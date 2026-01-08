import { z } from 'zod';

export const eventSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(1000),
    date: z.union([z.string(), z.date()]).refine((val) => !isNaN(new Date(val).getTime()), {
        message: 'Invalid date format',
    }),
    locationName: z.string().min(3).max(100),
    street: z.string().min(2).max(100),
    city: z.string().min(2).max(100),
    zipCode: z.string().min(2).max(20),
    country: z.string().min(2).max(100),
});

export type EventFormData = z.infer<typeof eventSchema>;

export const eventInitialValues: EventFormData = {
    title: '',
    description: '',
    date: null as unknown as Date,
    locationName: '',
    street: '',
    city: '',
    zipCode: '',
    country: '',
};
