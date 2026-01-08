import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import EventTaskList from '../EventTaskList.vue';
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Tag from 'primevue/tag';
import { createPinia } from 'pinia';
import type { Task, Participant } from '@/stores/event';
import { ParticipantRole } from '@/constants/roles';

// Mock FontAwesomeIcon
const FontAwesomeIconMock = {
    template: '<span></span>',
};

describe('EventTaskList.vue', () => {
    const mockParticipants: Participant[] = [
        { id: 'u1', username: 'Alice', avatar: 'alice.png', role: ParticipantRole.ORGANIZER, email: 'alice@test.com' },
        { id: 'u2', username: 'Bob', avatar: 'bob.png', role: ParticipantRole.MEMBER, email: 'bob@test.com' },
    ];

    const mockTasks: Task[] = [
        {
            id: 't1',
            description: 'Urgent Task',
            completed: false,
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
            assignedToId: 'u1',
            eventId: 'e1',
        },
        {
            id: 't2',
            description: 'Completed Task',
            completed: true,
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            assignedToId: 'u2',
            eventId: 'e1',
        },
    ];

    const factory = (props = {}) => {
        return mount(EventTaskList, {
            props: {
                tasks: mockTasks,
                participants: mockParticipants,
                ...props,
            },
            global: {
                plugins: [PrimeVue, createPinia()],
                components: {
                    Button,
                    Checkbox,
                    Tag,
                    FontAwesomeIcon: FontAwesomeIconMock,
                },
                directives: {
                    tooltip: () => {},
                },
            },
        });
    };

    it('renders tasks correctly', () => {
        const wrapper = factory();
        expect(wrapper.text()).toContain('Urgent Task');
        expect(wrapper.text()).toContain('Completed Task');
    });

    it('shows the correct assignee username', () => {
        const wrapper = factory();
        expect(wrapper.text()).toContain('Alice');
        expect(wrapper.text()).toContain('Bob');
    });

    it('emits add-task when New Task button is clicked', async () => {
        const wrapper = factory();
        const newTaskButton = wrapper.find('button.p-button');
        await newTaskButton.trigger('click');
        expect(wrapper.emitted('add-task')).toBeTruthy();
    });

    it('emits toggle-task when checkbox is changed', async () => {
        const wrapper = factory();
        const checkbox = wrapper.find('input[type="checkbox"]');
        await checkbox.setValue(true);
        expect(wrapper.emitted('toggle-task')).toBeTruthy();
        // It emits taskId and the new state
        expect(wrapper.emitted('toggle-task')![0]).toEqual(['t1', true]);
    });

    it('emits edit-task when edit button is clicked', async () => {
        const wrapper = factory();
        // Find edit buttons (pencil icon)
        const editButtons = wrapper.findAll('button').filter((b) => b.html().includes('pencil'));
        const editBtn = editButtons[0];
        if (editBtn) {
            await editBtn.trigger('click');
            expect(wrapper.emitted('edit-task')).toBeTruthy();
            expect(wrapper.emitted('edit-task')![0]).toEqual([mockTasks[0]]);
        }
    });

    it('emits delete-task when delete button is clicked', async () => {
        const wrapper = factory();
        // Find delete buttons (trash icon)
        const deleteButtons = wrapper.findAll('button').filter((b) => b.html().includes('trash'));
        const deleteBtn = deleteButtons[0];
        if (deleteBtn) {
            await deleteBtn.trigger('click');
            expect(wrapper.emitted('delete-task')).toBeTruthy();
            expect(wrapper.emitted('delete-task')![0]).toEqual(['t1']);
        }
    });

    it('applies line-through class to completed tasks', () => {
        const wrapper = factory();
        const taskDescriptions = wrapper.findAll('.text-xl.font-bold');
        const completedTask = taskDescriptions.find((d) => d.text() === 'Completed Task');
        expect(completedTask?.classes()).toContain('line-through');
    });

    it('shows urgency tag for incomplete nearing tasks', () => {
        const wrapper = factory();
        expect(wrapper.text()).toContain('Urgent');
    });
});
