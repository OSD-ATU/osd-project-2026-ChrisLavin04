// Express routes for match endpoints
import { Router } from 'express';
import { getMatches, getMatchById, createMatch, updateMatch, deleteMatch, deleteAllMatches } from '../controllers/matches';
import { validateRequest } from '../middleware/validation';
import { createMatchSchema, updateMatchSchema } from '../validators/matchSchema';

const router = Router();

// GET all matches
router.get('/', getMatches);

// GET match by ID
router.get('/:id', getMatchById);

// POST create new match
router.post('/', validateRequest(createMatchSchema), createMatch);

// PUT update match by ID
router.put('/:id', validateRequest(updateMatchSchema), updateMatch);

// DELETE all matches
router.delete('/', deleteAllMatches);

// DELETE match by ID
router.delete('/:id', deleteMatch);

export default router;