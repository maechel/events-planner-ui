export const UserRole = {
    USER: 'ROLE_USER',
    ADMIN: 'ROLE_ADMIN',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const ParticipantRole = {
    ORGANIZER: 'ORGANIZER',
    MEMBER: 'MEMBER',
} as const;

export type ParticipantRole = (typeof ParticipantRole)[keyof typeof ParticipantRole];
