/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Page, expect } from '@playwright/test';

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(url: string) { 
        await this.page.goto(url, { waitUntil: 'networkidle' });
    }

    async waitForPageLoaded() {
        await this.page.waitForLoadState('domcontentloaded');
    }

    async hasTitle(title: string) {
        await expect(this.page).toHaveTitle(title);
    }
}
