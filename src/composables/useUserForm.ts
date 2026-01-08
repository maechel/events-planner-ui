import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { userSchema, userInitialValues } from '@/schemas/user';
import { useToast } from 'primevue/usetoast';
import type { UserDetailDTO } from '@/types/users';
import type { EntityId } from '@/types/common';
import type { useAdminStore } from '@/stores/admin';

export function useUserForm(adminStore: ReturnType<typeof useAdminStore>) {
    const toast = useToast();
    const userDialog = ref(false);
    const deleteUserDialog = ref(false);
    const selectedUserId = ref<EntityId | null>(null);

    const { handleSubmit, errors, defineField, meta, resetForm, setValues } = useForm({
        validationSchema: userSchema,
        initialValues: userInitialValues,
    });

    const [username] = defineField('username');
    const [email] = defineField('email');
    const [password] = defineField('password');
    const [confirmPassword] = defineField('confirmPassword');
    const [authorities] = defineField('authorities');
    const [enabled] = defineField('enabled');
    const [accountNonLocked] = defineField('accountNonLocked');

    const openNew = () => {
        selectedUserId.value = null;
        resetForm({
            values: userInitialValues,
        });
        userDialog.value = true;
    };

    const editUser = (u: UserDetailDTO) => {
        selectedUserId.value = u.id;

        // Ensure we have authorities, fallback to a role if present
        let initialAuthorities = u.authorities || [];
        if (initialAuthorities.length === 0 && (u as UserDetailDTO & { role?: string }).role) {
            initialAuthorities = [(u as UserDetailDTO & { role?: string }).role!];
        }

        setValues({
            username: u.username,
            email: u.email,
            password: '',
            confirmPassword: '',
            authorities: initialAuthorities,
            enabled: u.enabled === undefined ? true : u.enabled,
            accountNonLocked: u.accountNonLocked === undefined ? true : u.accountNonLocked,
        });
        userDialog.value = true;
    };

    const saveUser = handleSubmit(async (values) => {
        try {
            if (selectedUserId.value) {
                await adminStore.updateUser(selectedUserId.value, values);
                toast.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
            } else {
                await adminStore.createUser(values);
                toast.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
            }

            userDialog.value = false;
        } catch (error) {
            console.error('Failed to save user:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save user', life: 3000 });
        }
    });

    const confirmDeleteUser = (u: UserDetailDTO) => {
        selectedUserId.value = u.id;
        userDialog.value = false;
        deleteUserDialog.value = true;
    };

    const deleteUser = async () => {
        if (selectedUserId.value) {
            try {
                await adminStore.deleteUser(selectedUserId.value);
                deleteUserDialog.value = false;
                selectedUserId.value = null;
                toast.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
            } catch (error) {
                console.error('Failed to delete user:', error);
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete user', life: 3000 });
            }
        }
    };

    return {
        userDialog,
        deleteUserDialog,
        selectedUserId,
        username,
        email,
        password,
        confirmPassword,
        authorities,
        enabled,
        accountNonLocked,
        errors,
        meta,
        openNew,
        editUser,
        saveUser,
        confirmDeleteUser,
        deleteUser,
        hideDialog: () => (userDialog.value = false),
    };
}
