import { test, expect } from "@playwright/test";

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
