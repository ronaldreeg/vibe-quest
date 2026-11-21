const { test, expect } = require("@playwright/test");

const ACTIVITY_ID = "23c96d4e-1f3f-4d2f-b1b4-82c39dc53b86";
const DISCOVERY_ORIGIN = "https://discover.vibe-quest.net";

async function renderRealListing(page) {
  // Every activity refresh returns the same fixture, including the initial
  // asynchronous backend bootstrap and later map-viewport refreshes. Mutating
  // the page's state after its first render races those refreshes.
  const activity = {
    id: ACTIVITY_ID,
    title: "A real discovery",
    description: "A public listing used to check discovery links.",
    city: "Galveston, TX",
    location_name: "Seawall",
    location_query: "Seawall, Galveston, TX",
    location_accuracy: "exact",
    location_visibility: "public",
    latitude: 29.3069,
    longitude: -94.7932,
    type: "Food & Drink",
    vibes: ["Hidden Gem"],
    listing_mode: "anytime",
    status: "published",
    last_confirmed_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  };
  await page.route("**/rest/v1/activities?*", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify([activity])
  }));
  await page.route("**/rest/v1/activity_links?*", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: "[]"
  }));
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(`#adventureGrid .adventure-title-link[data-id="${ACTIVITY_ID}"]`)).toBeVisible();
}

test("the directory is linked from the static homepage", async ({ page, request }) => {
  const response = await request.get("/");
  expect(await response.text()).toContain(`<a href="${DISCOVERY_ORIGIN}/">Browse all quests</a>`);
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Browse all quests" })).toHaveAttribute("href", `${DISCOVERY_ORIGIN}/`);
});

test("enabled listing links open the modal normally and allow modified navigation", async ({ page }) => {
  await renderRealListing(page);
  const card = page.locator("#adventureGrid .adventure-card").filter({
    has: page.locator(`.adventure-title-link[data-id="${ACTIVITY_ID}"]`)
  });
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
