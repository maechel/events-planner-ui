import api from '@/api/axios';
import { API_ENDPOINTS } from '@/constants/api';
import type { UserDetailDTO } from '@/types/users';
import type { HealthResponse, MetricResponse } from '@/stores/admin';
import type { EntityId } from '@/types/common';

export const adminService = {
    async getUsers(): Promise<UserDetailDTO[]> {
        const response = await api.get<UserDetailDTO[]>(API_ENDPOINTS.ADMIN.USERS);
        return response.data;
    },

    async getUserById(id: EntityId): Promise<UserDetailDTO> {
        const response = await api.get<UserDetailDTO>(API_ENDPOINTS.ADMIN.USER_BY_ID(id));
        return response.data;
    },

    async createUser(userData: Partial<UserDetailDTO>): Promise<UserDetailDTO> {
        const response = await api.post<UserDetailDTO>(API_ENDPOINTS.ADMIN.USERS, userData);
        return response.data;
    },

    async updateUser(id: EntityId, userData: Partial<UserDetailDTO>): Promise<UserDetailDTO> {
        const response = await api.put<UserDetailDTO>(API_ENDPOINTS.ADMIN.USER_BY_ID(id), userData);
        return response.data;
    },

    async deleteUser(id: EntityId): Promise<void> {
        await api.delete(API_ENDPOINTS.ADMIN.USER_BY_ID(id));
    },

    async getAdminStats(): Promise<{
        totalUsers: number;
        totalEvents: number;
        taskCompletionRate: number;
        activeOrganizers: number;
    }> {
        const response = await api.get(API_ENDPOINTS.ADMIN.STATS);
        return response.data;
    },

    async getHealth(): Promise<HealthResponse> {
        const response = await api.get<HealthResponse>(API_ENDPOINTS.ACTUATOR.HEALTH);
        return response.data;
    },

    async getMetric(name: string): Promise<MetricResponse> {
        const response = await api.get<MetricResponse>(API_ENDPOINTS.ACTUATOR.METRICS(name));
        return response.data;
    },

    async getRequestMetrics(uri?: string): Promise<MetricResponse> {
        const url = uri
            ? `${API_ENDPOINTS.ACTUATOR.HTTP_REQUESTS}?tag=uri:${uri}`
            : API_ENDPOINTS.ACTUATOR.HTTP_REQUESTS;
        const response = await api.get<MetricResponse>(url);
        return response.data;
    },
};
