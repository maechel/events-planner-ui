<script setup lang="ts">
import { DATE_FORMATS } from '@/constants/ui';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Card from 'primevue/card';
import { format, parseISO } from 'date-fns';
import { computed } from 'vue';
import type { EventSummaryDTO } from '@/types/events';
import type { EntityId } from '@/types/common';

type PropTypes = {
    event: EventSummaryDTO;
    isPassed?: boolean;
};

type EmitTypes = {
    'view-details': [id: EntityId];
};

const props = defineProps<PropTypes>();
const emit = defineEmits<EmitTypes>();

const participantCount = computed(() => {
    if (props.event.participantCount !== undefined && props.event.participantCount !== null) {
        return props.event.participantCount;
    }
    return (props.event.organizers?.length || 0) + (props.event.members?.length || 0);
});

const taskCount = computed(() => {
    if (props.event.taskCount !== undefined && props.event.taskCount !== null) {
        return props.event.taskCount;
    }
    return props.event.tasks?.length || 0;
});

const formatDate = (dateString: string) => {
    return format(parseISO(dateString), DATE_FORMATS.DEFAULT);
};
</script>

<template>
    <Card
        class="h-full overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl group cursor-default flex flex-col"
        :class="{ grayscale: isPassed }"
    >
        <template #header>
            <div
                class="h-48 bg-linear-to-br from-primary via-primary-emphasis to-primary-dark flex items-center justify-center text-white relative overflow-hidden"
                :class="{ 'from-surface-400 via-surface-500 to-surface-600': isPassed }"
            >
                <FontAwesomeIcon
                    :icon="isPassed ? 'fa-solid fa-clock-rotate-left' : 'fa-solid fa-calendar-days'"
                    size="5x"
                    class="opacity-10 absolute -right-6 -bottom-6 rotate-12 transition-transform group-hover:scale-125 group-hover:rotate-6 duration-700"
                />
                <div
                    class="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center relative z-10 shadow-xl border border-white/30 group-hover:scale-110 transition-transform duration-500"
                >
                    <FontAwesomeIcon
                        :icon="isPassed ? 'fa-solid fa-calendar-check' : 'fa-solid fa-calendar-days'"
                        size="3x"
                    />
                </div>
                <div
                    v-if="event.hasUnfinishedTasks"
                    class="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white rounded-xl shadow-lg"
                    :class="{ 'animate-pulse': !isPassed }"
                >
                    <FontAwesomeIcon
                        icon="fa-solid fa-circle-exclamation"
                        class="text-xs"
                    />
                    <span class="text-[10px] font-black uppercase tracking-tighter">{{
                        isPassed ? 'Incomplete' : 'Tasks Pending'
                    }}</span>
                </div>
            </div>
        </template>
        <template #title>
            <div
                class="text-2xl font-black text-surface-900 dark:text-surface-0 tracking-tight group-hover:text-primary transition-colors"
            >
                {{ event.title }}
            </div>
        </template>
        <template #subtitle>
            <div
                class="flex items-center gap-2 text-primary font-black mt-2 uppercase tracking-widest text-xs"
                :class="{ 'text-surface-500': isPassed }"
            >
                <FontAwesomeIcon icon="fa-solid fa-calendar-day" />
                {{ formatDate(event.date) }}
            </div>
        </template>
        <template #content>
            <div class="flex flex-col h-full gap-4">
                <p class="text-surface-500 dark:text-surface-400 line-clamp-2 leading-relaxed font-medium">
                    {{ event.description }}
                </p>
                <div class="flex items-center gap-4 text-xs font-black">
                    <span
                        class="flex items-center gap-2 px-4 py-2 bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 rounded-xl"
                    >
                        <FontAwesomeIcon
                            icon="fa-solid fa-users"
                            class="text-primary"
                            :class="{ 'text-surface-400': isPassed }"
                        />
                        {{ participantCount }}
                    </span>
                    <span
                        class="flex items-center gap-2 px-4 py-2 bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 rounded-xl"
                    >
                        <FontAwesomeIcon
                            icon="fa-solid fa-list-check"
                            class="text-primary"
                            :class="{ 'text-surface-400': isPassed }"
                        />
                        {{ taskCount }}
                        Tasks
                    </span>
                </div>
                <div class="mt-auto pt-2">
                    <Button
                        :label="isPassed ? 'View Recap' : 'Manage Event'"
                        :icon="isPassed ? 'fa-solid fa-eye' : 'fa-solid fa-arrow-right'"
                        iconPos="right"
                        class="w-full py-4 rounded-2xl font-black transition-all"
                        :variant="isPassed ? 'outlined' : undefined"
                        :severity="isPassed ? 'secondary' : 'primary'"
                        @click="emit('view-details', event.id)"
                    />
                </div>
            </div>
        </template>
    </Card>
</template>
