const { test, expect } = require("@playwright/test");

test("browser launches", async ({ page }) => {
  await page.goto("https://example.com");
  await expect(page.locator("h1")).toBeVisible();
});
