// Express routes for team endpoints
import { Router } from 'express';
import { getTeams, getTeamById, createTeam, updateTeam, deleteTeam, deleteAllTeams } from '../controllers/teams';
import { validateRequest } from '../middleware/validation';
import { createTeamSchema, updateTeamSchema } from '../validators/teamSchema';
import { authenticateToken, requireAdmin, requireRoles } from '../middleware/auth.middleware';

const router = Router();

// GET all teams
// Players, coaches, and admins can view
router.get('/', authenticateToken, requireRoles(['player', 'coach', 'admin']), getTeams);

// GET team by ID
router.get('/:id', authenticateToken, requireRoles(['player', 'coach', 'admin']), getTeamById);

// POST create new team (authenticated users)
router.post('/', authenticateToken, requireAdmin, validateRequest(createTeamSchema), createTeam);

// PUT update team by ID (authenticated users)
// Only admins can update teams
router.put('/:id', authenticateToken, requireAdmin, validateRequest(updateTeamSchema), updateTeam);

// DELETE all teams (admin only)
router.delete('/', authenticateToken, requireAdmin, deleteAllTeams);

// DELETE team by ID (authenticated users)
router.delete('/:id', authenticateToken, requireAdmin, deleteTeam);

export default router;