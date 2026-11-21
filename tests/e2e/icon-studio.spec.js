const { test, expect } = require('@playwright/test');

// Keep the studio tests local: no auth, database writes, or external image hosts.
test.beforeEach(async ({ page }) => {
  await page.route('**/supabase-client.js**', (route) => route.fulfill({ status: 200, body: '' }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#adventureGrid .adventure-card').first()).toBeVisible();
});

async function openStudio(page) {
  await page.locator('.site-footer [data-view="share"]').click();
  await page.locator('[data-workshop-mode="icon"]').click();
  await expect(page.locator('#iconCanvas')).toBeVisible();
}

async function badgePixel(page, x, y) {
  return page.evaluate(async ({ x, y }) => {
    const blob = await window.vvIconStudio.getBadgeBlob();
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 512;
    const context = canvas.getContext('2d');
    context.drawImage(bitmap, 0, 0);
    bitmap.close();
    return Array.from(context.getImageData(x, y, 1, 1).data);
  }, { x, y });
}

test('draws on the pixel grid, changes color, fills and undoes the last edit', async ({ page }) => {
  await openStudio(page);
  await page.locator('[data-icon-template="blank"]').click();
  await page.locator('#iconCanvas').click({ position: { x: 12, y: 12 } });
  expect(await badgePixel(page, 16, 16)).toEqual([250, 98, 46, 255]);
  await page.locator('[data-icon-color="#0f8fb1"]').click();
  await page.locator('[data-icon-tool="fill"]').click();
  await page.locator('#iconCanvas').click({ position: { x: 100, y: 100 } });
  expect(await badgePixel(page, 400, 400)).toEqual([15, 143, 177, 255]);
  expect(await badgePixel(page, 16, 16)).toEqual([250, 98, 46, 255]);
  await page.locator('[data-icon-action="undo"]').click();
  expect(await badgePixel(page, 400, 400)).toEqual([0, 0, 0, 0]);
  expect(await badgePixel(page, 16, 16)).toEqual([250, 98, 46, 255]);
});

test('crops an uploaded image and offers optional pixelation', async ({ page }) => {
  await openStudio(page);
  const bytes = await page.evaluate(() => {
    const c = document.createElement('canvas'); c.width = 80; c.height = 40;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ff0000'; ctx.fillRect(0, 0, 40, 40);
    ctx.fillStyle = '#00ff00'; ctx.fillRect(40, 0, 40, 40);
    return c.toDataURL('image/png').split(',')[1];
  });
  await page.locator('#iconUpload').setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer: Buffer.from(bytes, 'base64') });
  await expect(page.locator('#iconUploadControls')).toBeVisible();
  await page.locator('#iconCropX').fill('0');
  expect(await badgePixel(page, 256, 256)).toEqual([255, 0, 0, 255]);
  await page.locator('#iconCropX').fill('100');
  await page.locator('#iconPixelate').check();
  expect(await badgePixel(page, 256, 256)).toEqual([0, 255, 0, 255]);
});

test('sends the finished icon to the quest form without replacing its photo', async ({ page }) => {
  await openStudio(page);
  await page.locator('[data-icon-template="mushroom"]').click();
  await page.locator('[data-icon-action="use"]').click();
  await expect(page.locator('#hostView')).toBeVisible();
  await expect(page.locator('#questBadgePreview img')).toBeVisible();
  await expect(page.locator('#questBadgePreview img')).toHaveAttribute('src', /^data:image\/png;base64,/);
  await expect(page.locator('#hostForm input[name="photoFile"]').first()).toHaveValue('');
});

test('keeps canvas and tools together on a narrow screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openStudio(page);
  const canvas = await page.locator('#iconCanvas').boundingBox();
  const palette = await page.locator('.icon-palette').boundingBox();
  const tools = await page.locator('.icon-tool-options').boundingBox();
  expect(canvas.width).toBeLessThanOrEqual(390);
  expect(palette.y).toBeGreaterThan(canvas.y + canvas.height);
  expect(palette.y - (canvas.y + canvas.height)).toBeLessThan(120);
  expect(tools.y - (palette.y + palette.height)).toBeLessThan(100);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
