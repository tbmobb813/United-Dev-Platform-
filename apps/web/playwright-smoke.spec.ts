import { test, expect } from '@playwright/test';

test('login page shows sign-in and home loads', async ({ page }) => {
    // Check login page
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
    const loginButton = page.locator('text=Sign in with GitHub');
    await expect(loginButton).toBeVisible({ timeout: 10000 });

    // Navigate to home and check for a top-level heading
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    const heading = page.locator('text=Unified Dev Platform');
    await expect(heading).toBeVisible({ timeout: 15000 });
});
