import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  password_hash: string;
  role: string;
}

// Interface for API responses (excludes password_hash)
export interface UserResponse {
  _id: ObjectId;
  username: string;
  email: string;
  role: string;
}

// Helper function to convert User to UserResponse
export const toUserResponse = (user: User): UserResponse => {
  return {
    _id: user._id!,
    username: user.username,
    email: user.email,
    role: user.role
  };
};