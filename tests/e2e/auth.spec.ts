import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should login successfully and update the UI', async ({ page }) => {
        // Set viewport to desktop to ensure header elements are visible
        await page.setViewportSize({ width: 1280, height: 720 });

        // Mock the login API
        await page.route('**/api/auth/login', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ token: 'fake-jwt-token' }),
            });
        });

        // Mock the /me API
        await page.route('**/api/me', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: 1,
                    username: 'testuser',
                    email: 'test@mail.com',
                    role: 'ROLE_USER',
                    avatar: 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png',
                }),
            });
        });

        // Go to the home page
        await page.goto('/');

        // Ensure we are logged out before starting the login flow
        const logoutButton = page.locator('[data-testid="logout-button"]');
        if (await logoutButton.isVisible()) {
            await logoutButton.click();
            await page.click('button:has-text("Logout")');
            await expect(page.locator('header button:has-text("Login")')).toBeVisible();
        }

        // Click Login button in the header
        await page.click('header button:has-text("Login")');

        // Fill in the login form
        await page.fill('#username', 'testuser');
        await page.fill('#password input', 'password123');

        // Submit the form
        await page.click('button[type="submit"]:has-text("Login")');

        // Wait for the modal to close (or check for success message)
        await expect(page.locator('text=Logged in successfully')).toBeVisible();

        // Verify user info is visible in the header
        await expect(page.locator('header').getByText('testuser')).toBeVisible();
        await expect(page.locator('header').getByText('USER', { exact: true })).toBeVisible();

        // Verify Logout is visible in the header
        await expect(page.getByTestId('logout-button')).toBeVisible();

        // Open the drawer to verify detailed navigation
        await page.click('button:has(.fa-bars)');

        // Verify Dashboard is visible in menu
        await expect(page.locator('text=Dashboard')).toBeVisible();

        // Go to Dashboard
        await Promise.all([page.waitForURL('**/dashboard'), page.locator('.p-drawer').getByText('Dashboard').click()]);
        await expect(page.locator('text=Welcome back, testuser!')).toBeVisible();

        // Verify user info is visible in header (persistent)
        const header = page.locator('header');
        await expect(header.getByText('testuser').first()).toBeVisible();
        await expect(header.getByText('USER', { exact: true }).first()).toBeVisible();

        // Verify Logout is visible
        await expect(page.locator('.p-drawer').locator('text=Logout')).toBeVisible();
        await expect(page.locator('text=Login')).not.toBeVisible();

        // Verify Avatar is visible in header
        const avatar = page.locator('header .p-avatar img');
        await expect(avatar).toBeVisible();
        await expect(avatar).toHaveAttribute('src', /amyelsner.png/);
    });
});
