import {
    createRouter,
    createWebHistory,
    type Router,
    type RouteLocationNormalized,
    type NavigationGuardNext,
} from 'vue-router';
import { routes } from './routes';
import { useAuthStore } from '@/stores/auth';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

let isInitialNavigation = true;

/**
 * Global navigation guard to protect routes and handle redirection
 */
export const setupRouterGuards = (router: Router) => {
    router.beforeEach(
        async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
            const authStore = useAuthStore();

            // Wait for auth initialization if we have a token
            // We always fetch on initial navigation to ensure roles are fresh and complete
            if (authStore.token && (isInitialNavigation || !authStore.user)) {
                try {
                    console.log('Router guard: token detected, fetching/refreshing user...');
                    await authStore.fetchUser();
                    console.log('Router guard: user fetched successfully');
                } catch (e) {
                    console.error('Failed to fetch user during navigation', e);
                } finally {
                    isInitialNavigation = false;
                }
            }

            const isAuthenticated = authStore.isAuthenticated;
            const isUserLoaded = authStore.isUserLoaded;
            const isAdmin = authStore.isAdmin;
            const userAuthorities = authStore.user?.authorities || [];
            const userRoles = authStore.user?.roles || [];
            const userRole = authStore.user?.role;

            // Manage lastRoute storage - ONLY if navigation is successful or it's a public route
            // Don't set lastRoute to '/' if we are about to redirect from an auth route
            const isAuthRoute = to.meta.requiresAuth;
            const isRedirectingToHome = !isAuthenticated && isAuthRoute;

            if (to.name !== 'NotFound' && !isRedirectingToHome && to.path !== '/') {
                if (isAuthRoute && isAuthenticated && isUserLoaded) {
                    localStorage.setItem('lastRoute', to.fullPath);
                } else if (!isAuthRoute) {
                    localStorage.setItem('lastRoute', to.fullPath);
                }
            }

            if (to.meta.requiresAuth && !isAuthenticated) {
                next('/');
            } else if (to.meta.requiresAuth && isAuthenticated && !isUserLoaded) {
                // Token exists, but user info couldn't be loaded (e.g. server error)
                // Allow but components should handle missing user
                next();
            } else if (to.meta.roles && Array.isArray(to.meta.roles)) {
                const roles = to.meta.roles as string[];
                const hasRole =
                    roles.includes('ROLE_ADMIN') && isAdmin
                        ? true
                        : roles.some(
                              (role: string) =>
                                  userAuthorities.includes(role) || userRoles.includes(role) || userRole === role,
                          );

                if (hasRole) {
                    next();
                } else {
                    // If they don't have the role, don't overwrite lastRoute with '/' before redirecting
                    next('/');
                }
            } else {
                next();
            }
        },
    );
};

setupRouterGuards(router);
