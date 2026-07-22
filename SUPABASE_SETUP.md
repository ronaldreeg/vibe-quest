# Supabase setup

The Vibe Quest prototype is connected to the active Supabase project for `vibe-quest.net`.

## What is live

- Supabase Auth for email/password accounts.
- `profiles` for display name, home city, bio, and future avatar storage.
- `activities` for shared listings, verified coordinates, timing, vibes, type, and lifecycle status.
- `activity_links` for optional social, signup, and information links.
- `activity_media` for activity photos and future moderation.
- `saved_activities` for each user's saved list.
- `adventure_logs` for the future personal field-note/journey feature.
- `out_there_posts` for future team editorial publishing.
- Storage buckets for activity photos, private adventure media, and editorial media.
- Row-level security on every application table and Storage policy.

## One dashboard step

In Supabase, open **Authentication > URL Configuration** and set:

- **Site URL:** `https://www.vibe-quest.net`
- **Redirect URLs:** `https://www.vibe-quest.net/` and `https://vibe-quest.net/`

The app sends users back to the current site after email confirmation. Add the local development URL too when testing locally, such as `http://127.0.0.1:4173/`.

## Key safety

The browser uses the Supabase **publishable** key. That key is designed to be public and is protected by row-level security. Never put a secret or `service_role` key in `index.html`, `app.js`, Storage, or GitHub.

## Data transition

The original demo listings remain in the front-end so the map is not empty while the project is being populated. New accounts, user-created listings, saved remote listings, profile edits, and uploaded activity photos now use Supabase. The personal field-note and editorial tables are ready for their future UI passes.

## Migrations

The database migrations live in `supabase/migrations/` and are applied to the connected project. Keep future schema changes as new timestamped migration files rather than editing an already-applied migration.
