const { test, expect } = require('@playwright/test');

const censusCandidate = {
  lat: '29.305887751977', lon: '-94.791750912518',
  display_name: '2121 MARKET ST, GALVESTON, TX, 77550',
  name: '2101 MARKET ST', category: 'place', type: 'house', addresstype: 'house',
  address: { house_number: '2101', road: 'MARKET ST', city: 'GALVESTON', state: 'TX', state_code: 'US-TX' }
};

test.beforeEach(async ({ page }) => {
  // Exercise the real match and ranking logic without contacting any services.
  await page.route('**/supabase-client.js**', (route) => route.fulfill({ status: 200, body: '' }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate((candidate) => {
    window.__streetCandidate = candidate;
    window.__locationQueries = [];
    fetchGeocodeResults = async (query) => {
      window.__locationQueries.push(query);
      if (query === 'Galveston, TX') return [{
        lat: '29.3', lon: '-94.79', addresstype: 'city',
        boundingbox: ['29.1', '29.5', '-95', '-94.5'],
        address: { state: 'Texas', state_code: 'US-TX' }, display_name: 'Galveston, Texas'
      }];
      return [window.__streetCandidate];
    };
  }, censusCandidate);
});

test('accepts a suite while preserving the submitted address', async ({ page }) => {
  const result = await page.evaluate(async () => ({
    match: await geocodeListingLocation('2121 Market St Ste 101, Galveston, TX 77550', 'Galveston, TX'),
    queries: window.__locationQueries
  }));
  expect(result.match).toMatchObject({ ok: true, lat: 29.305887751977, lng: -94.791750912518 });
  expect(result.queries[1]).toBe('2121 Market St Ste 101, Galveston, TX 77550');
});

test('accepts common unit formats without weakening street and number matching', async ({ page }) => {
  const results = await page.evaluate(async () => {
    const addresses = [
      '2121 Market Street Suite 101', '2121 Market St #101', '2121 Market St Apt. 2B',
      '2121 Market St Unit A', '2101 Market St Ste 101', '2122 Market St Ste 101',
      '2121 Broadway St Ste 101'
    ];
    return Promise.all(addresses.map((address) => geocodeListingLocation(address, 'Galveston, TX')));
  });
  expect(results.map((result) => result.ok)).toEqual([true, true, true, true, false, false, false]);
});

test('still rejects a match returned in the wrong state', async ({ page }) => {
  const result = await page.evaluate(async () => {
    window.__streetCandidate.address.state = 'Louisiana';
    window.__streetCandidate.address.state_code = 'US-LA';
    return geocodeListingLocation('2121 Market St Ste 101', 'Galveston, TX');
  });
  expect(result.ok).toBe(false);
});
