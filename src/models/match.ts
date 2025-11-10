import { ObjectId } from 'mongodb';

export interface Match {
  _id?: ObjectId;
  home_team_id: string;
  away_team_id: string;
  score: number | { home: number; away: number };
  date: Date;
}