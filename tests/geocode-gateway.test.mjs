import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';

const source = await readFile(new URL('../supabase/functions/geocode/index.ts', import.meta.url), 'utf8');
const censusPlaces = JSON.parse(await readFile(new URL('../supabase/functions/geocode/census-places-2025.json', import.meta.url), 'utf8'));
const runnable = stripTypeScriptTypes(source.replace(/^import .*;\s*$/gm, ''), { mode: 'strip' });

function gateway({ responses, reservations = [], locationIqKey = "", cached = null }) {
  const calls = [];
  const writes = [];
  let handler;
  const admin = {
    rpc: async () => ({ data: reservations.shift() ?? 0, error: null }),
    from: () => ({
      select: () => ({ eq: () => ({ gt: () => ({ maybeSingle: async () => ({ data: cached }) }) }) }),
      upsert: async (value) => { writes.push(value); return { error: null }; },
    }),
  };
  const context = {
    Request, Response, crypto, TextEncoder, AbortSignal, URL, URLSearchParams, console, censusPlaces,
    setTimeout: (callback) => { callback(); return 0; },
    createClient: () => admin,
    Deno: { env: { get: (key) => key === 'LOCATIONIQ_API_KEY' ? locationIqKey : key === 'SUPABASE_ANON_KEY' ? 'anon' : 'configured' }, serve: (fn) => { handler = fn; } },
    fetch: async (url) => { calls.push(url); const next = responses.shift(); if (next instanceof Error) throw next; return next; },
  };
  vm.runInNewContext(runnable, context);
  return {
    calls, writes,
    request: (body) => handler(new Request('https://gateway.test', {
      method: 'POST', headers: { apikey: 'anon', origin: 'https://www.vibe-quest.net', 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'search', query: 'Austin, TX', limit: 3, ...body }),
    })),
  };
}

test('public venue search falls back after upstream failure and caches the result', async () => {
  const place = { lat: '30.2672', lon: '-97.7431', addresstype: 'attraction', address: { city: 'Austin' } };
  const api = gateway({ responses: [new Response('', { status: 403 }), Response.json([place])], reservations: [0, 15, 0] });
  const response = await api.request({ query: 'Texas Capitol, Austin, TX', sensitive: false });
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).results, [place]);
  assert.equal(api.calls.length, 2);
  assert.match(api.calls[1], /^https:\/\/nominatim\.openstreetmap\.org\/search/);
  assert.equal(api.writes[0].cache_key, 'v4:search:texas capitol, austin, tx:3');
});

test('city and state use the authoritative local Census Gazetteer without any upstream request', async () => {
  const api = gateway({ responses: [] });
  const response = await api.request({ sensitive: false });
  assert.equal(response.status, 200);
  const body = await response.json();
  const [place] = body.results;
  assert.equal(body.privateCitySupported, true);
  assert.equal(place.name, 'Austin');
  assert.equal(place.addresstype, 'city');
  assert.equal(place.address.state_code, 'US-TX');
  assert.equal(api.calls.length, 0);
  assert.equal(api.writes[0].cache_key, 'v3:search:austin, tx:3');
});


test('cached Census city retains private-city support but external places do not', async () => {
  const city = { lat: '30.27', lon: '-97.74', name: 'Austin', addresstype: 'city' };
  const existing = gateway({ responses: [], cached: { response: [city] } });
  const verified = await (await existing.request({ sensitive: false })).json();
  assert.equal(verified.privateCitySupported, true);
  const other = gateway({ responses: [Response.json([city])], locationIqKey: 'secret' });
  const unverified = await (await other.request({ query: 'Unrecognized Place, TX', sensitive: false })).json();
  assert.notEqual(unverified.privateCitySupported, true);
});

test('private and legacy requests never fall back or cache address searches', async () => {
  for (const body of [{ sensitive: true }, {}]) {
    const api = gateway({ responses: [new Response('', { status: 403 })] });
    const response = await api.request({ query: 'Private venue, Austin, TX', ...body });
    assert.equal(response.status, 503);
    assert.equal(api.calls.length, 1);
    assert.equal(api.writes.length, 0);
  }
});

