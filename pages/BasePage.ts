import { Page, expect } from '@playwright/test';

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(url: string) {
        await this.page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 30_000,
        });
        await this.page.waitForLoadState('domcontentloaded');
    }

    async waitForPageLoaded() {
        await this.page.waitForLoadState('domcontentloaded');
    }

    async hasTitle(title: string) {
        await expect(this.page).toHaveTitle(title);
    }
}
