import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
    test('should display admin dashboard and statistics for ROLE_ADMIN', async ({ page }) => {
        // Set viewport to desktop
        await page.setViewportSize({ width: 1280, height: 720 });

        // Mock the login API
        await page.route('**/api/auth/login', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ token: 'fake-admin-token' }),
            });
        });

        // Mock the /me API with ROLE_ADMIN
        await page.route('**/api/me', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: 99,
                    username: 'adminuser',
                    email: 'admin@eventplanner.com',
                    role: 'ROLE_ADMIN',
                    avatar: 'https://primefaces.org/cdn/primevue/images/avatar/ionibowcher.png',
                }),
            });
        });

        // Mock Actuator endpoints
        await page.route('**/actuator/health', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    status: 'UP',
                    components: {
                        db: { status: 'UP' },
                        diskSpace: { status: 'UP', details: { total: 500000000, free: 250000000 } },
                    },
                }),
            });
        });

        await page.route('**/actuator/metrics/**', async (route) => {
            const url = route.request().url();
            let body = {};

            if (url.includes('process.uptime')) {
                body = { measurements: [{ value: 3600 }] };
            } else if (url.includes('process.cpu.usage')) {
                body = { measurements: [{ value: 0.1 }] };
            } else if (url.includes('system.cpu.usage')) {
                body = { measurements: [{ value: 0.2 }] };
            } else if (url.includes('jvm.memory.used')) {
                body = { measurements: [{ value: 500000000 }] };
            } else if (url.includes('jvm.memory.max')) {
                body = { measurements: [{ value: 1000000000 }] };
            } else if (url.includes('http.server.requests')) {
                if (url.includes('tag=uri:')) {
                    body = {
                        measurements: [
                            { statistic: 'COUNT', value: 100 },
                            { statistic: 'TOTAL_TIME', value: 10 },
                        ],
                    };
                } else {
                    body = { availableTags: [{ tag: 'uri', values: ['/api/events', '/api/tasks'] }] };
                }
            }

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(body),
            });
        });

        await page.route('**/api/users', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([{ id: 1 }, { id: 2 }, { id: 3 }]),
            });
        });

        // Go to the home page
        await page.goto('/');

        // Check if we're already logged in (cleanup from previous runs)
        const logoutButton = page.locator('[data-testid="logout-button"]');
        if (await logoutButton.isVisible()) {
            await logoutButton.click();
            // Handle logout confirmation dialog
            await page.click('button:has-text("Logout")');
            await expect(page.locator('header button:has-text("Login")')).toBeVisible();
        }

        await page.click('header button:has-text("Login")');
        await page.fill('#username', 'adminuser');
        await page.fill('#password input', 'password123');
        await page.click('button[type="submit"]:has-text("Login")');

        // Wait for the login to complete
        await expect(page.locator('header').getByText('adminuser')).toBeVisible();
        await expect(page.locator('header').getByText('ADMIN', { exact: true })).toBeVisible();

        // Open the navigation menu
        await page.click('button:has(.fa-bars)');

        // Verify "Admin Dashboard" is visible in the menu
        const adminLink = page.locator('text=Admin Dashboard');
        await expect(adminLink).toBeVisible();

        // Navigate to Admin Dashboard
        await Promise.all([page.waitForURL('**/admin'), adminLink.click()]);

        // Verify Admin Dashboard content
        await expect(page.locator('h1')).toContainText('Admin Dashboard');
        await expect(page.locator('text=System monitoring and application statistics')).toBeVisible();

        // Verify KPIs
        await expect(page.locator('text=Total Users')).toBeVisible();
        await expect(page.locator('text=Total Events')).toBeVisible();
        await expect(page.locator('text=Task Completion')).toBeVisible();

        // Verify Health Status
        await expect(page.locator('.p-tag', { hasText: 'Healthy' }).first()).toBeVisible();
        await expect(
            page
                .locator('div')
                .filter({ hasText: /^Database$/ })
                .locator('..')
                .getByText('Healthy'),
        ).toBeVisible();
        await expect(
            page
                .locator('div')
                .filter({ hasText: /^Disk Space$/ })
                .locator('..')
                .getByText('Sufficient'),
        ).toBeVisible();

        // Verify System Resources
        await expect(page.locator('text=System Resources')).toBeVisible();
        await expect(page.locator('text=Memory Usage')).toBeVisible();
        await expect(page.locator('text=Uptime')).toBeVisible();

        // Verify Chart is present
        await expect(page.locator('.p-chart')).toBeVisible();
    });

    test('should not show Admin Dashboard link for ROLE_USER', async ({ page }) => {
        // Set viewport to desktop
        await page.setViewportSize({ width: 1280, height: 720 });

        // Mock the /me API with ROLE_USER
        await page.route('**/api/me', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: 1,
                    username: 'testuser',
                    role: 'ROLE_USER',
                }),
            });
        });

        // Login as ROLE_USER (simulated by setting token and user in storage or mocking /me)
        await page.goto('/');
        // We can use a simpler way if we don't want to go through the full login UI again
        // but for simplicity let's assume we are logged in.

        // For this test we can just mock the authenticated state
        await page.addInitScript(() => {
            window.localStorage.setItem('token', '"fake-user-token"');
            window.localStorage.setItem(
                'user',
                JSON.stringify({
                    id: 1,
                    username: 'testuser',
                    role: 'ROLE_USER',
                }),
            );
        });

        await page.reload();

        // Open the navigation menu
        await page.click('button:has(.fa-bars)');

        // Verify "Admin Dashboard" is NOT visible
        await expect(page.locator('text=Admin Dashboard')).not.toBeVisible();

        // Attempt to navigate directly to /admin
        await page.goto('/admin');

        // Should be redirected to home (since the route guard should catch it)
        await page.waitForURL('**/');
        expect(page.url()).not.toContain('/admin');
    });
});
