import { expect as baseExpect, APIResponse } from '@playwright/test';

interface ValidationOptions {
    type?: 'boolean' | 'list';
    minLength?: number;
    expectedStatus?: number; // Added: specify a exact status like 201
}

declare module '@playwright/test' {
    interface Matchers<R> {
        toBeValidResponse(options?: ValidationOptions): Promise<R>;
    }
}

export const expect = baseExpect.extend({
    async toBeValidResponse(
        response: APIResponse,
        options: ValidationOptions = { type: 'boolean', minLength: 1 }
    ) {
        const status = response.status();

        // 1. Status Validation
        // If expectedStatus is provided, check that specifically.
        // Otherwise, fall back to the standard response.ok() (status 200-299)
        const isCorrectStatus = options.expectedStatus
            ? status === options.expectedStatus
            : response.ok();

        let body: unknown;
        try {
            body = await response.json();
        } catch {
            body = null;
        }

        let pass = isCorrectStatus;
        let errorDetail = '';

        // 2. Specific status error message
        if (options.expectedStatus && status !== options.expectedStatus) {
            errorDetail = `Expected status ${options.expectedStatus} but received ${status}`;
        }

        // 3. List validation logic (only if status check passed)
        if (pass && options.type === 'list') {
            if (!Array.isArray(body)) {
                pass = false;
                errorDetail = `Expected Array, but received ${typeof body}`;
            } else {
                const actualLength = (body as unknown[]).length;
                const min = options.minLength ?? 1;
                pass = actualLength >= min;

                if (!pass) {
                    errorDetail = `Array length ${actualLength} is less than ${min}`;
                }
            }
        }

        if (pass) {
            return { message: () => 'passed', pass: true };
        } else {
            return {
                message: () =>
                    `Custom Assertion Failed:\n` +
                    `URL: ${response.url()}\n` +
                    `Status: ${status}\n` +
                    `Detail: ${errorDetail || 'Response not in 2xx range'}\n` +
                    `Body: ${JSON.stringify(body, null, 2)}`,
                pass: false,
            };
        }
    },
});
