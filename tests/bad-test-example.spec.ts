// tests/bad-test-example.spec.ts
import { test, expect } from '@playwright/test';

// Rule violation: No explicit return type
function addNumbers(a: number, b: number) {
    //Rule violation: No explicit return type
    const unusedVar = 'I do nothing'; // Rule violation: Unused variable
    return a + b;
}

test('bad example test', async ({ page }) => {
    console.log('This should not be here!'); // Rule violation: no-console

    await page.goto('https://playwright.dev/');

    page.getByRole('button', { name: 'Get Started' }).click(); //Rule violation: Missing 'await' for a Playwright action

    // Rule violation: Missing 'await' for a Playwright action
    page.getByLabel('Search').click();

    await page.getByPlaceholder('Search docs').fill('assertions');

    // Rule violation: Using page.pause()
    await page.pause();

    await expect(page.getByText('Writing assertions')).toBeVisible(); //Rule violation: Missing 'await'

    let result;
    await test.step('test', async () => {
        result = addNumbers(1, 2); //Rule violation: no-explicit-any
    });
    console.log(result); //Rule violation: no-console
});
