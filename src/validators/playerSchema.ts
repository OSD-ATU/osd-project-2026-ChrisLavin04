import { z } from 'zod';

export const createPlayerSchema = z.object({
  name: z.string() //Validat
    .min(2, { message: "Player name must be at least 2 characters long" })
    .max(100, { message: "Player name must be at most 100 characters long" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Player name can only contain letters, spaces, hyphens, and apostrophes" }),
  
    position: z.enum(['Goalkeeper', 'Defender', 'Midfielder', 'Forward'], { // Validate Position
    message: "Position must be one of: Goalkeeper, Defender, Midfielder, Forward"
  }),
  
  age: z.number() //Validate Age
    .int({ message: "Age must be a whole number" })
    .min(16, { message: "Player must be at least 16 years old" })
    .max(45, { message: "Player cannot be older than 45 years" }),
  
  team_id: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Team ID must be a valid ObjectId" }) // Validate Team ID
    .optional()
});

//Same validation as create but all fields optional
export const updatePlayerSchema = z.object({
  name: z.string() // Validate Name
    .min(2, { message: "Player name must be at least 2 characters long" })
    .max(100, { message: "Player name must be at most 100 characters long" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Player name can only contain letters, spaces, hyphens, and apostrophes" })
    .optional(),
  
  position: z.enum(['Goalkeeper', 'Defender', 'Midfielder', 'Forward'], { // Validate Position
    message: "Position must be one of: Goalkeeper, Defender, Midfielder, Forward"
  }).optional(),
  
  age: z.number() // Validate Age
    .int({ message: "Age must be a whole number" })
    .min(16, { message: "Player must be at least 16 years old" })
    .max(45, { message: "Player cannot be older than 45 years" })
    .optional(),
  
  team_id: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Team ID must be a valid ObjectId" }) // Validate Team ID
    .optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});

export type CreatePlayerRequest = z.infer<typeof createPlayerSchema>;
export type UpdatePlayerRequest = z.infer<typeof updatePlayerSchema>;