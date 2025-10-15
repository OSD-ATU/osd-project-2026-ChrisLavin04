import { Router } from 'express';
import { getPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer } from '../controllers/players';

const router = Router();

// GET all players
router.get('/', getPlayers);

// GET player by ID
router.get('/:id', getPlayerById);

// POST create new player
router.post('/', createPlayer);

// PUT update player by ID
router.put('/:id', updatePlayer);

// DELETE player by ID
router.delete('/:id', deletePlayer);

export default router;