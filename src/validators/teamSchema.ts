import { z } from 'zod';

export const createTeamSchema = z.object({
  team_id: z.string()
    .min(1, { message: "Team ID is required" })
    .max(20, { message: "Team ID must be at most 20 characters long" })
    .regex(/^T\d{3,}$/, { message: "Team ID must follow format T001, T002, etc." }),
  
  name: z.string()
    .min(2, { message: "Team name must be at least 2 characters long" })
    .max(100, { message: "Team name must be at most 100 characters long" })
    .regex(/^[a-zA-Z0-9\s'-]+$/, { message: "Team name can only contain letters, numbers, spaces, hyphens, and apostrophes" }),
  
  coach: z.string()
    .min(1, { message: "Coach is required" })
    .regex(/^U\d{3,}$/, { message: "Coach must be a valid User ID (format: U001, U002, etc.)" }),
  
  players: z.array(z.string().regex(/^P\d{3,}$/, { message: "Each player ID must follow format P001, P002, etc." }))
    .max(25, { message: "A team cannot have more than 25 players" })
    .optional()
    .default([])
});

export const updateTeamSchema = z.object({
  team_id: z.string()
    .min(1, { message: "Team ID is required" })
    .max(20, { message: "Team ID must be at most 20 characters long" })
    .regex(/^T\d{3,}$/, { message: "Team ID must follow format T001, T002, etc." })
    .optional(),
  
  name: z.string()
    .min(2, { message: "Team name must be at least 2 characters long" })
    .max(100, { message: "Team name must be at most 100 characters long" })
    .regex(/^[a-zA-Z0-9\s'-]+$/, { message: "Team name can only contain letters, numbers, spaces, hyphens, and apostrophes" })
    .optional(),
  
  coach: z.string()
    .min(1, { message: "Coach is required" })
    .regex(/^U\d{3,}$/, { message: "Coach must be a valid User ID (format: U001, U002, etc.)" })
    .optional(),
  
  players: z.array(z.string().regex(/^P\d{3,}$/, { message: "Each player ID must follow format P001, P002, etc." }))
    .max(25, { message: "A team cannot have more than 25 players" })
    .optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});

export type CreateTeamRequest = z.infer<typeof createTeamSchema>;
export type UpdateTeamRequest = z.infer<typeof updateTeamSchema>;