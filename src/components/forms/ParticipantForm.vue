<script setup lang="ts">
import { ParticipantRole } from '@/constants/roles';
import { ToastSeverity } from '@/constants/ui';
import { ref, onMounted, computed } from 'vue';
import { useForm } from 'vee-validate';
import { participantSchema, participantInitialValues } from '@/schemas/participant';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import { useAdminStore } from '@/stores/admin';
import { useEventStore } from '@/stores/event';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import type { AxiosError } from 'axios';
import type { EntityId } from '@/types/common';

type PropTypes = {
    eventId: EntityId;
};

type EmitTypes = {
    success: [];
    cancel: [];
};

const props = defineProps<PropTypes>();
const emit = defineEmits<EmitTypes>();

const adminStore = useAdminStore();
const eventStore = useEventStore();
const toast = useToast();
const loading = ref(false);

const { users } = storeToRefs(adminStore);
const { currentEvent } = storeToRefs(eventStore);

const availableUsers = computed(() => {
    if (!currentEvent.value) return users.value;
    const participantIds = new Set([
        ...(currentEvent.value.organizers || []).map((p) => String(p.id)),
        ...(currentEvent.value.members || []).map((p) => String(p.id)),
    ]);
    return users.value.filter((u) => !participantIds.has(String(u.id)));
});

const { handleSubmit, errors, defineField, meta } = useForm({
    validationSchema: participantSchema,
    initialValues: participantInitialValues,
});

const [userId] = defineField('userId');
const [role] = defineField('role');

const roles = [
    { label: 'Organizer', value: ParticipantRole.ORGANIZER },
    { label: 'Member', value: ParticipantRole.MEMBER },
];

onMounted(async () => {
    await adminStore.fetchUsers();
});

const onSubmit = handleSubmit(async (values) => {
    loading.value = true;
    try {
        await eventStore.addParticipant(props.eventId, values.userId, values.role as ParticipantRole);
        toast.add({
            severity: ToastSeverity.SUCCESS,
            summary: 'Success',
            detail: 'Participant added successfully',
            life: 3000,
        });
        emit('success');
    } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.add({
            severity: ToastSeverity.ERROR,
            summary: 'Error',
            detail: axiosError.response?.data?.message || 'Failed to add participant',
            life: 5000,
        });
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <form
        @submit.prevent="onSubmit"
        class="flex flex-col gap-4"
    >
        <div class="flex flex-col gap-2">
            <label
                for="userId"
                class="font-semibold text-surface-700 dark:text-surface-0/80"
                >Select User</label
            >
            <Select
                id="userId"
                v-model="userId"
                :options="availableUsers"
                optionLabel="username"
                optionValue="id"
                placeholder="Choose a user..."
                class="w-full"
                filter
            >
                <template #value="slotProps">
                    <div
                        v-if="slotProps.value"
                        class="flex items-center gap-2"
                    >
                        <Avatar
                            :image="availableUsers.find((u) => String(u.id) === String(slotProps.value))?.avatar"
                            :label="
                                availableUsers
                                    .find((u) => String(u.id) === String(slotProps.value))
                                    ?.username?.charAt(0)
                            "
                            shape="circle"
                            class="w-6 h-6"
                        />
                        <span>{{
                            availableUsers.find((u) => String(u.id) === String(slotProps.value))?.username
                        }}</span>
                    </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>
                <template #option="slotProps">
                    <div class="flex items-center gap-2">
                        <Avatar
                            :image="slotProps.option.avatar"
                            :label="slotProps.option.username?.charAt(0)"
                            shape="circle"
                            class="w-6 h-6"
                        />
                        <span>{{ slotProps.option.username }}</span>
                    </div>
                </template>
            </Select>
            <div class="h-5">
                <small
                    v-if="errors.userId"
                    class="text-red-500"
                    >{{ errors.userId }}</small
                >
            </div>
        </div>

        <div class="flex flex-col gap-2">
            <label
                for="role"
                class="font-semibold text-surface-700 dark:text-surface-0/80"
                >Role</label
            >
            <Select
                id="role"
                v-model="role"
                :options="roles"
                optionLabel="label"
                optionValue="value"
                class="w-full"
            />
            <div class="h-5">
                <small
                    v-if="errors.role"
                    class="text-red-500"
                    >{{ errors.role }}</small
                >
            </div>
        </div>

        <div class="flex justify-end gap-2 mt-4">
            <Button
                type="button"
                label="Cancel"
                variant="text"
                @click.prevent.stop="emit('cancel')"
                :disabled="loading"
            />
            <Button
                type="submit"
                label="Add Participant"
                :loading="loading"
                :disabled="!meta.valid"
                @click.stop
            />
        </div>
    </form>
</template>
