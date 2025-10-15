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
      "player_id": "P001",
      "name": "John Smith",
      "position": "Forward",
      "age": 25
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