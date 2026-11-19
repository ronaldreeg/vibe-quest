const fs = require("node:fs");
const path = require("node:path");
const { test, expect } = require("@playwright/test");

const clientConfig = fs.readFileSync(
  path.resolve(__dirname, "../../supabase-client.js"),
  "utf8"
);
const projectUrl = clientConfig.match(/https:\/\/[a-z0-9]+\.supabase\.co/)?.[0];
const publishableKey = clientConfig.match(/sb_publishable_[A-Za-z0-9_-]+/)?.[0];

test("Supabase Auth is healthy and requires email confirmation", async ({ request }) => {
  expect(projectUrl, "Supabase project URL is present in the client config").toBeTruthy();
  expect(publishableKey, "Supabase publishable key is present in the client config").toBeTruthy();

  const headers = { apikey: publishableKey };
  const healthResponse = await request.get(`${projectUrl}/auth/v1/health`, { headers });
  expect(healthResponse.ok()).toBeTruthy();
  const health = await healthResponse.json();
  expect(health).toMatchObject({ name: "GoTrue" });

  const settingsResponse = await request.get(`${projectUrl}/auth/v1/settings`, { headers });
  expect(settingsResponse.ok()).toBeTruthy();
  const settings = await settingsResponse.json();
  expect(settings.external.email).toBe(true);
  expect(settings.disable_signup).toBe(false);
  expect(settings.mailer_autoconfirm).toBe(false);
});
