import request from 'supertest';
import { app } from '../../index';
import { initDb } from '../../database';

describe('Team API', () => {
  let teamId: string;

  beforeAll(async () => {
    // Initialize database connection for integration tests
    await initDb();
  });
  
  const newTeam = {
      "name": "Manchester United",
      "coach": "507f1f77bcf86cd799439011",
      "players": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"]
    };

  test('should create a team and return Location header', async () => {
    

    const res = await request(app)
      .post('/api/teams')
      .send(newTeam)
      .expect(201);

    const location = res.header['location'];

    teamId = location;
    expect(teamId).toBeDefined();
  }); });