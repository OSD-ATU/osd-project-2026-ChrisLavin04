import { ObjectId } from 'mongodb';

export interface Team {
  _id?: ObjectId;
  name: string;
  coach: string; 
  players: string[];
}