<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import NavbarMenu from '@/components/navigation/NavbarMenu.vue';
import { useAuthStore } from '@/stores/auth';
import AuthModal from '@/components/auth/AuthModal.vue';
import { useLogout } from '@/composables/useLogout';

const authStore = useAuthStore();
const { user, isAuthenticated, isUserLoaded, isAdmin } = storeToRefs(authStore);
const { logout } = useLogout();

const userRoleLabel = computed(() => (isAdmin.value ? 'ADMIN' : 'USER'));

const visible = ref<boolean>(false);
const authModalVisible = ref(false);
const authModalMode = ref<'login' | 'register'>('login');

const openAuthModal = (event?: CustomEvent<{ mode?: 'login' | 'register' }>) => {
    authModalMode.value = event?.detail?.mode || 'login';
    authModalVisible.value = true;
    visible.value = false; // Close drawer if open
};

const closeDrawer = () => {
    visible.value = false;
};

onMounted(() => {
    globalThis.addEventListener('open-auth-modal', openAuthModal as EventListener);
    globalThis.addEventListener('close-drawer', closeDrawer);
});

onUnmounted(() => {
    globalThis.removeEventListener('open-auth-modal', openAuthModal as EventListener);
    globalThis.removeEventListener('close-drawer', closeDrawer);
});
</script>

<template>
    <header
        class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-16 bg-surface-0/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-800"
    >
        <div class="flex items-center gap-4">
            <Button
                variant="text"
                rounded
                @click="visible = true"
            >
                <FontAwesomeIcon
                    size="lg"
                    icon="fa-solid fa-bars"
                />
            </Button>
            <router-link
                to="/"
                class="flex items-center gap-2 no-underline group"
            >
                <span
                    class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary group-hover:scale-105 transition-transform"
                >
                    <FontAwesomeIcon
                        icon="fa-solid fa-calendar-days"
                        class="text-white"
                    />
                </span>
                <span class="text-xl font-bold text-surface-900 dark:text-surface-0 hidden sm:block">EventPlanner</span>
            </router-link>
        </div>

        <div class="flex items-center gap-2 sm:gap-4">
            <template v-if="isAuthenticated && isUserLoaded && user">
                <div
                    class="flex items-center gap-3 px-2 py-1 rounded-full bg-surface-100 dark:bg-surface-800 cursor-pointer hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                    @click="visible = true"
                >
                    <Avatar
                        :image="user.avatar"
                        :label="!user.avatar ? user.username?.charAt(0).toUpperCase() || '?' : undefined"
                        shape="circle"
                        class="ring-1 ring-primary/20"
                    />
                    <div class="hidden md:flex flex-col text-left mr-2">
                        <span class="text-xs font-bold leading-tight">{{ user.username }}</span>
                        <span class="text-[10px] text-surface-500 uppercase tracking-tighter">
                            {{ userRoleLabel }}
                        </span>
                    </div>
                    <Button
                        variant="text"
                        severity="danger"
                        size="small"
                        v-tooltip.bottom="'Logout'"
                        @click.stop="logout()"
                        class="hidden sm:flex"
                        data-testid="logout-button"
                    >
                        <FontAwesomeIcon
                            icon="fa-solid fa-right-from-bracket"
                            class="text-red-600 dark:text-red-400"
                        />
                    </Button>
                </div>
            </template>
            <template v-else-if="isAuthenticated && !isUserLoaded">
                <div class="flex items-center gap-3 px-4 py-2 rounded-full bg-surface-100 dark:bg-surface-800">
                    <Skeleton
                        shape="circle"
                        size="2rem"
                    />
                    <Skeleton
                        width="4rem"
                        height="1rem"
                        class="hidden md:block"
                    />
                </div>
            </template>
            <template v-else>
                <Button
                    variant="text"
                    size="small"
                    @click.stop="
                        authModalMode = 'login';
                        authModalVisible = true;
                    "
                >
                    <FontAwesomeIcon icon="fa-solid fa-right-to-bracket" />
                    <span>Login</span>
                </Button>
                <Button
                    size="small"
                    @click.stop="
                        authModalMode = 'register';
                        authModalVisible = true;
                    "
                    class="hidden sm:flex"
                >
                    <span>Register</span>
                </Button>
            </template>
        </div>
    </header>

    <!-- Spacer to push content below the fixed header -->
    <div class="h-16"></div>

    <div class="card flex justify-center">
        <Drawer v-model:visible="visible">
            <template #container="{ closeCallback }">
                <div
                    class="flex flex-col h-full bg-surface-0 dark:bg-surface-900 text-surface-700 dark:text-surface-0/80"
                >
                    <span class="flex justify-end p-2">
                        <Button
                            type="button"
                            @click="closeCallback"
                            rounded
                            variant="outlined"
                        >
                            <FontAwesomeIcon icon="fa-solid fa-times" />
                        </Button>
                    </span>

                    <div class="flex-1 overflow-y-auto">
                        <NavbarMenu />
                    </div>
                </div>
            </template>
        </Drawer>
    </div>

    <AuthModal
        v-model:visible="authModalVisible"
        :initial-mode="authModalMode"
    />
</template>
