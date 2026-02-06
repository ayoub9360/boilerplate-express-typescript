import { afterAll, beforeAll } from 'vitest';

// Setup before all tests
beforeAll(() => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/small_api_test';
  process.env.API_KEYS = 'test-api-key';
  process.env.LOG_LEVEL = 'error';
});

// Cleanup after all tests
afterAll(() => {
  // Add cleanup logic here if needed
});
