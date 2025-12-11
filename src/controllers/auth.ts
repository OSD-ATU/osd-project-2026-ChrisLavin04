import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { collections } from '../database';
import { User } from '../models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await collections.users?.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create new user
    const newUser: User = {
      username,
      email,
      password_hash,
      role: role || 'player' // Default role is 'player'
    };

    const result = await collections.users?.insertOne(newUser);

    if (result && result.insertedId) {
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: result.insertedId.toString(), 
          username,
          role: newUser.role 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          _id: result.insertedId,
          username,
          email,
          role: newUser.role
        }
      });
    } else {
      return res.status(500).json({ message: 'Failed to create user' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await collections.users?.findOne({ email }) as User | null;

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id?.toString(), 
        username: user.username,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};
