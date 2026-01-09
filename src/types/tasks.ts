import type { UserSummary } from './users';
import type { EntityId } from './common';

export interface TaskSummary {
    id: EntityId;
    description: string;
    completed: boolean;
    dueDate?: string;
    assignedToId?: EntityId;
    assignedToUsername?: string;
    eventId?: EntityId;
}

export interface TaskDetail extends TaskSummary {
    assignedTo?: UserSummary;
    createdAt?: string;
    updatedAt?: string;
}
