import { Router } from 'express';
import { getPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer, deleteAllPlayers } from '../controllers/players';
import { validateRequest } from '../middleware/validation';
import { createPlayerSchema, updatePlayerSchema } from '../validators/playerSchema';

const router = Router();

// GET all players
router.get('/', getPlayers);

// GET player by ID
router.get('/:id', getPlayerById);

// POST create new player
router.post('/', validateRequest(createPlayerSchema), createPlayer);

// PUT update player by ID
router.put('/:id', validateRequest(updatePlayerSchema), updatePlayer);

// DELETE all players
router.delete('/', deleteAllPlayers);

// DELETE player by ID
router.delete('/:id', deletePlayer);

export default router;