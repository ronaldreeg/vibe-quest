import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

async function client(cacheable, privateCitySupported = false) {
  const app = await readFile(new URL('../app-v8.js', import.meta.url), 'utf8');
  const helper = app.slice(app.indexOf('async function fetchGeocodeResults('), app.indexOf('function formatReverseGeocodeLabel('));
  let calls = 0;
  let now = 0;
  class Clock extends Date { static now() { return now; } }
  const context = {
    Date: Clock,
    window: { vvSupabase: {}, location: { protocol: 'https:', hostname: 'www.vibe-quest.net' } },
    normalize: (value) => value.toLowerCase(),
    geocodeCache: new Map(),
    GEOCODE_CACHE_TTL_MS: 48 * 60 * 60 * 1000,
    invokeGeocode: async () => ({ cacheable, privateCitySupported, results: [{ name: `result ${++calls}` }] }),
  };
  vm.runInNewContext(helper, context);
  return { context, advance: (milliseconds) => { now += milliseconds; }, calls: () => calls };
}

test('cacheable location results expire after at most 48 hours', async () => {
  const api = await client(true);
  const search = () => api.context.fetchGeocodeResults('Austin, TX', 5, { sensitive: false });
  assert.equal((await search())[0].name, 'result 1');
  api.advance(48 * 60 * 60 * 1000 - 1);
  assert.equal((await search())[0].name, 'result 1');
  api.advance(1);
  assert.equal((await search())[0].name, 'result 2');
});

test('non-cacheable and sensitive results never enter the browser cache', async () => {
  for (const [cacheable, sensitive] of [[false, false], [true, true]]) {
    const api = await client(cacheable);
    const search = () => api.context.fetchGeocodeResults('Austin, TX', 5, { sensitive });
    await search();
    await search();
    assert.equal(api.calls(), 2);
  }
});

test('trusted city metadata survives the client cache', async () => {
  const api = await client(true, true);
  const search = () => api.context.fetchGeocodeResults('Austin, TX', 3, { sensitive: false });
  assert.equal((await search()).privateCitySupported, true);
  assert.equal((await search()).privateCitySupported, true);
  assert.equal(api.calls(), 1);
});
