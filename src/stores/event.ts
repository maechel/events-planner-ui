import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth';
import type { TaskSummaryDTO } from '@/types/tasks';
import type { EventDetailDTO, EventSummaryDTO, AddressDTO } from '@/types/events';
import type { ParticipantDTO } from '@/types/users';
import type { EntityId } from '@/types/common';
import { eventService } from '@/services/eventService';
import { taskService } from '@/services/taskService';
import { useEventLogic } from '@/composables/useEventLogic';
import { ParticipantRole } from '@/constants/roles';
import mockEventsData from '@/assets/mocks/events.json';
import mockTasksData from '@/assets/mocks/tasks.json';

export type Task = TaskSummaryDTO;
export type Participant = ParticipantDTO;
export type Event = EventSummaryDTO;

export interface MockEvent extends EventDetailDTO {
    participantCount: number;
    taskCount: number;
    completedTaskCount: number;
    hasUnfinishedTasks: boolean;
}

// --- Helper Functions (Outer Scope) ---

function getFilteredMockEvents(mockEvents: MockEvent[], userId?: EntityId) {
    if (!userId) return mockEvents;
    return mockEvents.filter(
        (e) =>
            e.organizers.some((o: ParticipantDTO) => String(o.id) === String(userId)) ||
            e.members.some((m: ParticipantDTO) => String(m.id) === String(userId)),
    );
}

function mapToEventSummary(e: EventDetailDTO | MockEvent): EventSummaryDTO {
    return {
        ...e,
        locationName: e.address?.locationName || 'N/A',
        participantCount: (e as MockEvent).participantCount ?? e.organizers.length + e.members.length,
        taskCount: (e as MockEvent).taskCount ?? e.tasks.length,
        completedTaskCount: (e as MockEvent).completedTaskCount ?? e.tasks.filter((t) => t.completed).length,
        hasUnfinishedTasks: (e as MockEvent).hasUnfinishedTasks ?? e.tasks.some((t) => !t.completed),
    };
}

function getFilteredMockTasks(mockTasks: TaskSummaryDTO[], userId?: EntityId) {
    if (!userId) return mockTasks;
    return mockTasks.filter((t) => String(t.assignedToId) === String(userId));
}

function getMockEventById(mockEvents: MockEvent[], id: EntityId): MockEvent | null {
    return mockEvents.find((e) => String(e.id) === String(id)) || null;
}

function updateTaskInList(list: TaskSummaryDTO[], updatedTask: TaskSummaryDTO) {
    const index = list.findIndex((t) => String(t.id) === String(updatedTask.id));
    if (index !== -1) {
        list[index] = { ...list[index], ...updatedTask };
        return true;
    }
    return false;
}

function addParticipantToState(
    target: { organizers?: ParticipantDTO[]; members?: ParticipantDTO[] },
    participant: ParticipantDTO,
    role: ParticipantRole,
) {
    if (role === ParticipantRole.ORGANIZER) {
        target.organizers ??= [];
        if (!target.organizers.some((o) => String(o.id) === String(participant.id))) {
            target.organizers = [...target.organizers, participant];
        }
    } else {
        target.members ??= [];
        if (!target.members.some((m) => String(m.id) === String(participant.id))) {
            target.members = [...target.members, participant];
        }
    }
}

function removeParticipantFromState(
    target: { organizers?: ParticipantDTO[]; members?: ParticipantDTO[] },
    userId: EntityId,
    role: ParticipantRole,
) {
    if (role === ParticipantRole.ORGANIZER) {
        target.organizers = target.organizers?.filter((p) => String(p.id) !== String(userId));
    } else {
        target.members = target.members?.filter((p) => String(p.id) !== String(userId));
    }
}

