import { Request, Response } from 'express';
import { collections } from '../database';
import { User } from '../models/user'
import { ObjectId } from 'mongodb';


export const getUsers = async (req: Request, res: Response) => {

  try {

    const users = (await collections.users?.find({}).toArray()) as unknown as User[];
    res.status(200).json(users);

  } catch (error) {
    res.status(500).send("oppss");
  }
};


export const getUserById = async (req: Request, res: Response) => {
  //get a single  user by ID from the database

  let id: string = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const user = (await collections.users?.findOne(query)) as unknown as User;

    if (user) {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
  }
};


export const createUser = async (req: Request, res: Response) => {
  // create a new user in the database

  console.log(req.body); //for now still log the data

  const { username, email, password_hash, role } = req.body;
  const newUser : User = {
    username: username,
    email: email,
    password_hash: password_hash,
    role: role
  }

  try {
    const result = await collections.users?.insertOne(newUser)

    if (result) {
      res.status(201).location(`${result.insertedId}`).json({ message: `Created a new user with id ${result.insertedId}` })
          }
    else {
      res.status(500).send("Failed to create a new user.");
    }
  }
catch (error) {
    if (error instanceof Error)
    {
     console.log(`issue with inserting ${error.message}`);
    }
    else{
      console.log(`error with ${error}`)
    }
    res.status(400).send(`Unable to create new user`);
}
};


export const updateUser = async (req: Request, res: Response) => {
  
  let id: string = req.params.id;
  
  try {
    const query = { _id: new ObjectId(id) };
    const { username, email, password_hash, role } = req.body;
    
    const updateData: Partial<User> = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password_hash) updateData.password_hash = password_hash;
    if (role) updateData.role = role;

    const result = await collections.users?.updateOne(query, { $set: updateData });

    if (result && result.modifiedCount > 0) {
      res.status(200).json({ message: `Successfully updated user with id ${id}` });
    } else if (result && result.matchedCount === 0) {
      res.status(404).send(`User with id ${id} not found`);
    } else {
      res.status(304).send(`User with id ${id} not updated`);
    }
  } catch (error) {
    res.status(400).send(`Unable to update user with id ${id}`);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  // logic to delete user by ID from the database

  let id: string = req.params.id;

  try {
    const query = { _id: new ObjectId(id) };
    const result = await collections.users?.deleteOne(query);

    if (result && result.deletedCount > 0) {
      res.status(200).json({ message: `Successfully deleted user with id ${id}` });
    } else {
      res.status(404).send(`User with id ${id} not found`);
    }
  } catch (error) {
    res.status(400).send(`Unable to delete user with id ${id}`);
  }
};
