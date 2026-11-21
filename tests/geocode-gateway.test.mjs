import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';

const source = await readFile(new URL('../supabase/functions/geocode/index.ts', import.meta.url), 'utf8');
const censusPlaces = JSON.parse(await readFile(new URL('../supabase/functions/geocode/census-places-2025.json', import.meta.url), 'utf8'));
const runnable = stripTypeScriptTypes(source.replace(/^import .*;\s*$/gm, ''), { mode: 'strip' });

function gateway({ responses, reservations = [] }) {
  const calls = [];
  const writes = [];
  let handler;
  const admin = {
    rpc: async () => ({ data: reservations.shift() ?? 0, error: null }),
    from: () => ({
      select: () => ({ eq: () => ({ gt: () => ({ maybeSingle: async () => ({ data: null }) }) }) }),
      upsert: async (value) => { writes.push(value); return { error: null }; },
    }),
  };
  const context = {
    Request, Response, crypto, TextEncoder, AbortSignal, URL, console, censusPlaces,
    setTimeout: (callback) => { callback(); return 0; },
    createClient: () => admin,
    Deno: { env: { get: (key) => key === 'SUPABASE_ANON_KEY' ? 'anon' : 'configured' }, serve: (fn) => { handler = fn; } },
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
  assert.equal(api.writes[0].cache_key, 'v3:search:texas capitol, austin, tx:3');
});

test('city and state use the authoritative local Census Gazetteer without any upstream request', async () => {
  const api = gateway({ responses: [] });
  const response = await api.request({ sensitive: false });
  assert.equal(response.status, 200);
  const [place] = (await response.json()).results;
  assert.equal(place.name, 'Austin');
  assert.equal(place.addresstype, 'city');
  assert.equal(place.address.state_code, 'US-TX');
  assert.equal(api.calls.length, 0);
  assert.equal(api.writes[0].cache_key, 'v3:search:austin, tx:3');
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
      return [{ lat: '30.2672', lon: '-97.7431', addresstype: 'city' }];
    },
  };
  vm.runInNewContext(helper, context);
  const result = await context.geocodeListingLocation('123 Private Address', 'Austin, TX', { sensitive: true });
  assert.equal(result.ok, true);
  assert.equal(result.accuracy, 'approximate');
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], 'Austin, TX');
  assert.equal(calls[0][2].sensitive, false);
});
