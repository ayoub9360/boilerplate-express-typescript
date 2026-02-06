import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';

describe('Example API', () => {
  describe('GET /api/example/v1/hello', () => {
    it('should return hello world by default', async () => {
      const response = await request(app).get('/api/example/v1/hello');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('Hello, World!');
    });

    it('should greet with provided name', async () => {
      const response = await request(app).get('/api/example/v1/hello?name=Test');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('Hello, Test!');
    });
  });

  describe('POST /api/example/v1/echo', () => {
    it('should require API key', async () => {
      const response = await request(app)
        .post('/api/example/v1/echo')
        .send({ message: 'test' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should echo message with valid API key', async () => {
      const response = await request(app)
        .post('/api/example/v1/echo')
        .set('x-api-key', 'test-api-key')
        .send({ message: 'hello' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.original).toBe('hello');
      expect(response.body.data.echoed).toBe('hello');
    });

    it('should repeat message when repeat param is provided', async () => {
      const response = await request(app)
        .post('/api/example/v1/echo')
        .set('x-api-key', 'test-api-key')
        .send({ message: 'hi', repeat: 3 });

      expect(response.status).toBe(200);
      expect(response.body.data.echoed).toBe('hi hi hi');
    });

    it('should validate input', async () => {
      const response = await request(app)
        .post('/api/example/v1/echo')
        .set('x-api-key', 'test-api-key')
        .send({ message: '' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/example/v1/info', () => {
    it('should return API info', async () => {
      const response = await request(app).get('/api/example/v1/info');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.api).toBe('example');
      expect(response.body.data.version).toBe('v1');
    });
  });
});

describe('Health Check', () => {
  it('should return healthy status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});

describe('Root endpoint', () => {
  it('should return API information', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Small API');
    expect(response.body.documentation).toBe('/docs');
  });
});
