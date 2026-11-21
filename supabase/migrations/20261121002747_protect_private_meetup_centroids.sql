-- Never derive a public private-meetup pin from the submitted address or its
-- coordinates: old clients used a reversible offset based on the listing ID.
-- Only a verified city/town result from the server's geocoder can supply it.
-- Deploy the geocoder update first; older clients otherwise cache addresses.

-- A private address need not be geocoded. Keep its text in the protected
-- table without sending it to an external location provider.
alter table public.activity_private_locations
  alter column latitude drop not null,
  alter column longitude drop not null;

create or replace function private.protect_private_activity_location()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  city_key text;
  city_name text;
  city_place jsonb;
  city_lat double precision;
  city_lon double precision;
begin
  if new.location_visibility <> 'private' then
    return new;
  end if;

  -- This trigger is not callable as an API. Retain authentication checks
  -- for client roles while permitting service and migration operations.
  if current_setting('role', true) in ('anon', 'authenticated')
     and (select auth.uid()) is null then
    raise exception 'Sign in to save a private meetup.';
  end if;

  city_key := lower(regexp_replace(trim(new.city), '[[:space:]]+', ' ', 'g'));
  city_name := trim(split_part(city_key, ',', 1));
  if city_key <> '' and city_key !~ '[[:digit:]]' then
    select place.value
      into city_place
      from public.geocode_cache cache
      cross join lateral jsonb_array_elements(
        case when jsonb_typeof(cache.response) = 'array' then cache.response else '[]'::jsonb end
      ) with ordinality as place(value, position)
     where cache.cache_key = 'v3:search:' || city_key || ':3'
       and cache.action = 'search'
       and lower(coalesce(place.value->>'addresstype', place.value->>'type', ''))
         in ('city', 'town', 'village', 'hamlet', 'municipality', 'borough')
       and lower(trim(coalesce(place.value->>'name', ''))) = city_name
       and coalesce(place.value->>'lat', '') ~ '^-?[0-9]+(\.[0-9]+)?$'
       and coalesce(place.value->>'lon', '') ~ '^-?[0-9]+(\.[0-9]+)?$'
     order by place.position
     limit 1;
  end if;

  if city_place is not null then
    city_lat := (city_place->>'lat')::double precision;
    city_lon := (city_place->>'lon')::double precision;
    if city_lat not between -90 and 90 or city_lon not between -180 and 180 then
      city_place := null;
    end if;
  end if;

  if city_place is null then
    -- Fail closed for posts the public could see. Paused and draft records
    -- receive a neutral point so an existing record can always be secured.
    if new.status = 'published' then
      raise exception 'Could not verify this city for a private meetup. Check the city and try again.';
    end if;
    city_lat := 0;
    city_lon := 0;
  end if;

  new.latitude := city_lat;
  new.longitude := city_lon;
  new.location_name := new.city || ' area';
  new.location_query := new.city;
  new.location_accuracy := 'approximate';
  return new;
end;
$$;

revoke all on function private.protect_private_activity_location() from public, anon, authenticated;

drop trigger if exists activities_protect_private_location on public.activities;
create trigger activities_protect_private_location
before insert or update on public.activities
for each row execute function private.protect_private_activity_location();

-- Any private post created while this change was being prepared is paused
-- before being rewritten. The trigger will use a verified city or a neutral
-- location. A host can republish after the updated client verifies the city.
update public.activities
   set status = 'paused'
 where location_visibility = 'private';

-- Older versions of the gateway cached address searches, including ones made
-- by old private-meetup clients. Search cache entries are disposable.
delete from public.geocode_cache where action = 'search' and cache_key like 'v2:search:%';
