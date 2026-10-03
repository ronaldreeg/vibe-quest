# Vibe Quest Launch Readiness

Audit date: October 3, 2026

## Current status

The application foundation is ready for a closely watched one-city pilot. Core discovery, publishing, accounts, lifecycle controls, private locations, moderation, legal basics, and production geocoding are implemented.

Do not announce a broad public launch until the manual launch gates below are complete. Two depend on outside credentials or a Supabase plan choice and cannot be completed safely in source code.

## Foundation complete

- [x] Supabase Auth, Postgres, Storage, and row-level security back real accounts and listings.
- [x] Real listings load by map bounds as visitors pan and zoom; production excludes demo listings.
- [x] Users can create, edit, pause, republish, cancel, archive, delete, save, link to, and share listings.
- [x] Past one-time listings and stale recurring/anytime listings are hidden from public discovery.
- [x] Listing time zones and last-confirmed dates are stored and validated.
- [x] Private-meetup exact locations live in a protected table; public listings receive approximate points.
- [x] Signed-in users can file private reports; duplicate open reports and owner self-reports are blocked.
- [x] Admins have a private moderation queue, listing actions, resolution notes, and an audit trail.
- [x] Password recovery and account deletion are available in the interface.
- [x] Community Rules, Privacy, Terms, Accessibility, and Contact pages are published with the app.
- [x] Geocoding runs through a rate-limited, cached Edge Function instead of direct production browser requests.
- [x] Client images are compressed before Storage upload and rendered lazily in listing grids.
- [x] Hourly health checks cover public pages and the discovery backend.
- [x] Supabase Auth Site URL and production redirect URLs point to `https://www.vibe-quest.net/`.

## Manual launch gates

- [ ] Configure custom SMTP in Supabase and complete real signup, confirmation, recovery, and changed-password tests on both phone and desktop.
- [ ] Decide whether to upgrade Supabase for leaked-password protection and downloadable managed backups. The current Free plan does not provide those launch protections.
- [ ] Assign a named person to monitor reports and `hello@vibe-quest.net`, with the response expectations in `LAUNCH_RUNBOOK.md`.
- [ ] Publish a small, current, verified launch set. The October 3 anonymous production query correctly returned zero discoverable listings after expired and stale tests were hidden.
- [ ] Take and securely retain a pre-launch database export, then perform the smoke test in `LAUNCH_RUNBOOK.md` against production.

## Advisor status

The October 3 database review found no missing foreign-key indexes or duplicate permissive policies.

- Security advisor: the three geocoding service tables intentionally have RLS with no client policies. They are default-deny and reachable only by the service-role Edge Function.
- Security advisor: leaked-password protection remains disabled because it is a paid Supabase feature.
- Performance advisor: unused-index notices are expected before production traffic and should be reviewed after the pilot, not removed speculatively.

## Scale decisions

The current bounded query retrieves at most 250 rows and renders at most 150 map markers. That is appropriate for the first city pilot because only the visible padded map area is fetched.

Add a PostGIS viewport RPC and marker clustering when dense viewports regularly approach 100 markers, the 250-row query cap is reached, or measured map interaction slows. Add generated image variants when real mobile transfer measurements show the current compressed originals are too heavy.

## Pilot quality bar

- A first-time organizer can confirm an account and publish without help.
- Panning from one city to another replaces the visible discovery set correctly.
- Past, paused, cancelled, rejected, archived, and stale listings never appear as current.
- Exact private locations are absent from anonymous API responses and page content.
- One user cannot edit another user's listing or read another user's report.
- Uploads work from a current iPhone and Android photo library.
- Empty, loading, offline, rate-limit, and backend-error states explain what happened.
- Keyboard navigation, contrast, touch targets, and responsive layouts work throughout.
- A real person is watching reports, contact email, health checks, and auth-email delivery.

The durable product and data-model direction remains in [`../FOUNDATION_PLAN.md`](../FOUNDATION_PLAN.md).
