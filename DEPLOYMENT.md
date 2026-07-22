# Vibe Quest Deployment Handoff

## GitHub Pages

The static prototype is prepared to publish from the repository's `main` branch through GitHub Actions. After the repository is populated:

1. Enable GitHub Pages using the Actions deployment source.
2. Confirm the Pages custom domain is `www.vibe-quest.net`.
3. At the domain registrar, point the `www` DNS record to the GitHub Pages hostname for this account.
4. Turn on HTTPS after DNS verification completes.
5. Confirm both the `www` address and the preferred root-domain redirect before sharing the site.

The exact DNS records depend on the registrar's current interface, so they should be entered from the values GitHub shows during custom-domain verification.

## Supabase handoff

The Supabase project reference supplied for Vibe Quest is `wyebrsyiauxgoabzigrg`. It identifies the project, but it is not an application secret.

Before production launch, the browser storage adapter in `app-v5.js` should be replaced with:

- Supabase Auth for sign-up, sign-in, email verification, recovery, and sessions.
- Postgres tables for profiles, activities, activity occurrences, saves, field notes, media, reports, and editorial posts.
- Storage buckets for photos with size limits, transformations, thumbnails, and appropriate public/private access.
- Row Level Security policies so users can edit only their own content and public visitors can read only published listings.
- Edge/server functions for geocoding, moderation actions, and any provider keys that must stay private.

No Supabase service-role key or user credential belongs in this repository. Only the browser-safe project URL and publishable key may eventually be exposed to the frontend, and only after the database policies are in place.
