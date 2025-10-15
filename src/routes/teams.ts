import { Router } from 'express';
import { getTeams, getTeamById, createTeam, updateTeam, deleteTeam } from '../controllers/teams';

const router = Router();

// GET all teams
router.get('/', getTeams);

// GET team by ID
router.get('/:id', getTeamById);

// POST create new team
router.post('/', createTeam);

// PUT update team by ID
router.put('/:id', updateTeam);

// DELETE team by ID
router.delete('/:id', deleteTeam);

export default router;