import type { ParticipantDTO } from './users';
import type { TaskSummaryDTO } from './tasks';
import type { EntityId } from './common';

export interface AddressDTO {
    id?: EntityId;
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
    locationName?: string;
}

export interface EventSummaryDTO {
    id: EntityId;
    title: string;
    description: string;
    date: string;
    locationName?: string;
    participantCount: number;
    taskCount: number;
    hasUnfinishedTasks: boolean;
    completedTaskCount?: number;
    organizers?: ParticipantDTO[];
    members?: ParticipantDTO[];
    tasks?: TaskSummaryDTO[];
}

export interface EventDetailDTO extends Omit<EventSummaryDTO, 'locationName'> {
    address?: AddressDTO;
    organizers: ParticipantDTO[];
    members: ParticipantDTO[];
    tasks: TaskSummaryDTO[];
    createdAt?: string;
    updatedAt?: string;
}
