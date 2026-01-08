import type { UserSummaryDTO } from './users';
import type { EntityId } from './common';

export interface TaskSummaryDTO {
    id: EntityId;
    description: string;
    completed: boolean;
    dueDate?: string;
    assignedToId?: EntityId;
    assignedToUsername?: string;
    eventId?: EntityId;
}

export interface TaskDetailDTO extends TaskSummaryDTO {
    assignedTo?: UserSummaryDTO;
    createdAt?: string;
    updatedAt?: string;
}
