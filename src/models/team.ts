import { ObjectId } from 'mongodb';

export interface Team {
  _id?: ObjectId;
  team_id: string;
  name: string;
  coach: string; // For now, just a string reference (ignoring actual User reference as requested)
  players: string[]; // Array of Player IDs as strings (ignoring actual Player references as requested)
}