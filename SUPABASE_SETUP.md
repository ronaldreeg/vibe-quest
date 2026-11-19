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

Email confirmation is enabled. On November 18, 2026, **Authentication > Emails > SMTP Settings** showed custom SMTP enabled with these settings:

- Sender: `Vibe Quest <hello@vibe-quest.net>`
- Provider host: `mail.privateemail.com`
- Port: `587` (STARTTLS)
- Username: `hello@vibe-quest.net`

The stored password is hidden and has not been replaced. On November 19, 2026, signup and recovery test messages were delivered to a Gmail inbox. Private Email requires SMTP to be enabled under **Connect third-party apps** and an application password for the mail client.

Branded signup confirmation and password-reset HTML lives in [`supabase/templates/`](supabase/templates/README.md). Its images are hosted in the public `editorial-media/email/` Storage folder. Both templates and subjects were saved in **Authentication > Emails > Templates** on November 19, 2026. Source-file edits do not update the hosted templates automatically.

The November 18 public DNS check found SPF, MX, and a DKIM key at `privateemail._domainkey.vibe-quest.net`, but no DMARC TXT record at `_dmarc.vibe-quest.net`. Add a DMARC record with the domain's DNS provider before completing the delivery check. A monitoring-only starting policy is `v=DMARC1; p=none`; review authentication results before tightening enforcement.

The user completed the test account password reset on November 19, 2026. Verify sign-in using the new password and complete signup confirmation and password recovery tests on a phone. Gmail showed the delivered signup message was mailed and signed by `vibe-quest.net`; verify SPF, DKIM, and DMARC results in received message headers after DMARC is configured. Disable link tracking if the SMTP provider offers it because rewritten links can break Supabase confirmation URLs.

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
