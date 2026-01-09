import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import api from '@/api/axios';
import { useStorage } from '@vueuse/core';
import type { UserDetail } from '@/types/users';
import type { AxiosError } from 'axios';
import { userService } from '@/services/userService';

export type User = UserDetail & { role?: string };

export const useAuthStore = defineStore('auth', () => {
    const user = useStorage<User | null>('user', null);
    const rawToken = localStorage.getItem('token');
    const initialToken = rawToken ? rawToken.replace(/^"(.*)"$/, '$1') : null;
    const token = ref<string | null>(initialToken);
    const loading = ref(false);

    watch(token, (newToken) => {
        if (newToken) {
            localStorage.setItem('token', newToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        } else {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
        }
    });

    if (token.value) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
    }

    const isAuthenticated = computed(() => !!token.value || (!!user.value && user.value.authenticated !== false));
    const isUserLoaded = computed(() => !!user.value && user.value.authenticated !== false);
    const isAdmin = computed(() => {
        if (!user.value) return false;

        const authorities = user.value.authorities || [];
        const roles = user.value.roles || [];
        const role = user.value.role;

        const hasAdminRole = (r: string | { authority: string }) =>
            (typeof r === 'string' && r === 'ROLE_ADMIN') || (typeof r === 'object' && r.authority === 'ROLE_ADMIN');

        return authorities.some(hasAdminRole) || roles.some(hasAdminRole) || (role && hasAdminRole(role));
    });

    async function fetchUser() {
        loading.value = true;
        try {
            const userData = await userService.getCurrentUser();

            if (userData.authenticated === false) {
                user.value = null;
                token.value = null;
                return null;
            }

            user.value = userData;
            return userData;
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            if (axiosError.response?.status === 401) {
                logout();
            }
            throw error;
        } finally {
            loading.value = false;
        }
    }

    function setToken(newToken: string | null) {
        token.value = newToken;
    }

    async function logout(explicit: boolean = true) {
        loading.value = true;
        try {
            await userService.logout();
        } catch (error) {
            console.error('Logout request failed:', error);
        } finally {
            user.value = null;
            token.value = null;
            localStorage.removeItem('lastRoute');
            loading.value = false;

            if (explicit) {
                globalThis.dispatchEvent(new Event('logged-out'));
            }
        }
    }

    globalThis.addEventListener('unauthorized', () => {
        token.value = null;
        user.value = null;
    });

    return {
        user,
        token,
        loading,
        isAuthenticated,
        isUserLoaded,
        isAdmin,
        fetchUser,
        setToken,
        logout,
    };
});
