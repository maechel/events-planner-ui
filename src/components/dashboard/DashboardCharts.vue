<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

type PropTypes = {
    participantsPerEvent: { title: string; count: number }[];
    eventsByMonth: Record<string, number>;
};

defineProps<PropTypes>();
</script>

<template>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
            <h2 class="text-2xl font-black mb-8 flex items-center gap-3 tracking-tight">
                <span
                    class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-orange-900/30 flex items-center justify-center text-blue-500"
                >
                    <FontAwesomeIcon icon="fa-solid fa-users" />
                </span>
                Participation
            </h2>
            <div
                class="bg-surface-0 dark:bg-surface-900 p-8 rounded-3xl border border-surface-200 dark:border-surface-800 space-y-8 shadow-sm h-full"
            >
                <div
                    v-for="event in participantsPerEvent"
                    :key="event.title"
                    class="space-y-4"
                >
                    <div class="flex justify-between text-sm">
                        <span class="truncate pr-2 font-black text-surface-700 dark:text-surface-200">{{
                            event.title
                        }}</span>
                        <span class="text-primary font-black">{{ event.count }} members</span>
                    </div>
                    <div class="w-full bg-surface-100 dark:bg-surface-800 rounded-full h-3 overflow-hidden">
                        <div
                            class="bg-primary h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            :style="{ width: `${Math.min(100, (event.count / 20) * 100)}%` }"
                        ></div>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <h2 class="text-2xl font-black mb-8 flex items-center gap-3 tracking-tight">
                <span class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <FontAwesomeIcon icon="fa-solid fa-chart-line" />
                </span>
                Events per Month
            </h2>
            <div
                class="bg-surface-0 dark:bg-surface-900 p-8 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-sm h-full"
            >
                <div class="space-y-6">
                    <div
                        v-for="(count, month) in eventsByMonth"
                        :key="month"
                        class="flex items-center gap-6"
                    >
                        <span class="text-sm font-black font-mono w-20 text-surface-400">{{ month }}</span>
                        <div class="flex-1 flex items-center gap-3">
                            <div
                                class="bg-primary/10 h-10 rounded-xl border border-primary/20 flex items-center px-4 transition-all hover:bg-primary/20"
                                :style="{ width: `${(count / Math.max(...Object.values(eventsByMonth))) * 100}%` }"
                            >
                                <span class="text-sm font-black text-primary">{{ count }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
