import { Router } from 'express';
import { getTeams, getTeamById, createTeam, updateTeam, deleteTeam } from '../controllers/teams';
import { validateRequest } from '../middleware/validation';
import { createTeamSchema, updateTeamSchema } from '../validators/teamSchema';

const router = Router();

// GET all teams
router.get('/', getTeams);

// GET team by ID
router.get('/:id', getTeamById);

// POST create new team
router.post('/', validateRequest(createTeamSchema), createTeam);

// PUT update team by ID
router.put('/:id', validateRequest(updateTeamSchema), updateTeam);

// DELETE team by ID
router.delete('/:id', deleteTeam);

export default router;