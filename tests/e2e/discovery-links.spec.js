const { test, expect } = require("@playwright/test");

const ACTIVITY_ID = "23c96d4e-1f3f-4d2f-b1b4-82c39dc53b86";
const DISCOVERY_ORIGIN = "https://discover.vibe-quest.net";

async function renderRealListing(page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#adventureGrid .adventure-card").first()).toBeVisible();
  await page.evaluate((id) => {
    const sample = getAdventures()[0];
    const listing = {
      ...sample,
      id,
      title: "A real discovery",
      isExample: false,
      status: "published",
      listingMode: "anytime",
      lastConfirmedAt: new Date().toISOString()
    };
    state.backendEnabled = true;
    state.remoteActivities = [listing];
    els.adventureGrid.innerHTML = adventureCard(listing);
  }, ACTIVITY_ID);
}

test("discovery links stay disabled until the service is configured", async ({ page }) => {
  await renderRealListing(page);
  const title = page.locator("#adventureGrid .adventure-title-link");
  await expect(title).toHaveJSProperty("tagName", "BUTTON");
  const shareUrl = await page.evaluate((id) => activityShareUrl(id), ACTIVITY_ID);
  expect(new URL(shareUrl).searchParams.get("activity")).toBe(ACTIVITY_ID);
  await title.click();
  await expect(page.locator("#detailModal")).toHaveAttribute("open", "");
});

test("enabled listing links open the modal normally and allow modified navigation", async ({ page }) => {
  await page.route("**/app-v8.js?*", async (route) => {
    const response = await route.fetch();
    const original = await response.text();
    expect(original).toContain('const DISCOVERY_ORIGIN = "";');
    await route.fulfill({
      response,
      body: original.replace('const DISCOVERY_ORIGIN = "";', `const DISCOVERY_ORIGIN = "${DISCOVERY_ORIGIN}";`)
    });
  });
  await renderRealListing(page);
  const card = page.locator("#adventureGrid .adventure-card");
  const title = card.locator(".adventure-title-link");
  const expectedUrl = `${DISCOVERY_ORIGIN}/activities/${ACTIVITY_ID}`;
  await expect(title).toHaveAttribute("href", expectedUrl);
  await expect(card.locator(".adventure-detail-link")).toHaveAttribute("href", expectedUrl);
  expect(await page.evaluate((id) => activityShareUrl(id), ACTIVITY_ID)).toBe(expectedUrl);

  const wasAlreadyPrevented = await title.evaluate((element) => {
    let prevented = null;
    window.addEventListener("click", (event) => {
      prevented = event.defaultPrevented;
      event.preventDefault();
    }, { once: true });
    element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: true }));
    return prevented;
  });
  expect(wasAlreadyPrevented).toBe(false);
  await expect(page.locator("#detailModal")).not.toHaveAttribute("open", "");

  const originalUrl = page.url();
  await title.click();
  await expect(page.locator("#detailModal")).toHaveAttribute("open", "");
  expect(page.url()).toBe(originalUrl);

  const sampleUsesLegacyLink = await page.evaluate(() => {
    const sample = getAdventures().find((item) => item.isExample);
    return discoveryActivityUrl(sample) === "" && new URL(activityShareUrl(sample.id)).searchParams.get("activity") === sample.id;
  });
  expect(sampleUsesLegacyLink).toBe(true);
});
