import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  user_id: string;
  username: string;
  email: string;
  password_hash: string;
  role: string;
}