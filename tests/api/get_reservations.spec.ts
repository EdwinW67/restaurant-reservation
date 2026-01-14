import { test, expect } from '@playwright/test';

test('can list reservations', async ({ request }) => {
    const response = await request.get('/reservations');
    expect(response.ok()).toBeTruthy();

    const json = await response.json();
    expect(Array.isArray(json)).toBe(true);
});
