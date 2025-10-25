import request from 'supertest';

import {createApp} from '../src/app';

describe('Auth routes', () => {
  const app = createApp();

  it('should reject login when payload is invalid', async () => {
    const response = await request(app).post('/api/auth/login').send({email: 'invalid'});

    expect(response.status).toBe(400);
  });
});
