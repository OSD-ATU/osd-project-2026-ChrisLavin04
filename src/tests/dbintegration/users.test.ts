import request from 'supertest';
import { app } from '../../index';
import { connectToDatabase, collections } from '../../database';

describe('Users API Integration Tests', () => {

  beforeAll(async () => {
    // Connect to the database before running tests
    await connectToDatabase();
  });

  beforeEach(async () => {
    // Clear the users collection before each test
    await collections.users?.deleteMany({});
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        username: 'test_coach',
        email: 'test@example.com',
        password_hash: '$2b$10$testhashedpassword',
        role: 'coach'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);

      expect(response.body.message).toContain('Created a new user with id');
    });

    it('should validate required fields', async () => {
      const incompleteUser = {
        username: 'test_user'
        // Missing required fields
      };

      await request(app)
        .post('/api/users')
        .send(incompleteUser)
        .expect(400);
    });
  });

  describe('GET /api/users', () => {
    it('should get all users', async () => {
      // Insert test data
      const testUser = {
        username: 'test_user',
        email: 'test@example.com',
        password_hash: '$2b$10$testhashedpassword',
        role: 'player'
      };
      
      await collections.users?.insertOne(testUser);

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].username).toBe('test_user');
      expect(response.body[0].role).toBe('player');
    });

    it('should return empty array when no users exist', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get a user by ID', async () => {
      const testUser = {
        username: 'test_user',
        email: 'test@example.com',
        password_hash: '$2b$10$testhashedpassword',
        role: 'player'
      };
      
      const result = await collections.users?.insertOne(testUser);
      const userId = result?.insertedId.toString();

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.username).toBe('test_user');
      expect(response.body.email).toBe('test@example.com');
      expect(response.body.role).toBe('player');
    });

    it('should return 404 for non-existent user', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      
      await request(app)
        .get(`/api/users/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user', async () => {
      const testUser = {
        username: 'test_user',
        email: 'test@example.com',
        password_hash: '$2b$10$testhashedpassword',
        role: 'player'
      };
      
      const result = await collections.users?.insertOne(testUser);
      const userId = result?.insertedId.toString();

      const updateData = {
        username: 'updated_user',
        role: 'coach'
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.message).toContain('Successfully updated user');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      const testUser = {
        username: 'test_user',
        email: 'test@example.com',
        password_hash: '$2b$10$testhashedpassword',
        role: 'player'
      };
      
      const result = await collections.users?.insertOne(testUser);
      const userId = result?.insertedId.toString();

      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.message).toContain('Successfully deleted user');
    });

    it('should return 404 when deleting non-existent user', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      
      await request(app)
        .delete(`/api/users/${nonExistentId}`)
        .expect(404);
    });
  });
});
