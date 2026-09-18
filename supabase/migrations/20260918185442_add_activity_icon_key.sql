alter table public.activities
  add column if not exists icon_key text;

alter table public.activities
  drop constraint if exists activities_icon_key_format;

alter table public.activities
  add constraint activities_icon_key_format
  check (
    icon_key is null
    or (
      char_length(icon_key) between 1 and 40
      and icon_key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    )
  );

comment on column public.activities.icon_key is
  'Optional key for the Vibe Quest map icon selected by the activity owner.';
