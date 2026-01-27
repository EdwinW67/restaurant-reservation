import {test, expect} from '@playwright/test';
import { AdminLoginPage } from '@pages/AdminLoginPage';

test('Admin kan succesvol inloggen', async({page}) => {

    const loginPage = new AdminLoginPage(page);
    await loginPage.open();
    await loginPage.loginInAsAdmin();

    
    await expect(loginPage.loginMessage).not.toBeVisible();


})

test('Foutieve inlog wordt geweigerd', async({page}) => {

    const loginPage = new AdminLoginPage(page);
    await loginPage.open();
    await loginPage.login('admin','admin');

    await expect(loginPage.loginMessage).toHaveText('Invalid username or password');


})
