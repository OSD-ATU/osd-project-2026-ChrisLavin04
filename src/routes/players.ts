// Express routes for player endpoints
import { Router } from 'express';
import { getPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer, deleteAllPlayers } from '../controllers/players';
import { validateRequest } from '../middleware/validation';
import { createPlayerSchema, updatePlayerSchema } from '../validators/playerSchema';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// GET all players
router.get('/', getPlayers);

// GET player by ID
router.get('/:id', getPlayerById);

// POST create new player (authenticated users)
router.post('/', authenticateToken, validateRequest(createPlayerSchema), createPlayer);

// PUT update player by ID (authenticated users)
router.put('/:id', authenticateToken, validateRequest(updatePlayerSchema), updatePlayer);

// DELETE all players (admin only)
router.delete('/', authenticateToken, requireAdmin, deleteAllPlayers);

// DELETE player by ID (authenticated users)
router.delete('/:id', authenticateToken, deletePlayer);

export default router;