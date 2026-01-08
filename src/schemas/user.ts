import { z } from 'zod';

export const userSchema = z
    .object({
        username: z.string().min(1, 'Username is required').min(3, 'Username must be at least 3 characters').max(50),
        email: z.string().email('Email is required'),
        password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
        confirmPassword: z
            .string()
            .min(6, 'Confirm password must be at least 6 characters')
            .optional()
            .or(z.literal('')),
        authorities: z.array(z.string()).min(1, 'At least one role is required'),
        enabled: z.boolean(),
        accountNonLocked: z.boolean(),
    })
    .refine(
        (data) => {
            if (data.password || data.confirmPassword) {
                return data.password === data.confirmPassword;
            }
            return true;
        },
        {
            message: "Passwords don't match",
            path: ['confirmPassword'],
        },
    );

export type UserFormData = z.infer<typeof userSchema>;

export const userInitialValues: UserFormData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    authorities: ['ROLE_USER'],
    enabled: true,
    accountNonLocked: true,
};
