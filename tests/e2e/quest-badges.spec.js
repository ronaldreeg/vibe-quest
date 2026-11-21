const { test, expect } = require('@playwright/test');

async function pngFile(page) {
  const bytes = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 16;
    const context = canvas.getContext('2d');
    context.fillStyle = '#fa622e';
    context.fillRect(2, 2, 12, 12);
    return canvas.toDataURL('image/png').split(',')[1];
  });
  return { name: 'badge.png', mimeType: 'image/png', buffer: Buffer.from(bytes, 'base64') };
}

test.beforeEach(async ({ page }) => {
  // Isolate this test from production: local prototype storage only.
  await page.route('**/supabase-client.js**', (route) => route.fulfill({ status: 200, body: '' }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#adventureGrid .adventure-card').first()).toBeVisible();
});

test('a guest can upload a badge and keep it while opening sign in', async ({ page }) => {
  await page.locator('.nav-tabs-left [data-view="host"]').click();
  await page.locator('#questBadgeFile').setInputFiles(await pngFile(page));
  await expect(page.locator('#questBadgePreview img')).toBeVisible();
  await page.locator('#shareAuthPrompt [data-action="open-signup"]').click();
  await expect(page.locator('#authModal')).toHaveAttribute('open', '');
  await page.locator('[data-action="close-auth"]').click();
  await expect(page.locator('#questBadgePreview img')).toBeVisible();
  await page.locator('#questBadgeRemove').click();
  await expect(page.locator('#questBadgePreview')).toContainText('No badge selected');
});

test('a badge made in the workshop returns to the unfinished quest', async ({ page }) => {
  await page.locator('.nav-tabs-left [data-view="host"]').click();
  await page.locator('#hostForm input[name="title"]').fill('My unfinished quest');
  await page.locator('[data-action="open-badge-studio"]').click();
  await expect(page.locator('[data-workshop-panel="icon"]')).toBeVisible();
  await page.locator('[data-icon-template="heart"]').click();
  await page.locator('[data-icon-action="use"]').click();
  await expect(page.locator('#hostView')).toBeVisible();
  await expect(page.locator('#questBadgePreview img')).toBeVisible();
  await expect(page.locator('#hostForm input[name="title"]')).toHaveValue('My unfinished quest');
});

test('a badge stays separate from the photo and quest gem when posting and editing', async ({ page }) => {
  await page.evaluate(() => {
    const user = { id: 'test-badge-owner', name: 'Test Owner', email: 'test@example.invalid', city: 'Austin, TX' };
    store.set('vv_users', [user]);
    state.session = { userId: user.id };
    geocodeListingLocation = async () => ({ ok: true, lat: 30.267, lng: -97.743, accuracy: 'exact', message: 'Matched' });
  });
  await page.locator('.nav-tabs-left [data-view="host"]').click();
  await page.locator('#hostForm input[name="title"]').fill('Badge test quest');
  await page.locator('#hostForm input[name="location"]').fill('Test public venue');
  await page.locator('#hostForm input[name="city"]').fill('Austin, TX');
  await page.locator('#hostForm textarea[name="description"]').fill('A test activity to check a custom badge.');
  await page.locator('#hostForm input[name="price"]').fill('Free');
  await page.locator('#hostForm input[name="listingMode"][value="anytime"]').locator('..').click();
  await page.locator('#questBadgeFile').setInputFiles(await pngFile(page));
  await expect(page.locator('#questBadgePreview img')).toBeVisible();
  await page.locator('#hostForm button[type="submit"]').click();
  await expect.poll(() => page.evaluate(() => store.get('vv_adventures', []).length)).toBe(1);
  const posted = await page.evaluate(() => store.get('vv_adventures', [])[0]);
  expect(posted.badge).toMatch(/^data:image\/png;base64,/);
  expect(posted.iconKey).toBeTruthy();
  expect(posted.photo).toBe('');
  await page.evaluate((id) => openDetail(id), posted.id);
  await expect(page.locator('#detailModal .quest-custom-badge')).toBeVisible();
  await page.locator('#detailModal [data-action="edit-post"]').click();
  await expect(page.locator('#questBadgePreview img')).toBeVisible();
  await page.locator('#questBadgeRemove').click();
  await page.locator('#hostForm button[type="submit"]').click();
  await expect.poll(() => page.evaluate(() => store.get('vv_adventures', [])[0].badge)).toBe('');
});
