const { test, expect } = require('@playwright/test');
import { HomePage } from '@pages/HomePage';

test('browser launches', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await home.hasTitle('La Warmondia - Home');

    await expect(page.locator('h1')).toBeVisible();
});
