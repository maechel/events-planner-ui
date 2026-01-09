<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Button from 'primevue/button';
import Select from 'primevue/select';
import Dialog from 'primevue/dialog';
import Avatar from 'primevue/avatar';
import { useEventStore, type Participant, type Task } from '@/stores/event';
import { useToast } from 'primevue/usetoast';
import { ToastSeverity } from '@/constants/ui';
import type { EntityId } from '@/types/common';

type PropTypes = {
    eventId: EntityId;
    participantToRemoveId: EntityId;
    participantToRemoveName: string;
    tasks: Task[];
    allParticipants: Participant[];
    visible: boolean;
};

type EmitTypes = {
    success: [];
    cancel: [];
    hide: [];
    'update:visible': [value: boolean];
};

const props = defineProps<PropTypes>();
const emit = defineEmits<EmitTypes>();

const isVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value),
});

const eventStore = useEventStore();
const toast = useToast();
const loading = ref(false);

const assignedTasks = computed(() =>
    props.tasks.filter((t) => String(t.assignedToId) === String(props.participantToRemoveId)),
);

const otherParticipants = computed(() =>
    props.allParticipants.filter((p) => String(p.id) !== String(props.participantToRemoveId)),
);

const reassignments = ref<Record<string, EntityId>>({});

watch(
    () => props.visible,
    (newVal) => {
        if (!newVal) {
            reassignments.value = {};
        }
    },
);

const canSubmit = computed(() => {
    return assignedTasks.value.every((task) => reassignments.value[String(task.id)]);
});

const onReassignAndRemove = async () => {
    loading.value = true;
    try {
        // Use a static copy to avoid issues with reactive array mutations during iteration
        const tasksToReassign = [...assignedTasks.value];

        // 1. Reassign each task
        for (const task of tasksToReassign) {
            const newAssigneeId = reassignments.value[String(task.id)];
            if (newAssigneeId) {
                await eventStore.assignTask(task.id, newAssigneeId);
            }
        }
        emit('success');
    } catch (error) {
        console.error('Failed to reassign tasks:', error);
        toast.add({
            severity: ToastSeverity.ERROR,
            summary: 'Error',
            detail: 'Failed to reassign some tasks. Please try again.',
            life: 5000,
        });
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <Dialog
        v-model:visible="isVisible"
        modal
        header="Reassign Tasks"
        :style="{ width: '40rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        @hide="emit('hide')"
    >
        <div class="flex flex-col gap-6">
            <div
                class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-2xl flex gap-4"
            >
                <div class="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center text-white shrink-0">
                    <i class="fa-solid fa-triangle-exclamation text-xl"></i>
                </div>
                <div>
                    <h4 class="font-black text-yellow-800 dark:text-yellow-200">Pending Tasks</h4>
                    <p class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        {{ participantToRemoveName }} has <strong>{{ assignedTasks.length }}</strong> tasks assigned.
                        Please reassign them before removing the participant.
                    </p>
                </div>
            </div>

            <div class="max-h-[40vh] overflow-y-auto pr-2 space-y-4">
                <div
                    v-for="task in assignedTasks"
                    :key="task.id"
                    class="p-4 rounded-2xl border border-surface-100 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-800/50 flex flex-col gap-3"
                >
                    <span class="font-bold text-surface-900 dark:text-surface-0">{{ task.description }}</span>

                    <div class="flex flex-col gap-2">
                        <label
                            :for="'reassign-' + task.id"
                            class="text-xs font-black uppercase tracking-widest text-surface-400"
                            >Reassign to:</label
                        >
                        <Select
                            :id="'reassign-' + task.id"
                            v-model="reassignments[String(task.id)]"
                            :options="otherParticipants"
                            optionLabel="username"
                            optionValue="id"
                            placeholder="Select new assignee"
                            class="w-full"
                        >
                            <template #value="slotProps">
                                <div
                                    v-if="slotProps.value"
                                    class="flex items-center gap-2"
                                >
                                    <Avatar
                                        :image="
                                            otherParticipants.find((p) => String(p.id) === String(slotProps.value))
                                                ?.avatar
                                        "
                                        :label="
                                            otherParticipants
                                                .find((p) => String(p.id) === String(slotProps.value))
                                                ?.username?.charAt(0)
                                        "
                                        shape="circle"
                                        class="w-6 h-6"
                                    />
                                    <span class="text-sm">{{
                                        otherParticipants.find((p) => String(p.id) === String(slotProps.value))
                                            ?.username
                                    }}</span>
                                </div>
                                <span
                                    v-else
                                    class="text-sm"
                                >
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
                                    <span class="text-sm">{{ slotProps.option.username }}</span>
                                </div>
                            </template>
                        </Select>
                    </div>
                </div>
            </div>

            <div class="flex justify-end gap-3 mt-4">
                <Button
                    label="Cancel"
                    variant="text"
                    @click="isVisible = false"
                    :disabled="loading"
                />
                <Button
                    label="Reassign & Remove"
                    severity="danger"
                    :loading="loading"
                    :disabled="!canSubmit"
                    @click.stop="onReassignAndRemove"
                    class="font-black px-6"
                />
            </div>
        </div>
    </Dialog>
</template>
