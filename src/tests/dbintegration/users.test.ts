import request from 'supertest';
import { app } from '../../index';
import { initDb } from '../../database';

describe('User API', () => {
  let userId: string;

  beforeAll(async () => {
    // Initialize database connection for integration tests
    await initDb();
  });
  
  const newUser = {
      "username": "coach_john",
      "email": "john.doe@example.com",
      "password_hash": "$2b$10$abcdefghijklmnopqrstuv",
      "role": "coach"
    };

  test('should create a user and return Location header', async () => {
    

    const res = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(201);

    const location = res.header['location'];

    userId = location;
    expect(userId).toBeDefined();
  }); });
