import { Router } from 'express';
import { register, login } from '../controllers/auth';
import { validateRequest } from '../middleware/validation';
import { registerSchema, loginSchema } from '../validators/authSchema';

const router = Router();

// POST /api/auth/register - Register a new user
router.post('/register', validateRequest(registerSchema), register);

// POST /api/auth/login - Login user
router.post('/login', validateRequest(loginSchema), login);

export default router;
