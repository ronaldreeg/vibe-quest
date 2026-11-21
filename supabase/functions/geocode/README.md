# Geocoding data

`census-places-2025.json` contains the U.S. Census Bureau's 2025 Gazetteer
place internal points. Its source is the [national place archive](https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_place_national.zip),
listed on the [2025 Gazetteer page](https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.2025.html).

Each row contains `[name, state abbreviation, latitude, longitude]`, taken
from `NAME`, `USPS`, `INTPTLAT`, and `INTPTLONG`. The original place type
suffixes (such as `city`, `town`, and `CDP`) were removed from names; all
32,350 source places were retained. Census internal points are within the
place but are not necessarily its geographic or population center.

Deploy both `index.ts` and the JSON file together. The city lookup requires an
unambiguous name, preferably written as `city, state`. Street addresses use
the Census geocoder; named venues depend on the external place providers.

Named place searches and reverse geocoding may use LocationIQ when the Edge
Function secret `LOCATIONIQ_API_KEY` is set. Configure an account with both
forward and reverse geocoding enabled. Do not put this secret in the site or
commit it to the repository. Public street addresses first use Census and fall
back to LocationIQ when configured; private meetup addresses are never sent to
an external geocoder by the current client. Sensitive user searches do not
use the LocationIQ search endpoint or enter the shared cache; reverse lookup of
user-provided coordinates is sent to LocationIQ solely to label their area.

The free LocationIQ plan requires a prominent “Search by LocationIQ.com” link
and permits caching request-response pairs for up to 48 hours. Provider results
are intentionally not cached by the gateway, and the client honors the
`cacheable: false` response. Rate reservations serialize upstream requests to
one per second and limit them to 5,000 per rolling 24 hours; these limits are
shared conservatively with other geocoding providers. Provider-side quotas
still apply. See [LocationIQ pricing and terms](https://www.locationiq.com/pricing)
and its [forward](https://docs.locationiq.com/docs/search-forward-geocoding)
and [reverse](https://docs.locationiq.com/docs/reverse-geocoding) references.

Deploy the daily-quota migration before deploying the updated function. The
`v3:search` cache key for Census city results is required by the private
meetup protection trigger and must not be changed without updating that trigger.
