<script setup lang="ts">
import type { EventSummary } from '@/types/events';
import type { EntityId } from '@/types/common';
import EventCard from './EventCard.vue';

type PropTypes = {
    title: string;
    events: EventSummary[];
    isPassed?: boolean;
};

type EmitTypes = {
    'view-details': [id: EntityId];
};

defineProps<PropTypes>();
const emit = defineEmits<EmitTypes>();
</script>

<template>
    <section v-if="events.length > 0">
        <h2
            class="text-2xl font-black mb-8 flex items-center gap-3"
            :class="isPassed ? 'text-surface-400 dark:text-surface-500' : 'text-surface-900 dark:text-surface-0'"
        >
            <div
                class="w-2 h-8 rounded-full"
                :class="isPassed ? 'bg-surface-300 dark:bg-surface-600' : 'bg-primary'"
            ></div>
            {{ title }}
        </h2>
        <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            :class="{ 'opacity-70 hover:opacity-100 transition-opacity duration-500': isPassed }"
        >
            <EventCard
                v-for="event in events"
                :key="event.id"
                :event="event"
                :isPassed="isPassed"
                @view-details="emit('view-details', $event)"
            />
        </div>
    </section>
</template>
