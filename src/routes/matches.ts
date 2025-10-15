import { Router } from 'express';
import { getMatches, getMatchById, createMatch, updateMatch, deleteMatch } from '../controllers/matches';

const router = Router();

// GET all matches
router.get('/', getMatches);

// GET match by ID
router.get('/:id', getMatchById);

// POST create new match
router.post('/', createMatch);

// PUT update match by ID
router.put('/:id', updateMatch);

// DELETE match by ID
router.delete('/:id', deleteMatch);

export default router;