function updateEventInList(
    list: EventSummaryDTO[],
    id: EntityId,
    updatedFields: Partial<EventSummaryDTO> & { id: EntityId; title: string; description: string; date: string },
) {
    const index = list.findIndex((e) => String(e.id) === String(id));
    if (index !== -1) {
        const currentItem = list[index];
        if (!currentItem) return false;
        list[index] = {
            ...currentItem,
            ...updatedFields,
            participantCount: updatedFields.participantCount ?? currentItem.participantCount ?? 0,
            taskCount: updatedFields.taskCount ?? currentItem.taskCount ?? 0,
            completedTaskCount: updatedFields.completedTaskCount ?? currentItem.completedTaskCount ?? 0,
            hasUnfinishedTasks: updatedFields.hasUnfinishedTasks ?? currentItem.hasUnfinishedTasks ?? false,
        };
        return true;
    }
    return false;
}

function applyEventUpdates(target: EventSummaryDTO | MockEvent, updates: Partial<EventSummaryDTO>) {
    if (updates.title) target.title = updates.title;
    if (updates.description) target.description = updates.description;
    if (updates.date) target.date = updates.date;
}

function applyAddressUpdates(target: MockEvent, updates: Partial<AddressDTO>) {
    target.address ??= {};
    if (updates.locationName) target.address.locationName = updates.locationName;
    if (updates.street) target.address.street = updates.street;
    if (updates.city) target.address.city = updates.city;
    if (updates.zipCode) target.address.zipCode = updates.zipCode;
    if (updates.country) target.address.country = updates.country;
}

async function hydrateTaskAssignment(task: TaskSummaryDTO, currentEvent: EventDetailDTO | null) {
    if (!task.assignedToId) {
        task.assignedToUsername = undefined;
        return;
    }

    // Try current event participants first
    if (currentEvent) {
        const organizers = currentEvent.organizers || [];
        const members = currentEvent.members || [];
        const participant = [...organizers, ...members].find((p) => String(p.id) === String(task.assignedToId));
        if (participant) {
            task.assignedToUsername = participant.username;
            return;
        }
    }

    // Fallback to adminStore users
    const adminStore = (await import('./admin')).useAdminStore();
    if (adminStore.users.length === 0) {
        await adminStore.fetchUsers();
    }
    const user = adminStore.users.find((u) => String(u.id) === String(task.assignedToId));
    if (user) {
        task.assignedToUsername = user.username;
    }
}

async function hydrateParticipantInfo(participant: ParticipantDTO, userId: EntityId) {
    if (participant.username && participant.avatar) return;

    const adminStore = (await import('./admin')).useAdminStore();
    if (adminStore.users.length === 0) {
        await adminStore.fetchUsers();
    }
    const user = adminStore.users.find((u) => String(u.id) === String(userId));
    if (user) {
        participant.username = participant.username || user.username;
        participant.avatar = participant.avatar || user.avatar;
        participant.email = participant.email || user.email;
    }
}

function updateEventSummaryStats(
    events: EventSummaryDTO[],
    mockEvents: MockEvent[],
    eventId: EntityId,
    taskDiff: number,
    completedDiff: number,
    participantDiff: number = 0,
) {
    const event = events.find((e) => String(e.id) === String(eventId));
    if (event) {
        if (event.taskCount !== undefined) event.taskCount += taskDiff;
        if (event.completedTaskCount !== undefined) event.completedTaskCount += completedDiff;
        if (event.participantCount !== undefined) event.participantCount += participantDiff;
        event.hasUnfinishedTasks = (event.taskCount || 0) > (event.completedTaskCount || 0);
    }

    // Also update mock data to persist between navigations
    const mockEvent = mockEvents.find((e) => String(e.id) === String(eventId));
    if (mockEvent) {
        if (mockEvent.taskCount !== undefined) mockEvent.taskCount += taskDiff;
        if (mockEvent.completedTaskCount !== undefined) mockEvent.completedTaskCount += completedDiff;
        if (mockEvent.participantCount !== undefined) mockEvent.participantCount += participantDiff;
        mockEvent.hasUnfinishedTasks = (mockEvent.taskCount || 0) > (mockEvent.completedTaskCount || 0);
    }
}

