import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/users';

const router = Router();

// GET all users
router.get('/', getUsers);

// GET user by ID
router.get('/:id', getUserById);

// POST create new user
router.post('/', createUser);

// PUT update user by ID
router.put('/:id', updateUser);

// DELETE user by ID
router.delete('/:id', deleteUser);

export default router;