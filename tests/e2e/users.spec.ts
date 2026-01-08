import { test, expect } from '@playwright/test';

test.describe('User Management', () => {
    test.beforeEach(async ({ page }) => {
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

        // Mock User Management APIs
        await page.route('**/api/admin/users', async (route) => {
            if (route.request().method() === 'GET') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify([
                        {
                            id: 1,
                            username: 'testuser',
                            email: 'test@mail.com',
                            authorities: ['ROLE_USER'],
                            enabled: true,
                            accountNonLocked: true,
                            lastLogin: new Date().toISOString(),
                        },
                        {
                            id: 2,
                            username: 'adminuser',
                            email: 'admin@mail.com',
                            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
                            enabled: true,
                            accountNonLocked: true,
                            lastLogin: new Date().toISOString(),
                        },
                    ]),
                });
            } else if (route.request().method() === 'POST') {
                await route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        id: 3,
                        username: 'newuser',
                        email: 'new@mail.com',
                        authorities: ['ROLE_USER'],
                        enabled: true,
                        accountNonLocked: true,
                    }),
                });
            }
        });

        await page.route('**/api/admin/users/*', async (route) => {
            if (route.request().method() === 'PUT') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        id: 1,
                        username: 'updateduser',
                        email: 'updated@mail.com',
                        authorities: ['ROLE_USER'],
                        enabled: true,
                        accountNonLocked: true,
                    }),
                });
            } else if (route.request().method() === 'DELETE') {
                await route.fulfill({ status: 204 });
            }
        });

        // Login as admin
        await page.goto('/');

        // Ensure we are logged out before starting
        const logoutBtn = page.locator('[data-testid="logout-button"]');
        if (await logoutBtn.isVisible()) {
            await logoutBtn.click();
            await page.click('button:has-text("Logout")');
            await expect(page.locator('header button:has-text("Login")')).toBeVisible();
        }

        await page.click('header button:has-text("Login")');
        await page.fill('#username', 'adminuser');
        await page.fill('#password input', 'password123');
        await page.click('button[type="submit"]:has-text("Login")');
        await expect(page.locator('header').getByText('adminuser')).toBeVisible();
        await expect(page.locator('header').getByText('ADMIN', { exact: true })).toBeVisible();
    });

    test('should list users and perform CRUD operations', async ({ page }) => {
        // Open menu and go to User Management
        await page.click('button:has(.fa-bars)');

        await Promise.all([page.waitForURL('**/admin/users'), page.click('text=User Management')]);

        // Close the drawer if it's still open (it might be intercepting clicks)
        // We'll click the mask/backdrop or the close button specifically
        const drawerMask = page.locator('.p-drawer-mask');
        if (await drawerMask.isVisible()) {
            await page.keyboard.press('Escape'); // Generic way to close modals/drawers
            await expect(drawerMask).not.toBeVisible();
        }

        await expect(page.locator('h1')).toContainText('User Management');

        // Verify user list
        const userTable = page.locator('table');
        await expect(userTable.locator('text=testuser')).toBeVisible();
        await expect(userTable.locator('text=adminuser')).toBeVisible();

        // Create new user
        await page.click('text=New User');
        await page.fill('#username', 'newuser');
        await page.fill('#email', 'new@mail.com');
        await page.click('button:has-text("Save")');
        await expect(page.locator('text=User Created')).toBeVisible();
        await expect(page.locator('text=newuser')).toBeVisible();

        // Edit user
        // Find the row with 'testuser' and click pencil button
        const testUserRow = page.locator('tr', { hasText: 'testuser' }).first();
        await expect(testUserRow).toBeVisible();

        // Target the button specifically, which contains the .fa-pencil icon
        const editButton = testUserRow.locator('button:has(.fa-pencil)');
        await editButton.click();

        await page.fill('#username', 'updateduser');
        await page.click('button:has-text("Save")');
        await expect(page.locator('text=User Updated')).toBeVisible();
        await expect(userTable.locator('text=updateduser')).toBeVisible();

        // Delete user
        const updatedUserRow = page.locator('tr', { hasText: 'updateduser' }).first();
        await expect(updatedUserRow).toBeVisible();

        const deleteButton = updatedUserRow.locator('button:has(.fa-trash)');
        await deleteButton.click();

        await page.click('button:has-text("Yes")');
        await expect(page.locator('text=User Deleted')).toBeVisible();
        await expect(userTable.locator('text=updateduser')).not.toBeVisible();
    });
});
