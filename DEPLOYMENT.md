# Vibe Quest Deployment Handoff

## Production

- Site: `https://www.vibe-quest.net/`
- Hosting: GitHub Pages
- Source branch: `main`
- Backend: Supabase project `wyebrsyiauxgoabzigrg`
- Public contact: `hello@vibe-quest.net`

The repository's `CNAME` and GitHub Pages settings define the custom domain. HTTPS should remain enforced in GitHub Pages.

## Release flow

1. Run the local checks and responsive smoke test.
2. Commit a coherent release to `main`.
3. Push `main`.
4. Watch **Deploy Vibe Quest** in GitHub Actions.
5. Confirm the live footer, policy page, discovery map, and Supabase listing request.
6. Follow the full checklist in [`LAUNCH_RUNBOOK.md`](./LAUNCH_RUNBOOK.md) for a public release.

The **Launch health** workflow runs static checks on every push and production smoke checks hourly and on manual dispatch.

## Supabase

Production Supabase services are already connected:

- Auth for signup, confirmation, recovery, and sessions;
- Postgres with row-level security;
- Storage for uploaded media;
- `geocode` and `delete-account` Edge Functions.

See [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) for configuration and plan-dependent launch items.

## Secret handling

The browser may contain only the Supabase project URL and publishable key. Never commit:

- a `service_role` or `sb_secret_` key;
- the database password or connection string;
- SMTP credentials;
- database exports containing user data.

Edge Functions read secrets from Supabase-managed environment variables. GitHub Actions should use repository or environment secrets for any future private credential.

## Rollback

For a front-end regression, revert the responsible commit and push the revert. Do not rewrite shared branch history.

For database behavior, ship a new forward migration. Do not edit an already-applied migration. Export production data before any corrective migration that could alter user records.
