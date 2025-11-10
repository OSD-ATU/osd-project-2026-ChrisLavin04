import { Request, Response } from 'express';
import { collections } from '../database';
import { User, UserResponse, toUserResponse } from '../models/user'
import { ObjectId } from 'mongodb';


export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = (await collections.users?.find({}).toArray()) as unknown as User[];
    const userResponses = users.map(toUserResponse);
    res.status(200).json(userResponses);
  } catch (error) {
    res.status(500).send("Error retrieving users");
  }
};


export const getUserById = async (req: Request, res: Response) => {
  // get a single user by ID from the database

  let id: string = req.params.id;
  try {
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).send(`Invalid user ID format: ${id}`);
    }

    const query = { _id: new ObjectId(id) };
    const user = (await collections.users?.findOne(query)) as unknown as User;

    if (user) {
      const userResponse = toUserResponse(user);
      return res.status(200).json(userResponse);
    } else {
      return res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
  } catch (error) {
    return res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
  }
};


export const createUser = async (req: Request, res: Response) => {
  // create a new user in the database

  console.log(req.body); // log the data

  const { username, email, password_hash, role } = req.body;
  const newUser: User = {
    username: username,
    email: email,
    password_hash: password_hash,
    role: role
  }

  try {
    const result = await collections.users?.insertOne(newUser);

    if (result && result.insertedId) {
      const createdUser = await collections.users?.findOne({ _id: result.insertedId }) as User;
      const userResponse = toUserResponse(createdUser);
      res.status(201).location(`${result.insertedId}`).json({
        message: `Created a new user with id ${result.insertedId}`,
        user: userResponse
      });
    } else {
      res.status(500).send("Failed to create a new user.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with inserting ${error.message}`);
    } else {
      console.log(`error with ${error}`)
    }
    res.status(400).send(`Unable to create new user`);
  }
};


export const updateUser = async (req: Request, res: Response) => {
  
  let id: string = req.params.id;
  
  try {
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).send(`Invalid user ID format: ${id}`);
    }

    const query = { _id: new ObjectId(id) };
    const { username, email, password_hash, role } = req.body;
    
    const updateData: Partial<User> = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password_hash) updateData.password_hash = password_hash;
    if (role) updateData.role = role;

    const result = await collections.users?.updateOne(query, { $set: updateData });

    if (result && result.modifiedCount > 0) {
      // Return updated user without password hash
      const updatedUser = await collections.users?.findOne(query) as User;
      const userResponse = toUserResponse(updatedUser);
      return res.status(200).json({ 
        message: `Successfully updated user with id ${id}`,
        user: userResponse
      });
    } else if (result && result.matchedCount === 0) {
      return res.status(404).send(`User with id ${id} not found`);
    } else {
      return res.status(304).send(`User with id ${id} not updated`);
    }
  } catch (error) {
    return res.status(400).send(`Unable to update user with id ${id}`);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  // logic to delete user by ID from the database

  let id: string = req.params.id;

  try {
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).send(`Invalid user ID format: ${id}`);
    }

    const query = { _id: new ObjectId(id) };
    const result = await collections.users?.deleteOne(query);

    if (result && result.deletedCount > 0) {
      return res.status(200).json({ message: `Successfully deleted user with id ${id}` });
    } else {
      return res.status(404).send(`User with id ${id} not found`);
    }
  } catch (error) {
    return res.status(400).send(`Unable to delete user with id ${id}`);
  }
};

export const deleteAllUsers = async (req: Request, res: Response) => {
  // delete all users from the database
  try {
    const result = await collections.users?.deleteMany({});
    if (result && result.deletedCount !== undefined) {
      return res.status(200).json({ 
        message: `Successfully deleted ${result.deletedCount} users`,
        deletedCount: result.deletedCount
      });
    } else {
      return res.status(500).send("Error deleting users");
    }
  } catch (error) {
    console.error('Error deleting all users:', error);
    return res.status(500).send("Error deleting users");
  }
};
