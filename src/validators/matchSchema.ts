import { z } from 'zod';

const scoreSchema = z.union([
  z.number().int().min(0, { message: "Score must be a non-negative integer" }),
  z.object({
    home: z.number().int().min(0, { message: "Home score must be a non-negative integer" }),
    away: z.number().int().min(0, { message: "Away score must be a non-negative integer" })
  })
]);

export const createMatchSchema = z.object({
  home_team_id: z.string() // Validate Home Team ID
    .min(1, { message: "Home team ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Home team ID must be a valid ObjectId" }),
  
  away_team_id: z.string() // Validate Away Team ID
    .min(1, { message: "Away team ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Away team ID must be a valid ObjectId" }),
  
    score: scoreSchema.optional().default({ home: 0, away: 0 }), // Validate Score
  
  date: z.string() // Validate Date
    .datetime({ message: "Date must be a valid ISO datetime string" })
    .or(z.date())
    .transform((val) => new Date(val))
}).refine((data) => data.home_team_id !== data.away_team_id, {
  message: "Home team and away team cannot be the same",
  path: ["away_team_id"]
});

export const updateMatchSchema = z.object({
  home_team_id: z.string() // Validate Home Team ID
    .min(1, { message: "Home team ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Home team ID must be a valid ObjectId" })
    .optional(),
  
  away_team_id: z.string() // Validate Away Team ID
    .min(1, { message: "Away team ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Away team ID must be a valid ObjectId" })
    .optional(),
  
  score: scoreSchema.optional(),
  
  date: z.string() // Validate Date
    .datetime({ message: "Date must be a valid ISO datetime string" })
    .or(z.date())
    .transform((val) => new Date(val))
    .optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
}).refine((data) => {
  if (data.home_team_id && data.away_team_id) {
    return data.home_team_id !== data.away_team_id;
  }
  return true;
}, {
  message: "Home team and away team cannot be the same",
  path: ["away_team_id"]
});

export type CreateMatchRequest = z.infer<typeof createMatchSchema>;
export type UpdateMatchRequest = z.infer<typeof updateMatchSchema>;