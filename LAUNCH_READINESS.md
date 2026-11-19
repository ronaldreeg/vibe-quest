# Vibe Quest Launch Readiness

Audit date: November 19, 2026

## Current status

The application foundation is ready for a closely watched one-city pilot. Core discovery, publishing, accounts, lifecycle controls, private locations, moderation, legal basics, and production geocoding are implemented.

Do not announce a broad public launch until the manual launch gates below are complete. Two depend on outside credentials or a Supabase plan choice and cannot be completed safely in source code.

## Foundation complete

- [x] Supabase Auth, Postgres, Storage, and row-level security back real accounts and listings.
- [x] Real listings load by map bounds as visitors pan and zoom; a clearly labeled static example set fills out the early discovery experience without entering fake rows in Supabase.
- [x] Users can create, edit, pause, republish, cancel, archive, delete, save, link to, and share listings.
- [x] Shared links fetch their exact published listing instead of depending on the first discovery-page batch.
- [x] Past one-time listings and stale recurring/anytime listings are hidden from public discovery.
- [x] Listing time zones and last-confirmed dates are stored and validated.
- [x] Private-meetup exact locations live in a protected table; public listings receive approximate points.
- [x] Signed-in users can file private reports; duplicate open reports and owner self-reports are blocked.
- [x] Admins have a private moderation queue, listing actions, resolution notes, and an audit trail.
- [x] Password recovery and account deletion are available in the interface.
- [x] Community Rules, Privacy, Terms, Accessibility, and Contact pages are published with the app.
- [x] Geocoding runs through a rate-limited, cached Edge Function instead of direct production browser requests.
- [x] Client images are compressed before Storage upload and rendered lazily in listing grids.
- [x] Replaced and deleted listing photos are removed from Storage instead of accumulating silently.
- [x] Listing-photo database and Storage policies allow uploads and deletes only for the listing owner or an admin; the retired attendee-upload path is closed.
- [x] Hourly health checks cover public pages, required local assets, key production assets, and the discovery backend.
- [x] Automated Chromium journeys cover discovery filters, listing details, guest publishing, all Workshop modes, Out There, and mobile overflow. They run locally on pushes and against production after deployment.
- [x] Automated Auth checks confirm GoTrue health, email signup availability, and required email confirmation without creating test accounts or sending mail.
- [x] Third-party map and Supabase browser assets are version-pinned and protected with subresource-integrity hashes.
- [x] Supabase Auth Site URL and production redirect URLs point to `https://www.vibe-quest.net/`.

## Manual launch gates

- [ ] Add DMARC and complete the phone and post-reset sign-in tests. The branded templates are saved in Supabase; on November 19, signup and password-reset test emails arrived, signup confirmation and sign-in worked, and the user completed the password reset for the test account.
- [ ] Enable leaked-password protection if the current Supabase plan supports it, and confirm the managed-backup plan before launch.
- [ ] Assign a named person to monitor reports and `hello@vibe-quest.net`, with the response expectations in `LAUNCH_RUNBOOK.md`.
- [x] Publish a small, current, verified launch set alongside the retained, clearly labeled examples. On November 19, three upcoming events were added with links to their organizers; review them for changes before launch and refresh the set as dates pass.
- [ ] Take and securely retain a pre-launch database export, then perform the smoke test in `LAUNCH_RUNBOOK.md` against production.
- [ ] Review and remove the two existing unreferenced files in the `activity-media` bucket after confirming they are not needed. The November reliability fix prevents normal replacements and deletions from creating more.

## Advisor status

The November 10 database review found no health advisories or backend error events in the preceding 24 hours. The live listing-photo policies were also verified after hardening.

- Security advisor: the three geocoding service tables intentionally have RLS with no client policies. They are default-deny and reachable only by the service-role Edge Function.
- Security advisor: leaked-password protection remains disabled and must be enabled from the Supabase Auth dashboard when the plan allows it.
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
