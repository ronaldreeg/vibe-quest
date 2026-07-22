# Vibe Quest

This is the current functional Vibe Ventures prototype, prepared for the Vibe Quest repository on July 22, 2026. The Vibe Quest name and visual identity are still intentionally open while the brand is being developed.

For the launch boundary, see [`LAUNCH_READINESS.md`](./LAUNCH_READINESS.md).
For the hosting and backend handoff, see [`DEPLOYMENT.md`](./DEPLOYMENT.md).

## What is included

- Discovery-first layout with city search, activity type and vibe filters, activity cards, and an OpenStreetMap map.
- Local sign up and sign in flow.
- Editable user profile with a saved home city.
- Saved activities tied to the signed-in local user.
- Share form for creating, editing, and deleting activities, including verified map placement, vibe tags, optional links, and an uploaded photo.
- Activity detail windows with location, price, type, host, external links, and saved-state controls.
- An editorial Out There page reserved for team news, updates, and photography.
- Responsive styling for desktop and mobile.
- Launch-readiness hardening for local storage failures, map position, keyboard navigation, reduced motion, links, dates, and image uploads.

## Important storage note

The prototype stores accounts, profile data, saved activities, posted activities, and session data in the browser's `localStorage`. Passwords are hashed before being stored, but this is still only a prototype pattern.

For production, replace the local storage adapter in `app.js` with a real backend:

- Supabase Auth for email/password or magic-link login.
- Supabase Postgres tables for `profiles`, `activities`, `saved_activities`, and future RSVP/scheduling records.
- Supabase Storage for activity photos.
- Row-level security so users can only edit their own profile, saves, and posted activities.
- Optional verification/moderation before activities are publicly visible.

## Early schema sketch

The following schema documents the prototype's original direction only. It is not the recommended final production model because it does not yet separate organizers, recurring occurrences, location privacy, media, moderation, or listing lifecycle.

The production database should follow the foundation plan kept with the project notes, with separate organizer ownership, recurring occurrences, location privacy, media, moderation, and listing lifecycle fields.

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  home_city text,
  created_at timestamptz default now()
);

create table activities (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references profiles(id) on delete set null,
  title text not null,
  city text not null,
  area text,
  activity_type text not null,
  vibes text[] default '{}',
  links jsonb default '[]',
  description text not null,
  price text,
  seats integer,
  status text default 'draft',
  created_at timestamptz default now()
);

create table saved_activities (
  user_id uuid references profiles(id) on delete cascade,
  activity_id uuid references activities(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, activity_id)
);

```

## How to run

Open `index.html` in a browser, or serve the folder with any static web server.

## Deployment preparation

The repository-ready files include a `CNAME` for `www.vibe-quest.net`, a `.nojekyll` marker, and a GitHub Pages workflow under `.github/workflows/`. These prepare the site for Pages hosting once the repository is connected with write access and Pages is enabled.
