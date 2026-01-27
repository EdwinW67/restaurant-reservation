
import { Page, test } from '@playwright/test';
import { AdminLoginPage } from '@pages/AdminLoginPage';
import { AdminPage } from '@pages/AdminPage';

test.use({ headless: true });

export async function loginAsAdmin(page: Page): Promise<AdminPage> {
  const loginPage = new AdminLoginPage(page);
  const adminPage = new AdminPage(page);

  await loginPage.open();
  await loginPage.loginInAsAdmin();
  
  await adminPage.open();
  await adminPage.waitForPageLoaded();

  return adminPage;
}
