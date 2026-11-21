const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.route('**/supabase-client.js**', route => route.fulfill({ status: 200, body: '' }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('.site-footer [data-view="share"]').click();
  await page.locator('[data-workshop-mode="icon"]').click();
});

async function pixels(page, points) {
  return page.evaluate(async points => {
    const bitmap = await createImageBitmap(await window.vvIconStudio.getBadgeBlob());
    const c = document.createElement('canvas'); c.width = c.height = 512;
    const ctx = c.getContext('2d'); ctx.drawImage(bitmap, 0, 0); bitmap.close();
    return points.map(([x, y]) => Array.from(ctx.getImageData(x, y, 1, 1).data));
  }, points);
}

test('grid spacing is transparent in exports and changes with grid size', async ({ page }) => {
  await page.locator('[data-icon-template="blank"]').click();
  await page.locator('[data-icon-shape="circle"]').click();
  await page.locator('#iconBrushSize').fill('4');
  const canvas = page.locator('#iconCanvas');
  const box = await canvas.boundingBox();
  await canvas.click({ position: { x: box.width * 4.5 / 16, y: box.height * 4.5 / 16 } });
  // The 160 boundary cuts through the circle at 16 and 32, but not at 8.
  const sample = [[160, 170], [161, 170], [170, 170], [130, 130]];
  const at16 = await pixels(page, sample);
  expect(at16[0][3]).toBeLessThan(at16[1][3]);
  expect(at16[2][3]).toBe(255);
  expect(at16[3][3]).toBe(0);
  const shown = await canvas.evaluate(el => Array.from(el.getContext('2d').getImageData(160, 170, 1, 1).data));
  expect(shown).toEqual(at16[0]);
  await page.locator('[data-icon-size="8"]').click();
  const at8 = await pixels(page, sample);
  expect(at8[0][3]).toBe(255);
  await page.locator('[data-icon-size="32"]').click();
  const at32 = await pixels(page, sample);
  expect(at32[0][3]).toBeLessThan(255);
  expect(at32[2][3]).toBe(255);
});

test('seams apply to older pixel starters but never to uploaded images', async ({ page }) => {
  await page.locator('[data-icon-template="heart"]').click();
  const [seam, interior] = await pixels(page, [[160, 170], [170, 170]]);
  expect(seam[3]).toBeLessThan(interior[3]);
  expect(interior[3]).toBe(255);
  const bytes = await page.evaluate(() => {
    const c = document.createElement('canvas'); c.width = c.height = 32;
    const ctx = c.getContext('2d'); ctx.fillStyle = '#ff0000'; ctx.fillRect(0, 0, 32, 32);
    return c.toDataURL('image/png').split(',')[1];
  });
  await page.locator('#iconUpload').setInputFiles({ name: 'red.png', mimeType: 'image/png', buffer: Buffer.from(bytes, 'base64') });
  await expect(page.locator('#iconUploadControls')).toBeVisible();
  for (const pixel of await pixels(page, [[160, 170], [170, 170]])) expect(pixel).toEqual([255, 0, 0, 255]);
  await page.locator('#iconPixelate').check();
  for (const pixel of await pixels(page, [[160, 170], [170, 170]])) expect(pixel).toEqual([255, 0, 0, 255]);
});
