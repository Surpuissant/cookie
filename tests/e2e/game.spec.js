import { test, expect } from '@playwright/test';

test.describe('Cookie Clicker E2E', () => {
    test('should allow user to register and click the cookie', async ({ page }) => {
        const username = `user_${Date.now()}`;
        
        // Register
        await page.goto('/register');
        await page.fill('input[name="username"]', username);
        await page.fill('input[name="password"]', 'password123');
        await page.click('button[type="submit"]');

        // Check redirection
        await expect(page).toHaveURL('/');
        await expect(page.locator('.user-info')).toContainText(username);

        // Click the cookie
        const cookie = page.locator('#main-cookie');
        const count = page.locator('#cookie-count');
        
        await expect(count).toHaveText('0');
        await cookie.click();
        await expect(count).toHaveText('1');
        
        // Buy upgrade if possible (need 15)
        for(let i=0; i<14; i++) await cookie.click();
        await expect(count).toHaveText('15');
        
        const buyClick = page.locator('#buy-click');
        await expect(buyClick).not.toBeDisabled();
        await buyClick.click();
        
        await expect(page.locator('#click-level')).toHaveText('2');
        await expect(count).toHaveText('0'); // cost 15
    });
});
