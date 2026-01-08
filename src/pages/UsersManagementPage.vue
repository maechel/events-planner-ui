<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAdminStore } from '@/stores/admin';
import { useUserForm } from '@/composables/useUserForm';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Avatar from 'primevue/avatar';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Checkbox from 'primevue/checkbox';
import ToggleSwitch from 'primevue/toggleswitch';
import ToggleButton from 'primevue/togglebutton';
import Password from 'primevue/password';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useToast } from 'primevue/usetoast';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { DATE_FORMATS } from '@/constants/ui';
import type { User } from '@/stores/auth';

const adminStore = useAdminStore();
const { users, loading } = storeToRefs(adminStore);
const toast = useToast();

const {
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
    hideDialog,
} = useUserForm(adminStore);

const roles = ref([
    { label: 'Admin', value: 'ROLE_ADMIN' },
    { label: 'User', value: 'ROLE_USER' },
]);

const editingRows = ref([]);

onMounted(() => {
    adminStore.fetchUsers();
});

const onRowEditSave = async (event: { newData: User; index: number }) => {
    const { newData, index } = event;

    try {
        await adminStore.updateUser(newData.id, newData);
        users.value[index] = newData;
        toast.add({ severity: 'success', summary: 'Updated', detail: 'User updated successfully', life: 3000 });
    } catch (error) {
        console.error('Failed to update user:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user', life: 3000 });
    }
};

const toggleRole = (data: User) => {
    const isAdmin = data.authorities.includes('ROLE_ADMIN');
    if (isAdmin) {
        data.authorities = ['ROLE_USER'];
    } else {
        data.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }
};

const getRoleSeverity = (role: string) => {
    if (role.includes('ADMIN')) return 'danger';
    if (role.includes('USER')) return 'info';
    return 'secondary';
};

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Never';
    return format(parseISO(dateString), DATE_FORMATS.DEFAULT);
};

const getRelativeTime = (dateString: string | undefined) => {
    if (!dateString) return '';
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
};

const cleanRoleName = (role: string) => {
    if (!role) return '';
    return role.replace('ROLE_', '');
};

const getUserAuthorities = (user: User) => {
    return user.authorities && user.authorities.length > 0 ? user.authorities : [user.role || ''];
};
</script>

