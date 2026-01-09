<script setup lang="ts">
import { DATE_FORMATS } from '@/constants/ui';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Timeline from 'primevue/timeline';
import { format, parseISO } from 'date-fns';
import type { EventSummary } from '@/types/events';

type PropTypes = {
    eventsInComingYear: EventSummary[];
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
                class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500"
            >
                <FontAwesomeIcon icon="fa-solid fa-calendar-days" />
            </span>
            Event Timeline (Coming Year)
        </h2>
        <div
            class="bg-surface-0 dark:bg-surface-900 p-10 rounded-[2.5rem] border border-surface-200 dark:border-surface-800 shadow-sm overflow-x-auto"
        >
            <div
                v-if="eventsInComingYear.length === 0"
                class="text-center py-10"
            >
                <p class="text-surface-500 text-lg">No events scheduled for the coming year.</p>
            </div>
            <Timeline
                v-else
                :value="eventsInComingYear"
                layout="horizontal"
                class="customized-timeline"
            >
                <template #marker>
                    <span
                        class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm bg-primary border-2 border-surface-0 dark:border-surface-900"
                    >
                        <FontAwesomeIcon
                            icon="fa-solid fa-calendar-check"
                            size="xs"
                        />
                    </span>
                </template>
                <template #content="slotProps">
                    <div
                        @click="router.push(`/events/${slotProps.item.id}`)"
                        class="p-4 cursor-pointer group whitespace-nowrap min-w-[150px]"
                    >
                        <div class="text-xs font-black text-primary uppercase tracking-widest mb-1">
                            {{ formatDate(slotProps.item.date) }}
                        </div>
                        <div
                            class="text-base font-black text-surface-900 dark:text-surface-0 group-hover:text-primary transition-colors truncate"
                        >
                            {{ slotProps.item.title }}
                        </div>
                    </div>
                </template>
            </Timeline>
        </div>
    </div>
</template>

<style scoped>
:deep(.p-timeline-event-opposite) {
    display: none;
}

:deep(.p-timeline-event-connector) {
    background-color: var(--p-primary-600);
}

:deep(.p-timeline-horizontal .p-timeline-event-connector) {
    height: 2px;
    top: 50%;
    transform: translateY(-50%);
}

:deep(.p-timeline-event) {
    min-width: 150px;
}

:deep(.p-timeline-event-marker) {
    border: none;
    background: transparent;
    padding: 0;
}

@media screen and (max-width: 960px) {
    :deep(.customized-timeline .p-timeline-event:nth-child(even)) {
        flex-direction: row;
    }
}
</style>
