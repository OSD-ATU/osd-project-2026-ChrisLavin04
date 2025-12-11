// Express routes for player endpoints
import { Router } from 'express';
import { getPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer, deleteAllPlayers } from '../controllers/players';
import { validateRequest } from '../middleware/validation';
import { createPlayerSchema, updatePlayerSchema } from '../validators/playerSchema';
import { authenticateToken, requireCoach, requireAdmin, requireRoles } from '../middleware/auth.middleware';

const router = Router();

// GET all players
// Players, coaches, and admins can view
router.get('/', authenticateToken, requireRoles(['player', 'coach', 'admin']), getPlayers);

// GET player by ID
router.get('/:id', authenticateToken, requireRoles(['player', 'coach', 'admin']), getPlayerById);

// POST create new player (authenticated users)
// Coaches and admins can create players
router.post('/', authenticateToken, requireRoles(['coach', 'admin']), validateRequest(createPlayerSchema), createPlayer);

// PUT update player by ID (authenticated users)
// Coaches and admins can update players
router.put('/:id', authenticateToken, requireRoles(['coach', 'admin']), validateRequest(updatePlayerSchema), updatePlayer);

// DELETE all players (admin only)
router.delete('/', authenticateToken, requireAdmin, deleteAllPlayers);

// DELETE player by ID (authenticated users)
// Admins can delete players
router.delete('/:id', authenticateToken, requireAdmin, deletePlayer);

export default router;