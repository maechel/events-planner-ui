<script setup lang="ts">
import { DATE_FORMATS } from '@/constants/ui';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Tag from 'primevue/tag';
import { format, parseISO } from 'date-fns';
import type { Task } from '@/stores/event';
import { getUrgencySeverity } from '@/utils/formatters';
import type { EntityId } from '@/types/common';

type PropTypes = {
    tasks: { eventTitle: string; eventId: EntityId; task: Task }[];
};

defineProps<PropTypes>();

const router = useRouter();

const formatDate = (dateString: string) => {
    return format(parseISO(dateString), DATE_FORMATS.DEFAULT);
};
</script>

<template>
    <div class="w-full">
        <h2 class="text-2xl font-black mb-8 flex items-center gap-3 tracking-tight">
            <span
                class="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500"
            >
                <FontAwesomeIcon icon="fa-solid fa-clock" />
            </span>
            Tasks Nearing Due Date
        </h2>
        <div
            v-if="tasks.length === 0"
            class="bg-surface-0 dark:bg-surface-900 rounded-3xl p-12 text-center border-2 border-dashed border-surface-200 dark:border-surface-800"
        >
            <p class="text-surface-500 text-lg">No urgent tasks at the moment. Good job!</p>
        </div>
        <div
            v-else
            class="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            <div
                v-for="item in tasks"
                :key="item.task.id"
                @click="router.push(`/events/${item.eventId}`)"
                class="bg-surface-0 dark:bg-surface-900 p-6 rounded-2xl border border-surface-200 dark:border-surface-800 flex items-center justify-between hover:border-primary hover:shadow-md transition-all cursor-pointer group"
            >
                <div class="flex flex-col gap-1.5">
                    <span
                        class="text-lg font-black text-surface-900 dark:text-surface-0 group-hover:text-primary transition-colors"
                    >
                        {{ item.task.description }}
                    </span>
                    <span class="text-sm font-bold text-surface-500 flex items-center gap-2">
                        <FontAwesomeIcon
                            icon="fa-solid fa-calendar-days"
                            class="text-xs"
                        />
                        {{ item.eventTitle }}
                    </span>
                </div>
                <div class="flex items-center gap-4">
                    <Tag
                        :value="formatDate(item.task.dueDate!)"
                        :severity="getUrgencySeverity(item.task.dueDate!)"
                        class="px-4 py-1.5 font-black"
                    />
                    <FontAwesomeIcon
                        icon="fa-solid fa-chevron-right"
                        class="text-surface-300 group-hover:text-primary transform group-hover:translate-x-1 transition-all"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
