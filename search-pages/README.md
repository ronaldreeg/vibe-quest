# Vibe Quest discovery pages

This small Cloudflare Pages application serves a live, readable directory, an individual HTML page at `/activities/<uuid>`, and `/sitemap.xml` and `/robots.txt`. It uses anonymous Supabase access and the same discoverability rules as the map. Example listings live only in the app and are never included here. Each real activity links directly to its map detail window.

The renderer does not fetch private meetup details or render a cover image. It deliberately omits Event structured data: the current activity schema does not establish the verified public street addresses needed to assess eligibility. A paused, deleted, expired, or stale listing returns an uncached, `noindex` 404; database failures return a 503 instead. Search engines may retain prior snippets until they recrawl.

## Test

With Node.js 20 or later, run `npm test` from this directory. The tests use a mocked public API and do not modify production data.

## Deploy with Pages Git integration

1. In Cloudflare, create a **Pages** project connected to the repository. Set the project root to `search-pages`, use no build command, and set the output directory to `public`. The output's `_worker.js` takes responsibility for all routes.
2. Configure the variables in `wrangler.toml` as Pages production variables if not automatically picked up. `SUPABASE_ANON_KEY` is a public publishable key, not a service-role key. Keep the Supabase Data API's anonymous RLS in force. Change `PUBLIC_ORIGIN` only if the canonical public hostname changes.
3. Add `discover.vibe-quest.net` under the Pages project's **Custom domains** before adding DNS. At Namecheap, create the CNAME shown by Cloudflare, pointing `discover` to the project's assigned `*.pages.dev` hostname. Keep the existing website and email DNS records unchanged. Pages supports a subdomain CNAME without moving the domain's nameservers. Allow time for certificate issuance.
4. Verify `/`, `/robots.txt`, `/sitemap.xml`, and an individual listing over the custom hostname, and verify the listing's map button. Confirm an unavailable ID returns 404 and a backend outage returns 503. Add a visible site link to the discovery directory only after the hostname is live. Submit the directory's sitemap in Search Console when available.

The Pages deployment must be connected to the actual production branch so future changes to this directory are redeployed. The sitemap currently supports up to 49,999 current activities, and the directory paginates in groups of 40. If that limit is reached, the sitemap returns 503 rather than silently dropping records; implement a sitemap index and shards before then.
