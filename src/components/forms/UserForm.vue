<script setup lang="ts">
import { computed, watch } from 'vue';
import { useForm } from 'vee-validate';
import { userSchema, userInitialValues } from '@/schemas/user';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Checkbox from 'primevue/checkbox';
import Password from 'primevue/password';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Message from 'primevue/message';
import Button from 'primevue/button';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { UserDetail } from '@/types/users';
import { useAdminStore } from '@/stores/admin';

type PropTypes = {
    visible: boolean;
    initialData?: UserDetail | null;
};

type EmitTypes = {
    'update:visible': [value: boolean];
    success: [];
};

const props = defineProps<PropTypes>();
const emit = defineEmits<EmitTypes>();

const isVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value),
});

const adminStore = useAdminStore();
const toast = useToast();

const roles = [
    { label: 'Admin', value: 'ROLE_ADMIN' },
    { label: 'User', value: 'ROLE_USER' },
];

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

watch(
    () => props.visible,
    (newVal) => {
        if (!newVal) {
            resetForm({ values: userInitialValues });
        } else if (props.initialData) {
            // Re-populate if opening with initialData
            const u = props.initialData;
            let initialAuthorities = u.authorities || [];
            if (initialAuthorities.length === 0 && (u as UserDetail & { role?: string }).role) {
                initialAuthorities = [(u as UserDetail & { role?: string }).role!];
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
        }
    },
);

watch(
    () => props.initialData,
    (u) => {
        if (u && props.visible) {
            let initialAuthorities = u.authorities || [];
            if (initialAuthorities.length === 0 && (u as UserDetail & { role?: string }).role) {
                initialAuthorities = [(u as UserDetail & { role?: string }).role!];
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
        }
    },
    { immediate: true },
);

const onSave = handleSubmit(async (values) => {
    try {
        if (props.initialData?.id) {
            await adminStore.updateUser(props.initialData.id, values);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
        } else {
            await adminStore.createUser(values);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
        }
        isVisible.value = false;
        emit('success');
    } catch (error) {
        console.error('Failed to save user:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save user', life: 3000 });
    }
});
</script>

<template>
    <Dialog
        v-model:visible="isVisible"
        :style="{ width: '450px' }"
        :header="initialData ? 'Edit User' : 'New User'"
        :modal="true"
        class="p-fluid"
    >
        <form
            @submit.prevent="onSave"
            class="flex flex-col gap-2 mt-4"
        >
            <div class="flex flex-col gap-1 min-h-[5.5rem]">
                <label
                    for="username"
                    class="font-semibold text-sm text-surface-600 dark:text-surface-400"
                    >Username</label
                >
                <IconField>
                    <InputIcon>
                        <FontAwesomeIcon icon="fa-solid fa-user" />
                    </InputIcon>
                    <InputText
                        id="username"
                        v-model="username"
                        autofocus
                        :invalid="!!errors.username"
                        class="w-full h-11"
                        placeholder="Enter username"
                    />
                </IconField>
                <div class="h-5">
                    <Message
                        v-if="errors.username"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ errors.username }}</Message
                    >
                </div>
            </div>

            <div class="flex flex-col gap-1 min-h-[5.5rem]">
                <label
                    for="email"
                    class="font-semibold text-sm text-surface-600 dark:text-surface-400"
                    >Email</label
                >
                <IconField>
                    <InputIcon>
                        <FontAwesomeIcon icon="fa-solid fa-envelope" />
                    </InputIcon>
                    <InputText
                        id="email"
                        v-model="email"
                        :invalid="!!errors.email"
                        class="w-full h-11"
                        placeholder="Enter email"
                    />
                </IconField>
                <div class="h-5">
                    <Message
                        v-if="errors.email"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ errors.email }}</Message
                    >
                </div>
            </div>

            <div class="flex flex-col gap-1 min-h-[5.5rem]">
                <label
                    for="password"
                    class="font-semibold text-sm text-surface-600 dark:text-surface-400"
                >
                    {{ initialData ? 'New Password (optional)' : 'Password' }}
                </label>
                <IconField>
                    <InputIcon>
                        <FontAwesomeIcon icon="fa-solid fa-lock" />
                    </InputIcon>
                    <Password
                        id="password"
                        v-model="password"
                        :feedback="false"
                        toggleMask
                        :invalid="!!errors.password"
                        class="w-full"
                        :dt="{
                            pcInputText: {
                                root: 'w-full h-11',
                            },
                        }"
                        input-class="w-full"
                        placeholder="Enter password"
                    />
                </IconField>
                <div class="h-5">
                    <Message
                        v-if="errors.password"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ errors.password }}</Message
                    >
                </div>
            </div>

            <div class="flex flex-col gap-1 min-h-[5.5rem]">
                <label
                    for="confirmPassword"
                    class="font-semibold text-sm text-surface-600 dark:text-surface-400"
                    >Confirm Password</label
                >
                <IconField>
                    <InputIcon>
                        <FontAwesomeIcon icon="fa-solid fa-check-double" />
                    </InputIcon>
                    <Password
                        id="confirmPassword"
                        v-model="confirmPassword"
                        :feedback="false"
                        toggleMask
                        :invalid="!!errors.confirmPassword"
                        class="w-full"
                        :dt="{
                            pcInputText: {
                                root: 'w-full h-11',
                            },
                        }"
                        input-class="w-full"
                        placeholder="Confirm password"
                    />
                </IconField>
                <div class="h-5">
                    <Message
                        v-if="errors.confirmPassword"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ errors.confirmPassword }}</Message
                    >
                </div>
            </div>

            <div class="flex flex-col gap-1 min-h-[5.5rem]">
                <label
                    for="authorities"
                    class="font-semibold text-sm text-surface-600 dark:text-surface-400"
                    >Authorities</label
                >
                <MultiSelect
                    id="authorities"
                    v-model="authorities"
                    :options="roles"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Authorities"
                    display="chip"
                    class="w-full"
                    :invalid="!!errors.authorities"
                />
                <div class="h-5">
                    <Message
                        v-if="errors.authorities"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ errors.authorities }}</Message
                    >
                </div>
            </div>

            <div class="flex flex-col gap-3 mt-2">
                <div class="flex items-center gap-2">
                    <Checkbox
                        id="enabled"
                        v-model="enabled"
                        :binary="true"
                    />
                    <label
                        for="enabled"
                        class="font-bold"
                        >Account Enabled</label
                    >
                </div>
                <div class="flex items-center gap-2">
                    <Checkbox
                        id="accountNonLocked"
                        v-model="accountNonLocked"
                        :binary="true"
                    />
                    <label
                        for="accountNonLocked"
                        class="font-bold"
                        >Account Unlocked</label
                    >
                </div>
            </div>

            <div class="flex justify-end gap-2 mt-6">
                <Button
                    variant="text"
                    @click="isVisible = false"
                    type="button"
                >
                    <FontAwesomeIcon icon="fa-solid fa-times" />
                    <span>Cancel</span>
                </Button>
                <Button
                    type="submit"
                    :disabled="!meta.valid"
                >
                    <FontAwesomeIcon icon="fa-solid fa-check" />
                    <span>Save</span>
                </Button>
            </div>
        </form>
    </Dialog>
</template>
