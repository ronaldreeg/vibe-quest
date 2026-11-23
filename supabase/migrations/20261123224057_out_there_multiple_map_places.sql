-- Preserve the existing primary location and let each field note have extra pins.
alter table public.out_there_posts
  add column if not exists map_places jsonb not null default '[]'::jsonb;

alter table public.out_there_posts
  add constraint out_there_posts_map_places_array_check
  check (jsonb_typeof(map_places) = 'array');
