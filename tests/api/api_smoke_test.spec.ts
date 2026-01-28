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


test('can create and then delete a reservation (admin)', async ({ request }) => {
    // 1) Admin login to establish the session cookie in this request context
    const adminUser = process.env.ADMIN_USER ?? 'admin';
    const adminPass = process.env.ADMIN_PASS ?? 'supersecret';

    const login = await request.post('/admin/login', {
      data: { username: adminUser, password: adminPass },
    });
    expect(login.ok()).toBeTruthy();

    // 2) Create a reservation on the public endpoint
    const payload = {
      name: 'Delete Me',
      email: 'deleteme@example.com',
      guests: 3,
      date: '2026-01-11',
      time: '20:30',
    };
    const createRes = await request.post('/reservations', { data: payload });
    expect(createRes.status()).toBe(201);
    const created = await createRes.json();

    expect(created.id).toBeDefined();
    expect(created.name).toBe(payload.name);

    const id = created.id;

    // 3) Delete it via the admin endpoint (cookie from login is re-used automatically)
    const delRes = await request.delete(`/admin/reservations/${id}`);
    expect(delRes.ok()).toBeTruthy();

    // 4) Verify it no longer exists
    const listRes = await request.get('/reservations');
    expect(listRes.ok()).toBeTruthy();
    const all = await listRes.json();
    const found = all.find((r: any) => r.id === id);
    expect(found).toBeFalsy();
  });

  test('delete requires admin auth (unauthorized without login)', async ({ request }) => {
    const res = await request.delete('/admin/reservations/999999');
    expect(res.status()).toBe(401);
  });


