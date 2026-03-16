export interface Player {
  _id?: string;
  name: string;
  position: string;
  age: number;
  team_id?: string;
  goals?: number;
  assists?: number;
  matchesPlayed?: number;
}
