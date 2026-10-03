# Vibe Quest Launch Runbook

Use this checklist for the one-city pilot and every public release.

## Release owner

Before launch, write down the person responsible for:

- deployment and rollback;
- reports and urgent safety issues;
- `hello@vibe-quest.net`;
- Supabase health, limits, and auth-email delivery.

One person may own all four during the pilot, but the responsibilities must not be unassigned.

## Pre-launch gates

1. Configure custom SMTP and test signup confirmation plus password recovery on phone and desktop.
2. Export the production database and store the encrypted export outside GitHub.
3. Publish and verify a focused set of current launch listings so the public map does not open empty.
4. Review open reports and resolve or dismiss every launch-blocking item.
5. Confirm the latest GitHub Actions runs for **Deploy Vibe Quest** and **Launch health** are green.
6. Complete the production smoke test below.

## Production smoke test

Use a new test account and a disposable test listing.

1. Open `https://www.vibe-quest.net/` in a private browser window.
2. Search a city, pan to another city, zoom, and confirm listings follow the visible map.
3. Apply multiple vibes and types, clear them, and try **OR ROLL THE DICE**.
4. Create and confirm the test account from the received email.
5. Create a public listing with a photo and link; verify map placement, detail view, share link, and save.
6. Edit the listing, pause it, republish it, and confirm it as active.
7. Create a private-meetup listing and verify the public view shows only an approximate area.
8. From a second account, report the test listing. Confirm the first account cannot see the report.
9. From the admin account, review the report, add a note, and resolve it.
10. Request a password reset and finish the flow on the production domain.
11. Check mobile for horizontal overflow, upload behavior, map scrolling, dialogs, and tap targets.
12. Delete disposable listings and retain the test accounts only if they are useful for future smoke tests.

## Routine operations

### Daily during launch week

- Review open and reviewing reports.
- Check `hello@vibe-quest.net` and auth-email delivery failures.
- Check GitHub Actions and Supabase service health.
- Sample new listings for unsafe content, inaccurate location, broken links, and stale dates.

### Weekly during the pilot

- Export the database and verify the file can be opened.
- Review Storage growth, database size, Edge Function errors, and Auth email limits.
- Re-run Supabase security and performance advisors.
- Confirm recurring and anytime listings are being reconfirmed.
- Test one real upload on a phone over a normal mobile connection.

## Moderation response

- Immediate danger or clearly illegal content: pause the listing promptly, preserve the report and audit entry, and escalate to the appropriate real-world service. Vibe Quest is not an emergency service.
- Private address exposure, impersonation, threats, or targeted harassment: review the same day and hide the listing while facts are checked.
- Inaccurate date, broken link, duplicate, or map correction: review within two business days.
- Disagreement without a rule violation: document and dismiss; do not turn the product into a public argument or review thread.

Never reveal a reporter's identity to the listing owner.

## Incident response

If private data appears public, cross-account editing succeeds, or account access is compromised:

1. Pause affected listings or disable the exposed feature.
2. Preserve timestamps, affected record IDs, and relevant Supabase logs without copying unnecessary personal data.
3. Rotate any exposed secret immediately. Publishable keys are not secrets; `service_role`, database passwords, and SMTP passwords are.
4. Fix and test the issue against owner, non-owner, anonymous, and admin roles.
5. Notify affected people when legally or ethically required.
6. Record what happened and what prevents recurrence.

## Deployment and rollback

Production deploys from `main` through GitHub Pages.

1. Commit a coherent release with passing local checks.
2. Push `main` and watch the deployment workflow.
3. Run the public-page and critical-path smoke checks.

For a front-end regression, revert the bad commit and push the revert. Do not use `git reset --hard` on the shared branch.

For a database regression, prefer a new forward migration that restores safe behavior. Do not rewrite applied migration history. Take a fresh export before any corrective migration that changes user data.

## Scale triggers

The client currently fetches a padded visible-map area with a 250-row cap and renders at most 150 markers.

Plan PostGIS viewport queries and clustering when any of these become true:

- a normal city viewport regularly contains about 100 or more markers;
- the 250-row cap is reached;
- map movement becomes visibly slow on a mid-range phone;
- database logs show bounding-box discovery as a hot query.

Add generated image variants when measured listing images are regularly larger than needed for their rendered size. Make changes from real measurements, not imagined scale.
