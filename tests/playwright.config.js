const { defineConfig } = require('@playwright/test');

module.exports = {
  use: {
    headless: true,
	baseURL: process.env.API_BASE || "http://localhost:3001",
    launchOptions: {
      args: ["--disable-dev-shm-usage"]
    },
    trace: "on-first-retry", // or "on", "retain-on-failure" 
    video: "retain-on-failure", 
    screenshot: "only-on-failure"
  }
  , env: { NODE_ENV: "test",
    API_BASE: "http://localhost:3001"
   }
};
