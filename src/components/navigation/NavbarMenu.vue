<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import Menu from 'primevue/menu';
import Divider from 'primevue/divider';
import Avatar from 'primevue/avatar';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useAuthStore } from '@/stores/auth';
import { useLogout } from '@/composables/useLogout';

const router = useRouter();
const authStore = useAuthStore();
const { logout } = useLogout();
const { isAuthenticated, isUserLoaded, user, isAdmin } = storeToRefs(authStore);

const userRoleLabel = computed(() => (isAdmin.value ? 'ADMIN' : 'USER'));

const menuItems = computed(() => {
    return [
        {
            label: 'Navigation',
            items: [
                {
                    label: 'Home',
                    icon: 'fa-solid fa-house',
                    command: () => {
                        router.push('/');
                        globalThis.dispatchEvent(new CustomEvent('close-drawer'));
                    },
                },
                ...(isAuthenticated.value
                    ? [
                          {
                              label: 'Dashboard',
                              icon: 'fa-solid fa-chart-line',
                              command: () => {
                                  router.push('/dashboard');
                                  globalThis.dispatchEvent(new CustomEvent('close-drawer'));
                              },
                          },
                          ...(isAdmin.value
                              ? [
                                    {
                                        label: 'Admin Dashboard',
                                        icon: 'fa-solid fa-gauge-high',
                                        command: () => {
                                            router.push('/admin');
                                            globalThis.dispatchEvent(new CustomEvent('close-drawer'));
                                        },
                                    },
                                    {
                                        label: 'User Management',
                                        icon: 'fa-solid fa-users-gear',
                                        command: () => {
                                            router.push('/admin/users');
                                            globalThis.dispatchEvent(new CustomEvent('close-drawer'));
                                        },
                                    },
                                ]
                              : []),
                          {
                              label: 'Events',
                              icon: 'fa-solid fa-calendar-days',
                              command: () => {
                                  router.push('/events');
                                  globalThis.dispatchEvent(new CustomEvent('close-drawer'));
                              },
                          },
                      ]
                    : []),
                {
                    label: 'Changelog',
                    icon: 'fa-solid fa-clock',
                    command: () => {
                        router.push('/changelog');
                        globalThis.dispatchEvent(new CustomEvent('close-drawer'));
                    },
                },
                {
                    label: 'Roadmap',
                    icon: 'fa-solid fa-map-location-dot',
                    command: () => {
                        router.push('/roadmap');
                        globalThis.dispatchEvent(new CustomEvent('close-drawer'));
                    },
                },
            ],
        },
    ];
});

const userMenuItems = computed(() => {
    if (!isAuthenticated.value) {
        return [
            {
                label: 'Account',
                items: [
                    {
                        label: 'Login',
                        icon: 'fa-solid fa-right-to-bracket',
                        command: () => {
                            // Dispatch event to open auth modal in Navbar
                            globalThis.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }));
                        },
                    },
                    {
                        label: 'Register',
                        icon: 'fa-solid fa-user-plus',
                        command: () => {
                            // Dispatch event to open auth modal in Navbar
                            globalThis.dispatchEvent(
                                new CustomEvent('open-auth-modal', { detail: { mode: 'register' } }),
                            );
                        },
                    },
                ],
            },
        ];
    }

    return [
        {
            label: 'Account',
            items: [
                {
                    label: 'Settings',
                    icon: 'fa-solid fa-gear',
                    command: () => {
                        router.push('/settings');
                        globalThis.dispatchEvent(new CustomEvent('close-drawer'));
                    },
                },
                {
                    label: 'Logout',
                    icon: 'fa-solid fa-right-from-bracket',
                    class: 'text-red-600 dark:text-red-400',
                    command: () => {
                        logout();
                    },
                },
            ],
        },
    ];
});
</script>

<template>
    <div class="flex flex-col h-full">
        <!-- Main Navigation -->
        <div class="flex-1 px-2">
            <Menu
                :model="menuItems"
                class="w-full border-none bg-transparent"
            >
                <template #item="{ item, props }">
                    <a
                        class="flex items-center px-4 py-4 cursor-pointer group rounded-lg"
                        v-bind="props.action"
                    >
                        <span class="w-10">
                            <FontAwesomeIcon
                                :icon="item.icon as string"
                                class="text-lg text-surface-600 dark:text-surface-400 group-hover:text-primary"
                            />
                        </span>
                        <span
                            class="text-surface-700 dark:text-surface-0/80 font-medium group-hover:text-primary transition-colors"
                        >
                            {{ item.label }}
                        </span>
                    </a>
                </template>
            </Menu>
        </div>

        <Divider class="my-4" />

        <div
            v-if="isAuthenticated && isUserLoaded && user"
            class="px-6 py-4 mb-2"
        >
            <div
                class="flex items-center gap-4 p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700/50"
            >
                <Avatar
                    :image="user.avatar"
                    :label="!user.avatar ? user.username?.charAt(0).toUpperCase() || '?' : undefined"
                    shape="circle"
                    size="large"
                    class="ring-2 ring-primary/20"
                />
                <div class="flex flex-col overflow-hidden">
                    <span class="text-lg font-black text-surface-900 dark:text-surface-0 truncate">{{
                        user.username
                    }}</span>
                    <span class="text-xs font-bold text-surface-500 truncate">{{ user.email }}</span>
                    <div class="flex items-center gap-2 mt-1">
                        <span
                            class="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-primary/10 text-primary"
                        >
                            {{ userRoleLabel }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="px-2 pb-4">
            <Menu
                :model="userMenuItems"
                class="w-full border-none bg-transparent"
            >
                <template #item="{ item, props }">
                    <a
                        class="flex items-center px-4 py-2 cursor-pointer group rounded-lg"
                        v-bind="props.action"
                    >
                        <span class="w-10">
                            <FontAwesomeIcon
                                :icon="item.icon as string"
                                :class="[
                                    item.class ? '' : 'text-surface-600 dark:text-surface-400 group-hover:text-primary',
                                    item.class,
                                ]"
                            />
                        </span>
                        <span
                            class="text-sm font-medium transition-colors"
                            :class="[
                                item.class ? '' : 'text-surface-700 dark:text-surface-0/80 group-hover:text-primary',
                                item.class,
                            ]"
                        >
                            {{ item.label }}
                        </span>
                    </a>
                </template>
            </Menu>
        </div>
    </div>
</template>
