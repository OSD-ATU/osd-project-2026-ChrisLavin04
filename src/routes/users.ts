import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser, deleteAllUsers } from '../controllers/users';
import { validateRequest } from '../middleware/validation';
import { createUserSchema, updateUserSchema } from '../validators/userSchema';

const router = Router();

// GET all users
router.get('/', getUsers);

// GET user by ID
router.get('/:id', getUserById);

// POST create new user
router.post('/', validateRequest(createUserSchema), createUser);

// PUT update user by ID
router.put('/:id', validateRequest(updateUserSchema), updateUser);

// DELETE all users
router.delete('/', deleteAllUsers);

// DELETE user by ID
router.delete('/:id', deleteUser);

export default router;