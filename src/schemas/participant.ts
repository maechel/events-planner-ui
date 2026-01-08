import { z } from 'zod';
import { ParticipantRole } from '@/constants/roles';

export const participantSchema = z.object({
    userId: z.union([z.number(), z.string()], { message: 'User is required' }),
    role: z.enum(ParticipantRole),
});

export type ParticipantFormData = z.infer<typeof participantSchema>;

export const participantInitialValues: ParticipantFormData = {
    userId: undefined as unknown as string | number,
    role: ParticipantRole.MEMBER,
};
