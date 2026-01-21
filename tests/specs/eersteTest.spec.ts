import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test('homepage shows hero title and highlights', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await home.hasTitle('La Warmondia - Home');
    //await expect(home.heroTitle).toContainText('Welcome to La Warmondia');
    await expect(home.highlightCards).toHaveCount(3);
    // await home.clickContact;
    // await expect(page).toHaveTitle('La Warmondia - Home');
});
