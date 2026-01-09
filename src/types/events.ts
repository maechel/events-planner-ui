import type { Participant } from './users';
import type { TaskSummary } from './tasks';
import type { EntityId } from './common';

export interface Address {
    id?: EntityId;
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
    locationName?: string;
}

export interface EventSummary {
    id: EntityId;
    title: string;
    description: string;
    date: string;
    locationName?: string;
    participantCount: number;
    taskCount: number;
    hasUnfinishedTasks: boolean;
    completedTaskCount?: number;
    organizers?: Participant[];
    members?: Participant[];
    tasks?: TaskSummary[];
}

export interface EventDetail extends Omit<EventSummary, 'locationName'> {
    address?: Address;
    organizers: Participant[];
    members: Participant[];
    tasks: TaskSummary[];
    createdAt?: string;
    updatedAt?: string;
}
