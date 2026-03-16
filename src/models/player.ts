import { ObjectId } from 'mongodb';

export interface Player {
  // Player object for database and API
  _id?: ObjectId;
  name: string;
  position: string;
  age: number;
  team_id?: string; // Keep team_id as reference to team ObjectId
  goals?: number;
  assists?: number;
  matchesPlayed?: number;
}