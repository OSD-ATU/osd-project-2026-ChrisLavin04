import request from 'supertest';
import { app } from '../../index';
import { initDb } from '../../database';

describe('Match API', () => {
  let matchId: string;
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

  const newMatch = {
    home_team_id: "507f1f77bcf86cd799439011",
    away_team_id: "507f1f77bcf86cd799439012", 
    score: {
      home: 2,
      away: 1
    },
    date: "2025-11-10T15:30:00.000Z"
  };

  test('should create a match and return Location header', async () => {
    const res = await request(app)
      .post('/api/matches')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newMatch)
      .expect(201);

    const location = res.header['location'];
    matchId = location;
    expect(matchId).toBeDefined();
  });
});