test('gateway reports its global retry delay instead of a false no-match', async () => {
  const api = gateway({ responses: [], reservations: [750] });
  const response = await api.request({ query: 'A public venue, Austin, TX', sensitive: false });
  assert.equal(response.status, 429);
  assert.equal((await response.json()).retryAfterMs, 750);
  assert.equal(api.calls.length, 0);
});

test('client retries a temporary gateway reservation and preserves errors', async () => {
  const app = await readFile(new URL('../app-v8.js', import.meta.url), 'utf8');
  const helper = app.slice(app.indexOf('async function invokeGeocode('), app.indexOf('async function fetchGeocodeResults('));
  let calls = 0;
  const context = { window: { vvSupabase: { functions: { invoke: async () => {
    calls++;
    return calls === 1
      ? { error: { context: Response.json({ retryAfterMs: 1 }, { status: 429 }) } }
      : { data: { results: [{ lat: '30', lon: '-97' }] } };
  } } } }, setTimeout: (callback) => { callback(); return 0; } };
  vm.runInNewContext(helper, context);
  assert.equal((await context.invokeGeocode({ action: 'search' })).results.length, 1);
  assert.equal(calls, 2);
  context.window.vvSupabase.functions.invoke = async () => ({ error: { context: new Response('', { status: 503 }) } });
  await assert.rejects(context.invokeGeocode({ action: 'search' }), /temporarily unavailable/);
});

test('private meetup validates only its city and does not geocode its exact address', async () => {
  const app = await readFile(new URL('../app-v8.js', import.meta.url), 'utf8');
  const helper = app.slice(app.indexOf('async function geocodeListingLocation('), app.indexOf('async function geocodeLocation('));
  const calls = [];
  const context = {
    normalize: (s) => String(s || '').trim().toLowerCase(),
    looksLikeStreetAddress: (s) => /^\d/.test(s),
    geocodeType: (result) => result.addresstype,
    fetchGeocodeResults: async (...args) => {
      calls.push(args);
      return Object.assign([{ lat: '30.2672', lon: '-97.7431', addresstype: 'city' }], { privateCitySupported: true });
    },
  };
  vm.runInNewContext(helper, context);
  const result = await context.geocodeListingLocation('123 Private Address', 'Austin, TX', { sensitive: true });
  assert.equal(result.ok, true);
  assert.equal(result.accuracy, 'approximate');
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], 'Austin, TX');
  assert.equal(calls[0][2].sensitive, false);
  context.fetchGeocodeResults = async () => [{ lat: '30.26', lon: '-97.74', addresstype: 'city' }];
  const unsupported = await context.geocodeListingLocation('123 Private Address', 'Unverified Place, TX', { sensitive: true });
  assert.equal(unsupported.ok, false);
  assert.match(unsupported.message, /recognized city and state/);
});


test('LocationIQ forward search returns venue results without caching the provider response', async () => {
  const place = { lat: '30.2747', lon: '-97.7403', display_name: 'Texas Capitol, Austin, TX', type: 'attraction', address: { city: 'Austin', country_code: 'us' } };
  const api = gateway({ locationIqKey: 'secret-test-key', responses: [Response.json([place])] });
  const response = await api.request({ query: 'Texas Capitol, Austin, TX', sensitive: false });
  const result = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(result.results, [place]);
  assert.equal(result.cacheable, false);
  assert.equal(api.writes.length, 0);
  const url = new URL(api.calls[0]);
  assert.equal(url.origin, 'https://us1.locationiq.com');
  assert.equal(url.pathname, '/v1/search');
  assert.equal(url.searchParams.get('countrycodes'), 'us');
  assert.equal(url.searchParams.get('addressdetails'), '1');
  assert.equal(url.searchParams.get('key'), 'secret-test-key');
});

test('Census address lookup falls back to LocationIQ and avoids caching', async () => {
  const place = { lat: '30.27', lon: '-97.74', display_name: '1100 Congress Ave, Austin, TX' };
  const api = gateway({ locationIqKey: 'secret', responses: [Response.json({ result: { addressMatches: [] } }), Response.json([place])] });
  const response = await api.request({ query: '1100 Congress Ave, Austin, TX', sensitive: false });
  assert.deepEqual((await response.json()).results, [place]);
  assert.equal(api.calls.length, 2);
  assert.match(api.calls[1], /^https:\/\/us1\.locationiq\.com/);
  assert.equal(api.writes.length, 0);
});

