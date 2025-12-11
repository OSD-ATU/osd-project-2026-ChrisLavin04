import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser, deleteAllUsers } from '../controllers/users';
import { validateRequest } from '../middleware/validation';
import { createUserSchema, updateUserSchema } from '../validators/userSchema';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// GET all users
router.get('/', getUsers);

// GET user by ID
router.get('/:id', getUserById);

// POST create new user (admin only)
router.post('/', authenticateToken, requireAdmin, validateRequest(createUserSchema), createUser);

// PUT update user by ID (authenticated users)
router.put('/:id', authenticateToken, validateRequest(updateUserSchema), updateUser);

// DELETE all users (admin only)
router.delete('/', authenticateToken, requireAdmin, deleteAllUsers);

// DELETE user by ID (admin only)
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);

export default router;