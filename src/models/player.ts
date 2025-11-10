import { ObjectId } from 'mongodb';

export interface Player {
  _id?: ObjectId;
  name: string;
  position: string;
  age: number;
  team_id?: string; // Keep team_id as reference to team ObjectId
}