const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '../../app-v8.js'), 'utf8');
const saveSource = source.slice(source.indexOf('async function uploadRemoteActivityPhoto('), source.indexOf('async function setPostStatus('));
const deleteSource = source.slice(source.indexOf('async function removeRemoteActivity('), source.indexOf('async function confirmDeletePost('));

function fixture(failAt = '') {
  const activities = new Map();
  const media = new Set();
  const objects = new Set();
  const operations = [];
  const user = { id: 'owner-id' };
  const query = (table) => {
    let action = '', payload, filters = {};
    const exec = async () => {
      const name = `${table}.${action}`;
      operations.push(name);
      if (failAt === name) return { error: new Error(name) };
      if (failAt === 'activities.finalUpdateLostReadFail' && name === 'activities.select') return { error: new Error('read failed') };
      if (table === 'activities') {
        if (action === 'insert') { activities.set(payload.id, { ...payload }); return { data: payload }; }
        const row = activities.get(filters.id);
        if (!row || row.owner_id !== filters.owner_id) return { error: new Error('not found') };
        if (action === 'update') {
          Object.assign(row, payload);
          if (['activities.finalUpdateLost', 'activities.finalUpdateLostReadFail'].includes(failAt) && payload.badge_storage_path && payload.status === 'published') {
            return { error: new Error('response lost') };
          }
        }
        if (action === 'delete') activities.delete(filters.id);
        return { data: row };
      }
      if (table === 'activity_media') {
        if (action === 'insert') media.add(payload.storage_path);
        if (action === 'select') return { data: [...media].map((storage_path) => ({ storage_path })) };
        if (action === 'delete') media.delete(filters.storage_path);
      }
      return { data: [] };
    };
    const q = {
      insert(value) { action = 'insert'; payload = value; return q; },
      update(value) { action = 'update'; payload = value; return q; },
      upsert(value) { action = 'upsert'; payload = value; return q; },
      delete() { action = 'delete'; return q; },
      select() { if (!action) action = 'select'; return q; },
      eq(key, value) { filters[key] = value; return q; },
      single() { return exec(); },
      maybeSingle() { return exec(); },
      then(resolve, reject) { return exec().then(resolve, reject); }
    };
    return q;
  };
  const client = {
    from: query,
    storage: { from: () => ({
      async list(prefix, { limit, offset }) {
        operations.push('storage.list');
        if (failAt === 'storage.list') return { error: new Error('storage listing denied') };
        const files = [...objects].filter((key) => key.startsWith(`${prefix}/`))
          .map((key) => ({ name: key.slice(prefix.length + 1) }))
          .sort((a, b) => a.name.localeCompare(b.name));
        return { data: files.slice(offset, offset + limit) };
      },
      async upload(key) {
        operations.push('storage.upload');
        if (!activities.has(key.split('/')[1])) return { error: new Error('storage ownership policy rejected upload') };
        if (failAt === 'storage.upload') return { error: new Error('upload failed') };
        objects.add(key);
        return {};
      },
      async remove(keys) {
        operations.push('storage.remove');
        if (failAt === 'storage.remove' || keys.some((key) => !activities.has(key.split('/')[1]))) return { error: new Error('storage deletion denied') };
        if (failAt === 'storage.empty') return { data: [] };
        const data = keys.filter((key) => objects.delete(key)).map((name) => ({ name }));
        return { data };
      }
    }) }
  };
  const context = vm.createContext({
    window: { vvSupabase: client },
    crypto: { randomUUID: (() => { let n = 0; return () => `00000000-0000-4000-8000-${String(++n).padStart(12, '0')}`; })() },
    getCurrentUser: () => user,
    dataUrlToBlob: () => ({ type: 'image/jpeg' }),
    loadRemoteActivities: async () => {},
    loadRemoteOwnedActivities: async () => {},
    loadRemoteSavedIds: async () => {},
    console
  });
  vm.runInContext(`${saveSource}\n${deleteSource}`, context);
  const adventure = {
    id: 'activity-id', title: 'Test', area: 'Test place', city: 'Austin', lat: 30, lng: -97,
    type: 'Activity', vibes: ['Fun'], listingMode: 'anytime', links: []
  };
  return { activities, media, objects, operations, adventure, save: context.saveRemoteActivity, remove: context.removeRemoteActivity };
}

