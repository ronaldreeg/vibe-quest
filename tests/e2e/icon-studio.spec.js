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

test('shows a clean drawing surface while keeping empty badge pixels transparent', async ({ page }) => {
  await openStudio(page);
  await page.locator('[data-icon-template="blank"]').click();
  const shell = page.locator('.icon-canvas-shell');
  await expect(shell).toHaveCSS('background-image', 'none');
  await expect(shell).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  const canvas = page.locator('#iconCanvas');
  const blank = await canvas.evaluate(el => Array.from(el.getContext('2d').getImageData(32, 32, 1, 1).data));
  expect(blank).toEqual([0, 0, 0, 0]);
  await page.locator('[data-icon-shape="circle"]').click();
  await page.locator('#iconBrushSize').fill('2');
  const box = await canvas.boundingBox();
  await canvas.click({ position: { x: box.width * 4.5 / 16, y: box.height * 4.5 / 16 } });
  // Seams reveal the background, both in the editor and the exported badge.
  for (const [x, alpha] of [[159, 255], [160, 0], [161, 255]]) {
    expect((await badgePixel(page, x, 170))[3]).toBe(alpha);
    expect((await canvas.evaluate((el, x) => Array.from(el.getContext('2d').getImageData(x, 170, 1, 1).data), x))[3]).toBe(alpha);
  }
  expect((await badgePixel(page, 130, 130))[3]).toBe(0);
});

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

test('stamps partial geometric shapes and rotates them without changing the chosen shape', async ({ page }) => {
  await openStudio(page);
  await page.locator('[data-icon-template="blank"]').click();
  await page.locator('[data-icon-shape="triangle"]').click();
  // Stamp at the top-left grid cell, with solid below the diagonal.
  await page.locator('#iconCanvas').click({ position: { x: 8, y: 8 } });
  expect((await badgePixel(page, 6, 26))[3]).toBe(255);
  expect((await badgePixel(page, 26, 6))[3]).toBe(0);
  await page.locator('[data-icon-action="rotate"]').click();
  await expect(page.locator('[data-icon-shape="triangle"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-icon-action="rotate"]')).toHaveAttribute('aria-label', /90 degrees/);
  await expect(page.locator('[data-icon-shape="triangle"] svg')).toHaveCSS('transform', 'matrix(0, 1, -1, 0, 0, 0)');
  await page.locator('#iconCanvas').click({ position: { x: 40, y: 8 } });
  expect((await badgePixel(page, 38, 6))[3]).toBe(255);
  expect((await badgePixel(page, 58, 26))[3]).toBe(0);
});

test('retains a multi-cell circle when the grid is enlarged, and undo restores a reduced grid', async ({ page }) => {
  await openStudio(page);
  await page.locator('[data-icon-template="blank"]').click();
  await page.locator('[data-icon-shape="circle"]').click();
  await page.locator('#iconBrushSize').fill('2');
  const canvas = page.locator('#iconCanvas');
  const box = await canvas.boundingBox();
  await canvas.click({ position: { x: box.width * 4.5 / 16, y: box.height * 4.5 / 16 } });
  const samples = [[163,130], [130,130], [163,163], [188,188]];
  const original = await Promise.all(samples.map(([x,y]) => badgePixel(page, x, y)));
  expect(original[0][3]).toBe(255);
  expect(original[1][3]).toBe(0);
  await page.locator('[data-icon-size="32"]').click();
  expect(await Promise.all(samples.map(([x,y]) => badgePixel(page, x, y)))).toEqual(original);
  await page.locator('[data-icon-size="8"]').click();
  await expect(page.locator('#iconStatus')).toContainText('Undo restores');
  await page.locator('[data-icon-action="undo"]').click();
  await expect(page.locator('[data-icon-size="32"]')).toHaveAttribute('aria-pressed', 'true');
  expect(await Promise.all(samples.map(([x,y]) => badgePixel(page, x, y)))).toEqual(original);
  await page.locator('[data-icon-action="undo"]').click();
  await expect(page.locator('[data-icon-size="16"]')).toHaveAttribute('aria-pressed', 'true');
  expect(await Promise.all(samples.map(([x,y]) => badgePixel(page, x, y)))).toEqual(original);
});

