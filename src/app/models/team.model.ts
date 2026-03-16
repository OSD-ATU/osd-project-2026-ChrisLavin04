export interface Team {
  _id?: string;
  name: string;
  coach?: string; // User ID of assigned coach
  players?: string[]; // Array of player IDs
}
