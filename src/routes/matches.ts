// Express routes for match endpoints
import { Router } from 'express';
import { getMatches, getMatchById, createMatch, updateMatch, deleteMatch, deleteAllMatches } from '../controllers/matches';
import { validateRequest } from '../middleware/validation';
import { createMatchSchema, updateMatchSchema } from '../validators/matchSchema';
import { authenticateToken, requireAdmin, requireRoles } from '../middleware/auth.middleware';

const router = Router();

// GET all matches
// Players, coaches, and admins can view
router.get('/', authenticateToken, requireRoles(['player', 'coach', 'admin']), getMatches);

// GET match by ID
router.get('/:id', authenticateToken, requireRoles(['player', 'coach', 'admin']), getMatchById);

// POST create new match (authenticated users)
// Coaches and admins can create matches
router.post('/', authenticateToken, requireRoles(['coach', 'admin']), validateRequest(createMatchSchema), createMatch);

// PUT update match by ID (authenticated users)
// Coaches and admins can update matches
router.put('/:id', authenticateToken, requireRoles(['coach', 'admin']), validateRequest(updateMatchSchema), updateMatch);

// DELETE all matches (admin only)
router.delete('/', authenticateToken, requireAdmin, deleteAllMatches);

// DELETE match by ID (authenticated users)
// Coaches and admins can delete matches
router.delete('/:id', authenticateToken, requireRoles(['coach', 'admin']), deleteMatch);

export default router;