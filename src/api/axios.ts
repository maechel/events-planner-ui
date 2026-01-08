import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for API calls
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<{ message?: string }>) => {
        // Detailed logging for network and server errors
        if (error.response) {
            console.error(
                `API Error (${error.config?.method?.toUpperCase()} ${error.config?.url}):`,
                error.response.status,
                error.response.data,
            );
        } else {
            console.error('Network Error or server is unreachable:', error.message);
        }

        if (error.response?.status === 401) {
            globalThis.dispatchEvent(
                new CustomEvent('unauthorized', {
                    detail: {
                        message: error.response.data?.message || 'Session expired. Please login again.',
                    },
                }),
            );
        }
        throw error;
    },
);

export default api;
