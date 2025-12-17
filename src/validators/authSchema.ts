import { z } from 'zod';

// Schema for user registration
export const registerSchema = z.object({
  username: z.string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(50, { message: 'Username must be at most 50 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' }),
  email: z.string()
    .email({ message: 'Invalid email format' })
    .max(100, { message: 'Email must be at most 100 characters' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['admin', 'coach', 'player'], {
    message: 'Role must be one of: admin, coach, player'
  }).optional().default('player')
});

// Schema for user login
export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(1, { message: 'Password is required' })
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
