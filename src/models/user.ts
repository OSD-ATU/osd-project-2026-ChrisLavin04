import { ObjectId } from 'mongodb';


// User object stored in the database
export interface User {
  _id?: ObjectId; // MongoDB ID
  username: string;
  email: string;
  password_hash: string;
  role: string;
}


// User object sent in API responses (no password)
export interface UserResponse {
  _id: ObjectId;
  username: string;
  email: string;
  role: string;
}


// Convert a User to a UserResponse (removes password)
export const toUserResponse = (user: User): UserResponse => {
  return {
    _id: user._id!,
    username: user.username,
    email: user.email,
    role: user.role
  };
};