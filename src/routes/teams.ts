// Express routes for team endpoints
import { Router } from 'express';
import { getTeams, getTeamById, createTeam, updateTeam, deleteTeam, deleteAllTeams } from '../controllers/teams';
import { validateRequest } from '../middleware/validation';
import { createTeamSchema, updateTeamSchema } from '../validators/teamSchema';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// GET all teams
router.get('/', getTeams);

// GET team by ID
router.get('/:id', getTeamById);

// POST create new team (authenticated users)
router.post('/', authenticateToken, validateRequest(createTeamSchema), createTeam);

// PUT update team by ID (authenticated users)
router.put('/:id', authenticateToken, validateRequest(updateTeamSchema), updateTeam);

// DELETE all teams (admin only)
router.delete('/', authenticateToken, requireAdmin, deleteAllTeams);

// DELETE team by ID (authenticated users)
router.delete('/:id', authenticateToken, deleteTeam);

export default router;