# Vibe Ventures Launch Readiness

Audit date: July 22, 2026

## Current status

The current build is ready for private browser testing and a small local prototype run. It is not ready for a public launch yet because accounts, listings, saves, and uploaded photos still live in each visitor's browser `localStorage`.

That is useful for exploring the experience, but it means:

- A user's account does not follow them to another device.
- There is no shared public database between visitors.
- Browser storage can fill up or be cleared without warning.
- Passwords and private data are still being handled in the browser.
- There is no real moderation, account recovery, or administrative control.

## Improvements made in this pass

- Map rendering now preserves a user's manual zoom and position while filters update.
- City searches, deliberate map jumps, profile cities, and new posts can still request a fresh map fit.
- Search filtering is lightly debounced so the map does not rebuild on every keystroke.
- Activity tiles are keyboard-focusable and open with Enter or Space.
- Filter controls expose their selected state to assistive technology.
- Local storage writes fail gracefully instead of crashing the interface.
- Existing prototype password records continue to work and upgrade to salted PBKDF2 hashes after sign-in.
- Uploaded images are resized and compressed before browser storage, with an upload limit and clear failure states.
- Broken remote photos fall back to the existing visual treatment.
- Invalid external links are rejected with a human-readable message.
- Invalid calendar dates are rejected instead of being silently rolled into another day.
- The app no longer removes older adventure-log keys every time it starts.
- Reduced-motion preferences and visible keyboard focus states are supported.
- Page metadata and a no-JavaScript message are present for a cleaner first launch.

## Required before public launch

1. Replace the browser storage adapter with Supabase Auth, Postgres, and Storage.
2. Add row-level security so people can only manage their own profile, saves, media, and listings.
3. Move password handling entirely to Supabase Auth. The browser prototype hash is not a production authentication system.
4. Store photos in Supabase Storage or an image service, with public/private buckets, transformations, thumbnails, and CDN delivery.
5. Move geocoding behind a server-side function or a production geocoding provider. Nominatim should not be treated as an unlimited client-side production API.
6. Query activities by map bounds and indexed geographic points. The prototype intentionally shows only the first 40 pins; a production map needs clustering and progressive loading.
7. Add listing lifecycle fields: published, paused, cancelled, expired, last confirmed, and time zone.
8. Add reporting, moderation, organizer ownership, admin publishing for Out There, and a way to correct unsafe or inaccurate locations.
9. Protect private-home locations by storing a protected address separately from the public approximate point.
10. Add password recovery, email verification, error monitoring, backups, analytics, legal pages, and domain/SSL configuration.
11. Replace the prototype's `example.com` listing links and the temporary `hello@vibeventure.org` editorial inbox before inviting the public.

## Recommended release sequence

### Private prototype

Use the current static build to test whether people can discover, save, and share without help. Keep real passwords and sensitive personal information out of it.

### One-city pilot

Connect Supabase, launch in one city, seed a small number of excellent listings, and watch the first publishing and moderation flows closely.

### Public expansion

Add map-bound queries, image delivery, moderation operations, organizer roles, and lifecycle automation before expanding across multiple cities.

The durable foundation plan remains in [`../FOUNDATION_PLAN.md`](../FOUNDATION_PLAN.md).
