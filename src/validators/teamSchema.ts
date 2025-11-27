import { z } from 'zod';


// Schema for creating a team
export const createTeamSchema = z.object({
  // Name must be 2-100 chars, can include letters, numbers, spaces, hyphens, apostrophes
  name: z.string()
    .min(2, { message: "Team name must be at least 2 characters long" })
    .max(100, { message: "Team name must be at most 100 characters long" })
    .regex(/^[a-zA-Z0-9\s'-]+$/, { message: "Team name can only contain letters, numbers, spaces, hyphens, and apostrophes" }),
  // Coach must be a valid ObjectId string
  coach: z.string({ required_error: "Coach is required", invalid_type_error: "Coach must be a string" })
    .min(1, { message: "Coach cannot be empty" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Coach must be a valid ObjectId" }),
  // Players is an array of valid ObjectId strings, max 25
  players: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Each player ID must be a valid ObjectId" }))
    .max(25, { message: "A team cannot have more than 25 players" })
    .optional()
    .default([])
});


// Schema for updating a team (all fields optional)
export const updateTeamSchema = z.object({
  name: z.string()
    .min(2, { message: "Team name must be at least 2 characters long" })
    .max(100, { message: "Team name must be at most 100 characters long" })
    .regex(/^[a-zA-Z0-9\s'-]+$/, { message: "Team name can only contain letters, numbers, spaces, hyphens, and apostrophes" })
    .optional(),
  coach: z.string({ invalid_type_error: "Coach must be a string" })
    .min(1, { message: "Coach cannot be empty" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Coach must be a valid ObjectId" })
    .optional(),
  players: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Each player ID must be a valid ObjectId" }))
    .max(25, { message: "A team cannot have more than 25 players" })
    .optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});

export type CreateTeamRequest = z.infer<typeof createTeamSchema>;
export type UpdateTeamRequest = z.infer<typeof updateTeamSchema>;