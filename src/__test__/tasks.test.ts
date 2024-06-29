import request from 'supertest';
import { createApp } from '../server';
import { initializeDatabase } from '../db';

let app: ReturnType<typeof createApp>;

beforeAll(async () => {
  await initializeDatabase();
  app = createApp();
});

describe('Task API', () => {
  it('should create a new task', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({ title: 'Test Task', description: 'This is a test task' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Test Task');
  });

  it('should get all tasks', async () => {
    const response = await request(app).get('/tasks');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // 他のテストケースも追加可能
});