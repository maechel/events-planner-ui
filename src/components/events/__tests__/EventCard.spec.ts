import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import EventCard from '../EventCard.vue';
import PrimeVue from 'primevue/config';
import Card from 'primevue/card';
import Button from 'primevue/button';
import { createPinia } from 'pinia';
import type { EventSummaryDTO } from '@/types/events';
import { ParticipantRole } from '@/constants/roles';

// Mock FontAwesomeIcon
const FontAwesomeIconMock = {
    template: '<span></span>',
};

describe('EventCard.vue', () => {
    const mockEvent: EventSummaryDTO = {
        id: '1',
        title: 'Test Event',
        description: 'This is a test event description',
        date: '2026-05-20T10:00:00Z',
        participantCount: 5,
        taskCount: 10,
        hasUnfinishedTasks: true,
        organizers: [],
        members: [],
        tasks: [],
    };

    const factory = (props = {}) => {
        return mount(EventCard, {
            props: {
                event: mockEvent,
                ...props,
            },
            global: {
                plugins: [PrimeVue, createPinia()],
                components: {
                    Card,
                    Button,
                    FontAwesomeIcon: FontAwesomeIconMock,
                },
                stubs: {
                    'router-link': true,
                },
            },
        });
    };

    it('renders event title and description correctly', () => {
        const wrapper = factory();
        expect(wrapper.text()).toContain('Test Event');
        expect(wrapper.text()).toContain('This is a test event description');
    });

    it('formats the date correctly', () => {
        const wrapper = factory();
        // The formatter uses DATE_FORMATS.DEFAULT which is likely 'yyyy-MM-dd HH:mm'
        expect(wrapper.text()).toContain('2026-05-20');
    });

    it('displays participant and task counts from props when provided', () => {
        const wrapper = factory();
        expect(wrapper.text()).toContain('5');
        expect(wrapper.text()).toContain('10 Tasks');
    });

    it('calculates counts from arrays when explicit counts are missing', () => {
        const eventWithoutCounts: EventSummaryDTO = {
            ...mockEvent,
            participantCount: undefined as unknown as number,
            taskCount: undefined as unknown as number,
            organizers: [{ id: '1', username: 'org', role: ParticipantRole.ORGANIZER, email: 'org@test.com' }],
            members: [{ id: '2', username: 'mem', role: ParticipantRole.MEMBER, email: 'mem@test.com' }],
            tasks: [{ id: '1', description: 'task', completed: false }],
        };
        const wrapper = factory({ event: eventWithoutCounts });
        expect(wrapper.text()).toContain('2'); // 1 org + 1 mem
        expect(wrapper.text()).toContain('1 Tasks');
    });

    it('emits view-details event when Manage Event button is clicked', async () => {
        const wrapper = factory();
        const button = wrapper.find('button');
        await button.trigger('click');
        expect(wrapper.emitted('view-details')).toBeTruthy();
        expect(wrapper.emitted('view-details')![0]).toEqual(['1']);
    });

    it('applies grayscale class when isPassed prop is true', () => {
        const wrapper = factory({ isPassed: true });
        expect(wrapper.classes()).toContain('grayscale');
        expect(wrapper.text()).toContain('View Recap');
    });

    it('shows Pending Tasks tag when hasUnfinishedTasks is true and not passed', () => {
        const wrapper = factory({ isPassed: false });
        expect(wrapper.text()).toContain('Tasks Pending');
    });
});
