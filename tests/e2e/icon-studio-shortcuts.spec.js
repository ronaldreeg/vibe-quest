const { test, expect } = require('@playwright/test');

test('Command-Z and Control-Z undo studio artwork without hijacking text input or other views', async ({ page }) => {
  await page.route('**/supabase-client.js**', route => route.fulfill({ status: 200, body: '' }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('.site-footer [data-view="share"]').click();
  await page.locator('[data-workshop-mode="icon"]').click();
  await page.locator('[data-icon-template="blank"]').click();
  const canvas = page.locator('#iconCanvas');
  const box = await canvas.boundingBox();
  await canvas.click({ position: { x: box.width / 32, y: box.height / 32 } });
  await canvas.click({ position: { x: box.width * 3 / 32, y: box.height / 32 } });
  const alpha = async x => canvas.evaluate((el, x) => el.getContext('2d').getImageData(x, 16, 1, 1).data[3], x);
  expect(await alpha(16)).toBe(255);
  expect(await alpha(48)).toBe(255);

  // Editable fields keep their normal browser undo, even when inside the studio.
  const wasTextShortcutCanceled = await page.evaluate(() => {
    const text = document.createElement('textarea');
    document.querySelector('[data-workshop-panel="icon"]').append(text);
    const canceled = !text.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', metaKey: true, bubbles: true, cancelable: true }));
    text.remove();
    return canceled;
  });
  expect(wasTextShortcutCanceled).toBe(false);
  expect(await alpha(48)).toBe(255);

  // Non-typing controls retain focus after use, but should still undo the art.
  await page.locator('#iconBrushSize').focus();
  await page.keyboard.press('Meta+z');
  expect(await alpha(48)).toBe(0);
  expect(await alpha(16)).toBe(255);
  await page.locator('#iconBrushStretch').focus();
  await page.keyboard.press('Control+z');
  expect(await alpha(16)).toBe(0);
  await expect(page.locator('#iconStatus')).toHaveText('Last change undone.');

  // Other modifiers and hidden studio views are not intercepted.
  const prevented = await page.evaluate(() => {
    const fire = options => !document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', bubbles: true, cancelable: true, ...options }));
    const modified = fire({ metaKey: true, shiftKey: true });
    document.querySelector('[data-workshop-panel="icon"]').hidden = true;
    const hidden = fire({ metaKey: true });
    return { modified, hidden };
  });
  expect(prevented).toEqual({ modified: false, hidden: false });
});
