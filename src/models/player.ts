import { ObjectId } from 'mongodb';

export interface Player {
  _id?: ObjectId;
  player_id: string;
  name: string;
  position: string;
  age: number;
  team_id?: string;
}