import request from 'supertest';
import { app } from '../../index';
import { initDb } from '../../database';

describe('User API', () => {
  let userId: string;
  let adminToken: string;

  beforeAll(async () => {
    await initDb();
    // Register admin user (ignore errors if already exists)
    try {
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'admin',
          email: 'admin@football.com',
          password: 'admin123',
          role: 'admin'
        });
    } catch (e) {}
    // Login as admin to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@football.com', password: 'admin123' });
    adminToken = loginRes.body.token;
  });

  const newUser = {
    username: "coach_john",
    email: "john.doe@example.com",
    password_hash: "$2b$10$abcdefghijklmnopqrstuv",
    role: "coach"
  };

  test('should create a user and return Location header or trigger validation', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newUser);

    // Pass if user is created or if validation triggers (409 Conflict)
    expect([201, 409]).toContain(res.status);
    if (res.status === 201) {
      const location = res.header['location'];
      userId = location;
      expect(userId).toBeDefined();
    } else {
      // 409 means validation for duplicate user/email worked
      expect(res.body.message).toMatch(/already used|already exists/i);
    }
  });
});
