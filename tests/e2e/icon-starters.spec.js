const { test, expect } = require('@playwright/test');

async function pixel(page, x, y) {
  return page.evaluate(async ({ x, y }) => {
    const bitmap = await createImageBitmap(await window.vvIconStudio.getBadgeBlob());
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    return Array.from(ctx.getImageData(x, y, 1, 1).data);
  }, { x, y });
}

test('shape starters are transparent, editable and undoable at every canvas size', async ({ page }) => {
  await page.route('**/supabase-client.js**', route => route.fulfill({ status: 200, body: '' }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('.site-footer [data-view="share"]').click();
  await page.locator('[data-workshop-mode="icon"]').click();
  for (const size of [8, 16, 32]) {
    await page.locator(`[data-icon-size="${size}"]`).click();
    await page.locator('[data-icon-template="sunrise"]').click();
    expect(await pixel(page, 16, 16)).toEqual([0, 0, 0, 0]);
    expect(await pixel(page, 256, 128)).toEqual([248, 210, 61, 255]);
    expect(await pixel(page, 160, 340)).toEqual([250, 98, 46, 255]);
    expect(await pixel(page, 350, 340)).toEqual([244, 80, 119, 255]);
    await page.locator('[data-icon-template="flower"]').click();
    expect(await pixel(page, 16, 16)).toEqual([0, 0, 0, 0]);
    expect(await pixel(page, 256, 224)).toEqual([248, 210, 61, 255]);
    expect(await pixel(page, 232, 104)).toEqual([244, 80, 119, 255]);
    expect(await pixel(page, 224, 400)).toEqual([15, 143, 177, 255]);
    await page.locator('[data-icon-action="undo"]').click();
    expect(await pixel(page, 160, 340)).toEqual([250, 98, 46, 255]);
  }
  await page.locator('[data-icon-template="flower"]').click();
  await page.locator('[data-icon-tool="eraser"]').click();
  const canvas = page.locator('#iconCanvas');
  const box = await canvas.boundingBox();
  await canvas.click({ position: { x: box.width * 232 / 512, y: box.height * 104 / 512 } });
  expect(await pixel(page, 232, 104)).toEqual([0, 0, 0, 0]);
  await page.locator('[data-icon-action="undo"]').click();
  expect(await pixel(page, 232, 104)).toEqual([244, 80, 119, 255]);
});

test('planet and cactus remain transparent and editable at every canvas size', async ({ page }) => {
  await page.route('**/supabase-client.js**', route => route.fulfill({ status: 200, body: '' }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('.site-footer [data-view="share"]').click();
  await page.locator('[data-workshop-mode="icon"]').click();
  for (const size of [8, 16, 32]) {
    await page.locator(`[data-icon-size="${size}"]`).click();
    await page.locator('[data-icon-template="planet"]').click();
    expect(await pixel(page, 16, 16)).toEqual([0, 0, 0, 0]);
    expect(await pixel(page, 256, 256)).toEqual([15, 143, 177, 255]);
    expect(await pixel(page, 96, 256)).toEqual([243, 233, 196, 255]);
    await page.locator('[data-icon-template="cactus"]').click();
    expect(await pixel(page, 16, 16)).toEqual([0, 0, 0, 0]);
    expect(await pixel(page, 224, 192)).toEqual([157, 169, 98, 255]);
    expect(await pixel(page, 224, 416)).toEqual([244, 80, 119, 255]);
    await page.locator('[data-icon-action="undo"]').click();
    expect(await pixel(page, 256, 256)).toEqual([15, 143, 177, 255]);
  }
  await page.locator('[data-icon-template="cactus"]').click();
  await page.locator('[data-icon-tool="eraser"]').click();
  const canvas = page.locator('#iconCanvas');
  const box = await canvas.boundingBox();
  await canvas.click({ position: { x: box.width * 232 / 512, y: box.height * 200 / 512 } });
  expect(await pixel(page, 232, 200)).toEqual([0, 0, 0, 0]);
  await page.locator('[data-icon-action="undo"]').click();
  expect(await pixel(page, 232, 200)).toEqual([157, 169, 98, 255]);
});

test('the centered round planet and geometric W work at every grid size', async ({ page }) => {
  await page.route('**/supabase-client.js**', route => route.fulfill({ status: 200, body: '' }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('.site-footer [data-view="share"]').click();
  await page.locator('[data-workshop-mode="icon"]').click();
  for (const size of [8, 16, 32]) {
    await page.locator(`[data-icon-size="${size}"]`).click();
    await page.locator('[data-icon-template="planet"]').click();
    // Cardinal points of a centered circular globe, above and below the ring.
    for (const [x, y] of [[256, 136], [256, 376], [136, 256], [376, 256]]) {
      expect(await pixel(page, x, y)).toEqual([15, 143, 177, 255]);
    }
    expect((await pixel(page, 256, 120))[3]).toBe(0);
    expect((await pixel(page, 256, 392))[3]).toBe(0);
    await page.locator('[data-icon-template="w"]').click();
    expect(await pixel(page, 96, 160)).toEqual([15, 143, 177, 255]);
    expect(await pixel(page, 416, 160)).toEqual([244, 80, 119, 255]);
    expect(await pixel(page, 176, 320)).toEqual([15, 143, 177, 255]);
    expect(await pixel(page, 336, 320)).toEqual([244, 80, 119, 255]);
    expect((await pixel(page, 256, 160))[3]).toBe(0);
    expect((await pixel(page, 16, 16))[3]).toBe(0);
  }
  await page.locator('[data-icon-tool="eraser"]').click();
  const canvas = page.locator('#iconCanvas');
  const box = await canvas.boundingBox();
  await canvas.click({ position: { x: box.width * 104 / 512, y: box.height * 168 / 512 } });
  expect((await pixel(page, 104, 168))[3]).toBe(0);
  await page.locator('[data-icon-action="undo"]').click();
  expect(await pixel(page, 104, 168)).toEqual([15, 143, 177, 255]);
});
