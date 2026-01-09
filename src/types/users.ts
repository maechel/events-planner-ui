import { ParticipantRole } from '@/constants/roles';
import type { EntityId } from './common';

export interface UserSummary {
    id: EntityId;
    username: string;
    avatar?: string;
    email?: string;
}

export interface UserDetail {
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

export interface Participant extends UserSummary {
    email: string;
    role: ParticipantRole;
}
