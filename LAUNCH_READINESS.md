# Vibe Quest Launch Readiness

Audit date: September 30, 2026

## Current status

Vibe Quest is ready for continued private testing and a tightly watched local pilot. The product now has a real Supabase foundation, shared listings, cross-device accounts, Storage-backed photos, saves, ownership controls, map-bound loading, and private reporting intake.

It is not ready for a broad public launch yet. The remaining blockers are mostly trust, lifecycle, privacy, recovery, and operations rather than visual design.

## Foundation complete

- [x] Supabase Auth, Postgres, and Storage replace browser-only data for real accounts and user-created listings.
- [x] Row-level security protects profiles, owned listings, links, media, saves, field notes, and reports.
- [x] Password handling for production accounts lives in Supabase Auth.
- [x] Uploaded activity photos are compressed before upload and stored in Supabase Storage.
- [x] Shared listings load by visible map bounds as the map moves and zooms.
- [x] Users can create, edit, delete, save, link to, and share real listings.
- [x] `www.vibe-quest.net` is connected with HTTPS, and `hello@vibe-quest.net` is the public contact address.
- [x] Signed-in users can privately report a real listing. Duplicate open reports are blocked, owners cannot report their own post, and reports are protected by RLS.

## Required before public launch

### 1. Trust and moderation

- [x] Private listing-report intake and moderation-ready database queue.
- [ ] Add a small admin moderation view for open reports, listing removal, resolution notes, and an audit trail.
- [ ] Publish clear prohibited-content and community-safety rules.
- [ ] Add a correction path for inaccurate or unsafe map locations.

### 2. Listing lifecycle

- [ ] Add owner controls for published, paused, cancelled, and archived states instead of relying on deletion.
- [ ] Automatically hide and expire past one-time listings while preserving them in the owner's private history.
- [ ] Store and display the listing's local time zone.
- [ ] Add last-confirmed dates and reconfirmation for recurring or anytime listings.

### 3. Location privacy

- [ ] Separate a protected private address from the public map point.
- [ ] Make private-home listings default to an approximate public location.
- [ ] Add a deliberate future path for an organizer to share exact details with an accepted attendee.

### 4. Account safety and legal basics

- [ ] Add password recovery to the sign-in window and test the complete email flow.
- [ ] Confirm email-verification messaging and redirect behavior on desktop and mobile.
- [ ] Add Privacy, Terms, Community Guidelines, and basic accessibility/contact pages.
- [ ] Add account deletion and explain what happens to owned listings and uploaded media.
- [ ] Enable Supabase leaked-password protection.

### 5. Production services and scale

- [ ] Move geocoding away from direct client-side Nominatim usage to a production provider or server function with rate limits and caching.
- [ ] Add PostGIS-backed viewport queries and clustering before dense-city inventory grows.
- [ ] Add responsive image variants or transformations and verify mobile delivery size on slower connections.
- [ ] Add error monitoring, uptime checks, privacy-respecting analytics, and a documented backup/restore drill.
- [ ] Remove remaining demo-only `example.com` links and decide when demo listings leave the public map.

## Recommended order

1. Finish moderation operations and safety rules.
2. Build listing pause, cancellation, and expiration behavior.
3. Add password recovery, account deletion, and legal pages.
4. Protect private-home locations.
5. Move geocoding server-side and add PostGIS/clustering.
6. Add monitoring, image delivery checks, and a launch-day operations runbook.

## Pilot quality bar

Before inviting a city beyond trusted testers, verify that:

- A first-time organizer can publish without help.
- A visitor can move the map between cities and receive the correct listings.
- Past, paused, cancelled, rejected, and expired listings never appear as current.
- Private addresses cannot leak through the interface or API.
- One user cannot edit another user's listing or read another user's report.
- Uploaded images stay fast and correctly cropped on mobile.
- Empty, loading, error, and offline states explain what happened.
- Keyboard navigation, contrast, touch targets, and responsive layouts work throughout.
- A real person is assigned to review reports and respond to urgent issues.

## Release sequence

### Private testing

Keep testing complete discovery, publishing, saving, sharing, reporting, recovery, and cancellation flows with a small trusted group.

### One-city pilot

Launch with a deliberately small set of excellent listings, review every first-time publishing flow, and watch freshness and reports closely.

### Public expansion

Expand only after lifecycle automation, private-location handling, moderation operations, map clustering, monitoring, and recovery flows have been exercised in the pilot.

The durable product and data-model direction remains in [`../FOUNDATION_PLAN.md`](../FOUNDATION_PLAN.md).
