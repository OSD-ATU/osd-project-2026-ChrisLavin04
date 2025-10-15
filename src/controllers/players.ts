import { Request, Response } from 'express';
import { collections } from '../database';
import { Player } from '../models/player'
import { ObjectId } from 'mongodb';


export const getPlayers = async (req: Request, res: Response) => {

  try {

    const players = (await collections.players?.find({}).toArray()) as unknown as Player[];
    res.status(200).json(players);

  } catch (error) {
    res.status(500).send("Error retrieving players");
  }
};


export const getPlayerById = async (req: Request, res: Response) => {
  // get a single player by ID from the database

  let id: string = req.params.id;
  try {
    // Query by player_id field instead of _id
    const query = { player_id: id };
    const player = (await collections.players?.findOne(query)) as unknown as Player;

    if (player) {
      res.status(200).send(player);
    } else {
      res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
  } catch (error) {
    res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
  }
};


export const createPlayer = async (req: Request, res: Response) => {
  // create a new player in the database

  console.log(req.body); //log the data

  const { player_id, name, position, age, team_id } = req.body;
  const newPlayer : Player = {
    player_id: player_id,
    name: name,
    position: position,
    age: age,
    team_id: team_id
  }

  try {
    const result = await collections.players?.insertOne(newPlayer)

    if (result) {
      res.status(201).location(`${result.insertedId}`).json({ message: `Created a new player with id ${result.insertedId}` })
          }
    else {
      res.status(500).send("Failed to create a new player.");
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
    res.status(400).send(`Unable to create new player`);
}
};


export const updatePlayer = async (req: Request, res: Response) => {
  
  let id: string = req.params.id;
  
  try {
    // Query by player_id field instead of _id
    const query = { player_id: id };
    const { player_id, name, position, age, team_id } = req.body;
    
    const updateData: Partial<Player> = {};
    if (player_id) updateData.player_id = player_id;
    if (name) updateData.name = name;
    if (position) updateData.position = position;
    if (age) updateData.age = age;
    if (team_id) updateData.team_id = team_id;

    const result = await collections.players?.updateOne(query, { $set: updateData });

    if (result && result.modifiedCount > 0) {
      res.status(200).json({ message: `Successfully updated player with id ${id}` });
    } else if (result && result.matchedCount === 0) {
      res.status(404).send(`Player with id ${id} not found`);
    } else {
      res.status(304).send(`Player with id ${id} not updated`);
    }
  } catch (error) {
    res.status(400).send(`Unable to update player with id ${id}`);
  }
};

export const deletePlayer = async (req: Request, res: Response) => {
  // logic to delete player by ID from the database

  let id: string = req.params.id;

  try {
    // Query by player_id field instead of _id
    const query = { player_id: id };
    const result = await collections.players?.deleteOne(query);

    if (result && result.deletedCount > 0) {
      res.status(200).json({ message: `Successfully deleted player with id ${id}` });
    } else {
      res.status(404).send(`Player with id ${id} not found`);
    }
  } catch (error) {
    res.status(400).send(`Unable to delete player with id ${id}`);
  }
};