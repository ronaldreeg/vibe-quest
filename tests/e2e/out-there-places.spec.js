const { test, expect } = require('@playwright/test');

const existingPost = {
  id: '0a000000-0000-4000-8000-000000000001', author_id: '0a000000-0000-4000-8000-000000000002',
  field_note_number: 1, title: 'Galveston favorites', dek: 'A day on the island',
  body: 'The original Galveston story stays intact.', city: 'Galveston, TX',
  address: '2706 Market St', map_label: 'Maceo Spice & Import Co.', map_note: 'Start here',
  latitude: 29.304208, longitude: -94.798628,
  cover_photo_path: 'site:assets/out-there/field-note-001-maceo.jpg',
  status: 'published', featured: true, published_at: '2026-01-01T00:00:00Z',
  created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z', map_places: []
};
const existingMedia = {
  id: '0a000000-0000-4000-8000-000000000003', post_id: existingPost.id,
  storage_path: 'site:assets/out-there/field-note-001-maceo.jpg', alt_text: 'Maceo shop',
  caption: null, sort_order: 0, created_at: existingPost.created_at
};

async function installEditorialBackend(page) {
  await page.evaluate(() => {
    const key = 'test-editorial-db';
    class Query {
      constructor(table) { this.table = table; this.filters = []; this.action = 'select'; }
      select() { return this; }
      update(payload) { this.action = 'update'; this.payload = payload; return this; }
      eq(field, value) { this.filters.push((row) => row[field] === value); return this; }
      neq(field, value) { this.filters.push((row) => row[field] !== value); return this; }
      in(field, values) { this.filters.push((row) => values.includes(row[field])); return this; }
      order() { return this; }
      limit() { return this; }
      async execute(single = false) {
        const db = JSON.parse(localStorage.getItem(key));
        const rows = (db[this.table] || []).filter((row) => this.filters.every((filter) => filter(row)));
        if (this.action === 'update') {
          rows.forEach((row) => Object.assign(row, structuredClone(this.payload)));
          db.writes.push({ table: this.table, payload: this.payload });
          localStorage.setItem(key, JSON.stringify(db));
        }
        return { data: single ? rows[0] || null : rows, error: null };
      }
      single() { return this.execute(true); }
      then(resolve, reject) { return this.execute().then(resolve, reject); }
    }
    window.vvSupabase = {
      from: (table) => new Query(table),
      storage: { from: () => ({ getPublicUrl: (path) => ({ data: { publicUrl: path } }) }) }
    };
    state.backendEnabled = true;
    state.remoteUser = { id: '0a000000-0000-4000-8000-000000000002', isAdmin: true, name: 'Editor' };
    geocodeListingLocation = async (address) => {
      if (address.includes('Unfindable')) return { ok: false, message: 'Could not find that location.' };
      if (address.includes('Invalid coordinates')) return { ok: true, lat: NaN, lng: 999 };
      return { ok: true, lat: 29.3023, lng: -94.7912 };
    };
    openProfile = async () => {};
  });
}

test.beforeEach(async ({ page }) => {
  // No production backend is contacted; all reads and writes use localStorage.
  await page.route('**/supabase-client.js**', (route) => route.fulfill({ status: 200, body: '' }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ post, media }) => localStorage.setItem('test-editorial-db', JSON.stringify({
    out_there_posts: [post], out_there_media: [media], writes: []
  })), { post: existingPost, media: existingMedia });
  await installEditorialBackend(page);
  await page.evaluate(async () => { await loadEditorialPosts(); openFieldNoteEditor(state.editorialPosts[0].id); });
});

