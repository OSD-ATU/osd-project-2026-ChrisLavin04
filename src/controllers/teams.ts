import { Request, Response } from 'express';
import { collections } from '../database';
import { Team } from '../models/team';
import { ObjectId } from 'mongodb';


export const getTeams = async (req: Request, res: Response) => {

  try {

    const teams = (await collections.teams?.find({}).toArray()) as unknown as Team[];
    res.status(200).json(teams);

  } catch (error) {
    res.status(500).send("Error retrieving teams");
  }
};


export const getTeamById = async (req: Request, res: Response) => {
  // get a single team by ID from the database

  let id: string = req.params.id;
  try {
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).send(`Invalid team ID format: ${id}`);
    }

    const query = { _id: new ObjectId(id) };
    const team = (await collections.teams?.findOne(query)) as unknown as Team;

    if (team) {
      return res.status(200).json(team);
    } else {
      return res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
  } catch (error) {
    return res.status(500).send(`Error retrieving team with id: ${req.params.id}`);
  }
};


export const createTeam = async (req: Request, res: Response) => {
  // create a new team in the database

  console.log(req.body); //log the data

  const { name, coach, players } = req.body;
  const newTeam: Team = {
    name: name,
    coach: coach,
    players: players || [] // Default to empty array if not provided
  }

  try {
    const result = await collections.teams?.insertOne(newTeam);

    if (result && result.insertedId) {
      const createdTeam = await collections.teams?.findOne({ _id: result.insertedId }) as Team;
      res.status(201).location(`${result.insertedId}`).json({
        message: `Created a new team with id ${result.insertedId}`,
        team: createdTeam
      });
    } else {
      res.status(500).send("Failed to create a new team.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with inserting ${error.message}`);
    } else {
      console.log(`error with ${error}`)
    }
    res.status(400).send(`Unable to create new team`);
  }
};


export const updateTeam = async (req: Request, res: Response) => {
  
  let id: string = req.params.id;
  
  try {
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).send(`Invalid team ID format: ${id}`);
    }

    const query = { _id: new ObjectId(id) };
    const { name, coach, players } = req.body;
    
    const updateData: Partial<Team> = {};
    if (name) updateData.name = name;
    if (coach) updateData.coach = coach;
    if (players) updateData.players = players;

    const result = await collections.teams?.updateOne(query, { $set: updateData });

    if (result && result.modifiedCount > 0) {
      const updatedTeam = await collections.teams?.findOne(query) as Team;
      return res.status(200).json({ 
        message: `Successfully updated team with id ${id}`,
        team: updatedTeam
      });
    } else if (result && result.matchedCount === 0) {
      return res.status(404).send(`Team with id ${id} not found`);
    } else {
      return res.status(304).send(`Team with id ${id} not updated`);
    }
  } catch (error) {
    return res.status(400).send(`Unable to update team with id ${id}`);
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  // logic to delete team by ID from the database

  let id: string = req.params.id;

  try {
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).send(`Invalid team ID format: ${id}`);
    }

    const query = { _id: new ObjectId(id) };
    const result = await collections.teams?.deleteOne(query);

    if (result && result.deletedCount > 0) {
      return res.status(200).json({ message: `Successfully deleted team with id ${id}` });
    } else {
      return res.status(404).send(`Team with id ${id} not found`);
    }
  } catch (error) {
    return res.status(400).send(`Unable to delete team with id ${id}`);
  }
};

export const deleteAllTeams = async (req: Request, res: Response) => {
  // delete all teams from the database
  try {
    const result = await collections.teams?.deleteMany({});
    if (result && result.deletedCount !== undefined) {
      return res.status(200).json({ 
        message: `Successfully deleted ${result.deletedCount} teams`,
        deletedCount: result.deletedCount
      });
    } else {
      return res.status(500).send("Error deleting teams");
    }
  } catch (error) {
    console.error('Error deleting all teams:', error);
    return res.status(500).send("Error deleting teams");
  }
};