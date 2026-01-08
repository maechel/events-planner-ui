<script setup lang="ts">
import { ParticipantRole } from '@/constants/roles';
import { ToastSeverity } from '@/constants/ui';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import Dialog from 'primevue/dialog';
import Skeleton from 'primevue/skeleton';
import Button from 'primevue/button';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useEventStore } from '@/stores/event';
import EventForm from '@/components/forms/EventForm.vue';
import TaskForm from '@/components/forms/TaskForm.vue';
import ParticipantForm from '@/components/forms/ParticipantForm.vue';
import EventHeader from '@/components/events/EventHeader.vue';
import EventInfo from '@/components/events/EventInfo.vue';
import EventTaskList from '@/components/events/EventTaskList.vue';
import EventTeam from '@/components/events/EventTeam.vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import type { TaskSummaryDTO } from '@/types/tasks';
import type { EntityId } from '@/types/common';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const confirm = useConfirm();
const eventStore = useEventStore();
const { currentEvent, loading } = storeToRefs(eventStore);

const showEditEventDialog = ref(false);
const showAddTaskDialog = ref(false);
const showEditTaskDialog = ref(false);
const showParticipantDialog = ref(false);
const selectedTask = ref<TaskSummaryDTO | null>(null);

const allParticipants = computed(() => {
    if (!currentEvent.value) return [];
    return [...(currentEvent.value.organizers || []), ...(currentEvent.value.members || [])];
});

onMounted(async () => {
    const id = route.params.id as string;
    if (id) {
        await eventStore.fetchEventById(id);
    }
});

const handleToggleTask = async (taskId: EntityId, completed: boolean) => {
    try {
        await eventStore.toggleTask(currentEvent.value!.id, taskId, completed);
    } catch (error) {
        console.error('Failed to toggle task:', error);
        toast.add({
            severity: ToastSeverity.ERROR,
            summary: 'Error',
            detail: 'Failed to toggle task. Please check your connection.',
            life: 3000,
        });
    }
};

const openEditTask = (task: TaskSummaryDTO) => {
    selectedTask.value = task;
    showEditTaskDialog.value = true;
};

const confirmDeleteTask = (taskId: EntityId) => {
    confirm.require({
        message: 'Are you sure you want to delete this task?',
        header: 'Confirmation',
        icon: 'fa-solid fa-triangle-exclamation',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true,
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger',
        },
        accept: async () => {
            try {
                await eventStore.deleteTask(taskId);
                toast.add({
                    severity: ToastSeverity.INFO,
                    summary: 'Deleted',
                    detail: 'Task removed successfully',
                    life: 3000,
                });
            } catch (error) {
                console.error('Failed to delete task:', error);
                toast.add({
                    severity: ToastSeverity.ERROR,
                    summary: 'Error',
                    detail: 'Failed to delete task',
                    life: 3000,
                });
            }
        },
    });
};

const confirmDeleteEvent = () => {
    confirm.require({
        message: 'Are you sure you want to delete this event? This action cannot be undone.',
        header: 'Danger Zone',
        icon: 'fa-solid fa-exclamation-triangle',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true,
        },
        acceptProps: {
            label: 'Delete Event',
            severity: 'danger',
        },
        accept: async () => {
            try {
                await eventStore.deleteEvent(currentEvent.value!.id);
                toast.add({
                    severity: ToastSeverity.SUCCESS,
                    summary: 'Deleted',
                    detail: 'Event deleted successfully',
                    life: 3000,
                });
                await router.push('/events');
            } catch (error) {
                console.error('Failed to delete event:', error);
                toast.add({
                    severity: ToastSeverity.ERROR,
                    summary: 'Error',
                    detail: 'Failed to delete event',
                    life: 3000,
                });
            }
        },
    });
};

const removeParticipant = (userId: EntityId, role: ParticipantRole) => {
    confirm.require({
        message: `Remove this ${role.toLowerCase()} from the event?`,
        header: 'Confirm Removal',
        icon: 'fa-solid fa-user-minus',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true,
        },
        acceptProps: {
            label: 'Remove',
            severity: 'danger',
        },
        accept: async () => {
            try {
                await eventStore.removeParticipant(currentEvent.value!.id, userId, role);
                toast.add({
                    severity: ToastSeverity.INFO,
                    summary: 'Removed',
                    detail: 'Participant removed',
                    life: 3000,
                });
            } catch (error) {
                console.error('Failed to remove participant:', error);
                toast.add({
                    severity: ToastSeverity.ERROR,
                    summary: 'Error',
                    detail: 'Failed to remove participant',
                    life: 3000,
                });
            }
        },
    });
};

const goBack = () => {
    router.push('/events');
};
</script>

