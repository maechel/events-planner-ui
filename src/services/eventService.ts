import api from '@/api/axios';
import { API_ENDPOINTS, CACHE_CONFIG } from '@/constants/api';
import type { EventSummary, EventDetail } from '@/types/events';
import type { Event } from '@/stores/event';
import type { Participant } from '@/types/users';
import type { ParticipantRole } from '@/constants/roles';
import type { EntityId } from '@/types/common';

export const eventService = {
    async getEvents(): Promise<EventSummary[]> {
        const response = await api.get<EventSummary[]>(API_ENDPOINTS.EVENTS.BASE, {
            params: { _t: Date.now() },
            headers: CACHE_CONFIG.NO_CACHE_HEADERS,
        });
        return response.data;
    },

    async getEventById(id: EntityId): Promise<EventDetail> {
        const response = await api.get<EventDetail>(API_ENDPOINTS.EVENTS.BY_ID(id), {
            params: { _t: Date.now() },
            headers: CACHE_CONFIG.NO_CACHE_HEADERS,
        });
        return response.data;
    },

    async createEvent(eventData: Omit<Event, 'id' | 'organizers' | 'members' | 'tasks'>): Promise<EventDetail> {
        const response = await api.post<EventDetail>(API_ENDPOINTS.EVENTS.BASE, eventData);
        return response.data;
    },

    async updateEvent(id: EntityId, eventData: Partial<Event>): Promise<EventDetail> {
        const response = await api.put<EventDetail>(API_ENDPOINTS.EVENTS.BY_ID(id), eventData);
        return response.data;
    },

    async deleteEvent(id: EntityId): Promise<void> {
        await api.delete(API_ENDPOINTS.EVENTS.BY_ID(id));
    },

    async getMembers(eventId: EntityId): Promise<Participant[]> {
        const response = await api.get<Participant[]>(API_ENDPOINTS.EVENTS.MEMBERS(eventId), {
            params: { _t: Date.now() },
            headers: CACHE_CONFIG.NO_CACHE_HEADERS,
        });
        return response.data;
    },

    async getOrganizers(eventId: EntityId): Promise<Participant[]> {
        const response = await api.get<Participant[]>(API_ENDPOINTS.EVENTS.ORGANIZERS(eventId), {
            params: { _t: Date.now() },
            headers: CACHE_CONFIG.NO_CACHE_HEADERS,
        });
        return response.data;
    },

    async addParticipant(eventId: EntityId, userId: EntityId, role: ParticipantRole): Promise<Participant> {
        const endpoint =
            role === 'ORGANIZER'
                ? API_ENDPOINTS.EVENTS.ORGANIZER_ACTION(eventId, userId)
                : API_ENDPOINTS.EVENTS.MEMBER_ACTION(eventId, userId);
        const response = await api.post<Participant>(endpoint);
        return response.data;
    },

    async removeParticipant(eventId: EntityId, userId: EntityId, role: ParticipantRole): Promise<void> {
        const endpoint =
            role === 'ORGANIZER'
                ? API_ENDPOINTS.EVENTS.ORGANIZER_ACTION(eventId, userId)
                : API_ENDPOINTS.EVENTS.MEMBER_ACTION(eventId, userId);
        await api.delete(endpoint);
    },
};
