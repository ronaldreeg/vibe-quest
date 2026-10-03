# Vibe Quest

Vibe Quest is a map-first discovery platform for real-world pop-ups, classes, groups, markets, tours, local lore, and other things worth leaving the house for.

Start with [`LAUNCH_READINESS.md`](./LAUNCH_READINESS.md). Operational steps live in [`LAUNCH_RUNBOOK.md`](./LAUNCH_RUNBOOK.md), and backend details live in [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md).

## What is included

- Map-bound discovery that refreshes listings as visitors pan and zoom between cities.
- Multi-select vibe and type filters, date filters, saves, sharing, and random discovery.
- Supabase email/password accounts with confirmation, recovery, persistent sessions, profile editing, and account deletion.
- User-created listings with photos, optional links, Quest Gems, exact geocoding, local time zones, and one-time, recurring, or anytime schedules.
- Published, paused, cancelled, archived, and rejected listing states, plus automatic expiry and recurring-listing freshness rules.
- Private-meetup support that stores the exact location separately and exposes only an approximate public point.
- Private listing reports, an admin moderation queue, resolution notes, listing controls, and an audit trail.
- Storage-backed uploads with client-side image resizing and mobile-safe display.
- A server-side geocoding gateway with validation, caching, per-client limits, and upstream throttling.
- Community rules, Privacy, Terms, Accessibility, and Contact pages.
- Editorial Out There, Workshop flyer tools, Vibetinerary, and Vibe Code generation.
- Responsive keyboard- and touch-friendly layouts for desktop and mobile.

## Production boundary

Production loads only real Supabase listings. The illustrative demo listings remain available on `localhost` and `file:` previews for design work, but they are excluded from `vibe-quest.net`.

The public client contains only the Supabase publishable key. Authorization is enforced by Postgres row-level security and protected Edge Functions; the `service_role` key never ships to the browser.

## Run locally

From this directory:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/`.

## Deployment

Pushing `main` triggers the GitHub Pages workflow in `.github/workflows/deploy-pages.yml`. The hourly launch-health workflow checks JavaScript syntax, required release files, public pages, and the public discovery endpoint.

The repository includes `CNAME` for `www.vibe-quest.net` and `.nojekyll` for GitHub Pages.