<template>
    <div class="min-h-screen bg-surface-50 dark:bg-surface-950 p-6 sm:p-10">
        <div class="max-w-[1600px] mx-auto space-y-16 sm:space-y-20">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                <div>
                    <h1 class="text-3xl sm:text-4xl font-black text-surface-900 dark:text-surface-0 tracking-tight">
                        User Management
                    </h1>
                    <p class="text-surface-500 mt-2 text-base sm:text-lg font-medium">
                        Manage application users and their roles
                    </p>
                </div>
                <Button
                    severity="success"
                    size="large"
                    @click="openNew"
                    class="shadow-xl shadow-green-500/20 px-8 py-4 font-black"
                >
                    <FontAwesomeIcon icon="fa-solid fa-plus" />
                    <span>New User</span>
                </Button>
            </div>

            <div
                class="bg-surface-0 dark:bg-surface-900 rounded-[2.5rem] border border-surface-200 dark:border-surface-800 shadow-sm overflow-hidden p-2"
            >
                <DataTable
                    :value="users"
                    :loading="loading"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    v-model:editingRows="editingRows"
                    editMode="row"
                    @row-edit-save="onRowEditSave"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                    class="p-datatable-lg"
                    scrollable
                    scrollHeight="flex"
                    responsiveLayout="stack"
                    breakpoint="960px"
                >
                    <Column
                        field="username"
                        header="User"
                        sortable
                        style="min-width: 14rem"
                    >
                        <template #body="slotProps">
                            <div class="flex items-center gap-4 py-2">
                                <Avatar
                                    :image="slotProps.data.avatar"
                                    :label="
                                        !slotProps.data.avatar ? slotProps.data.username.charAt(0).toUpperCase() : null
                                    "
                                    shape="circle"
                                    size="large"
                                    class="ring-2 ring-surface-100 dark:ring-surface-800"
                                />
                                <div class="flex flex-col">
                                    <span class="font-black text-surface-900 dark:text-surface-0">{{
                                        slotProps.data.username
                                    }}</span>
                                    <span class="text-xs font-bold text-surface-500">{{ slotProps.data.email }}</span>
                                </div>
                            </div>
                        </template>
                    </Column>

                    <Column
                        header="Roles"
                        style="min-width: 10rem"
                    >
                        <template #body="slotProps">
                            <div class="flex flex-wrap gap-1.5">
                                <Tag
                                    v-for="auth in getUserAuthorities(slotProps.data)"
                                    :key="auth"
                                    :value="cleanRoleName(auth)"
                                    :severity="getRoleSeverity(auth)"
                                    class="font-black"
                                />
                            </div>
                        </template>
                        <template #editor="{ data }">
                            <ToggleButton
                                :modelValue="data.authorities.includes('ROLE_ADMIN')"
                                @update:modelValue="toggleRole(data)"
                                onLabel="Admin"
                                offLabel="User"
                                class="w-full font-black text-xs h-10"
                            />
                        </template>
                    </Column>

                    <Column
                        field="enabled"
                        header="Status"
                        sortable
                        style="min-width: 7rem"
                    >
                        <template #body="slotProps">
                            <Tag
                                :value="slotProps.data.enabled ? 'Active' : 'Disabled'"
                                :severity="slotProps.data.enabled ? 'success' : 'warn'"
                                class="font-black px-3"
                            />
                        </template>
                        <template #editor="{ data }">
                            <div class="flex justify-center">
                                <ToggleSwitch v-model="data.enabled" />
                            </div>
                        </template>
                    </Column>

                    <Column
                        field="accountNonLocked"
                        header="Locked"
                        sortable
                        style="min-width: 7rem"
                    >
                        <template #body="slotProps">
                            <Tag
                                :value="slotProps.data.accountNonLocked ? 'No' : 'Locked'"
                                :severity="slotProps.data.accountNonLocked ? 'success' : 'danger'"
                                class="font-black px-3"
                            />
                        </template>
                        <template #editor="{ data }">
                            <div class="flex justify-center">
                                <ToggleSwitch v-model="data.accountNonLocked" />
                            </div>
                        </template>
                    </Column>

                    <Column
                        field="failedLoginAttempts"
                        header="Failed"
                        sortable
                        style="min-width: 5rem"
                    >
                        <template #body="slotProps">
                            <div class="flex justify-center sm:justify-start">
                                <span
                                    :class="{
                                        'text-red-500 font-black bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-md':
                                            (slotProps.data.failedLoginAttempts || 0) > 0,
                                        'text-surface-400 font-bold': (slotProps.data.failedLoginAttempts || 0) === 0,
                                    }"
                                >
                                    {{ slotProps.data.failedLoginAttempts || 0 }}
                                </span>
                            </div>
                        </template>
                    </Column>

                    <Column
                        field="lastLogin"
                        header="Last Login"
                        sortable
                        style="min-width: 11rem"
                    >
                        <template #body="slotProps">
                            <span
                                v-tooltip.top="getRelativeTime(slotProps.data.lastLogin)"
                                class="font-mono text-xs font-bold text-surface-600 dark:text-surface-400"
                            >
                                {{ formatDate(slotProps.data.lastLogin) }}
                            </span>
                        </template>
                    </Column>

                    <Column
                        field="createdAt"
                        header="Created"
                        sortable
                        style="min-width: 11rem"
                    >
                        <template #body="slotProps">
                            <span
                                v-tooltip.top="getRelativeTime(slotProps.data.createdAt)"
                                class="font-mono text-xs font-bold text-surface-600 dark:text-surface-400"
                            >
                                {{ formatDate(slotProps.data.createdAt) }}
                            </span>
                        </template>
                    </Column>

                    <Column
                        field="updatedAt"
                        header="Updated"
                        sortable
                        style="min-width: 11rem"
                    >
                        <template #body="slotProps">
                            <span
                                v-tooltip.top="getRelativeTime(slotProps.data.updatedAt)"
                                class="font-mono text-xs font-bold text-surface-600 dark:text-surface-400"
                            >
                                {{ formatDate(slotProps.data.updatedAt) }}
                            </span>
                        </template>
                    </Column>

                    <Column
                        :rowEditor="true"
                        style="width: 6rem; min-width: 6rem"
                        bodyStyle="text-align:center"
                    ></Column>

                    <Column
                        :exportable="false"
                        style="min-width: 6rem"
                    >
                        <template #body="slotProps">
                            <div class="flex gap-3 justify-end px-2">
                                <Button
                                    variant="text"
                                    rounded
                                    size="large"
                                    @click="editUser(slotProps.data)"
                                    v-tooltip.top="'Full Edit'"
                                >
                                    <FontAwesomeIcon icon="fa-solid fa-pencil" />
                                </Button>
                                <Button
                                    variant="text"
                                    rounded
                                    severity="danger"
                                    size="large"
                                    @click="confirmDeleteUser(slotProps.data)"
                                    v-tooltip.top="'Delete'"
                                >
                                    <FontAwesomeIcon icon="fa-solid fa-trash" />
                                </Button>
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <!-- User Form Dialog -->
        <Dialog
            v-model:visible="userDialog"
            :style="{ width: '450px' }"
            :header="selectedUserId ? 'Edit User' : 'New User'"
            :modal="true"
            class="p-fluid"
        >
            <div class="flex flex-col gap-2 mt-4">
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
                        >{{ selectedUserId ? 'New Password (optional)' : 'Password' }}</label
                    >
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
            </div>
            <template #footer>
                <Button
                    variant="text"
                    @click="hideDialog"
                >
                    <FontAwesomeIcon icon="fa-solid fa-times" />
                    <span>Cancel</span>
                </Button>
                <Button
                    @click="saveUser"
                    :disabled="!meta.valid"
                >
                    <FontAwesomeIcon icon="fa-solid fa-check" />
                    <span>Save</span>
                </Button>
            </template>
        </Dialog>

        <!-- Delete User Confirmation Dialog -->
        <Dialog
            v-model:visible="deleteUserDialog"
            :style="{ width: '450px' }"
            header="Confirm"
            :modal="true"
        >
            <div class="flex items-center gap-3 mt-4">
                <FontAwesomeIcon
                    icon="fa-solid fa-triangle-exclamation"
                    class="text-3xl text-yellow-500"
                />
                <span v-if="selectedUserId">Are you sure you want to delete this user?</span>
            </div>
            <template #footer>
                <Button
                    label="No"
                    icon="fa-solid fa-times"
                    variant="text"
                    @click="deleteUserDialog = false"
                />
                <Button
                    label="Yes"
                    icon="fa-solid fa-check"
                    severity="danger"
                    @click="deleteUser"
                />
            </template>
        </Dialog>
    </div>
</template>
