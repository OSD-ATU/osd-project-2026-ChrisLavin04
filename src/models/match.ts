import { ObjectId } from 'mongodb';

export interface Match {
  _id?: ObjectId;
  match_id: string;
  home_team_id: string;
  away_team_id: string;
  score: number | { home: number; away: number };
  date: Date;
}