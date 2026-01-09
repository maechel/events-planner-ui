<script setup lang="ts">
import { DATE_FORMATS } from '@/constants/ui';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Avatar from 'primevue/avatar';
import Tag from 'primevue/tag';
import { format, parseISO } from 'date-fns';
import type { Task, Participant } from '@/stores/event';
import { getUrgencySeverity } from '@/utils/formatters';

import type { EntityId } from '@/types/common';

type PropTypes = {
    tasks: Task[];
    participants: Participant[];
};

type EmitTypes = {
    'add-task': [];
    'toggle-task': [taskId: EntityId, completed: boolean];
    'edit-task': [task: Task];
    'delete-task': [taskId: EntityId];
};

defineProps<PropTypes>();
const emit = defineEmits<EmitTypes>();

const getParticipant = (id: EntityId, participants: Participant[]) => {
    return participants.find((p) => String(p.id) === String(id));
};

const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return format(parseISO(dateString), DATE_FORMATS.DEFAULT);
};

const getUrgencyLabel = (dueDate: string) => {
    const severity = getUrgencySeverity(dueDate);
    switch (severity) {
        case 'danger':
            return 'Urgent';
        case 'warn':
            return 'Soon';
        case 'info':
            return 'Planned';
        default:
            return 'Scheduled';
    }
};

const getUrgencyIcon = (dueDate: string) => {
    const severity = getUrgencySeverity(dueDate);
    switch (severity) {
        case 'danger':
            return 'fa-solid fa-triangle-exclamation';
        case 'warn':
            return 'fa-solid fa-clock';
        case 'info':
            return 'fa-solid fa-calendar-check';
        default:
            return 'fa-solid fa-calendar-day';
    }
};
</script>

<template>
    <div
        class="bg-surface-0 dark:bg-surface-900 p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-surface-100 dark:border-surface-800"
    >
        <div class="flex justify-between items-center mb-12">
            <h3 class="text-3xl font-black flex items-center tracking-tight">
                <span
                    class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg mr-6"
                >
                    <FontAwesomeIcon
                        icon="fa-solid fa-list-check"
                        size="sm"
                    />
                </span>
                Tasks
            </h3>
            <Button
                size="small"
                rounded
                @click.stop="emit('add-task')"
                class="font-black px-4"
            >
                <FontAwesomeIcon icon="fa-solid fa-plus" />
                <span>New Task</span>
            </Button>
        </div>

        <div class="space-y-5 mt-4">
            <div
                v-for="task in tasks"
                :key="task.id"
                class="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl border border-surface-100 dark:border-surface-800 bg-surface-50/30 dark:bg-surface-800/30 hover:bg-surface-0 dark:hover:bg-surface-800 hover:border-primary transition-all group shadow-xs hover:shadow-xl gap-4"
            >
                <div class="flex items-center gap-6">
                    <Checkbox
                        v-model="task.completed"
                        :binary="true"
                        @change="emit('toggle-task', task.id, task.completed)"
                        class="scale-125 shrink-0"
                    />
                    <div class="flex flex-col gap-1">
                        <span
                            :class="{ 'line-through text-surface-400 font-medium': task.completed }"
                            class="text-xl font-bold transition-all text-surface-800 dark:text-surface-100"
                        >
                            {{ task.description }}
                        </span>
                        <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-surface-500">
                            <span
                                v-if="task.assignedToId || task.assignedToUsername"
                                class="flex items-center gap-1.5"
                            >
                                <FontAwesomeIcon
                                    icon="fa-solid fa-user"
                                    class="text-[10px]"
                                />
                                {{
                                    task.assignedToUsername ||
                                    getParticipant(task.assignedToId || '', participants)?.username ||
                                    'Assigned'
                                }}
                            </span>
                            <span
                                v-if="task.dueDate"
                                class="flex items-center gap-1.5"
                                :class="!task.completed ? 'text-' + getUrgencySeverity(task.dueDate) : ''"
                            >
                                <FontAwesomeIcon
                                    icon="fa-solid fa-calendar-day"
                                    class="text-[10px]"
                                />
                                Due {{ formatDate(task.dueDate) }}
                                <Tag
                                    v-if="!task.completed"
                                    :severity="getUrgencySeverity(task.dueDate)"
                                    size="small"
                                    class="scale-75 origin-left"
                                >
                                    <div class="flex items-center gap-1.5 px-1">
                                        <FontAwesomeIcon
                                            :icon="getUrgencyIcon(task.dueDate)"
                                            class="text-[10px]"
                                        />
                                        <span>{{ getUrgencyLabel(task.dueDate) }}</span>
                                    </div>
                                </Tag>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between sm:justify-end gap-6">
                    <template v-if="task.assignedToId || task.assignedToUsername">
                        <Avatar
                            :image="getParticipant(task.assignedToId || '', participants)?.avatar"
                            :label="
                                (
                                    task.assignedToUsername ||
                                    getParticipant(task.assignedToId || '', participants)?.username ||
                                    '?'
                                )
                                    .charAt(0)
                                    .toUpperCase()
                            "
                            shape="circle"
                            size="large"
                            class="ring-4 ring-primary/5 shadow-sm"
                        />
                    </template>
                    <div class="flex gap-2">
                        <Button
                            variant="text"
                            rounded
                            class="transition-opacity"
                            @click.stop="emit('edit-task', task)"
                        >
                            <FontAwesomeIcon icon="fa-solid fa-pencil" />
                        </Button>
                        <Button
                            variant="text"
                            severity="danger"
                            rounded
                            class="transition-opacity"
                            @click.stop="emit('delete-task', task.id)"
                        >
                            <FontAwesomeIcon icon="fa-solid fa-trash" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
