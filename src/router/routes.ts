export const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/pages/HomePage.vue'),
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/DashboardPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/events',
        name: 'Events',
        component: () => import('@/pages/EventsPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/events/:id',
        name: 'EventDetails',
        component: () => import('@/pages/EventDetailsPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/pages/UnderConstructionPage.vue'),
        meta: {
            requiresAuth: true,
            title: 'Account Settings',
            description:
                'We are building a comprehensive settings panel where you can manage your profile, notification preferences, and security options.',
            quarter: 'Q2 2026',
        },
    },
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('@/pages/AdminDashboardPage.vue'),
        meta: { requiresAuth: true, roles: ['ROLE_ADMIN'] },
    },
    {
        path: '/admin/users',
        name: 'UserManagement',
        component: () => import('@/pages/UsersManagementPage.vue'),
        meta: { requiresAuth: true, roles: ['ROLE_ADMIN'] },
    },
    {
        path: '/changelog',
        name: 'Changelog',
        component: () => import('@/pages/ChangelogPage.vue'),
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('@/pages/AboutPage.vue'),
    },
    {
        path: '/roadmap',
        name: 'Roadmap',
        component: () => import('@/pages/RoadmapPage.vue'),
    },
    {
        path: '/construction',
        name: 'UnderConstruction',
        component: () => import('@/pages/UnderConstructionPage.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/pages/NotFound.vue'),
    },
];
