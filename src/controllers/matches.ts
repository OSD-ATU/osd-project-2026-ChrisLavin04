import { Request, Response } from 'express';
import { collections } from '../database';
import { Match } from '../models/match'
import { ObjectId } from 'mongodb'

export const getMatches = async (req: Request, res: Response) => {
    try {
        const matches = (await collections.matches?.find({}).toArray()) as unknown as Match[];
        res.status(200).json(matches);
    } catch (error) {
        res.status(500).send("Error retrieving matches");
    }
};


export const getMatchById = async (req: Request, res: Response) => {
    // get a single match by ID from the database
    let matchId: string = req.params.id;
    try {
        const query = { match_id: matchId };
        const match = (await collections.matches?.findOne(query)) as unknown as Match;
        if (match) {
            res.status(200).send(match);
        } else {
            res.status(404).send("Match not found");
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with match_id: ${req.params.id}`);
    }
};
export const createMatch = async (req: Request, res: Response) => {
    // create a new match in the database
    console.log(req.body); //log the data

    const { match_id, home_team_id, away_team_id, date, score } = req.body;
    const newMatch: Match = {
        match_id: match_id,
        home_team_id: home_team_id,
        away_team_id: away_team_id,
        date: date,
        score: score || { home: 0, away: 0 } // Default score if not provided
    }

    try {
        const result = await collections.matches?.insertOne(newMatch)
        if (result) {
            res.status(201).location(`${result.insertedId}`).json({ message: `Created a new match with id ${result.insertedId}` })
        }
    } catch (error) {
        res.status(500).send("Error creating match");
    }
};

export const updateMatch = async (req: Request, res: Response) => {
    // update a match by ID in the database
    let matchId: string = req.params.id;
    const { match_id, home_team_id, away_team_id, date, score } = req.body;
    const updatedMatch: Match = {
        match_id: match_id,
        home_team_id: home_team_id,
        away_team_id: away_team_id,
        date: date,
        score: score
    };
    try {
        const query = { match_id: matchId };
        const result = await collections.matches?.updateOne(query, { $set: updatedMatch });
        if (result && result.matchedCount) {
            res.status(200).send(`Updated match with match_id: ${matchId}`);
        } else {
            res.status(404).send(`Match with match_id: ${matchId} not found`);
        }
    } catch (error) {
        console.error('Error updating match:', error);
        res.status(500).send("Error updating match");
    }
};
export const deleteMatch = async (req: Request, res: Response) => {
    // delete a match by ID from the database
    let matchId: string = req.params.id;
    try {
        const query = { match_id: matchId };
        const result = await collections.matches?.deleteOne(query);
        if (result && result.deletedCount) {
            res.status(200).send(`Deleted match with match_id: ${matchId}`);
        } else {
            res.status(404).send(`Match with match_id: ${matchId} not found`);
        }
    } catch (error) {
        console.error('Error deleting match:', error);
        res.status(500).send("Error deleting match");
    }
};
