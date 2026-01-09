import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useEventStore } from '@/stores/event';
import type { UserDetail } from '@/types/users';
import type { EntityId } from '@/types/common';
import { adminService } from '@/services/adminService';
import mockUsersData from '@/assets/mocks/users.json';

export interface AdminStats {
    health: HealthResponse;
    metrics: {
        uptime: number;
        processCpuUsage: number;
        systemCpuUsage: number;
        memoryUsed: number;
        memoryMax: number;
    };
    usage: {
        topEndpoints: Array<{
            uri: string;
            count: number;
            totalTime: number;
        }>;
    };
    kpis: {
        totalUsers: number;
        totalEvents: number;
        taskCompletionRate: number;
        activeOrganizers: number;
    };
}

export interface HealthResponse {
    status: string;
    components?: {
        db?: { status: string };
        diskSpace?: { status: string; details?: { total: number; free: number; threshold: number; exists: boolean } };
    };
}

export interface MetricResponse {
    name: string;
    description?: string;
    baseUnit?: string;
    measurements: Array<{ statistic: string; value: number }>;
    availableTags?: Array<{ tag: string; values: string[] }>;
}

// --- Helper Functions (Outer Scope) ---

function processMetrics(
    uptimeMetric: MetricResponse,
    cpuProcessMetric: MetricResponse,
    cpuSystemMetric: MetricResponse,
    memoryUsedMetric: MetricResponse,
    memoryMaxMetric: MetricResponse,
) {
    return {
        uptime: uptimeMetric?.measurements?.[0]?.value || 0,
        processCpuUsage: cpuProcessMetric?.measurements?.[0]?.value || 0,
        systemCpuUsage: cpuSystemMetric?.measurements?.[0]?.value || 0,
        memoryUsed: memoryUsedMetric?.measurements?.[0]?.value || 0,
        memoryMax: memoryMaxMetric?.measurements?.[0]?.value || 0,
    };
}

function calculateKPIs(
    adminStats: {
        totalUsers: number;
        totalEvents: number;
        taskCompletionRate: number;
        activeOrganizers: number;
    } | null,
    eventStore: ReturnType<typeof useEventStore>,
    usersCount: number,
) {
    let taskCompletionRate = 0;
    if (adminStats) {
        taskCompletionRate = Math.round(adminStats.taskCompletionRate * 100);
    } else if (eventStore.stats.totalTasks > 0) {
        taskCompletionRate = Math.round((eventStore.stats.completedTasks / eventStore.stats.totalTasks) * 100);
    }

    return {
        totalUsers: adminStats?.totalUsers || usersCount || 0,
        totalEvents: adminStats?.totalEvents || eventStore.events.length || 0,
        taskCompletionRate,
        activeOrganizers: adminStats?.activeOrganizers || 0,
    };
}

export const useAdminStore = defineStore('admin', () => {
    const stats = ref<AdminStats | null>(null);
    const users = ref<UserDetail[]>([]);
    const loading = ref(false);

    async function fetchUsers() {
        loading.value = true;
        try {
            users.value = await adminService.getUsers();
        } catch (error) {
            console.error('Failed to fetch users:', error);
            if (users.value.length === 0) {
                users.value = mockUsersData as UserDetail[];
            }
        } finally {
            loading.value = false;
        }
    }

    async function createUser(userData: Partial<UserDetail>) {
        loading.value = true;
        try {
            const newUser = await adminService.createUser(userData);
            users.value.push(newUser);
            return newUser;
        } finally {
            loading.value = false;
        }
    }

    async function updateUser(id: EntityId, userData: Partial<UserDetail>) {
        loading.value = true;
        try {
            const updatedUser = await adminService.updateUser(id, userData);
            const index = users.value.findIndex((u) => String(u.id) === String(id));
            if (index !== -1) users.value[index] = updatedUser;
            return updatedUser;
        } finally {
            loading.value = false;
        }
    }

    async function deleteUser(id: EntityId) {
        loading.value = true;
        try {
            await adminService.deleteUser(id);
            users.value = users.value.filter((u) => String(u.id) !== String(id));
        } finally {
            loading.value = false;
        }
    }

    async function fetchAdminStats() {
        loading.value = true;
        try {
            const [
                health,
                adminStats,
                uptimeMetric,
                cpuProcessMetric,
                cpuSystemMetric,
                memoryUsedMetric,
                memoryMaxMetric,
                requestMetricBase,
            ] = await Promise.all([
                adminService
                    .getHealth()
                    .catch(() => ({ status: 'UP', components: { db: { status: 'UP' }, diskSpace: { status: 'UP' } } })),
                adminService.getAdminStats().catch(() => null),
                adminService
                    .getMetric('process.uptime')
                    .catch(() => ({ name: 'process.uptime', measurements: [{ statistic: 'VALUE', value: 0 }] })),
                adminService
                    .getMetric('process.cpu.usage')
                    .catch(() => ({ name: 'process.cpu.usage', measurements: [{ statistic: 'VALUE', value: 0 }] })),
                adminService
                    .getMetric('system.cpu.usage')
                    .catch(() => ({ name: 'system.cpu.usage', measurements: [{ statistic: 'VALUE', value: 0 }] })),
                adminService
                    .getMetric('jvm.memory.used')
                    .catch(() => ({ name: 'jvm.memory.used', measurements: [{ statistic: 'VALUE', value: 0 }] })),
                adminService
                    .getMetric('jvm.memory.max')
                    .catch(() => ({ name: 'jvm.memory.max', measurements: [{ statistic: 'VALUE', value: 0 }] })),
                adminService
                    .getMetric('http.server.requests')
                    .catch(() => ({ name: 'http.server.requests', measurements: [], availableTags: [] })),
            ]);

            const metrics = processMetrics(
                uptimeMetric,
                cpuProcessMetric,
                cpuSystemMetric,
                memoryUsedMetric,
                memoryMaxMetric,
            );

            // Fetch details for top URIs if available, filtering out path variables
            const uriTag = requestMetricBase.availableTags?.find(
                (t: { tag: string; values: string[] }) => t.tag === 'uri',
            );
            const filteredUris = uriTag
                ? uriTag.values.filter((uri: string) => !uri.includes('{') && !uri.includes('}'))
                : ['/api/events', '/api/tasks', '/api/me', '/api/auth/login'];

            const topUris = filteredUris.slice(0, 5);

            const endpointMetrics = await Promise.all(
                topUris.map(async (uri: string) => {
                    try {
                        const data = await adminService.getRequestMetrics(uri);
                        const count =
                            data.measurements.find((m: { statistic: string; value: number }) => m.statistic === 'COUNT')
                                ?.value || 0;
                        const totalTime =
                            data.measurements.find(
                                (m: { statistic: string; value: number }) => m.statistic === 'TOTAL_TIME',
                            )?.value || 0;
                        return { uri, count, totalTime };
                    } catch {
                        return { uri, count: 0, totalTime: 0 };
                    }
                }),
            );

            const usage = {
                topEndpoints: endpointMetrics.sort((a, b) => b.count - a.count),
            };

            const kpis = calculateKPIs(adminStats, useEventStore(), users.value.length);

            stats.value = { health, metrics, usage, kpis };
        } catch (error) {
            console.error('Failed to fetch admin stats:', error);
        } finally {
            loading.value = false;
        }
    }

    return { stats, users, loading, fetchAdminStats, fetchUsers, createUser, updateUser, deleteUser };
});
