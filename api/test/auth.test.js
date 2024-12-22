const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
  it('should register a user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      first_name: 'Eunice',
      last_name: 'Jack',
      email: 'eunice.jack@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });
});