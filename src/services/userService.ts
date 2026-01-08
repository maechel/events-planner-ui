import api from '@/api/axios';
import { API_ENDPOINTS } from '@/constants/api';
import type { UserDetailDTO, UserSummaryDTO } from '@/types/users';

export const userService = {
    async getCurrentUser(): Promise<UserDetailDTO> {
        const response = await api.get<UserDetailDTO>(API_ENDPOINTS.AUTH.ME);
        return response.data;
    },

    async getAllUsers(): Promise<UserSummaryDTO[]> {
        const response = await api.get<UserSummaryDTO[]>(API_ENDPOINTS.USERS);
        return response.data;
    },

    async login(credentials: Record<string, string>): Promise<{ token: string }> {
        const response = await api.post<{ token: string }>(API_ENDPOINTS.AUTH.LOGIN, credentials);
        return response.data;
    },

    async register(userData: Record<string, string>): Promise<UserDetailDTO> {
        const response = await api.post<UserDetailDTO>(API_ENDPOINTS.AUTH.REGISTER, userData);
        return response.data;
    },

    async logout(): Promise<void> {
        await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    },
};
