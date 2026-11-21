const { test, expect } = require('@playwright/test');

test('shape stamps follow the chosen grid size', async ({ page }) => {
  await page.route('**/supabase-client.js**', route => route.fulfill({ status: 200, body: '' }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#adventureGrid .adventure-card').first()).toBeVisible();
  await page.locator('.site-footer [data-view="share"]').click();
  await page.locator('[data-workshop-mode="icon"]').click();

  const canvas = page.locator('#iconCanvas');
  const box = await canvas.boundingBox();
  for (const size of [8, 16, 32]) {
    await page.locator(`[data-icon-size="${size}"]`).click();
    for (const shape of ['square', 'triangle', 'circle', 'semicircle', 'quarter', 'curved']) {
      await page.locator('[data-icon-template="blank"]').click();
      await page.locator(`[data-icon-shape="${shape}"]`).click();
      await canvas.click({ position: { x: box.width * 1.5 / size, y: box.height * 1.5 / size } });
      const bounds = await canvas.evaluate(el => {
        const data = el.getContext('2d').getImageData(0, 0, 512, 512).data;
        let left = 512, top = 512, right = -1, bottom = -1;
        for (let y = 0; y < 512; y++) for (let x = 0; x < 512; x++) {
          if (!data[(y * 512 + x) * 4 + 3]) continue;
          left = Math.min(left, x); right = Math.max(right, x);
          top = Math.min(top, y); bottom = Math.max(bottom, y);
        }
        return { left, top, right, bottom };
      });
      const cell = 512 / size;
      expect(bounds.left, `${shape} left edge on ${size} grid`).toBeGreaterThanOrEqual(cell);
      expect(bounds.top, `${shape} top edge on ${size} grid`).toBeGreaterThanOrEqual(cell);
      expect(bounds.right, `${shape} right edge on ${size} grid`).toBeLessThan(cell * 2);
      expect(bounds.bottom, `${shape} bottom edge on ${size} grid`).toBeLessThan(cell * 2);
      // Curved shapes narrow near the corners, and the seams remove an edge pixel.
      expect(bounds.right - bounds.left, `${shape} width on ${size} grid`).toBeGreaterThan(cell * .55);
      expect(bounds.bottom - bounds.top, `${shape} height on ${size} grid`).toBeGreaterThan(cell * .35);
    }
  }
});
