const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#adventureGrid .adventure-card").first()).toBeVisible();
});

test("discovery filters and activity details work together", async ({ page }) => {
  await expect(page.getByRole("heading", { name: /Choose your vibe/i })).toBeVisible();

  const hiddenGem = page.locator('[data-vibe-filter="Hidden Gem"]');
  const spooky = page.locator('[data-vibe-filter="Spooky"]');
  await hiddenGem.click();
  await spooky.click();
  await expect(hiddenGem).toHaveAttribute("aria-pressed", "true");
  await expect(spooky).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#adventureGrid .adventure-card").first()).toBeVisible();

  const firstCard = page.locator("#adventureGrid .adventure-card").first();
  await firstCard.focus();
  await firstCard.press("Enter");
  await expect(page.locator("#detailModal")).toHaveAttribute("open", "");
  await expect(page.locator('#detailModal [data-action="share-activity"]')).toBeVisible();
  await expect(page.locator('#detailModal [data-action="copy-activity-link"]')).toBeVisible();
  await page.locator('[data-action="close-detail"]').click();
  await expect(page.locator("#detailModal")).not.toHaveAttribute("open", "");
});

test("shared map locations spread every pin without overlap", async ({ page }) => {
  const rendered = await page.evaluate(() => {
    const source = getAdventures().find(
      (adventure) => Number.isFinite(adventure.lat) && Number.isFinite(adventure.lng)
    );
    if (!source) return false;
    const sharedLocationListings = Array.from({ length: 12 }, (_, index) => ({
      ...source,
      id: `shared-location-${index}`,
      title: `Shared location ${String(index + 1).padStart(2, "0")}`,
      lat: source.lat,
      lng: source.lng
    }));
    renderMap(sharedLocationListings, sharedLocationListings);
    return true;
  });
  expect(rendered).toBe(true);

  const pins = page.locator("#realMap .vv-marker-shell.is-collision-spread");
  await expect(pins).toHaveCount(12);
  const boxes = await pins.evaluateAll((elements) =>
    elements.map((element) => {
      const box = element.getBoundingClientRect();
      return { left: box.left, top: box.top, right: box.right, bottom: box.bottom };
    })
  );

  const overlappingPairs = [];
  for (let first = 0; first < boxes.length; first += 1) {
    for (let second = first + 1; second < boxes.length; second += 1) {
      const horizontalOverlap = Math.min(boxes[first].right, boxes[second].right) - Math.max(boxes[first].left, boxes[second].left);
      const verticalOverlap = Math.min(boxes[first].bottom, boxes[second].bottom) - Math.max(boxes[first].top, boxes[second].top);
      if (horizontalOverlap > 0 && verticalOverlap > 0) overlappingPairs.push([first, second]);
    }
  }
  expect(overlappingPairs).toEqual([]);
});

test("guest posting prompts for an account without breaking the form", async ({ page }) => {
  await page.locator('.nav-tabs-left [data-view="host"]').click();
  await expect(page.locator("#hostView")).toBeVisible();
  await expect(page.locator("#shareAuthPrompt")).toBeVisible();
  await expect(page.locator('#hostForm input[name="title"]')).toBeEditable();

  await page.locator('#shareAuthPrompt [data-action="open-signup"]').click();
  await expect(page.locator("#authModal")).toHaveAttribute("open", "");
  await expect(page.locator("#authTitle")).toContainText("Create");
  await page.locator('[data-action="close-auth"]').click();
  await expect(page.locator("#authModal")).not.toHaveAttribute("open", "");
});

test("all Workshop modes and Out There remain reachable", async ({ page }) => {
  await page.locator('.nav-tabs-left [data-view="share"]').click();
  await expect(page.locator('#shareView [data-workshop-panel="flyer"]')).toBeVisible();
  await expect(page.locator("#flyerCanvas")).toBeVisible();

  await page.locator('[data-workshop-mode="vibetinerary"]').click();
  await expect(page.locator('[data-workshop-panel="vibetinerary"]')).toBeVisible();
  await expect(page.locator("#vibetineraryCanvas")).toBeVisible();
  await page.locator('[data-vibetinerary-layout="map"]').click();
  const treasureMapGeometry = await page.evaluate(() => {
    const canvas = document.querySelector("#vibetineraryCanvas");
    const context = canvas.getContext("2d");
    const originalCurve = context.bezierCurveTo;
    let routeSegments = 0;
    context.bezierCurveTo = function (...args) {
      routeSegments += 1;
      return originalCurve.apply(this, args);
    };
    window.vvVibetineraryStudio.render();
    context.bezierCurveTo = originalCurve;
    return {
      layouts: Array.from({ length: 5 }, (_, index) =>
        window.vvVibetineraryStudio.getTreasureMapPoints(index + 1)
      ),
      routeSegments
    };
  });
  expect(treasureMapGeometry.routeSegments).toBe(0);
  treasureMapGeometry.layouts.forEach((points, index) => {
    expect(points).toHaveLength(index + 1);
    expect(new Set(points.map(([x, y]) => `${Math.round(x)}:${Math.round(y)}`)).size).toBe(index + 1);
    points.forEach(([x, y]) => {
      expect(x).toBeGreaterThanOrEqual(250);
      expect(x).toBeLessThanOrEqual(830);
      expect(y).toBeGreaterThanOrEqual(440);
      expect(y).toBeLessThanOrEqual(930);
    });
  });

  await page.locator('[data-workshop-mode="vibe-code"]').click();
  await expect(page.locator('[data-workshop-panel="vibe-code"]')).toBeVisible();
  await expect(page.locator("#vibeCodeCanvas")).toBeVisible();

  await page.locator('.nav-tabs-right [data-view="out-there"]').click();
  await expect(page.locator("#outThereView")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Good things are happening out there/i })).toBeVisible();
  await expect(page.locator("#outThereSlides img").first()).toBeVisible();
});

test("mobile navigation and New Quest stay inside the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".mobile-nav-toggle")).toBeVisible();

  const initialOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(initialOverflow).toBeLessThanOrEqual(1);

  await page.locator(".mobile-nav-toggle").click();
  await expect(page.locator("#mobileNavigation")).toBeVisible();
  await page.locator('#mobileNavigation [data-view="host"]').click();
  await expect(page.locator("#hostView")).toBeVisible();

  const fileInput = page.locator('#hostForm input[name="photoFile"]');
  const priceInput = page.locator('#hostForm input[name="price"]');
  await fileInput.scrollIntoViewIfNeeded();
  const [fileBox, priceBox] = await Promise.all([fileInput.boundingBox(), priceInput.boundingBox()]);
  expect(fileBox).not.toBeNull();
  expect(priceBox).not.toBeNull();
  expect(fileBox.x).toBeGreaterThanOrEqual(0);
  expect(fileBox.x + fileBox.width).toBeLessThanOrEqual(390);
  expect(fileBox.y + fileBox.height).toBeLessThanOrEqual(priceBox.y);

  const finalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(finalOverflow).toBeLessThanOrEqual(1);
});
