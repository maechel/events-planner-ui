<script setup lang="ts">
import Tag from 'primevue/tag';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

type PropTypes = {
    health: {
        status: string;
        components?: {
            db?: { status: string };
            diskSpace?: { status: string };
        };
    };
};

defineProps<PropTypes>();
</script>

<template>
    <div
        class="bg-surface-0 dark:bg-surface-900 p-10 rounded-[2.5rem] border border-surface-200 dark:border-surface-800 shadow-sm"
    >
        <h2 class="text-2xl font-black mb-10 tracking-tight">Component Health</h2>
        <div class="space-y-6">
            <div
                v-if="health.components?.db"
                class="flex items-center justify-between p-6 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700/50 hover:scale-[1.02] transition-transform"
            >
                <div class="flex items-center gap-5">
                    <span
                        class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400"
                    >
                        <FontAwesomeIcon
                            icon="fa-solid fa-database"
                            size="lg"
                        />
                    </span>
                    <span class="font-black text-xl">Database</span>
                </div>
                <Tag
                    :value="health.components.db.status === 'UP' ? 'Healthy' : 'Issues'"
                    :severity="health.components.db.status === 'UP' ? 'success' : 'danger'"
                    class="px-4 font-black uppercase tracking-widest text-xs"
                />
            </div>
            <div
                v-if="health.components?.diskSpace"
                class="flex items-center justify-between p-6 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700/50 hover:scale-[1.02] transition-transform"
            >
                <div class="flex items-center gap-5">
                    <span
                        class="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400"
                    >
                        <FontAwesomeIcon
                            icon="fa-solid fa-server"
                            size="lg"
                        />
                    </span>
                    <span class="font-black text-xl">Disk Space</span>
                </div>
                <Tag
                    :value="health.components.diskSpace.status === 'UP' ? 'Sufficient' : 'Low Space'"
                    :severity="health.components.diskSpace.status === 'UP' ? 'success' : 'danger'"
                    class="px-4 font-black uppercase tracking-widest text-xs"
                />
            </div>
            <div
                v-if="!health.components?.db && !health.components?.diskSpace"
                class="text-center py-4 italic text-surface-400"
            >
                No component details available
            </div>
        </div>
    </div>
</template>
