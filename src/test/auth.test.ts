import request from 'supertest';
import app from '../app';


describe('POST /api/login', () => {
  it('should authenticate user and return a JWT token', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'user@sroa.com',
        password: 'yourpassword'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });


  it('should authenticate user and return a JWT token', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'user@sroa.com',
        password: 'yourpassword'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
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
});
