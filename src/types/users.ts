import { ParticipantRole } from '@/constants/roles';
import type { EntityId } from './common';

export interface UserSummaryDTO {
    id: EntityId;
    username: string;
    avatar?: string;
}

export interface UserDetailDTO {
    id: EntityId;
    username: string;
    email: string;
    enabled: boolean;
    accountNonLocked: boolean;
    avatar?: string;
    failedLoginAttempts: number;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
    authorities: string[];
    roles?: string[];
    authenticated?: boolean;
    password?: string;
}

export interface ParticipantDTO extends UserSummaryDTO {
    email: string;
    role: ParticipantRole;
}
