const { test, expect } = require('@playwright/test');

test('browser launches', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page.locator('h1')).toBeVisible();
});
