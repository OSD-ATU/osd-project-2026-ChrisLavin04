import request from 'supertest';
import { app } from '../../index';
import { initDb } from '../../database';

describe('Team API', () => {
  let teamId: string;
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

  const newTeam = {
    name: "Manchester United",
    coach: "507f1f77bcf86cd799439011",
    players: ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"]
  };

  test('should create a team and return Location header', async () => {
    const res = await request(app)
      .post('/api/teams')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newTeam)
      .expect(201);

    const location = res.header['location'];
    teamId = location;
    expect(teamId).toBeDefined();
  });
});