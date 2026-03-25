import request from 'supertest';
import { app } from '../../index';
import { initDb } from '../../database';

describe('Player API', () => {
  let playerId: string;
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

  const newPlayer = {
    name: "John Smith",
    position: "Forward",
    age: 25,
    team_id: "507f1f77bcf86cd799439011"
  };

  test('should create a player and return Location header', async () => {
    const res = await request(app)
      .post('/api/players')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newPlayer)
      .expect(201);

    const location = res.header['location'];
    playerId = location;
    expect(playerId).toBeDefined();
  });
});