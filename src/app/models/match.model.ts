export interface Match {
  _id?: string;
  home_team_id: string;
  away_team_id: string;
  score?: { home: number; away: number };
  date: string;
}
