<script setup lang="ts">
type PropTypes = {
    stats: {
        totalEvents: number;
        totalTasks: number;
        completedTasks: number;
    };
};

defineProps<PropTypes>();
</script>

<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
            class="bg-surface-0 dark:bg-surface-900 p-8 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-sm transition-all hover:shadow-lg"
        >
            <span class="block text-5xl font-black text-primary mb-2 tracking-tighter">{{ stats.totalEvents }}</span>
            <span class="text-xs font-black text-surface-400 uppercase tracking-[0.2em]">Total Events</span>
        </div>
        <div
            class="bg-surface-0 dark:bg-surface-900 p-8 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-sm transition-all hover:shadow-lg"
        >
            <span class="block text-5xl font-black text-primary mb-2 tracking-tighter">{{ stats.totalTasks }}</span>
            <span class="text-xs font-black text-surface-400 uppercase tracking-[0.2em]">Total Tasks</span>
        </div>
        <div
            class="bg-surface-0 dark:bg-surface-900 p-8 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-sm transition-all hover:shadow-lg"
        >
            <span class="block text-5xl font-black text-green-500 mb-2 tracking-tighter">{{
                stats.completedTasks
            }}</span>
            <span class="text-xs font-black text-surface-400 uppercase tracking-[0.2em]">Completed</span>
        </div>
        <div
            class="bg-surface-0 dark:bg-surface-900 p-8 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-sm transition-all hover:shadow-lg"
        >
            <span class="block text-5xl font-black text-orange-500 mb-2 tracking-tighter">{{
                stats.totalTasks - stats.completedTasks
            }}</span>
            <span class="text-xs font-black text-surface-400 uppercase tracking-[0.2em]">Pending</span>
        </div>
    </div>
</template>
