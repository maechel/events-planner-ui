<script setup lang="ts">
import { onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Navbar from '@/components/navigation/Navbar.vue';
import { useAuthStore } from '@/stores/auth';
import { useEventStore } from '@/stores/event';
import { useAdminStore } from '@/stores/admin';
import Toast from 'primevue/toast';
import ProgressBar from 'primevue/progressbar';
import ConfirmDialog from 'primevue/confirmdialog';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

const authStore = useAuthStore();
const eventStore = useEventStore();
const adminStore = useAdminStore();
const toast = useToast();

onMounted(async () => {
    // Always attempt to fetch the latest user profile on mount to ensure session validity
    // (Handles both Token and Cookie-based authentication hydration)
    try {
        await authStore.fetchUser();

        // Restore the last route if available and different from the current path
        const lastRoute = localStorage.getItem('lastRoute');
        const currentPath = globalThis.location.pathname;
        if (lastRoute && currentPath !== lastRoute && currentPath === '/') {
            const { router } = await import('@/router');
            await router.push(lastRoute);
        }
    } catch (e) {
        console.error('Session restoration failed:', e);
    }

    // Listen for unauthorized events to show toast
    globalThis.addEventListener('unauthorized', ((event: CustomEvent<{ message?: string }>) => {
        toast.add({
            severity: 'warn',
            summary: 'Authentication Required',
            detail: event.detail?.message || 'Please login to continue',
            life: 5000,
        });
    }) as EventListener);

    // Listen for logout events to show toast
    globalThis.addEventListener('logged-out', () => {
        toast.add({
            severity: 'info',
            summary: 'Logout',
            detail: 'Logged out successfully',
            life: 3000,
        });
    });
});
</script>

<template>
    <div class="app">
        <div
            v-if="authStore.loading || eventStore.loading || adminStore.loading"
            class="fixed top-0 left-0 right-0 z-100 h-1"
        >
            <ProgressBar
                mode="indeterminate"
                class="h-1"
            />
        </div>
        <Toast position="bottom-right" />
        <ConfirmDialog />
        <ConfirmDialog group="headless">
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div
                    class="flex flex-col items-center p-10 bg-surface-0 dark:bg-surface-900 rounded-4xl shadow-2xl border border-surface-100 dark:border-surface-800 max-w-[28rem] w-[90vw]"
                >
                    <div
                        class="rounded-2xl bg-primary text-primary-contrast inline-flex justify-center items-center h-20 w-20 -mt-20 shadow-xl"
                    >
                        <FontAwesomeIcon
                            icon="fas fa-question"
                            class="text-4xl"
                        />
                    </div>
                    <h3 class="text-3xl font-black text-surface-900 dark:text-surface-0 mt-8 tracking-tight">
                        {{ message.header }}
                    </h3>
                    <p
                        class="mt-4 mb-10 text-surface-600 dark:text-surface-400 text-center text-lg font-medium leading-relaxed px-4"
                    >
                        {{ message.message }}
                    </p>
                    <div class="flex items-center gap-4 w-full px-4">
                        <Button
                            label="Stay"
                            outlined
                            @click="rejectCallback"
                            class="flex-1 h-14 font-black text-lg rounded-xl"
                        ></Button>
                        <Button
                            label="Logout"
                            severity="danger"
                            @click="acceptCallback"
                            class="flex-1 h-14 font-black text-lg rounded-xl shadow-lg shadow-red-500/20"
                        ></Button>
                    </div>
                </div>
            </template>
        </ConfirmDialog>
        <Navbar />
        <main class="min-h-screen bg-surface-50 dark:bg-surface-950">
            <RouterView v-slot="{ Component }">
                <template v-if="Component">
                    <Suspense>
                        <component :is="Component" />
                        <template #fallback>
                            <div class="loading-state">
                                <FontAwesomeIcon
                                    icon="fa-solid fa-circle-notch"
                                    spin
                                />
                                <span>Loading...</span>
                            </div>
                        </template>
                    </Suspense>
                </template>
            </RouterView>
        </main>
    </div>
</template>
