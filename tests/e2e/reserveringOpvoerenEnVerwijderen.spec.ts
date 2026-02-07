import { test, expect } from '@playwright/test';
import { HomePage } from '@pages/HomePage';
import { randomDateWithin30Days } from '../utils/date';
import { loginAsAdmin } from 'tests/utils/login';

test('e2e -> Gebruiker kan een reservering opvoeren', async ({ page }) => {
    const homePage = new HomePage(page);
    const date = randomDateWithin30Days();
    await homePage.open();
    await homePage.clickReservations();
    await expect(page.locator('#reservation-form')).toBeVisible();

    await page.fill('#name', 'Ed Tester');
    await page.fill('#email', 'ed@example.com');
    await page.fill('#guests', '3');
    await page.fill('#date', date);
    await page.fill('#time', '19:00');

    await page.click('button[type=submit]');

    // // #reservation-message
    //console.log(await page.textContent('#reservation-message'));

    await expect(page.locator('#reservation-message')).toContainText(
        'Your reservation has been saved.'
    );
});

test('e2e -> Verwijderen van meest recent aangemaakte reservering', async ({
    page,
}) => {
    const admin = await loginAsAdmin(page);
    await admin.waitForPageLoaded();
    const before = await admin.getLastRowId();
    const rijenVooraf = await admin.getRowCount();

    //console.log(rijenVooraf,"->",before);
    const deletedId = await admin.deleteLastReservation(true);

    await admin.waitForPageLoaded();

    const after = await admin.getLastRowId();
    const rijenAchteraf = await admin.getRowCount();

    //console.log(rijenAchteraf,"->",after);

    expect(rijenAchteraf).toBe(Number(rijenVooraf) - 1);

    await expect(page.locator(`tr[data-id="${deletedId}"]`)).toHaveCount(0);

    admin.logoutButton.click();
});
