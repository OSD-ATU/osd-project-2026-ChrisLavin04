import request from 'supertest';
import { app } from '../../index';
import { initDb } from '../../database';

describe('Player API', () => {
  let playerId: string;

  beforeAll(async () => {
    // Initialize database connection for integration tests
    await initDb();
  });
  
  const newPlayer = {
      "name": "John Smith",
      "position": "Forward",
      "age": 25,
      "team_id": "507f1f77bcf86cd799439011"
    };

  test('should create a player and return Location header', async () => {
    

    const res = await request(app)
      .post('/api/players')
      .send(newPlayer)
      .expect(201);

    const location = res.header['location'];

    playerId = location;
    expect(playerId).toBeDefined();
  }); });