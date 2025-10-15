import { z } from 'zod';

export const createPlayerSchema = z.object({
  player_id: z.string()
    .min(1, { message: "Player ID is required" })
    .max(20, { message: "Player ID must be at most 20 characters long" })
    .regex(/^P\d{3,}$/, { message: "Player ID must follow format P001, P002, etc." }),
  
  name: z.string()
    .min(2, { message: "Player name must be at least 2 characters long" })
    .max(100, { message: "Player name must be at most 100 characters long" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Player name can only contain letters, spaces, hyphens, and apostrophes" }),
  
  position: z.enum(['Goalkeeper', 'Defender', 'Midfielder', 'Forward'], {
    message: "Position must be one of: Goalkeeper, Defender, Midfielder, Forward"
  }),
  
  age: z.number()
    .int({ message: "Age must be a whole number" })
    .min(16, { message: "Player must be at least 16 years old" })
    .max(45, { message: "Player cannot be older than 45 years" }),
  
  team_id: z.string()
    .regex(/^T\d{3,}$/, { message: "Team ID must follow format T001, T002, etc." })
    .optional()
});

export const updatePlayerSchema = z.object({
  player_id: z.string()
    .min(1, { message: "Player ID is required" })
    .max(20, { message: "Player ID must be at most 20 characters long" })
    .regex(/^P\d{3,}$/, { message: "Player ID must follow format P001, P002, etc." })
    .optional(),
  
  name: z.string()
    .min(2, { message: "Player name must be at least 2 characters long" })
    .max(100, { message: "Player name must be at most 100 characters long" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Player name can only contain letters, spaces, hyphens, and apostrophes" })
    .optional(),
  
  position: z.enum(['Goalkeeper', 'Defender', 'Midfielder', 'Forward'], {
    message: "Position must be one of: Goalkeeper, Defender, Midfielder, Forward"
  }).optional(),
  
  age: z.number()
    .int({ message: "Age must be a whole number" })
    .min(16, { message: "Player must be at least 16 years old" })
    .max(45, { message: "Player cannot be older than 45 years" })
    .optional(),
  
  team_id: z.string()
    .regex(/^T\d{3,}$/, { message: "Team ID must follow format T001, T002, etc." })
    .optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});

export type CreatePlayerRequest = z.infer<typeof createPlayerSchema>;
export type UpdatePlayerRequest = z.infer<typeof updatePlayerSchema>;