test('new listing is created as a draft before upload and published with its photo', async () => {
  const f = fixture();
  await f.save(f.adventure, null, 'image');
  const activity = f.activities.get(f.adventure.id);
  assert.equal(activity.status, 'published');
  assert.ok(f.objects.has(activity.cover_photo_path));
  assert.ok(f.media.has(activity.cover_photo_path));
  assert.ok(f.operations.indexOf('activities.insert') < f.operations.indexOf('storage.upload'));
  assert.ok(f.operations.indexOf('storage.upload') < f.operations.indexOf('activities.update'));
});

test('failed upload removes the unpublished draft', async () => {
  const f = fixture('storage.upload');
  await assert.rejects(f.save(f.adventure, null, 'image'));
  assert.equal(f.activities.size, 0);
  assert.equal(f.objects.size, 0);
});

test('failed media registration removes both uploaded file and draft', async () => {
  const f = fixture('activity_media.insert');
  await assert.rejects(f.save(f.adventure, null, 'image'));
  assert.equal(f.activities.size, 0);
  assert.equal(f.objects.size, 0);
  assert.ok(f.operations.indexOf('storage.remove') < f.operations.indexOf('activities.delete'));
});

test('delete removes the photo before removing its owning listing', async () => {
  const f = fixture();
  await f.save(f.adventure, null, 'image');
  const photoPath = f.activities.get(f.adventure.id).cover_photo_path;
  await f.remove({ ...f.adventure, photoPath });
  assert.equal(f.objects.size, 0);
  assert.equal(f.activities.size, 0);
  assert.ok(f.operations.indexOf('storage.remove') < f.operations.indexOf('activities.delete'));
});

test('delete retains the listing when photo removal fails', async () => {
  const f = fixture('storage.remove');
  const photoPath = 'owner-id/activity-id/test.jpg';
  f.activities.set(f.adventure.id, { id: f.adventure.id, owner_id: 'owner-id' });
  f.objects.add(photoPath);
  f.media.add(photoPath);
  await assert.rejects(f.remove({ ...f.adventure, photoPath }));
  assert.equal(f.activities.size, 1);
  assert.equal(f.objects.size, 1);
  assert.ok(!f.operations.includes('activities.delete'));
});


test('delete retains the listing when storage silently deletes no files', async () => {
  const f = fixture('storage.empty');
  const photoPath = 'owner-id/activity-id/test.jpg';
  f.activities.set(f.adventure.id, { id: f.adventure.id, owner_id: 'owner-id' });
  f.objects.add(photoPath);
  f.media.add(photoPath);
  await assert.rejects(f.remove({ ...f.adventure, photoPath }), /activity-photo-removal-unconfirmed/);
  assert.equal(f.activities.size, 1);
  assert.equal(f.objects.size, 1);
  assert.ok(!f.operations.includes('activities.delete'));
});

test('failed replacement upload leaves an existing listing and its cover untouched', async () => {
  const f = fixture('storage.upload');
  const photoPath = 'owner-id/activity-id/original.jpg';
  const original = { id: f.adventure.id, owner_id: 'owner-id', title: 'Original title', cover_photo_path: photoPath };
  f.activities.set(f.adventure.id, { ...original });
  f.objects.add(photoPath);
  await assert.rejects(f.save({ ...f.adventure, title: 'Changed title' }, { id: f.adventure.id, photoPath }, 'image'));
  assert.deepEqual(f.activities.get(f.adventure.id), original);
  assert.ok(f.objects.has(photoPath));
  assert.ok(!f.operations.includes('activities.update'));
  assert.ok(!f.operations.includes('activity_links.delete'));
});

