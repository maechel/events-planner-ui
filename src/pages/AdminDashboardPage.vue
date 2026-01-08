<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAdminStore } from '@/stores/admin';
import { useAdminDashboard } from '@/composables/useAdminDashboard';
import AdminCharts from '@/components/dashboard/AdminCharts.vue';
import AdminHealth from '@/components/dashboard/AdminHealth.vue';
import AdminSystem from '@/components/dashboard/AdminSystem.vue';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { ChartData, ChartOptions } from 'chart.js';

const adminStore = useAdminStore();
const { stats, loading } = storeToRefs(adminStore);
const { formatBytes, formatUptime, memoryMeterData } = useAdminDashboard(stats);

onMounted(() => {
    adminStore.fetchAdminStats();
});

const chartData = computed<ChartData>(() => {
    if (!stats.value) return { labels: [], datasets: [] };
    return {
        labels: stats.value.usage.topEndpoints.map((e) => e.uri),
        datasets: [
            {
                label: 'Hits',
                data: stats.value.usage.topEndpoints.map((e) => e.count),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1,
            },
        ],
    };
});

const chartOptions = ref<ChartOptions>({
    indexAxis: 'y',
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            callbacks: {
                label: function (context) {
                    const endpoint = adminStore.stats?.usage.topEndpoints[context.dataIndex];
                    if (endpoint) {
                        const avgTime =
                            endpoint.count > 0 ? ((endpoint.totalTime / endpoint.count) * 1000).toFixed(2) : 0;
                        return [`Hits: ${endpoint.count}`, `Avg Time: ${avgTime}ms`];
                    }
                    return `Hits: ${context.raw}`;
                },
            },
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
            title: {
                display: true,
                text: 'Request Count',
            },
        },
        y: {
            grid: {
                display: false,
            },
        },
    },
});
</script>

<template>
    <div class="min-h-screen bg-surface-50 dark:bg-surface-950 p-6 sm:p-10">
        <div class="max-w-[1600px] mx-auto flex flex-col gap-16 sm:gap-20">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                <div>
                    <h1 class="text-3xl sm:text-4xl font-black text-surface-900 dark:text-surface-0 tracking-tight">
                        Admin Dashboard
                    </h1>
                    <p class="text-surface-500 mt-2 text-base sm:text-lg font-medium">
                        System monitoring and application statistics
                    </p>
                </div>
                <div class="flex items-center gap-4">
                    <Tag
                        :value="stats?.health.status === 'UP' ? 'Healthy' : 'Issues Detected'"
                        :severity="stats?.health.status === 'UP' ? 'success' : 'danger'"
                        class="px-8 py-3 text-sm font-black shadow-sm uppercase tracking-widest"
                    />
                    <Button
                        rounded
                        variant="outlined"
                        @click="adminStore.fetchAdminStats()"
                        :loading="loading"
                        class="shadow-sm w-12 h-12 text-surface-600 dark:text-surface-0"
                    >
                        <FontAwesomeIcon icon="fa-solid fa-arrows-rotate" />
                    </Button>
                </div>
            </div>

            <!-- Loading State -->
            <div
                v-if="loading && !stats"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
            >
                <Skeleton
                    v-for="i in 4"
                    :key="i"
                    height="10rem"
                    class="rounded-[2rem]"
                />
            </div>

            <template v-else-if="stats">
                <!-- KPIs -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    <div
                        class="bg-surface-0 dark:bg-surface-900 p-8 rounded-[2rem] border border-surface-200 dark:border-surface-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group"
                    >
                        <div class="flex items-center gap-6">
                            <div
                                class="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner group-hover:scale-110 transition-transform"
                            >
                                <FontAwesomeIcon
                                    icon="fa-solid fa-users"
                                    size="2xl"
                                />
                            </div>
                            <div>
                                <p class="text-xs font-black text-surface-400 uppercase tracking-[0.2em] mb-1">
                                    Total Users
                                </p>
                                <p class="text-4xl font-black text-surface-900 dark:text-surface-0 tracking-tighter">
                                    {{ stats.kpis.totalUsers }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        class="bg-surface-0 dark:bg-surface-900 p-8 rounded-[2rem] border border-surface-200 dark:border-surface-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group"
                    >
                        <div class="flex items-center gap-6">
                            <div
                                class="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-inner group-hover:scale-110 transition-transform"
                            >
                                <FontAwesomeIcon
                                    icon="fa-solid fa-calendar-days"
                                    size="2xl"
                                />
                            </div>
                            <div>
                                <p class="text-xs font-black text-surface-400 uppercase tracking-[0.2em] mb-1">
                                    Total Events
                                </p>
                                <p class="text-4xl font-black text-surface-900 dark:text-surface-0 tracking-tighter">
                                    {{ stats.kpis.totalEvents }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        class="bg-surface-0 dark:bg-surface-900 p-8 rounded-[2rem] border border-surface-200 dark:border-surface-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group"
                    >
                        <div class="flex items-center gap-6">
                            <div
                                class="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 shadow-inner group-hover:scale-110 transition-transform"
                            >
                                <FontAwesomeIcon
                                    icon="fa-solid fa-list-check"
                                    size="2xl"
                                />
                            </div>
                            <div>
                                <p class="text-xs font-black text-surface-400 uppercase tracking-[0.2em] mb-1">
                                    Task Completion
                                </p>
                                <p class="text-4xl font-black text-surface-900 dark:text-surface-0 tracking-tighter">
                                    {{ stats.kpis.taskCompletionRate }}%
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        class="bg-surface-0 dark:bg-surface-900 p-8 rounded-4xl border border-surface-200 dark:border-surface-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group"
                    >
                        <div class="flex items-center gap-6">
                            <div
                                class="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-inner group-hover:scale-110 transition-transform"
                            >
                                <FontAwesomeIcon
                                    icon="fa-solid fa-user-gear"
                                    size="2xl"
                                />
                            </div>
                            <div>
                                <p class="text-xs font-black text-surface-400 uppercase tracking-[0.2em] mb-1">
                                    Active Organizers
                                </p>
                                <p class="text-4xl font-black text-surface-900 dark:text-surface-0 tracking-tighter">
                                    {{ stats.kpis.activeOrganizers }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Content Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <!-- Left: Usage Stats -->
                    <AdminCharts
                        :chart-data="chartData"
                        :chart-options="chartOptions"
                    />

                    <!-- Right: Health & System -->
                    <div class="space-y-12">
                        <!-- Health Status -->
                        <AdminHealth :health="stats.health" />

                        <!-- System Metrics -->
                        <AdminSystem
                            :metrics="stats.metrics"
                            :memory-meter-data="memoryMeterData"
                            :format-bytes="formatBytes"
                            :format-uptime="formatUptime"
                        />
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
:deep(.p-chart) {
    height: 100% !important;
}
</style>
