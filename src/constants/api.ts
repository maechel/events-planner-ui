import type { EntityId } from '@/types/common';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        ME: '/me',
    },
    EVENTS: {
        BASE: '/events',
        BY_ID: (id: EntityId) => `/events/${id}`,
        MEMBERS: (id: EntityId) => `/events/${id}/members`,
        ORGANIZERS: (id: EntityId) => `/events/${id}/organizers`,
        MEMBER_ACTION: (id: EntityId, userId: EntityId) => `/events/${id}/members/${userId}`,
        ORGANIZER_ACTION: (id: EntityId, userId: EntityId) => `/events/${id}/organizers/${userId}`,
    },
    TASKS: {
        BASE: '/tasks',
        BY_ID: (id: EntityId) => `/tasks/${id}`,
        TOGGLE: (id: EntityId) => `/tasks/${id}/toggle`,
    },
    ADMIN: {
        STATS: '/admin/stats',
        USERS: '/admin/users',
        USER_BY_ID: (id: EntityId) => `/admin/users/${id}`,
    },
    ACTUATOR: {
        BASE: 'http://localhost:8080/actuator',
        HEALTH: 'http://localhost:8080/actuator/health',
        METRICS: (name: string) => `http://localhost:8080/actuator/metrics/${name}`,
        HTTP_REQUESTS: 'http://localhost:8080/actuator/metrics/http.server.requests',
    },
    USERS: '/users',
} as const;

export const CACHE_CONFIG = {
    NO_CACHE_HEADERS: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
    },
} as const;