test('a badge is uploaded independently after the draft exists, and both files are removed on deletion', async () => {
  const f = fixture();
  await f.save(f.adventure, null, 'image', { type: 'image/png' }, false);
  const activity = f.activities.get(f.adventure.id);
  assert.ok(f.objects.has(activity.cover_photo_path));
  assert.ok(f.objects.has(activity.badge_storage_path));
  assert.notEqual(activity.cover_photo_path, activity.badge_storage_path);
  assert.ok(!f.media.has(activity.badge_storage_path));
  assert.match(activity.badge_storage_path, /badge-.*\.png$/);
  await f.remove({ ...f.adventure, photoPath: activity.cover_photo_path, badgePath: activity.badge_storage_path });
  assert.equal(f.objects.size, 0);
  assert.equal(f.activities.size, 0);
});

test('badge replacement and removal preserve the photo and clean up the old badge', async () => {
  const f = fixture();
  await f.save(f.adventure, null, 'image', { type: 'image/png' }, false);
  let row = f.activities.get(f.adventure.id);
  const photoPath = row.cover_photo_path;
  const oldBadge = row.badge_storage_path;
  await f.save(f.adventure, { id: f.adventure.id, photoPath, badgePath: oldBadge, status: 'published' }, '', { type: 'image/png' }, false);
  row = f.activities.get(f.adventure.id);
  assert.ok(f.objects.has(photoPath));
  assert.ok(!f.objects.has(oldBadge));
  assert.ok(f.objects.has(row.badge_storage_path));
  const newBadge = row.badge_storage_path;
  await f.save(f.adventure, { id: f.adventure.id, photoPath, badgePath: newBadge, status: 'published' }, '', null, true);
  assert.equal(f.activities.get(f.adventure.id).badge_storage_path, null);
  assert.ok(!f.objects.has(newBadge));
  assert.ok(f.objects.has(photoPath));
});

test('a failed draft save cleans up the newly uploaded badge', async () => {
  const f = fixture('activity_links.delete');
  await assert.rejects(f.save(f.adventure, null, '', { type: 'image/png' }, false));
  assert.equal(f.objects.size, 0);
  assert.equal(f.activities.size, 0);
});

test('deleting a listing removes unreferenced badges across multiple storage pages', async () => {
  const f = fixture();
  f.activities.set(f.adventure.id, { id: f.adventure.id, owner_id: 'owner-id' });
  for (let i = 0; i < 125; i++) {
    f.objects.add(`owner-id/activity-id/badge-00000000-0000-4000-8000-${String(i).padStart(12, '0')}.png`);
  }
  f.objects.add('another-owner/activity-id/badge-00000000-0000-4000-8000-000000000000.png');
  await f.remove(f.adventure);
  assert.equal(f.operations.filter((operation) => operation === 'storage.list').length, 2);
  assert.deepEqual([...f.objects], ['another-owner/activity-id/badge-00000000-0000-4000-8000-000000000000.png']);
  assert.equal(f.activities.size, 0);
});

test('storage enumeration failure retains the listing for a later retry', async () => {
  const f = fixture('storage.list');
  f.activities.set(f.adventure.id, { id: f.adventure.id, owner_id: 'owner-id' });
  await assert.rejects(f.remove(f.adventure), /storage listing denied/);
  assert.equal(f.activities.size, 1);
  assert.ok(!f.operations.includes('activities.delete'));
});

for (const failAt of ['activities.finalUpdateLost', 'activities.finalUpdateLostReadFail']) {
  test(`a lost publish response preserves a possibly referenced badge: ${failAt}`, async () => {
    const f = fixture(failAt);
    await assert.rejects(f.save(f.adventure, null, '', { type: 'image/png' }, false), /activity-save-unconfirmed/);
    const row = f.activities.get(f.adventure.id);
    assert.equal(row.status, 'published');
    assert.ok(f.objects.has(row.badge_storage_path));
    assert.ok(!f.operations.includes('activities.delete'));
  });
}
