const { test, expect } = require('@playwright/test');
test.use({ headless: true });

test('User can submit a reservation', async ({ page }) => {
    await page.goto('http://localhost:3000/reservations.html');

    await page.waitForSelector('reservation-form');

    await page.fill('#name', 'Ed Tester');
    await page.fill('#email', 'ed@example.com');
    await page.fill('#guests', '3');
    await page.fill('#date', '2026-01-10');
    await page.fill('#time', '19:00');

    await page.click('button[type=submit]');

    //#reservation-message
    console.log(await page.textContent('reservation-message'));

    await expect(page.getById('reservation-message')).toContainText(
        'Your reservation has been saved.'
    );
});
