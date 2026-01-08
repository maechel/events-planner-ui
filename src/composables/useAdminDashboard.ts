import { computed, type Ref } from 'vue';
import type { AdminStats } from '@/stores/admin';

export function useAdminDashboard(stats: Ref<AdminStats | null>) {
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatUptime = (seconds: number) => {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        return `${days}d ${hours}h ${mins}m`;
    };

    const memoryMeterData = computed(() => {
        if (!stats.value) return [];
        const used = stats.value.metrics.memoryUsed;
        const max = stats.value.metrics.memoryMax;
        const percentage = Math.round((used / max) * 100);
        return [{ label: 'Used', color: '#3b82f6', value: percentage, icon: 'fa-solid fa-microchip' }];
    });

    return {
        formatBytes,
        formatUptime,
        memoryMeterData,
    };
}
