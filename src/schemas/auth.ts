import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(1, 'Username is required').min(3, 'Username must be at least 3 characters').max(50),
    password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
    .object({
        username: z.string().min(1, 'Username is required').min(3, 'Username must be at least 3 characters').max(50),
        email: z.string().min(1, 'Email is required').email('Invalid email format'),
        password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
        confirmPassword: z
            .string()
            .min(1, 'Please confirm your password')
            .min(6, 'Confirm password must be at least 6 characters'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;

export const loginInitialValues: LoginData = {
    username: '',
    password: '',
};

export const registerInitialValues: RegisterData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
};