<template>
    <div
        v-if="loading"
        class="max-w-[1600px] mx-auto p-6 sm:p-10 animate-fade-in flex flex-col gap-10 sm:gap-14"
    >
        <div class="space-y-8">
            <Skeleton
                width="12rem"
                height="2rem"
            ></Skeleton>
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8">
                <div class="space-y-4">
                    <Skeleton
                        width="28rem"
                        height="4rem"
                        class="rounded-xl"
                    ></Skeleton>
                    <div class="flex gap-8">
                        <Skeleton
                            width="12rem"
                            height="1.5rem"
                        ></Skeleton>
                        <Skeleton
                            width="12rem"
                            height="1.5rem"
                        ></Skeleton>
                    </div>
                </div>
                <div class="flex gap-4">
                    <Skeleton
                        width="10rem"
                        height="3.5rem"
                        class="rounded-xl"
                    ></Skeleton>
                    <Skeleton
                        width="8rem"
                        height="3.5rem"
                        class="rounded-xl"
                    ></Skeleton>
                    <Skeleton
                        width="8rem"
                        height="3.5rem"
                        class="rounded-xl"
                    ></Skeleton>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div class="lg:col-span-2 flex flex-col gap-12">
                <div
                    class="bg-surface-0 dark:bg-surface-900 p-10 rounded-[2.5rem] border border-surface-100 dark:border-surface-800"
                >
                    <Skeleton
                        width="14rem"
                        height="2.5rem"
                        class="mb-8"
                    ></Skeleton>
                    <Skeleton
                        width="100%"
                        height="10rem"
                        border-radius="1.5rem"
                    ></Skeleton>
                </div>
                <div
                    class="bg-surface-0 dark:bg-surface-900 p-10 rounded-[2.5rem] border border-surface-100 dark:border-surface-800"
                >
                    <div class="flex justify-between mb-10">
                        <Skeleton
                            width="12rem"
                            height="2.5rem"
                        ></Skeleton>
                        <Skeleton
                            width="10rem"
                            height="3rem"
                            border-radius="3rem"
                        ></Skeleton>
                    </div>
                    <div class="space-y-8">
                        <Skeleton
                            v-for="i in 3"
                            :key="i"
                            width="100%"
                            height="6rem"
                            border-radius="1.5rem"
                        ></Skeleton>
                    </div>
                </div>
            </div>
            <div class="space-y-10">
                <div
                    class="bg-surface-0 dark:bg-surface-900 p-10 rounded-[2.5rem] border border-surface-100 dark:border-surface-800"
                >
                    <div class="flex justify-between mb-8">
                        <Skeleton
                            width="12rem"
                            height="2.5rem"
                        ></Skeleton>
                        <Skeleton
                            width="3rem"
                            height="3rem"
                            border-radius="50%"
                        ></Skeleton>
                    </div>
                    <div class="flex gap-4 mb-10">
                        <Skeleton
                            v-for="i in 3"
                            :key="i"
                            width="4rem"
                            height="4rem"
                            border-radius="50%"
                        ></Skeleton>
                    </div>
                    <Skeleton
                        width="12rem"
                        height="2.5rem"
                        class="mb-8"
                    ></Skeleton>
                    <div class="flex gap-4">
                        <Skeleton
                            v-for="i in 2"
                            :key="i"
                            width="4rem"
                            height="4rem"
                            border-radius="50%"
                        ></Skeleton>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div
        v-else-if="currentEvent"
        class="max-w-[1600px] mx-auto p-6 sm:p-10 animate-fade-in"
    >
        <!-- Dialogs -->
        <Dialog
            v-model:visible="showEditEventDialog"
            modal
            header="Edit Event"
            :style="{ width: '45rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        >
            <EventForm
                :initialData="currentEvent"
                isEdit
                @success="showEditEventDialog = false"
                @cancel="showEditEventDialog = false"
            />
        </Dialog>

        <Dialog
            v-model:visible="showAddTaskDialog"
            modal
            header="Add New Task"
            :style="{ width: '35rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        >
            <TaskForm
                :eventId="currentEvent.id"
                :participants="allParticipants"
                @success="showAddTaskDialog = false"
                @cancel="showAddTaskDialog = false"
            />
        </Dialog>

        <Dialog
            v-model:visible="showEditTaskDialog"
            modal
            header="Edit Task"
            :style="{ width: '35rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        >
            <TaskForm
                v-if="selectedTask"
                :eventId="currentEvent.id"
                :initialData="selectedTask"
                :participants="allParticipants"
                isEdit
                @success="showEditTaskDialog = false"
                @cancel="showEditTaskDialog = false"
            />
        </Dialog>

        <Dialog
            v-model:visible="showParticipantDialog"
            modal
            header="Add Participant"
            :style="{ width: '35rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        >
            <ParticipantForm
                :eventId="currentEvent.id"
                @success="showParticipantDialog = false"
                @cancel="showParticipantDialog = false"
            />
        </Dialog>

        <div class="flex flex-col gap-10 sm:gap-14">
            <EventHeader
                :event="currentEvent"
                @back="goBack"
                @edit="showEditEventDialog = true"
                @delete="confirmDeleteEvent"
                @invite="showParticipantDialog = true"
            />

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div class="lg:col-span-2 flex flex-col gap-12">
                    <EventInfo :event="currentEvent" />
                    <EventTaskList
                        :tasks="currentEvent.tasks || []"
                        :participants="allParticipants"
                        @add-task="showAddTaskDialog = true"
                        @toggle-task="handleToggleTask"
                        @edit-task="openEditTask"
                        @delete-task="confirmDeleteTask"
                    />
                </div>

                <div class="space-y-12">
                    <EventTeam
                        :organizers="currentEvent.organizers || []"
                        :members="currentEvent.members || []"
                        @add="showParticipantDialog = true"
                        @remove="removeParticipant"
                    />
                </div>
            </div>
        </div>
    </div>

    <div
        v-else
        class="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
        <FontAwesomeIcon
            icon="fa-solid fa-calendar-xmark"
            size="4x"
            class="text-surface-200 mb-4"
        />
        <h2 class="text-2xl font-bold">Event not found</h2>
        <Button
            label="Back to Home"
            @click="goBack"
            variant="text"
            class="mt-4"
        />
    </div>
</template>
