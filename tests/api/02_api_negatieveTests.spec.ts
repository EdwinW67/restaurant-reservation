import { test, expect } from "@playwright/test";
import { request } from "node:http";

test("rejects invalid date", async ({ request }) => {
  const response = await request.post("/reservations", {
    data: {
      name: "Ed",
      email: "ed@example.com",
      guests: 2,
      date: "not-a-date",
      time: "19:00"
    }
  });

  expect(response.status()).toBe(500);
});

test("rejects invalid email", async ({ request}) => {
  const response = await request.post("/reservations", {
    data: {
      name: "Ed",
      email: "isZekerGeenEmail",
      guests: 2,
      date: "16-03-2026",
      time: "19:00"
    }
  });

  expect(response.status()).toBe(500);
});

test("rejects invalid number", async ({ request}) => {
  const response = await request.post("/reservations", {
    data: {
      name: "Ed",
      email: "ed@example.com",
      guests: "twee",
      date: "16-03-2026",
      time: "19:00"
    }
  });

  expect(response.status()).toBe(500);
});

test("rejects missing fields", async ({ request }) => {
  const response = await request.post("/reservations", {
    data: { name: "Ed" }
  });

  expect(response.status()).toBe(400);
});

  test('delete requires admin auth (unauthorized without login)', async ({ request }) => {
    const res = await request.delete('/admin/reservations/999999');
    expect(res.status()).toBe(401);
  });

