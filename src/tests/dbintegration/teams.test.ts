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
      "team_id": "T001",
      "name": "Manchester United",
      "coach": "coach_john",
      "players": ["P001", "P002", "P003"]
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