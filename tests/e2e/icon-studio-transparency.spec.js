const { test, expect } = require('@playwright/test');

test('shape stamps preserve underlying artwork and leave empty space transparent', async ({ page }) => {
  await page.route('**/supabase-client.js**', route => route.fulfill({ status: 200, body: '' }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('.site-footer [data-view="share"]').click();
  await page.locator('[data-workshop-mode="icon"]').click();
  await page.locator('[data-icon-template="blank"]').click();
  const canvas = page.locator('#iconCanvas');
  const box = await canvas.boundingBox();
  const at = (x, y) => canvas.click({ position: { x: box.width * x / 16, y: box.height * y / 16 } });
  async function pixel(x, y) {
    return page.evaluate(async ({x, y}) => {
      const bmp = await createImageBitmap(await window.vvIconStudio.getBadgeBlob());
      const c = document.createElement('canvas'); c.width = c.height = 512;
      const ctx = c.getContext('2d'); ctx.drawImage(bmp, 0, 0); bmp.close();
      return Array.from(ctx.getImageData(x, y, 1, 1).data);
    }, {x, y});
  }
  await page.locator('[data-icon-color="#f8d23d"]').click();
  await page.locator('[data-icon-tool="fill"]').click();
  await at(1.5, 1.5);
  await page.locator('[data-icon-color="#fa622e"]').click();
  await page.locator('[data-icon-shape="quarter"]').click();
  await at(4.5, 4.5);
  expect(await pixel(132, 156)).toEqual([250, 98, 46, 255]);
  expect(await pixel(156, 132)).toEqual([248, 210, 61, 255]);
  await page.locator('[data-icon-size="32"]').click();
  expect(await pixel(132, 156)).toEqual([250, 98, 46, 255]);
  expect(await pixel(156, 132)).toEqual([248, 210, 61, 255]);
  await page.locator('[data-icon-action="undo"]').click();
  await page.locator('[data-icon-action="undo"]').click();
  expect(await pixel(132, 156)).toEqual([248, 210, 61, 255]);
  expect(await pixel(156, 132)).toEqual([248, 210, 61, 255]);
  await page.locator('[data-icon-template="blank"]').click();
  await at(4.5, 4.5);
  expect(await pixel(132, 156)).toEqual([250, 98, 46, 255]);
  expect(await pixel(156, 132)).toEqual([0, 0, 0, 0]);
  expect(await pixel(20, 20)).toEqual([0, 0, 0, 0]);
});
