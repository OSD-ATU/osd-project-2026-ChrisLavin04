// Test setup file for Jest
// This file runs before each test suite

import { initDb, closeDb } from '../database';

// Setup function that runs once before all tests
beforeAll(async () => {
  // You can add global test setup here if needed
}, 30000); // 30 second timeout

// Cleanup function that runs once after all tests  
afterAll(async () => {
  // Close database connections to prevent hanging
  try {
    await closeDb();
  } catch (error) {
    console.log('Error closing database:', error);
  }
}, 30000); // 30 second timeout