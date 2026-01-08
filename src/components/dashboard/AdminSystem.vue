<script setup lang="ts">
import MeterGroup from 'primevue/metergroup';
import ProgressBar from 'primevue/progressbar';

type PropTypes = {
    metrics: {
        uptime: number;
        processCpuUsage: number;
        systemCpuUsage: number;
        memoryUsed: number;
        memoryMax: number;
    };
    memoryMeterData: Array<{ label: string; color: string; value: number; icon: string }>;
    formatBytes: (bytes: number) => string;
    formatUptime: (seconds: number) => string;
};

defineProps<PropTypes>();
</script>

<template>
    <div
        class="bg-surface-0 dark:bg-surface-900 p-10 rounded-[2.5rem] border border-surface-200 dark:border-surface-800 shadow-sm"
    >
        <h2 class="text-2xl font-black mb-10 tracking-tight">System Resources</h2>
        <div class="space-y-12">
            <!-- Memory -->
            <div class="space-y-4">
                <div class="flex justify-between text-sm font-black uppercase tracking-widest">
                    <span class="text-surface-400">Memory Usage</span>
                    <span class="font-mono text-primary"
                        >{{ formatBytes(metrics.memoryUsed) }} / {{ formatBytes(metrics.memoryMax) }}</span
                    >
                </div>
                <MeterGroup
                    :value="memoryMeterData"
                    label-position="end"
                />
            </div>

            <!-- CPU -->
            <div class="space-y-8">
                <div class="space-y-4">
                    <div class="flex justify-between text-sm font-black uppercase tracking-widest">
                        <span class="text-surface-400">Process CPU</span>
                        <span class="text-primary">{{ (metrics.processCpuUsage * 100).toFixed(1) }}%</span>
                    </div>
                    <ProgressBar
                        :value="metrics.processCpuUsage * 100"
                        :show-value="false"
                        class="h-2 rounded-full"
                    />
                </div>
                <div class="space-y-4">
                    <div class="flex justify-between text-sm font-black uppercase tracking-widest">
                        <span class="text-surface-400">System CPU</span>
                        <span class="text-primary">{{ (metrics.systemCpuUsage * 100).toFixed(1) }}%</span>
                    </div>
                    <ProgressBar
                        :value="metrics.systemCpuUsage * 100"
                        :show-value="false"
                        class="h-2 rounded-full"
                    />
                </div>
            </div>

            <div class="pt-8 border-t border-surface-100 dark:border-surface-800">
                <div class="flex justify-between items-center">
                    <span class="text-sm font-black text-surface-400 uppercase tracking-[0.2em]">Uptime</span>
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span class="font-mono text-primary font-black text-2xl tracking-tighter">{{
                            formatUptime(metrics.uptime)
                        }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
