import { z } from 'zod';

export const taskSchema = z.object({
    description: z.string().min(3, 'Description must be at least 3 characters').max(500),
    assignedToId: z
        .union([z.number(), z.string()])
        .refine((val) => val !== undefined && val !== null && val !== '', { message: 'Assignee is required' }),
    dueDate: z
        .union([z.string(), z.date()])
        .refine((val) => val !== undefined && val !== null && val !== '', { message: 'Due date is required' })
        .refine(
            (val) => {
                if (!val) return false;
                return !Number.isNaN(new Date(val).getTime());
            },
            {
                message: 'Invalid date format',
            },
        ),
});

export type TaskFormData = z.infer<typeof taskSchema>;

export const taskInitialValues: TaskFormData = {
    description: '',
    assignedToId: undefined as unknown as string | number,
    dueDate: undefined as unknown as Date,
};