test('adding places keeps the original post and persists on reload', async ({ page }) => {
  await page.locator('#fieldNoteAddPlace').click();
  const row = page.locator('#fieldNotePlaces .field-note-place').last();
  await row.locator('[data-place-name]').fill('The Strand');
  await row.locator('[data-place-address]').fill('2300 Strand St');
  await row.locator('[data-place-city]').fill('Galveston, TX');
  await page.locator('#fieldNoteForm').evaluate((form) => form.requestSubmit());
  await expect(page.locator('#fieldNoteModal')).not.toHaveAttribute('open', '');
  const db = await page.evaluate(() => JSON.parse(localStorage.getItem('test-editorial-db')));
  expect(db.out_there_posts[0]).toMatchObject({
    title: existingPost.title, body: existingPost.body, address: existingPost.address,
    latitude: existingPost.latitude, longitude: existingPost.longitude,
    map_label: existingPost.map_label,
    map_places: [{ name: 'The Strand', address: '2300 Strand St', city: 'Galveston, TX', latitude: 29.3023, longitude: -94.7912 }]
  });
  expect(db.out_there_media).toEqual([existingMedia]);

  await page.reload({ waitUntil: 'domcontentloaded' });
  await installEditorialBackend(page);
  await page.evaluate(async () => { await loadEditorialPosts(); openFieldNoteEditor(state.editorialPosts[0].id); });
  await expect(page.locator('#fieldNotePlaces [data-place-name]')).toHaveValue('The Strand');
  await expect(page.locator('#fieldNotePlaces [data-place-address]')).toHaveValue('2300 Strand St');
  await expect(page.locator('#fieldNoteForm [name="address"]')).toHaveValue(existingPost.address);
  await expect(page.locator('#fieldNoteForm [name="body"]')).toHaveValue(existingPost.body);
});

test('an unresolved place does not overwrite an existing published post', async ({ page }) => {
  await page.locator('#fieldNoteAddPlace').click();
  const row = page.locator('#fieldNotePlaces .field-note-place').last();
  await row.locator('[data-place-name]').fill('Mystery spot');
  await row.locator('[data-place-address]').fill('Unfindable address');
  await row.locator('[data-place-city]').fill('Galveston, TX');
  await page.locator('#fieldNoteForm').evaluate((form) => form.requestSubmit());
  await expect(page.locator('#fieldNoteMessage')).toContainText('Could not find that location.');
  const db = await page.evaluate(() => JSON.parse(localStorage.getItem('test-editorial-db')));
  expect(db.out_there_posts).toEqual([existingPost]);
  expect(db.writes).toEqual([]);
});

test('invalid coordinates from the location service do not get saved', async ({ page }) => {
  await page.locator('#fieldNoteAddPlace').click();
  const row = page.locator('#fieldNotePlaces .field-note-place').last();
  await row.locator('[data-place-name]').fill('Bad location');
  await row.locator('[data-place-address]').fill('Invalid coordinates');
  await row.locator('[data-place-city]').fill('Galveston, TX');
  await page.locator('#fieldNoteForm').evaluate((form) => form.requestSubmit());
  await expect(page.locator('#fieldNoteMessage')).toContainText("couldn't place that address");
  const db = await page.evaluate(() => JSON.parse(localStorage.getItem('test-editorial-db')));
  expect(db.out_there_posts).toEqual([existingPost]);
  expect(db.writes).toEqual([]);
});

test('the published map labels every valid location and excludes invalid pins', async ({ page }) => {
  await page.evaluate(() => {
    const db = JSON.parse(localStorage.getItem('test-editorial-db'));
    db.out_there_posts[0].map_places = [
      { name: 'The Strand', address: '2300 Strand St', city: 'Galveston, TX', latitude: 29.3023, longitude: -94.7912 },
      { name: 'Missing coordinates', latitude: null, longitude: null },
      { name: 'Outside the world', latitude: 91, longitude: -94.7 }
    ];
    localStorage.setItem('test-editorial-db', JSON.stringify(db));
  });
  await page.evaluate(async () => { await closeFieldNoteEditor({ reopenProfile: false }); await loadPublishedFieldNotes(); setView('out-there'); });
  await expect(page.locator('#outThereMap')).toBeVisible();
  await expect(page.locator('#outThereMap .editorial-map-pin-shell')).toHaveCount(2);
  await expect(page.locator('#outThereMap .editorial-map-pin-shell').nth(0)).toHaveAttribute('title', /Maceo/);
  await expect(page.locator('#outThereMap .editorial-map-pin-shell').nth(1)).toHaveAttribute('title', /The Strand/);
  await expect(page.locator('.editorial-map-places > li')).toHaveText(['Maceo Spice & Import Co.', 'The Strand']);
});
