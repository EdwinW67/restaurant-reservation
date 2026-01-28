import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminLoginPage extends BasePage {

    //navigatie elementen

    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly loginMessage: Locator;

    constructor(page: Page) {
        super(page)


        //de velden:
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('button[type="submit"]');
        this.loginMessage = page.locator('#login-message');

    }

    async open() {
        await this.goto('/admin-login.html');
        await this.waitForPageLoaded();
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();

    }

    async getMessage() {
        return this.loginMessage.textContent();
    }

    async loginInAsAdmin() {
        await this.open();
        
        await this.login('admin','supersecret');

    }






}
