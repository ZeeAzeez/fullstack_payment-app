import request from 'supertest';
import { app } from '../src/app';

describe('Payment Routes', () => {
  describe('POST /api/payments', () => {
    it('should return 401 without auth token', async () => {
      const res = await request(app)
        .post('/api/payments')
        .send({ amount: 100, receiverEmail: 'test@test.com' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/payments', () => {
    it('should return 401 without auth token', async () => {
      const res = await request(app).get('/api/payments');
      expect(res.status).toBe(401);
    });
  });
});
