import api from '@/api/axios';
import { API_ENDPOINTS, CACHE_CONFIG } from '@/constants/api';
import type { TaskSummary, TaskDetail } from '@/types/tasks';
import type { EntityId } from '@/types/common';

export const taskService = {
    async getTasks(eventId?: EntityId): Promise<TaskSummary[]> {
        const response = await api.get<TaskSummary[]>(API_ENDPOINTS.TASKS.BASE, {
            params: { eventId, _t: Date.now() },
            headers: CACHE_CONFIG.NO_CACHE_HEADERS,
        });
        return response.data;
    },

    async getTaskById(id: EntityId): Promise<TaskDetail> {
        const response = await api.get<TaskDetail>(API_ENDPOINTS.TASKS.BY_ID(id), {
            params: { _t: Date.now() },
            headers: CACHE_CONFIG.NO_CACHE_HEADERS,
        });
        return response.data;
    },

    async createTask(taskData: Omit<TaskSummary, 'id' | 'completed'> & { eventId: EntityId }): Promise<TaskSummary> {
        const response = await api.post<TaskSummary>(API_ENDPOINTS.TASKS.BASE, taskData);
        return response.data;
    },

    async updateTask(id: EntityId, taskData: Partial<TaskSummary>): Promise<TaskSummary> {
        const response = await api.put<TaskSummary>(API_ENDPOINTS.TASKS.BY_ID(id), taskData);
        return response.data;
    },

    async deleteTask(id: EntityId): Promise<void> {
        await api.delete(API_ENDPOINTS.TASKS.BY_ID(id));
    },

    async toggleTask(id: EntityId): Promise<void> {
        await api.post(API_ENDPOINTS.TASKS.TOGGLE(id));
    },

    async assignTask(id: EntityId, userId: EntityId | undefined, description: string): Promise<TaskSummary> {
        return this.updateTask(id, { assignedToId: userId, description });
    },
};
