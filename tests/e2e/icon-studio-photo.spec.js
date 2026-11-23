const { test, expect } = require('@playwright/test');

async function makePng(page, color = '#129c3d', width = 64, height = 40) {
  const data = await page.evaluate(({ color, width, height }) => {
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const context = canvas.getContext('2d');
    context.fillStyle = color; context.fillRect(0, 0, width, height);
    return canvas.toDataURL('image/png').split(',')[1];
  }, { color, width, height });
  return { name: 'manual.png', mimeType: 'image/png', buffer: Buffer.from(data, 'base64') };
}

async function openStudioFromQuest(page) {
  await page.locator('[data-action="open-badge-studio"]').click();
  await expect(page.locator('[data-workshop-panel="icon"]')).toBeVisible();
}

async function outputPixels(page) {
  return page.evaluate(async () => {
    const blob = await window.vvIconStudio.getOutputBlob();
    const url = URL.createObjectURL(blob);
    try {
      const image = new Image(); image.src = url; await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
      const pixel = (x, y) => [...context.getImageData(x, y, 1, 1).data];
      return { width: canvas.width, height: canvas.height, corner: pixel(0, 0), center: pixel((canvas.width / 2 + 10) | 0, (canvas.height / 2 + 10) | 0) };
    } finally { URL.revokeObjectURL(url); }
  });
}

async function prepareAccount(page) {
  await page.evaluate(() => {
    const user = { id: 'studio-photo-owner', name: 'Test Owner', email: 'test@example.invalid', city: 'Austin, TX' };
    store.set('vv_users', [user]); state.session = { userId: user.id };
    geocodeListingLocation = async () => ({ ok: true, lat: 30.267, lng: -97.743, accuracy: 'exact', message: 'Matched' });
  });
}

async function fillPost(page) {
  await page.locator('#hostForm input[name="title"]').fill('Studio cover test');
  await page.locator('#hostForm input[name="location"]').fill('Test public venue');
  await page.locator('#hostForm input[name="city"]').fill('Austin, TX');
  await page.locator('#hostForm textarea[name="description"]').fill('A test activity for a studio cover image.');
  await page.locator('#hostForm input[name="price"]').fill('Free');
  await page.locator('#hostForm input[name="listingMode"][value="anytime"]').locator('..').click();
}

test.beforeEach(async ({ page }) => {
  await page.route('**/supabase-client.js**', route => route.fulfill({ status: 200, body: '' }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#adventureGrid .adventure-card').first()).toBeVisible();
});

test('badge and main-photo outputs have the intended proportions and backgrounds', async ({ page }) => {
  await page.locator('.nav-tabs-left [data-view="host"]').click();
  await page.locator('[data-action="open-photo-studio"]').click();
  await expect(page.locator('[data-icon-destination="photo"]')).toHaveAttribute("aria-pressed", "true");
  await page.locator('[data-icon-template="heart"]').click();
  await page.locator('[data-icon-destination="badge"]').click();
  const badge = await outputPixels(page);
  expect([badge.width, badge.height]).toEqual([512, 512]);
  expect(badge.corner[3]).toBe(0);
  expect(badge.center[3]).toBeGreaterThan(0);
  await page.locator('[data-icon-destination="photo"]').click();
  await page.locator('[data-icon-background="#f8d23d"]').click();
  const photo = await outputPixels(page);
  expect([photo.width, photo.height]).toEqual([1200, 675]);
  expect(photo.corner).toEqual([248, 210, 61, 255]);
  expect(photo.center).not.toEqual(photo.corner);
  await page.locator('[data-icon-destination="badge"]').click();
  expect(await outputPixels(page)).toEqual(badge);
});

test('photo survives validation and posts alongside an independent badge', async ({ page }) => {
  await prepareAccount(page);
  await page.locator('.nav-tabs-left [data-view="host"]').click();
  await fillPost(page);
  await page.locator('#questBadgeFile').setInputFiles(await makePng(page));
  const badgeSrc = await page.locator('#questBadgePreview img').getAttribute('src');
  await openStudioFromQuest(page);
  await page.locator('[data-icon-template="heart"]').click();
  await page.locator('[data-icon-destination="photo"]').click();
  await page.locator('[data-icon-action="use"]').click();
  await expect(page.locator('#hostView')).toBeVisible();
  await expect(page.locator('#questPhotoSelection')).toBeVisible();
  await expect(page.locator('#questBadgePreview img')).toHaveAttribute('src', badgeSrc);
  await expect(page.locator('#hostForm input[name="title"]')).toHaveValue('Studio cover test');
  await expect.poll(() => page.locator('#questPhotoSelectionImage').evaluate(img => [img.naturalWidth, img.naturalHeight])).toEqual([1200, 675]);
  // Programmatic submit exercises validation without the browser blocking the event.
  await page.locator('#hostForm input[name="title"]').fill('x');
  await page.locator('#hostForm').evaluate(form => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  await expect(page.locator('#questPhotoSelection')).toBeVisible();
  await expect(page.locator('#questBadgePreview img')).toHaveAttribute('src', badgeSrc);
  await page.locator('#hostForm input[name="title"]').fill('Studio cover test');
  await page.locator('#hostForm button[type="submit"]').click();
  await expect.poll(() => page.evaluate(() => store.get('vv_adventures', []).length)).toBe(1);
  const posted = await page.evaluate(() => store.get('vv_adventures', [])[0]);
  expect(posted.photo).toMatch(/^data:image\/(webp|jpeg);base64,/);
  expect(posted.badge).toMatch(/^data:image\/png;base64,/);
  const dimensions = await page.evaluate(async src => { const img = new Image(); img.src = src; await img.decode(); return [img.naturalWidth, img.naturalHeight]; }, posted.photo);
  expect(dimensions).toEqual([1200, 675]);
});

test('manual photo replaces the studio photo and clear removes the new selection', async ({ page }) => {
  await page.locator('.nav-tabs-left [data-view="host"]').click();
  await openStudioFromQuest(page);
  await page.locator('[data-icon-template="heart"]').click();
  await page.locator('[data-icon-destination="photo"]').click();
  await page.locator('[data-icon-action="use"]').click();
  await expect(page.locator('#questPhotoSelection')).toBeVisible();
  await page.locator('#hostForm input[name="photoFile"]').setInputFiles(await makePng(page));
  await expect.poll(() => page.locator('#questPhotoSelectionImage').evaluate(img => [img.naturalWidth, img.naturalHeight])).toEqual([64, 40]);
  await page.locator('#questPhotoClear').click();
  await expect(page.locator('#questPhotoSelection')).toBeHidden();
  expect(await page.locator('#hostForm input[name="photoFile"]').evaluate(input => input.files.length)).toBe(0);
  await prepareAccount(page);
  await fillPost(page);
  await page.locator('#hostForm button[type="submit"]').click();
  await expect.poll(() => page.evaluate(() => store.get('vv_adventures', []).length)).toBe(1);
  expect(await page.evaluate(() => store.get('vv_adventures', [])[0].photo)).toBe('');
});