export const useEventStore = defineStore('event', () => {
    const events = ref<EventSummaryDTO[]>([]);
    const tasks = ref<TaskSummaryDTO[]>([]);
    const currentEvent = ref<EventDetailDTO | null>(null);
    const loading = ref(false);

    const authStore = useAuthStore();
    const { user: authUser } = storeToRefs(authStore);
    const {
        upcomingEvents,
        passedEvents,
        eventsInComingYear,
        eventsByMonth,
        nearingDueTasks,
        stats,
        currentUserUnfinishedTaskCount,
        currentUserTasksUrgencySeverity,
    } = useEventLogic(events, tasks, authUser);

    // Mock data storage for sessions without a backend
    const mockEvents = ref<MockEvent[]>(mockEventsData as MockEvent[]);

    const mockTasks = ref<TaskSummaryDTO[]>(mockTasksData as TaskSummaryDTO[]);

    // --- Actions ---

    async function fetchEvents() {
        loading.value = true;
        try {
            events.value = await eventService.getEvents();
        } catch (error) {
            console.error(error);
            const filtered = getFilteredMockEvents(mockEvents.value, authStore.user?.id);
            events.value = filtered.map(mapToEventSummary);
        } finally {
            loading.value = false;
        }
    }

    async function fetchTasks() {
        loading.value = true;
        try {
            tasks.value = await taskService.getTasks();
        } catch (error) {
            console.error(error);
            tasks.value = getFilteredMockTasks(mockTasks.value, authStore.user?.id);
        } finally {
            loading.value = false;
        }
    }

    async function fetchEventById(id: EntityId) {
        loading.value = true;
        try {
            currentEvent.value = await eventService.getEventById(id);
            // Hydrate missing details if needed
            if (!currentEvent.value.tasks || currentEvent.value.tasks.length === 0) {
                currentEvent.value.tasks = await taskService
                    .getTasks(id)
                    .catch(() => mockTasks.value.filter((t) => String(t.eventId) === String(id)));
            }
        } catch (error) {
            console.error(error);
            currentEvent.value = getMockEventById(mockEvents.value, id);
        } finally {
            loading.value = false;
        }
    }

    async function toggleTask(eventId: EntityId, taskId: EntityId, newState?: boolean) {
        const task =
            tasks.value.find((t) => String(t.id) === String(taskId)) ||
            currentEvent.value?.tasks?.find((t) => String(t.id) === String(taskId));
        if (!task) return;

        const previousState = task.completed;
        const targetState = newState ?? !previousState;

        // Optimistic update
        task.completed = targetState;
        updateEventSummaryStats(events.value, mockEvents.value, eventId, 0, targetState ? 1 : -1);

        try {
            await taskService.toggleTask(taskId);
        } catch (error) {
            task.completed = previousState;
            updateEventSummaryStats(events.value, mockEvents.value, eventId, 0, previousState ? 1 : -1);
            throw error;
        }
    }

    async function addTask(eventId: EntityId, taskData: Omit<TaskSummaryDTO, 'id' | 'completed'>) {
        loading.value = true;
        try {
            const newTask = await taskService.createTask({ ...taskData, eventId });
            await syncTaskInState(newTask);
            updateEventSummaryStats(events.value, mockEvents.value, eventId, 1, 0);
            return newTask;
        } catch (error) {
            console.error(error);
            const newTask: TaskSummaryDTO = {
                ...taskData,
                id: crypto.randomUUID(),
                completed: false,
                eventId,
            };

            await syncTaskInState(newTask);
            updateEventSummaryStats(events.value, mockEvents.value, eventId, 1, 0);
            return newTask;
        } finally {
            loading.value = false;
        }
    }

    async function deleteTask(taskId: EntityId) {
        const task =
            tasks.value.find((t) => String(t.id) === String(taskId)) ||
            currentEvent.value?.tasks?.find((t) => String(t.id) === String(taskId));
        if (!task) return;
        const eventId = task.eventId || currentEvent.value?.id;
        const wasCompleted = task.completed;

        loading.value = true;
        try {
            await taskService.deleteTask(taskId);
            tasks.value = tasks.value.filter((t) => String(t.id) !== String(taskId));
            if (currentEvent.value?.tasks) {
                currentEvent.value.tasks = currentEvent.value.tasks.filter((t) => String(t.id) !== String(taskId));
            }
            if (eventId) {
                updateEventSummaryStats(events.value, mockEvents.value, eventId, -1, wasCompleted ? -1 : 0);
            }
        } finally {
            loading.value = false;
        }
    }

    async function addParticipant(eventId: EntityId, userId: EntityId, role: ParticipantRole) {
        loading.value = true;
        try {
            const participant = await eventService.addParticipant(eventId, userId, role);
            await hydrateParticipantInfo(participant, userId);

            if (currentEvent.value && String(currentEvent.value.id) === String(eventId)) {
                addParticipantToState(currentEvent.value, participant, role);
            }
            updateEventSummaryStats(events.value, mockEvents.value, eventId, 0, 0, 1);
        } catch (error) {
            console.error(error);
            // Mock fallback
            const adminStore = (await import('./admin')).useAdminStore();
            if (adminStore.users.length === 0) {
                await adminStore.fetchUsers();
            }
            const user = adminStore.users.find((u) => String(u.id) === String(userId));
            if (user) {
                const participant: ParticipantDTO = {
                    id: user.id,
                    username: user.username,
                    avatar: user.avatar,
                    email: user.email,
                    role: role,
                };

                if (currentEvent.value && String(currentEvent.value.id) === String(eventId)) {
                    addParticipantToState(currentEvent.value, participant, role);
                }

                const mockEvent = getMockEventById(mockEvents.value, eventId);
                if (mockEvent) {
                    addParticipantToState(mockEvent, participant, role);
                }
                updateEventSummaryStats(events.value, mockEvents.value, eventId, 0, 0, 1);
            } else {
                throw error;
            }
        } finally {
            loading.value = false;
        }
    }

    async function removeParticipant(eventId: EntityId, userId: EntityId, role: ParticipantRole) {
        loading.value = true;
        try {
            await eventService.removeParticipant(eventId, userId, role);
            if (currentEvent.value && String(currentEvent.value.id) === String(eventId)) {
                removeParticipantFromState(currentEvent.value, userId, role);
            }
            updateEventSummaryStats(events.value, mockEvents.value, eventId, 0, 0, -1);
        } catch (error) {
            console.error(error);
            // Mock fallback
            if (currentEvent.value && String(currentEvent.value.id) === String(eventId)) {
                removeParticipantFromState(currentEvent.value, userId, role);
            }
            const mockEvent = getMockEventById(mockEvents.value, eventId);
            if (mockEvent) {
                removeParticipantFromState(mockEvent, userId, role);
            }
            updateEventSummaryStats(events.value, mockEvents.value, eventId, 0, 0, -1);
        } finally {
            loading.value = false;
        }
    }

    async function updateTask(taskId: EntityId, taskData: Partial<TaskSummaryDTO>) {
        loading.value = true;
        try {
            const updatedTask = await taskService.updateTask(taskId, taskData);
            await syncTaskInState(updatedTask);
            return updatedTask;
        } catch (error) {
            // Fallback for mock data
            const task =
                tasks.value.find((t) => String(t.id) === String(taskId)) ||
                currentEvent.value?.tasks?.find((t) => String(t.id) === String(taskId));
            if (task) {
                Object.assign(task, taskData);
                await syncTaskInState(task);
                return task;
            }
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function assignTask(taskId: EntityId, userId: EntityId | undefined) {
        loading.value = true;
        try {
            await taskService.assignTask(taskId, userId);
            const task =
                tasks.value.find((t) => String(t.id) === String(taskId)) ||
                currentEvent.value?.tasks?.find((t) => String(t.id) === String(taskId));
            if (task) {
                task.assignedToId = userId;
                // assignedToUsername will be hydrated inside syncTaskInState
                await syncTaskInState(task);
            }
        } finally {
            loading.value = false;
        }
    }

    async function syncTaskInState(updatedTask: TaskSummaryDTO) {
        await hydrateTaskAssignment(updatedTask, currentEvent.value);

        // Update in global tasks list
        if (!updateTaskInList(tasks.value, updatedTask)) {
            if (authStore.user && String(updatedTask.assignedToId) === String(authStore.user.id)) {
                tasks.value = [...tasks.value, updatedTask];
            }
        }

        // Update in current event
        if (currentEvent.value && String(currentEvent.value.id) === String(updatedTask.eventId)) {
            if (!currentEvent.value.tasks) currentEvent.value.tasks = [];
            if (!updateTaskInList(currentEvent.value.tasks, updatedTask)) {
                currentEvent.value.tasks = [...currentEvent.value.tasks, updatedTask];
            }
        }

        // Update in mock storage
        updateTaskInList(mockTasks.value, updatedTask);
    }

    async function createEvent(
        eventData: Omit<EventSummaryDTO, 'id' | 'organizers' | 'members' | 'tasks'> & {
            locationName?: string;
            address?: Partial<AddressDTO>;
        },
    ) {
        loading.value = true;
        try {
            const newEvent = await eventService.createEvent(eventData);
            events.value.push(newEvent);
            return newEvent;
        } catch (error) {
            console.error(error);
            const newEvent: MockEvent = {
                id: crypto.randomUUID(),
                title: eventData.title || 'Untitled Event',
                description: eventData.description || '',
                date: eventData.date || new Date().toISOString(),
                address: {
                    id: crypto.randomUUID(),
                    locationName: eventData.locationName,
                    street: (eventData.address as AddressDTO)?.street,
                    city: (eventData.address as AddressDTO)?.city,
                    zipCode: (eventData.address as AddressDTO)?.zipCode,
                    country: (eventData.address as AddressDTO)?.country,
                },
                organizers: [{ ...authStore.user!, role: ParticipantRole.ORGANIZER }],
                members: [],
                tasks: [],
                participantCount: 1,
                taskCount: 0,
                completedTaskCount: 0,
                hasUnfinishedTasks: false,
            };
            mockEvents.value.push(newEvent);
            events.value.push(mapToEventSummary(newEvent));
            return newEvent;
        } finally {
            loading.value = false;
        }
    }

    async function updateEvent(
        id: EntityId,
        eventData: Partial<EventDetailDTO> & { id: EntityId; locationName?: string },
    ) {
        loading.value = true;
        try {
            const updatedEvent = await eventService.updateEvent(id, eventData);
            updateEventInList(events.value, id, updatedEvent);
            if (currentEvent.value && String(currentEvent.value.id) === String(id)) {
                currentEvent.value = { ...currentEvent.value, ...updatedEvent };
            }
            return updatedEvent;
        } catch (error) {
            console.error(error);
            const event = events.value.find((e) => String(e.id) === String(id));
            const mockEvent = getMockEventById(mockEvents.value, id);

            if (!event || !mockEvent) throw error;

            // Update top level fields
            applyEventUpdates(event, eventData);
            applyEventUpdates(mockEvent, eventData);

            // Update address fields
            applyAddressUpdates(mockEvent, eventData);
            if (eventData.locationName) {
                event.locationName = eventData.locationName;
            }

            if (currentEvent.value && String(currentEvent.value.id) === String(id)) {
                currentEvent.value = { ...mockEvent };
            }

            return event;
        } finally {
            loading.value = false;
        }
    }

    async function deleteEvent(id: EntityId) {
        loading.value = true;
        try {
            await eventService.deleteEvent(id);
            events.value = events.value.filter((e) => String(e.id) !== String(id));
            if (currentEvent.value && String(currentEvent.value.id) === String(id)) {
                currentEvent.value = null;
            }
            mockEvents.value = mockEvents.value.filter((e) => String(e.id) !== String(id));
        } finally {
            loading.value = false;
        }
    }

    return {
        events,
        tasks,
        currentEvent,
        loading,
        upcomingEvents,
        passedEvents,
        eventsInComingYear,
        eventsByMonth,
        nearingDueTasks,
        stats,
        currentUserUnfinishedTaskCount,
        currentUserTasksUrgencySeverity,
        fetchEvents,
        fetchTasks,
        fetchEventById,
        toggleTask,
        addTask,
        deleteTask,
        addParticipant,
        removeParticipant,
        updateTask,
        assignTask,
        createEvent,
        updateEvent,
        deleteEvent,
    };
});
