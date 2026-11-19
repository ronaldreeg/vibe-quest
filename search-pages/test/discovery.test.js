import test from "node:test";
import assert from "node:assert/strict";
import worker from "../public/_worker.js";

const env = { PUBLIC_ORIGIN: "https://discover.vibe-quest.net", APP_ORIGIN: "https://www.vibe-quest.net", SUPABASE_URL: "https://test.supabase.co", SUPABASE_ANON_KEY: "sb_publishable_test" };
const id = "12345678-1234-4234-8234-123456789abc";
const activity = { id, title: "Market & Makers", description: "Meet local artists & makers.", city: "Austin, TX", location_name: "Community Hall", location_visibility: "public", location_accuracy: "exact", type: "Market", vibes: ["Creative"], price_label: "Free", listing_mode: "one-time", start_date: "2099-12-19", start_time: "10:00:00", status: "published", time_zone: "America/Chicago", last_confirmed_at: new Date().toISOString(), created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", cover_photo_path: "photos/farm image.jpg" };
const originalFetch = globalThis.fetch;

async function withDatabase(rows, callback, status = 200) {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    const parsed = new URL(url);
    const targetId = parsed.searchParams.get("id")?.slice(3);
    const offset = Number(parsed.searchParams.get("offset") || 0);
    const limit = Number(parsed.searchParams.get("limit") || 40);
    const selected = (targetId ? rows.filter((row) => row.id === targetId) : rows).slice(offset, offset + limit);
    return new Response(status === 200 ? JSON.stringify(selected) : "failure", { status, headers: { "Content-Type": "application/json" } });
  };
  try { await callback(calls); } finally { globalThis.fetch = originalFetch; }
}
const request = (path, method = "GET") => worker.fetch(new Request(`https://discover.vibe-quest.net${path}`, { method }), env);

test("public listing returns readable HTML and points to the map, using anonymous RLS", async () => {
  await withDatabase([activity], async (calls) => {
    const result = await request(`/activities/${id}`);
    const html = await result.text();
    assert.equal(result.status, 200);
    assert.match(result.headers.get("content-type"), /text\/html/);
    assert.equal(result.headers.get("cache-control"), "no-store");
    assert.match(html, /Market &amp; Makers/);
    assert.match(html, new RegExp(`https://www\\.vibe-quest\\.net/\\?activity=${id}`));
    assert.doesNotMatch(html, /application\/ld\+json/);
    assert.match(html, /December 19, 2099 at 10:00 AM/);
    assert.match(html, /property="og:title" content="Market &amp; Makers in Austin, TX \| Vibe Quest"/);
    assert.match(html, /name="twitter:card" content="summary"/);
    assert.match(html, new RegExp(`property="og:url" content="https://discover\\.vibe-quest\\.net/activities/${id}"`));
    assert.doesNotMatch(html, /farm%20image.jpg/);
    assert.equal(calls[0].options.headers.apikey, env.SUPABASE_ANON_KEY);
    assert.equal(calls[0].options.headers.Authorization, undefined);
    assert.match(calls[0].url, /\/rest\/v1\/activities/);
    assert.doesNotMatch(calls[0].url, /private_locations/);
  });
});

test("directory and sitemap contain current real listings, not expired or paused ones", async () => {
  const expired = { ...activity, id: "22345678-1234-4234-8234-123456789abc", start_date: "2020-01-01" };
  const paused = { ...activity, id: "32345678-1234-4234-8234-123456789abc", status: "paused" };
  await withDatabase([activity, expired, paused], async () => {
    const directory = await (await request("/")).text();
    assert.match(directory, new RegExp(`/activities/${id}`));
    assert.doesNotMatch(directory, new RegExp(expired.id));
    assert.doesNotMatch(directory, new RegExp(paused.id));
    const sitemap = await request("/sitemap.xml");
    assert.match(sitemap.headers.get("content-type"), /application\/xml/);
    const xml = await sitemap.text();
    assert.match(xml, new RegExp(`/activities/${id}`));
    assert.doesNotMatch(xml, new RegExp(expired.id));
    assert.doesNotMatch(xml, new RegExp(paused.id));
  });
});

test("unavailable, expired and malformed listings return uncached, noindex 404", async () => {
  await withDatabase([{ ...activity, start_date: "2020-01-01" }], async () => {
    for (const path of [`/activities/${id}`, "/activities/not-a-uuid", "/no-such-route"]) {
      const result = await request(path);
      assert.equal(result.status, 404);
      assert.equal(result.headers.get("x-robots-tag"), "noindex");
      assert.equal(result.headers.get("cache-control"), "no-store");
    }
  });
});

test("database failures return 503 rather than claiming listings were removed", async () => {
  await withDatabase([], async () => {
    for (const path of [`/activities/${id}`, "/", "/sitemap.xml"]) {
      const result = await request(path);
      assert.equal(result.status, 503);
      assert.equal(result.headers.get("retry-after"), "60");
    }
  }, 500);
});

test("private and approximate locations do not get event venue markup or precise location", async () => {
  for (const patch of [{ location_visibility: "private", location_name: "Secret address" }, { location_accuracy: "approximate" }]) {
    await withDatabase([{ ...activity, ...patch }], async () => {
      const html = await (await request(`/activities/${id}`)).text();
      assert.doesNotMatch(html, /application\/ld\+json/);
      if (patch.location_visibility) {
        assert.doesNotMatch(html, /Secret address/);
        assert.match(html, /Exact meetup details are private/);
      } else assert.match(html, /Approximate area/);
    });
  }
});

test("user content is escaped in page markup and social metadata", async () => {
  await withDatabase([{ ...activity, title: '</script><script>alert("x")</script>', description: '<img src=x onerror="alert(1)">' }], async () => {
    const html = await (await request(`/activities/${id}`)).text();
    assert.doesNotMatch(html, /<script>alert/);
    assert.doesNotMatch(html, /<img src=x/);
    assert.match(html, /&lt;img src=x/);
    assert.match(html, /property="og:title" content="&lt;\/script&gt;&lt;script&gt;/);
  });
});

test("an unknown price is not presented as free", async () => {
  await withDatabase([{ ...activity, price_label: null }], async () => {
    const html = await (await request(`/activities/${id}`)).text();
    assert.doesNotMatch(html, /<strong>Price:/);
    assert.doesNotMatch(html, />Free</);
  });
});

test("robots declares the canonical sitemap; HEAD returns no body", async () => {
  const robots = await request("/robots.txt");
  assert.match(await robots.text(), /Sitemap: https:\/\/discover\.vibe-quest\.net\/sitemap\.xml/);
  const head = await request("/robots.txt", "HEAD");
  assert.equal(await head.text(), "");
});
