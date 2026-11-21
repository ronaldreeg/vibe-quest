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
    expect(await pixel(page, 259, 131)).toEqual([248, 210, 61, 255]);
    expect(await pixel(page, 163, 340)).toEqual([250, 98, 46, 255]);
    expect(await pixel(page, 350, 340)).toEqual([244, 80, 119, 255]);
    await page.locator('[data-icon-template="flower"]').click();
    expect(await pixel(page, 16, 16)).toEqual([0, 0, 0, 0]);
    expect(await pixel(page, 259, 227)).toEqual([248, 210, 61, 255]);
    expect(await pixel(page, 232, 104)).toEqual([244, 80, 119, 255]);
    expect(await pixel(page, 227, 403)).toEqual([15, 143, 177, 255]);
    await page.locator('[data-icon-action="undo"]').click();
    expect(await pixel(page, 163, 340)).toEqual([250, 98, 46, 255]);
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
    expect(await pixel(page, 259, 259)).toEqual([15, 143, 177, 255]);
    expect(await pixel(page, 99, 259)).toEqual([243, 233, 196, 255]);
    await page.locator('[data-icon-template="cactus"]').click();
    expect(await pixel(page, 16, 16)).toEqual([0, 0, 0, 0]);
    expect(await pixel(page, 227, 195)).toEqual([157, 169, 98, 255]);
    expect(await pixel(page, 227, 419)).toEqual([244, 80, 119, 255]);
    await page.locator('[data-icon-action="undo"]').click();
    expect(await pixel(page, 259, 259)).toEqual([15, 143, 177, 255]);
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
    for (const [x, y] of [[259, 136], [259, 376], [136, 259], [376, 259]]) {
      expect(await pixel(page, x, y)).toEqual([15, 143, 177, 255]);
    }
    expect((await pixel(page, 259, 120))[3]).toBe(0);
    expect((await pixel(page, 259, 392))[3]).toBe(0);
    await page.locator('[data-icon-template="w"]').click();
    expect(await pixel(page, 99, 163)).toEqual([248, 210, 61, 255]);
    expect(await pixel(page, 419, 163)).toEqual([248, 210, 61, 255]);
    expect(await pixel(page, 179, 323)).toEqual([15, 143, 177, 255]);
    expect(await pixel(page, 339, 323)).toEqual([15, 143, 177, 255]);
    expect(await pixel(page, 238, 150)).toEqual([250, 98, 46, 255]);
    expect(await pixel(page, 274, 150)).toEqual([250, 98, 46, 255]);
    expect((await pixel(page, 259, 100))[3]).toBe(0);
    expect((await pixel(page, 16, 16))[3]).toBe(0);
  }
  await page.locator('[data-icon-tool="eraser"]').click();
  const canvas = page.locator('#iconCanvas');
  const box = await canvas.boundingBox();
  await canvas.click({ position: { x: box.width * 104 / 512, y: box.height * 168 / 512 } });
  expect((await pixel(page, 104, 168))[3]).toBe(0);
  await page.locator('[data-icon-action="undo"]').click();
  expect(await pixel(page, 104, 168)).toEqual([248, 210, 61, 255]);
});
