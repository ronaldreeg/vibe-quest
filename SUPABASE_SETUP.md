# Supabase setup

Vibe Quest is connected to Supabase project `wyebrsyiauxgoabzigrg`.

## Live services

- Auth: email/password signup, confirmation, persistent sessions, password recovery, and account deletion.
- Database: profiles, activities, links, media, saves, field notes, editorial posts, reports, moderation history, and protected private locations.
- Storage: activity photos, private adventure media, and editorial media.
- Edge Functions: `geocode` and `delete-account`.
- Security: row-level security on application tables and ownership-aware Storage policies.

## Auth configuration

Configured in **Authentication > URL Configuration**:

- Site URL: `https://www.vibe-quest.net/`
- Allowed redirect URLs: `https://www.vibe-quest.net/` and `https://vibe-quest.net/`

Add `http://127.0.0.1:4173/` only when a local email-flow test requires it. Remove temporary preview URLs after testing.

Email confirmation is enabled. Before a public launch, configure custom SMTP under **Authentication > Emails > SMTP Settings** using the credentials from the chosen mail provider. A mailbox such as `hello@vibe-quest.net` is not itself an SMTP integration; Supabase needs the server host, port, username, password, sender address, and sender name.

After SMTP is configured, test signup confirmation and password recovery from a fresh address on phone and desktop. Disable link tracking in the SMTP provider because rewritten links can break Supabase confirmation URLs.

## Authorization model

- Members may manage only their own profile, listings, media, saves, and protected locations.
- Public discovery exposes only currently discoverable published listings and approved media.
- Exact private-meetup coordinates are visible only to the owner and admins.
- Reporters may read their own reports; admins may review all reports and write moderation actions.
- Admin authority is stored in the protected profile `role`, never user-editable metadata.
- Geocoding cache and throttle tables grant no access to `anon` or `authenticated` clients.

## Edge Functions

### `geocode`

Accepts validated search or reverse-geocode requests from the Vibe Quest client. It verifies the publishable API key and allowed origin, hashes the client network signature, enforces database-backed limits, caches responses, and throttles upstream traffic.

### `delete-account`

Requires an authenticated JWT and explicit confirmation. It removes owned activity and adventure media from Storage, then deletes the Auth user. Database cascades remove the user's listings and related records.

## Plan-dependent settings

The current Free plan does not provide leaked-password protection or downloadable managed backups. Decide whether to upgrade before a broad launch. Until then, keep a manual export outside the repository and never commit database dumps containing user information.

Free projects may also be paused after low activity. A public launch that promises continuous availability should use a plan that will not pause for inactivity.

## Migrations

Migrations live in `supabase/migrations/` and are applied to the connected project. Add future schema changes as new timestamped migrations; do not edit an already-applied migration.

After every schema change:

1. Run Supabase security and performance advisors.
2. Test public, member, owner, and admin access paths.
3. Confirm no `service_role` or secret keys appear in browser assets or Git history.
4. Update `LAUNCH_RUNBOOK.md` when operations change.
