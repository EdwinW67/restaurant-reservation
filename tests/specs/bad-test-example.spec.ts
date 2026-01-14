// tests/bad-test-example.spec.ts
import { test, expect } from '@playwright/test';

// Rule violation: No explicit return type
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function addNumbers(a: number, b: number) {
    //Rule violation: No explicit return type
    return a + b;
}

test('bad example test', async ({ page }) => {
    // Rule violation: no-console

    await page.goto('https://playwright.dev/');

    await page.getByRole('button', { name: 'Get Started' }).click(); //Rule violation: Missing 'await' for a Playwright action

    // Rule violation: Missing 'await' for a Playwright action
    await page.getByLabel('Search').click();

    await page.getByPlaceholder('Search docs').fill('assertions');

    // Rule violation: Using page.pause()
    // eslint-disable-next-line playwright/no-page-pause
    await page.pause();

    await expect(page.getByText('Writing assertions')).toBeVisible(); //Rule violation: Missing 'await'

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let result;

    await test.step('test', async () => {
        result = addNumbers(1, 2); //Rule violation: no-explicit-any
    });
    //Rule violation: no-console
});
