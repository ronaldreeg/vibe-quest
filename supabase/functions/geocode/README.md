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
