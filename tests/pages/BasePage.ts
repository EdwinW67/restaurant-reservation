/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Page, expect } from '@playwright/test';

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(url: string) {
        // eslint-disable-next-line playwright/no-networkidle
        await this.page.goto(url, { waitUntil: 'networkidle' });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async waitForPageLoaded() {
        await this.page.waitForLoadState('domcontentloaded');
    }

    async hasTitle(title: string) {
        await expect(this.page).toHaveTitle(title);
    }
}
