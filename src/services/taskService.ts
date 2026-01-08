import api from '@/api/axios';
import { API_ENDPOINTS, CACHE_CONFIG } from '@/constants/api';
import type { TaskSummaryDTO, TaskDetailDTO } from '@/types/tasks';
import type { EntityId } from '@/types/common';

export const taskService = {
    async getTasks(eventId?: EntityId): Promise<TaskSummaryDTO[]> {
        const response = await api.get<TaskSummaryDTO[]>(API_ENDPOINTS.TASKS.BASE, {
            params: { eventId, _t: Date.now() },
            headers: CACHE_CONFIG.NO_CACHE_HEADERS,
        });
        return response.data;
    },

    async getTaskById(id: EntityId): Promise<TaskDetailDTO> {
        const response = await api.get<TaskDetailDTO>(API_ENDPOINTS.TASKS.BY_ID(id), {
            params: { _t: Date.now() },
            headers: CACHE_CONFIG.NO_CACHE_HEADERS,
        });
        return response.data;
    },

    async createTask(
        taskData: Omit<TaskSummaryDTO, 'id' | 'completed'> & { eventId: EntityId },
    ): Promise<TaskSummaryDTO> {
        const response = await api.post<TaskSummaryDTO>(API_ENDPOINTS.TASKS.BASE, taskData);
        return response.data;
    },

    async updateTask(id: EntityId, taskData: Partial<TaskSummaryDTO>): Promise<TaskSummaryDTO> {
        const response = await api.put<TaskSummaryDTO>(API_ENDPOINTS.TASKS.BY_ID(id), taskData);
        return response.data;
    },

    async deleteTask(id: EntityId): Promise<void> {
        await api.delete(API_ENDPOINTS.TASKS.BY_ID(id));
    },

    async toggleTask(id: EntityId): Promise<void> {
        await api.post(API_ENDPOINTS.TASKS.TOGGLE(id));
    },

    async assignTask(id: EntityId, userId: EntityId | undefined): Promise<void> {
        await api.post(API_ENDPOINTS.TASKS.ASSIGN(id), { userId });
    },
};
