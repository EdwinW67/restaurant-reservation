import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
    await request.delete('/test/cleanup');
});
test.afterEach(async ({ request }) => {
    await request.delete('/test/cleanup');
});

test.describe('Reservations API', () => {
    test('can create a reservation', async ({ request }) => {
        const payload = {
            name: 'API Tester',
            email: 'api@example.com',
            guests: 2,
            date: '2026-01-10',
            time: '19:00',
        };

        const response = await request.post('/reservations', {
            data: payload,
        });

        expect(response.ok()).toBeTruthy();

        const json = await response.json();

        expect(json.name).toBe(payload.name);
        expect(json.email).toBe(payload.email);
        expect(json.guests).toBe(payload.guests);
        expect(json.date.startsWith(payload.date)).toBe(true);
        expect(json.time.startsWith(payload.time)).toBe(true);
        expect(json.id).toBeDefined();
    });
});
