import request from 'supertest';
import { app } from '../../index';
import { connectToDatabase, collections } from '../../database';

describe('Players API Integration Tests', () => {

  beforeAll(async () => {
    // Connect to the database before running tests
    await connectToDatabase();
  });

  beforeEach(async () => {
    // Clear the players collection before each test
    await collections.players?.deleteMany({});
  });

  describe('POST /api/players', () => {
    it('should create a new player', async () => {
      const newPlayer = {
        player_id: 'P001',
        name: 'John Smith',
        position: 'Forward',
        age: 25
      };

      const response = await request(app)
        .post('/api/players')
        .send(newPlayer)
        .expect(201);

      expect(response.body.message).toContain('Created a new player with id');
    });

    it('should validate required fields', async () => {
      const incompletePlayer = {
        name: 'John Smith'
        // Missing required fields
      };

      await request(app)
        .post('/api/players')
        .send(incompletePlayer)
        .expect(400);
    });
  });

  describe('GET /api/players', () => {
    it('should get all players', async () => {
      // Insert test data
      const testPlayer = {
        player_id: 'P002',
        name: 'Jane Doe',
        position: 'Defender',
        age: 23
      };

      await collections.players?.insertOne(testPlayer);

      const response = await request(app)
        .get('/api/players')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('Jane Doe');
    });

    it('should return empty array when no players exist', async () => {
      const response = await request(app)
        .get('/api/players')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /api/players/:id', () => {
    it('should get a player by id', async () => {
      // Insert test data
      const testPlayer = {
        player_id: 'P003',
        name: 'Mike Johnson',
        position: 'Goalkeeper',
        age: 28
      };

      const insertResult = await collections.players?.insertOne(testPlayer);
      const playerId = insertResult?.insertedId.toString();

      const response = await request(app)
        .get(`/api/players/${playerId}`)
        .expect(200);

      expect(response.body.name).toBe('Mike Johnson');
      expect(response.body.position).toBe('Goalkeeper');
    });

    it('should return 404 for non-existent player', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';

      await request(app)
        .get(`/api/players/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('PUT /api/players/:id', () => {
    it('should update a player', async () => {
      // Insert test data
      const testPlayer = {
        player_id: 'P004',
        name: 'Sarah Wilson',
        position: 'Midfielder',
        age: 24
      };

      const insertResult = await collections.players?.insertOne(testPlayer);
      const playerId = insertResult?.insertedId.toString();

      const updateData = {
        name: 'Sarah Wilson-Smith',
        age: 25
      };

      const response = await request(app)
        .put(`/api/players/${playerId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.message).toContain('Successfully updated player');
    });

    it('should return 404 for non-existent player', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const updateData = { name: 'Updated Name' };

      await request(app)
        .put(`/api/players/${nonExistentId}`)
        .send(updateData)
        .expect(404);
    });
  });

  describe('DELETE /api/players/:id', () => {
    it('should delete a player', async () => {
      // Insert test data
      const testPlayer = {
        player_id: 'P005',
        name: 'Tom Brown',
        position: 'Forward',
        age: 22
      };

      const insertResult = await collections.players?.insertOne(testPlayer);
      const playerId = insertResult?.insertedId.toString();

      const response = await request(app)
        .delete(`/api/players/${playerId}`)
        .expect(200);

      expect(response.body.message).toContain('Successfully deleted player');

      // Verify the player was actually deleted
      const deletedPlayer = await collections.players?.findOne({ _id: insertResult?.insertedId });
      expect(deletedPlayer).toBeNull();
    });

    it('should return 404 for non-existent player', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';

      await request(app)
        .delete(`/api/players/${nonExistentId}`)
        .expect(404);
    });
  });
});