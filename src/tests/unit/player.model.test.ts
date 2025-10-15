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
  });

  test('should get all players', async () => {
    const res = await request(app)
      .get('/api/players')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  test('should get player by ID', async () => {
    if (playerId) {
      const res = await request(app)
        .get(`/api/players/${playerId}`)
        .expect(200);

      expect(res.body).toHaveProperty('player_id');
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('position');
      expect(res.body).toHaveProperty('age');
    }
  });

  test('should update player', async () => {
    if (playerId) {
      const updatedPlayer = {
        "name": "John Smith Jr.",
        "position": "Midfielder",
        "age": 26
      };

      const res = await request(app)
        .put(`/api/players/${playerId}`)
        .send(updatedPlayer)
        .expect(200);

      expect(res.body).toHaveProperty('message');
    }
  });

  test('should delete player', async () => {
    if (playerId) {
      const res = await request(app)
        .delete(`/api/players/${playerId}`)
        .expect(200);

      expect(res.body).toHaveProperty('message');
    }
  });
});