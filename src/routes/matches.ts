// Express routes for match endpoints
import { Router } from 'express';
import { getMatches, getMatchById, createMatch, updateMatch, deleteMatch, deleteAllMatches } from '../controllers/matches';
import { validateRequest } from '../middleware/validation';
import { createMatchSchema, updateMatchSchema } from '../validators/matchSchema';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// GET all matches
router.get('/', getMatches);

// GET match by ID
router.get('/:id', getMatchById);

// POST create new match (authenticated users)
router.post('/', authenticateToken, validateRequest(createMatchSchema), createMatch);

// PUT update match by ID (authenticated users)
router.put('/:id', authenticateToken, validateRequest(updateMatchSchema), updateMatch);

// DELETE all matches (admin only)
router.delete('/', authenticateToken, requireAdmin, deleteAllMatches);

// DELETE match by ID (authenticated users)
router.delete('/:id', authenticateToken, deleteMatch);

export default router;