test('brush size slider makes larger stamps and stays within the current grid', async ({ page }) => {
  await openStudio(page);
  await page.locator('[data-icon-template="blank"]').click();
  const slider = page.getByLabel('Brush size');
  await slider.fill('4');
  await expect(slider).toHaveAttribute('aria-valuetext', '4 by 4 cells');
  await expect(page.locator('#iconBrushSizeValue')).toHaveText('4 × 4 cells');
  const canvas = page.locator('#iconCanvas');
  const box = await canvas.boundingBox();
  await canvas.click({ position: { x: box.width * 2.5 / 16, y: box.height * 2.5 / 16 } });
  expect((await badgePixel(page, 175, 175))[3]).toBe(255);
  expect((await badgePixel(page, 200, 200))[3]).toBe(0);
  await page.locator('#iconBrushStretch').check();
  await expect(slider).toHaveAttribute('aria-valuetext', '4 by 8 cells');
  await page.locator('[data-icon-size="8"]').click();
  await expect(slider).toHaveAttribute('max', '4');
});

test('rotates a rectangular stamp to cover the correct cells', async ({ page }) => {
  await openStudio(page);
  await page.locator('[data-icon-template="blank"]').click();
  await page.locator('#iconBrushStretch').check();
  await page.locator('[data-icon-action="rotate"]').click();
  const canvas = page.locator('#iconCanvas');
  const box = await canvas.boundingBox();
  await canvas.click({ position: { x: box.width * 2.5 / 16, y: box.height * 2.5 / 16 } });
  expect((await badgePixel(page, 80, 80))[3]).toBe(255);
  expect((await badgePixel(page, 112, 80))[3]).toBe(255);
  expect((await badgePixel(page, 80, 112))[3]).toBe(0);
});


test('fill recolors connected shape pieces without changing their geometry', async ({ page }) => {
  await openStudio(page);
  await page.locator('[data-icon-template="blank"]').click();
  await page.locator('[data-icon-shape="circle"]').click();
  await page.locator('#iconBrushSize').fill('2');
  const canvas = page.locator('#iconCanvas');
  const box = await canvas.boundingBox();
  await canvas.click({ position: { x: box.width * 4.5 / 16, y: box.height * 4.5 / 16 } });
  await page.locator('[data-icon-tool="fill"]').click();
  await page.locator('[data-icon-color="#0f8fb1"]').click();
  await expect(page.locator('[data-icon-tool="fill"]')).toHaveAttribute('aria-pressed', 'true');
  await canvas.click({ position: { x: box.width * 5 / 16, y: box.height * 5 / 16 } });
  expect(await badgePixel(page, 163, 163)).toEqual([15, 143, 177, 255]);
  expect((await badgePixel(page, 130, 130))[3]).toBe(0);
  expect(await badgePixel(page, 163, 130)).toEqual([15, 143, 177, 255]);
});


test('quarter and concave curve stamps fill complementary areas', async ({ page }) => {
  await openStudio(page);
  await page.locator('[data-icon-template="blank"]').click();
  const canvas = page.locator('#iconCanvas');
  const box = await canvas.boundingBox();
  await page.locator('[data-icon-shape="quarter"]').click();
  await canvas.click({ position: { x: box.width * 2.5 / 16, y: box.height * 2.5 / 16 } });
  await page.locator('[data-icon-shape="curved"]').click();
  await canvas.click({ position: { x: box.width * 4.5 / 16, y: box.height * 2.5 / 16 } });
  // Bottom left is inside the quarter disk; top right is inside its inverse.
  expect((await badgePixel(page, 68, 92))[3]).toBe(255);
  expect((await badgePixel(page, 92, 68))[3]).toBe(0);
  expect((await badgePixel(page, 132, 92))[3]).toBe(0);
  expect((await badgePixel(page, 156, 68))[3]).toBe(255);
});

test('background fill reaches the transparent corners of curved starter pieces and remains undoable', async ({ page }) => {
  await openStudio(page);
  await page.locator('[data-icon-template="cactus"]').click();
  await page.locator('[data-icon-tool="fill"]').click();
  await page.locator('[data-icon-color="#f3e9c4"]').click();
  const canvas = page.locator('#iconCanvas'), box = await canvas.boundingBox();
  const clickPixel = (x, y) => canvas.click({ position: { x: box.width * x / 512, y: box.height * y / 512 } });
  expect((await badgePixel(page, 195, 5))[3]).toBe(0);
  // Click a transparent point inside the yellow circle's bounding cell.
  await clickPixel(195, 5);
  expect(await badgePixel(page, 195, 5)).toEqual([243, 233, 196, 255]);
  expect(await badgePixel(page, 5, 5)).toEqual([243, 233, 196, 255]);
  expect(await badgePixel(page, 250, 20)).toEqual([248, 210, 61, 255]);
  expect((await badgePixel(page, 192, 10))[3]).toBe(0); // transparent grid seam
  await page.locator('[data-icon-color="#0f8fb1"]').click();
  await clickPixel(195, 5); // Recolor the same background under the circle.
  expect(await badgePixel(page, 195, 5)).toEqual([15, 143, 177, 255]);
  expect(await badgePixel(page, 5, 5)).toEqual([15, 143, 177, 255]);
  expect(await badgePixel(page, 250, 20)).toEqual([248, 210, 61, 255]);
  await page.locator('[data-icon-action="undo"]').click();
  expect(await badgePixel(page, 195, 5)).toEqual([243, 233, 196, 255]);
  await page.locator('[data-icon-size="32"]').click();
  expect(await badgePixel(page, 195, 5)).toEqual([243, 233, 196, 255]);
  await page.locator('[data-icon-action="undo"]').click();
  await page.locator('[data-icon-action="undo"]').click();
  expect((await badgePixel(page, 195, 5))[3]).toBe(0);
  // Filling from a blank cell also reaches the curved corners.
  await page.locator('[data-icon-color="#f3e9c4"]').click();
  await clickPixel(5, 5);
  expect(await badgePixel(page, 195, 5)).toEqual([243, 233, 196, 255]);
});

