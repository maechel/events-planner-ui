<script setup lang="ts">
import Chart from 'primevue/chart';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { ChartData, ChartOptions } from 'chart.js';

type PropTypes = {
    chartData: ChartData;
    chartOptions: ChartOptions;
};

defineProps<PropTypes>();
</script>

<template>
    <div
        class="lg:col-span-2 bg-surface-0 dark:bg-surface-900 p-10 rounded-[2.5rem] border border-surface-200 dark:border-surface-800 shadow-sm"
    >
        <div class="flex items-center justify-between mb-12">
            <h2 class="text-3xl font-black tracking-tight">Top API Endpoints</h2>
            <span class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <FontAwesomeIcon
                    icon="fa-solid fa-server"
                    class="text-primary text-xl"
                />
            </span>
        </div>
        <div class="h-125">
            <Chart
                type="bar"
                :data="chartData"
                :options="chartOptions"
                class="h-full w-full"
            />
        </div>
    </div>
</template>

<style scoped>
:deep(.p-chart) {
    height: 100% !important;
}
</style>
