import { useConfirm } from 'primevue/useconfirm';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

export function useLogout() {
    const confirm = useConfirm();
    const authStore = useAuthStore();
    const router = useRouter();

    const logout = () => {
        confirm.require({
            group: 'headless',
            header: 'Are you sure?',
            message: 'Do you really want to log out of your account?',
            accept: async () => {
                await authStore.logout();
                await router.push('/');
                // Close drawer if it's open (it responds to this event)
                globalThis.dispatchEvent(new CustomEvent('close-drawer'));
            },
        });
    };

    return {
        logout,
    };
}
