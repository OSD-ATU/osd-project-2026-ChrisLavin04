import { z } from 'zod';

// Schema for creating users - accepts password_hash (pre-hashed by client)
export const createUserSchema = z.object({
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(50, { message: "Username must be at most 50 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
  
  email: z.string()
    .email({ message: "Invalid email format" })
    .max(100, { message: "Email must be at most 100 characters long" }),
  
  password_hash: z.string()
    .min(1, { message: "Password hash is required" }),
  
  role: z.enum(['admin', 'coach', 'player', 'manager'], {
    message: "Role must be one of: admin, coach, player, manager"
  })
});

// Schema for updating users - password_hash is optional
export const updateUserSchema = z.object({
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(50, { message: "Username must be at most 50 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" })
    .optional(),
  
  email: z.string()
    .email({ message: "Invalid email format" })
    .max(100, { message: "Email must be at most 100 characters long" })
    .optional(),
  
  password_hash: z.string()
    .min(1, { message: "Password hash is required" })
    .optional(),
  
  role: z.enum(['admin', 'coach', 'player', 'manager'], {
    message: "Role must be one of: admin, coach, player, manager"
  }).optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;