test('LocationIQ distinguishes no match from quota or malformed response', async () => {
  for (const [reply, status] of [[new Response('', { status: 404 }), 200], [new Response('', { status: 429 }), 429], [Response.json({ broken: true }), 503]]) {
    const api = gateway({ locationIqKey: 'secret', responses: [reply] });
    const response = await api.request({ query: 'Texas Capitol, Austin, TX', sensitive: false });
    assert.equal(response.status, status);
    if (status === 200) assert.deepEqual((await response.json()).results, []);
    assert.equal(api.writes.length, 0);
  }
});

test('reverse lookup uses LocationIQ without caching precise user location', async () => {
  const place = { lat: '30.27', lon: '-97.74', address: { city: 'Austin', state: 'Texas', country_code: 'us' } };
  const api = gateway({ locationIqKey: 'secret', responses: [Response.json(place)] });
  const response = await api.request({ action: 'reverse', latitude: 30.27, longitude: -97.74, sensitive: true });
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).result, place);
  assert.equal(new URL(api.calls[0]).pathname, '/v1/reverse');
  assert.equal(api.writes.length, 0);
});

test('sensitive street searches remain Census-only with LocationIQ configured', async () => {
  const api = gateway({ locationIqKey: 'secret', responses: [Response.json({ result: { addressMatches: [{
    matchedAddress: '1100 CONGRESS AVE, AUSTIN, TX 78701',
    coordinates: { x: -97.7404, y: 30.2747 },
    addressComponents: { fromAddress: '1100', streetName: 'CONGRESS', suffixType: 'AVE', city: 'AUSTIN', state: 'TX', zip: '78701' },
  }] } })] });
  const response = await api.request({ query: '1100 Congress Ave, Austin, TX', sensitive: true });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).results[0].address.city, 'AUSTIN');
  assert.equal(api.calls.length, 1);
  assert.equal(new URL(api.calls[0]).hostname, 'geocoding.geo.census.gov');
  assert.equal(api.writes.length, 0);
});

test('listing geocoding rejects a same-named city in the wrong state', async () => {
  const app = await readFile(new URL('../app-v8.js', import.meta.url), 'utf8');
  const helpers = app.slice(app.indexOf('function geocodeType('), app.indexOf('async function geocodeLocation('));
  const city = { lat: '30.267', lon: '-97.743', addresstype: 'city', address: { state_code: 'US-TX' } };
  const wrong = { lat: '43.67', lon: '-92.97', display_name: 'Town Hall, Austin, Minnesota, United States', type: 'attraction', address: { city: 'Austin', state: 'Minnesota' } };
  const correct = { lat: '30.274', lon: '-97.740', display_name: 'Town Hall, Austin, Texas, United States', type: 'attraction', address: { city: 'Austin', state_code: 'TX', state: 'Texas' } };
  let candidates = [wrong];
  const context = {
    normalize: (value) => String(value || '').trim().toLowerCase(),
    looksLikeStreetAddress: (value) => /^\d/.test(value),
    fetchGeocodeResults: async (query) => query === 'Austin, TX' ? [city] : candidates,
    BROAD_GEOCODE_TYPES: new Set(['city', 'town', 'village', 'municipality']),
    ROAD_GEOCODE_TYPES: new Set(['road', 'street']),
    APPROXIMATE_GEOCODE_TYPES: new Set(['city', 'town', 'village', 'municipality']),
  };
  vm.runInNewContext(helpers, context);
  const rejected = await context.geocodeListingLocation('Town Hall', 'Austin, TX');
  assert.equal(rejected.ok, false);
  candidates = [wrong, correct];
  const found = await context.geocodeListingLocation('Town Hall', 'Austin, TX');
  assert.equal(found.ok, true);
  assert.equal(found.lat, 30.274);
  candidates = [{ ...correct, address: { city: 'Austin' }, display_name: 'Town Hall, Austin, United States' }];
  assert.equal((await context.geocodeListingLocation('Town Hall', 'Austin, TX')).ok, false);
  candidates = [{ ...correct, address: { city: 'Austin' }, display_name: 'Town Hall, Austin, Texas 78701, United States' }];
  assert.equal((await context.geocodeListingLocation('Town Hall', 'Austin, TX')).ok, true);
});
