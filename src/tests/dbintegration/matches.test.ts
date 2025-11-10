import request from 'supertest';
import { app } from '../../index';
import { initDb } from '../../database';

describe('Match API', () => {
  let matchId: string;

  beforeAll(async () => {
    // Initialize database connection for integration tests
    await initDb();
  });
  
  const newMatch = {
      "home_team_id": "507f1f77bcf86cd799439011",
      "away_team_id": "507f1f77bcf86cd799439012", 
      "score": {
        "home": 2,
        "away": 1
      },
      "date": "2025-11-10T15:30:00.000Z"
    };

  test('should create a match and return Location header', async () => {
    
    const res = await request(app)
      .post('/api/matches')
      .send(newMatch)
      .expect(201);

    const location = res.header['location'];

    matchId = location;
    expect(matchId).toBeDefined();
  }); 
});