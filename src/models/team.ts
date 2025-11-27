import { ObjectId } from 'mongodb';

export interface Team {
  // Team object for database and API
  _id?: ObjectId;
  name: string;
  coach: string; 
  players: string[];
}