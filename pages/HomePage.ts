import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    //readonly page: Page;

    // Navbar
    readonly navHome: Locator;
    readonly navMenu: Locator;
    readonly navHours: Locator;
    readonly navReservations: Locator;
    readonly navContact: Locator;
    readonly navAdminPage: Locator;

    // Hero section
    readonly heroTitle: Locator;
    readonly heroSubtitle: Locator;

    // Highlights
    readonly highlightCards: Locator;

    constructor(page: Page) {
        super(page);
        //this.page = page;

        // Navbar selectors
        this.navHome = page.getByRole('link', { name: 'Home' });
        this.navMenu = page.getByRole('link', { name: 'Menu' });
        this.navHours = page.getByRole('link', {
            name: 'Opening Hours',
        });
        this.navReservations = page.getByRole('link', { name: 'Reservations' });
        this.navContact = page.getByRole('link', { name: 'Contact' });
        this.navAdminPage = page.getByRole('link', { name: 'Admin' });

        // Hero section
        this.heroTitle = page.locator('.hero-title');
        this.heroSubtitle = page.locator('.hero-subtitle');

        // Highlight cards
        this.highlightCards = page
            .getByRole('heading', { name: 'Highlights' })
            .locator('..')
            .locator('.card');
    }

    async open() {
        await this.goto('http://localhost:3000/');
        await expect(this.navHome).toBeVisible();
    }

    async clickReservations() {
        await this.navReservations.click();
    }

    async clickContact() {
        await this.navContact.click();
    }

    async clickAdmin() {
        await this.navAdminPage.click();
    }

    async clickMenu() {
        await this.navMenu.click();
    }
}
