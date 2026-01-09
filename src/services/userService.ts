import api from '@/api/axios';
import { API_ENDPOINTS } from '@/constants/api';
import type { UserDetail, UserSummary } from '@/types/users';

export const userService = {
    async getCurrentUser(): Promise<UserDetail> {
        const response = await api.get<UserDetail>(API_ENDPOINTS.AUTH.ME);
        return response.data;
    },

    async getAllUsers(): Promise<UserSummary[]> {
        const response = await api.get<UserSummary[]>(API_ENDPOINTS.USERS);
        return response.data;
    },

    async login(credentials: Record<string, string>): Promise<{ token: string }> {
        const response = await api.post<{ token: string }>(API_ENDPOINTS.AUTH.LOGIN, credentials);
        return response.data;
    },

    async register(userData: Record<string, string>): Promise<UserDetail> {
        const response = await api.post<UserDetail>(API_ENDPOINTS.AUTH.REGISTER, userData);
        return response.data;
    },

    async logout(): Promise<void> {
        await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    },
};
