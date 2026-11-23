const { test, expect } = require('@playwright/test');

async function quadrantImage(page, width = 160, height = 90) {
  const data = await page.evaluate(({ width, height }) => {
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');
    [['#ff0000', 0, 0], ['#00ff00', 1, 0], ['#0000ff', 0, 1], ['#ffff00', 1, 1]].forEach(([color, x, y]) => {
      ctx.fillStyle = color; ctx.fillRect(x * width / 2, y * height / 2, width / 2, height / 2);
    });
    return canvas.toDataURL('image/png').split(',')[1];
  }, { width, height });
  return { name: 'quadrants.png', mimeType: 'image/png', buffer: Buffer.from(data, 'base64') };
}

async function cropPixels(page) {
  return page.evaluate(async () => {
    const canvas = document.querySelector('#iconCanvas');
    const preview = document.querySelector('#iconSmallPreview');
    const center = c => [...c.getContext('2d').getImageData(Math.floor(c.width / 2), Math.floor(c.height / 2), 1, 1).data];
    const blob = await window.vvIconStudio.getOutputBlob();
    const url = URL.createObjectURL(blob);
    try {
      const image = new Image(); image.src = url; await image.decode();
      const out = document.createElement('canvas'); out.width = image.naturalWidth; out.height = image.naturalHeight;
      out.getContext('2d').drawImage(image, 0, 0);
      return { editor: center(canvas), preview: center(preview), output: center(out) };
    } finally { URL.revokeObjectURL(url); }
  });
}

async function setSlider(page, id, value, event = 'input') {
  await page.locator(id).evaluate((element, { value, event }) => {
    element.value = value;
    element.dispatchEvent(new Event(event, { bubbles: true }));
  }, { value, event });
}

test.beforeEach(async ({ page }) => {
  await page.route('**/supabase-client.js**', route => route.fulfill({ status: 200, body: '' }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('.nav-tabs-left [data-view="host"]').click();
  await page.locator('[data-action="open-photo-studio"]').click();
});

test('zoom and reposition a matching-aspect photo, including pixelated export', async ({ page }) => {
  await page.locator('#iconUpload').setInputFiles(await quadrantImage(page));
  await expect(page.locator('#iconCropZoom')).toBeVisible();
  await setSlider(page, '#iconCropZoom', '200');
  await setSlider(page, '#iconCropX', '0');
  await setSlider(page, '#iconCropY', '0');
  expect(await cropPixels(page)).toEqual({ editor: [255, 0, 0, 255], preview: [255, 0, 0, 255], output: [255, 0, 0, 255] });
  // Test change as well as input, including the pixelated rendering path.
  await page.locator('#iconPixelate').check();
  await setSlider(page, '#iconCropX', '100', 'change');
  await setSlider(page, '#iconCropY', '100', 'change');
  expect(await cropPixels(page)).toEqual({ editor: [255, 255, 0, 255], preview: [255, 255, 0, 255], output: [255, 255, 0, 255] });
});

test('badge crop uses the same controls and a new upload resets framing', async ({ page }) => {
  await page.locator('[data-icon-destination="badge"]').click();
  await page.locator('#iconUpload').setInputFiles(await quadrantImage(page, 160, 160));
  await expect(page.locator('#iconCropZoom')).toBeVisible();
  await setSlider(page, '#iconCropZoom', '200');
  await setSlider(page, '#iconCropX', '100');
  await setSlider(page, '#iconCropY', '100');
  expect(await cropPixels(page)).toEqual({ editor: [255, 255, 0, 255], preview: [255, 255, 0, 255], output: [255, 255, 0, 255] });
  await page.locator('#iconUpload').setInputFiles(await quadrantImage(page, 161, 160));
  await expect(page.locator('#iconCropZoom')).toHaveValue('100');
  await expect(page.locator('#iconCropX')).toHaveValue('50');
  await expect(page.locator('#iconCropY')).toHaveValue('50');
});
