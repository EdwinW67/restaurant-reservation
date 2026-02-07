const { defineConfig } = require('@playwright/test');
import { expect } from '@playwright/test';

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

// expect.extend({
//   async toBeValidResponse(response, options = { type: 'boolean', minLength: 1 }) {
//     const status = response.status();
//     const ok = response.ok();
//     let body;

//     try {
//       body = await response.json();
//     } catch (e) {
//       body = null;
//     }

//     // Validation Logic
//     let pass = ok;
//     let errorDetail = '';

//     if (options.type === 'list') {
//       const isArray = Array.isArray(body);
//       const hasMinLength = isArray && body.length >= (options.minLength || 1);
//       pass = ok && hasMinLength;
//       if (!isArray) errorDetail = 'Expected an Array but received ' + typeof body;
//       else if (!hasMinLength) errorDetail = `Array length ${body.length} is less than ${options.minLength}`;
//     }

//     if (pass) {
//       return {
//         message: () => 'passed',
//         pass: true,
//       };
//     } else {
//       return {
//         message: () =>
//           `expect(received).toBeValidResponse()\n` +
//           `Status: ${status}\n` +
//           `Error: ${errorDetail || 'Response not OK'}\n` +
//           `Body: ${JSON.stringify(body, null, 2)}`,
//         pass: false,
//       };
//     }
//   },
// });