test('background fill preserves enclosed transparent regions and artwork under a curve', async ({ page }) => {
  await openStudio(page);
  await page.locator('[data-icon-template="blank"]').click();
  await page.locator('[data-icon-color="#0f8fb1"]').click();
  const canvas = page.locator('#iconCanvas'), box = await canvas.boundingBox();
  const clickPixel = (x, y) => canvas.click({ position: { x: box.width * x / 512, y: box.height * y / 512 } });
  await clickPixel(70, 70); // teal under the corner of a large circle
  await page.locator('[data-icon-color="#fa622e"]').click();
  await page.locator('[data-icon-shape="circle"]').click();
  await page.locator('#iconBrushSize').fill('6');
  await clickPixel(70, 70);
  await page.locator('[data-icon-tool="eraser"]').click();
  await page.locator('#iconBrushSize').fill('1');
  await clickPixel(140, 140); // hole entirely enclosed by the circle
  await page.locator('[data-icon-tool="fill"]').click();
  await page.locator('[data-icon-color="#f3e9c4"]').click();
  await clickPixel(5, 5);
  expect(await badgePixel(page, 70, 70)).toEqual([15, 143, 177, 255]);
  expect(await badgePixel(page, 120, 120)).toEqual([250, 98, 46, 255]);
  expect((await badgePixel(page, 140, 140))[3]).toBe(0);
});

test('new letter starters stay transparent, recognizable and editable through grid changes', async ({ page }) => {
  await openStudio(page);
  for (const [name, ink, empty] of [
    ['w', [84, 140], [148, 204]],
    ['q', [140, 204], [236, 204]]
  ]) {
    await page.locator('[data-icon-size="16"]').click();
    await page.locator(`[data-icon-template="${name}"]`).click();
    for (const size of [16, 8, 32, 16]) {
      if (size !== 16 || await page.locator('[data-icon-size="16"]').getAttribute('aria-pressed') !== 'true') {
        await page.locator(`[data-icon-size="${size}"]`).click();
      }
      expect((await badgePixel(page, ...ink))[3]).toBe(255);
      expect((await badgePixel(page, ...empty))[3]).toBe(0);
      expect((await badgePixel(page, 10, 10))[3]).toBe(0);
      if (name === 'q') {
        expect((await badgePixel(page, 392, 392))[3]).toBeGreaterThan(0); // connected tail
        expect((await badgePixel(page, 392, 344))[3]).toBe(0); // outside the tail
      }
    }
  }
  await page.locator('[data-icon-template="q"]').click();
  await page.locator('[data-icon-tool="eraser"]').click();
  const canvas = page.locator('#iconCanvas');
  const box = await canvas.boundingBox();
  await canvas.click({ position: { x: box.width * 4.5 / 16, y: box.height * 6.5 / 16 } });
  expect((await badgePixel(page, 140, 204))[3]).toBe(0);
  await page.locator('[data-icon-action="undo"]').click();
  expect((await badgePixel(page, 140, 204))[3]).toBe(255);
});

