import { test, expect } from "@playwright/test";

test("rejects missing fields", async ({ request }) => {
  const response = await request.post("/reservations", {
    data: { name: "Ed" }
  });

  expect(response.status()).toBe(400);
});
