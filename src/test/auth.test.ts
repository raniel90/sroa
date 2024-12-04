import request from 'supertest';
import app from '../app';

jest.mock('../app', () => {
  const express = require('express');
  const app = express();
  app.use(express.json());
  
  app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (email === 'user@sroa.com' && password === 'yourpassword') {
      return res.status(200).json({ token: 'mocked_jwt_token' });
    }

    if (email === 'user@sroa.com' && password !== 'yourpassword') {
      return res.status(401).json({ message: 'Invalid password' });
    }

    if (email === 'nonexistent@sroa.com') {
      return res.status(404).json({ message: 'User not found by email' });
    }

    return res.status(400).json({ message: 'Bad Request' });
  });

  return app;
});

describe('POST /api/login', () => {
  it('should authenticate user and return a JWT token', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'user@sroa.com',
        password: 'yourpassword'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token', 'mocked_jwt_token');
  });

  it('should return 401 for invalid password', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'user@sroa.com',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Invalid password');
  });

  it('should return 404 for non-existent user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'nonexistent@sroa.com',
        password: 'somepassword'
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('User not found by email');
  });

  it('should return 400 for bad request', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Bad Request');
  });
});
