<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useEventStore } from '@/stores/event';
import { useAuthStore } from '@/stores/auth';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import DashboardStats from '@/components/dashboard/DashboardStats.vue';
import DashboardUrgentTasks from '@/components/dashboard/DashboardUrgentTasks.vue';
import DashboardCharts from '@/components/dashboard/DashboardCharts.vue';
import DashboardTimeline from '@/components/dashboard/DashboardTimeline.vue';

const eventStore = useEventStore();
const authStore = useAuthStore();
const { stats, nearingDueTasks, eventsByMonth, eventsInComingYear, loading } = storeToRefs(eventStore);
const { user } = storeToRefs(authStore);

onMounted(async () => {
    await Promise.all([eventStore.fetchEvents(), eventStore.fetchTasks()]);
});
</script>

<template>
    <div class="p-6 sm:p-10 max-w-[1600px] mx-auto space-y-10">
        <header>
            <h1 class="text-3xl sm:text-4xl font-black text-surface-900 dark:text-surface-0 tracking-tight">
                Welcome back, {{ user?.username }}!
            </h1>
            <p class="text-surface-500 mt-2 text-base sm:text-lg font-medium">
                Here's what's happening with your events.
            </p>
        </header>

        <div
            v-if="loading && !stats.totalEvents"
            class="flex justify-center py-20"
        >
            <FontAwesomeIcon
                icon="fa-solid fa-circle-notch"
                spin
                size="3x"
                class="text-primary"
            />
        </div>

        <div
            v-else
            class="flex flex-col gap-16 sm:gap-20"
        >
            <DashboardStats :stats="stats" />
            <DashboardUrgentTasks :tasks="nearingDueTasks" />
            <DashboardCharts
                :participantsPerEvent="stats.participantsPerEvent"
                :eventsByMonth="eventsByMonth"
            />
            <DashboardTimeline :eventsInComingYear="eventsInComingYear" />
        </div>
    </div>
</template>