test('shows a shape placement outline without changing the artwork or exported badge', async ({ page }) => {
  await openStudio(page);
  await page.locator('[data-icon-template="blank"]').click();
  await page.locator('[data-icon-shape="circle"]').click();
  await page.locator('#iconBrushSize').fill('2');
  const canvas = page.locator('#iconCanvas');
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  const moveToPixel = (x, y) => page.mouse.move(box.x + box.width * x / 512, box.y + box.height * y / 512);
  const guidePixel = (x, y) => page.locator('.icon-canvas-shell canvas[aria-hidden="true"]').evaluate((el, [x, y]) => Array.from(el.getContext('2d').getImageData(x, y, 1, 1).data), [x, y]);
  await moveToPixel(140, 140); // The stamp starts at grid cell (4, 4).
  expect((await guidePixel(160, 126))[3]).toBeGreaterThan(0); // circle's top edge
  expect((await guidePixel(128, 128))[3]).toBe(0); // not a square bounding box
  expect((await canvas.evaluate(el => el.getContext('2d').getImageData(160, 126, 1, 1).data[3]))).toBe(0);
  await canvas.click({ position: { x: box.width * 140 / 512, y: box.height * 140 / 512 } });
  expect((await badgePixel(page, 160, 126))[3]).toBe(0); // outline is never exported
  expect((await badgePixel(page, 161, 145))[3]).toBe(255);
  await page.mouse.move(box.x - 10, box.y - 10);
  expect((await guidePixel(160, 126))[3]).toBe(0);
});

test('previews the rotated eraser footprint and hides the guide for fill and touch', async ({ page }) => {
  await openStudio(page);
  await page.locator('[data-icon-template="blank"]').click();
  await page.locator('[data-icon-shape="circle"]').click();
  await page.locator('#iconBrushSize').fill('2');
  await page.locator('#iconBrushStretch').check();
  await page.locator('[data-icon-action="rotate"]').click();
  await page.locator('[data-icon-tool="eraser"]').click();
  const canvas = page.locator('#iconCanvas');
  await canvas.scrollIntoViewIfNeeded();
  let box = await canvas.boundingBox();
  const guide = page.locator('.icon-canvas-shell canvas[aria-hidden="true"]');
  const alpha = (x, y) => guide.evaluate((el, [x, y]) => el.getContext('2d').getImageData(x, y, 1, 1).data[3], [x, y]);
  const move = () => page.mouse.move(box.x + box.width * 140 / 512, box.y + box.height * 140 / 512);
  await move();
  expect(await alpha(190, 126)).toBeGreaterThan(0); // 4 cells wide after rotation
  expect(await alpha(257, 160)).toBeGreaterThan(0);
  expect(await alpha(160, 193)).toBeGreaterThan(0); // 2 cells tall
  expect(await alpha(190, 160)).toBe(0); // hollow guide
  await page.locator('[data-icon-tool="fill"]').click();
  await canvas.scrollIntoViewIfNeeded();
  box = await canvas.boundingBox();
  await move();
  expect(await alpha(190, 126)).toBe(0);
  await page.locator('[data-icon-tool="pencil"]').click();
  await canvas.scrollIntoViewIfNeeded();
  box = await canvas.boundingBox();
  await page.mouse.move(box.x - 10, box.y - 10);
  await canvas.dispatchEvent('pointermove', { pointerType: 'touch', pointerId: 44, clientX: box.x + 20, clientY: box.y + 20 });
  expect(await alpha(190, 126)).toBe(0);
});


test('aligns a rotated asymmetric stamp preview with its painted area, including at the edge', async ({ page }) => {
  await openStudio(page);
  await page.locator('[data-icon-template="blank"]').click();
  await page.locator('[data-icon-shape="triangle"]').click();
  await page.locator('#iconBrushSize').fill('2');
  await page.locator('#iconBrushStretch').check();
  await page.locator('[data-icon-action="rotate"]').click();
  const canvas = page.locator('#iconCanvas');
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  const guide = page.locator('.icon-canvas-shell canvas[aria-hidden="true"]');
  const alpha = (x, y) => guide.evaluate((el, [x, y]) => el.getContext('2d').getImageData(x, y, 1, 1).data[3], [x, y]);
  const move = (x, y) => page.mouse.move(box.x + box.width * x / 512, box.y + box.height * y / 512);
  await move(140, 140);
  expect(await alpha(192, 160)).toBeGreaterThan(0); // diagonal of rotated triangle
  expect(await alpha(253, 190)).toBe(0); // outside the triangle
  await canvas.click({ position: { x: box.width * 140 / 512, y: box.height * 140 / 512 } });
  expect((await badgePixel(page, 140, 140))[3]).toBe(255);
  expect((await badgePixel(page, 245, 184))[3]).toBe(0);
  await move(485, 485); // top-left anchor near bottom-right; only part will fit
  expect(await alpha(500, 478)).toBeGreaterThan(0);
  await canvas.click({ position: { x: box.width * 485 / 512, y: box.height * 485 / 512 } });
  expect((await badgePixel(page, 500, 485))[3]).toBe(255);
});
