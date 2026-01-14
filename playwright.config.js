const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',

    projects: [
        {
            name: 'ui',
            testDir: './tests/specs',
            use: {
                baseURL: 'http://localhost:3000',
            },
        },
        {
            name: 'api',
            testDir: './tests/api',
            use: {
                baseURL: 'http://localhost:3001',
            },
        },
        {
            name: 'e2e',
            testDir: './tests/e2e',
            use: {
                baseURL: 'http://localhost:3000',
            },
        },
    ],

    use: {
        headless: true,
        launchOptions: {
            args: ['--disable-dev-shm-usage'],
        },
        trace: 'on-first-retry',
        video: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
});
