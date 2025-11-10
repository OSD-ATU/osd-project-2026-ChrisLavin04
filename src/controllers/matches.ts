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
        // Validate ObjectId format
        if (!ObjectId.isValid(matchId)) {
            return res.status(400).send(`Invalid match ID format: ${matchId}`);
        }

        const query = { _id: new ObjectId(matchId) };
        const match = (await collections.matches?.findOne(query)) as unknown as Match;
        if (match) {
            return res.status(200).json(match);
        } else {
            return res.status(404).send("Match not found");
        }
    } catch (error) {
        return res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
};
export const createMatch = async (req: Request, res: Response) => {
    // create a new match in the database
    console.log(req.body); //log the data

    const { home_team_id, away_team_id, date, score } = req.body;
    const newMatch: Match = {
        home_team_id: home_team_id,
        away_team_id: away_team_id,
        date: date,
        score: score || { home: 0, away: 0 } // Default score if not provided
    }

    try {
        const result = await collections.matches?.insertOne(newMatch);
        if (result && result.insertedId) {
            const createdMatch = await collections.matches?.findOne({ _id: result.insertedId }) as Match;
            res.status(201).location(`${result.insertedId}`).json({
                message: `Created a new match with id ${result.insertedId}`,
                match: createdMatch
            });
        } else {
            res.status(500).send("Failed to create a new match.");
        }
    } catch (error) {
        res.status(500).send("Error creating match");
    }
};

export const updateMatch = async (req: Request, res: Response) => {
    // update a match by ID in the database
    let matchId: string = req.params.id;
    
    try {
        // Validate ObjectId format
        if (!ObjectId.isValid(matchId)) {
            return res.status(400).send(`Invalid match ID format: ${matchId}`);
        }

        const query = { _id: new ObjectId(matchId) };
        const { home_team_id, away_team_id, date, score } = req.body;
        
        const updateData: Partial<Match> = {};
        if (home_team_id) updateData.home_team_id = home_team_id;
        if (away_team_id) updateData.away_team_id = away_team_id;
        if (date) updateData.date = date;
        if (score) updateData.score = score;

        const result = await collections.matches?.updateOne(query, { $set: updateData });
        
        if (result && result.modifiedCount > 0) {
            const updatedMatch = await collections.matches?.findOne(query) as Match;
            return res.status(200).json({ 
                message: `Successfully updated match with id ${matchId}`,
                match: updatedMatch
            });
        } else if (result && result.matchedCount === 0) {
            return res.status(404).send(`Match with id ${matchId} not found`);
        } else {
            return res.status(304).send(`Match with id ${matchId} not updated`);
        }
    } catch (error) {
        console.error('Error updating match:', error);
        return res.status(500).send("Error updating match");
    }
};
export const deleteMatch = async (req: Request, res: Response) => {
    // delete a match by ID from the database
    let matchId: string = req.params.id;
    try {
        // Validate ObjectId format
        if (!ObjectId.isValid(matchId)) {
            return res.status(400).send(`Invalid match ID format: ${matchId}`);
        }

        const query = { _id: new ObjectId(matchId) };
        const result = await collections.matches?.deleteOne(query);
        if (result && result.deletedCount) {
            return res.status(200).json({ message: `Successfully deleted match with id ${matchId}` });
        } else {
            return res.status(404).send(`Match with id ${matchId} not found`);
        }
    } catch (error) {
        console.error('Error deleting match:', error);
        return res.status(500).send("Error deleting match");
    }
};
