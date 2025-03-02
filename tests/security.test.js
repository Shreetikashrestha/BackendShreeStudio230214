const request = require('supertest');
const express = require('express');
const BookingRouter = require('../../routes/booking/BookingRouter');
const { authenticateToken } = require('../../middleware/Auth');
const Booking = require('../../model/Booking');

// Mock the Booking model
jest.mock('../../model/Booking', () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  save: jest.fn(),
  destroy: jest.fn(),
}));

// Mock the authentication middleware
jest.mock('../../middleware/Auth', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    const token = req.headers['authorization'];
    if (!token || token === 'Bearer invalidtoken') {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    if (token === 'Bearer validtoken') {
      req.user = { userId: 1, role: 'admin' }; // Mock authenticated user
      return next();
    }
    return res.status(401).json({ message: 'Access denied: No token provided' });
  }),
}));

// Create an Express app and use the BookingRouter
const app = express();
app.use(express.json());
app.use('/api/booking', authenticateToken, BookingRouter);

describe('Booking Routes Security', () => {
  let server;

  beforeAll(() => {
    server = app.listen(4000); // Start the server on port 4000 for testing
  });

  afterAll((done) => {
    server.close(done); // Close the server after tests
  });

  // Test 1: No token provided
  test('should return 401 if no token is provided', async () => {
    const response = await request(app).get('/api/booking/view_bookings');
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Access denied: No token provided' });
  });

  // Test 2: Invalid token provided
  test('should return 403 if token is invalid', async () => {
    const response = await request(app)
      .get('/api/booking/view_bookings')
      .set('Authorization', 'Bearer invalidtoken');
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: 'Invalid or expired token' });
  });

  // Test 3: Valid token provided
  test('should return 200 if token is valid', async () => {
    // Mock the Booking.findAll method to return a list of bookings
    Booking.findAll.mockResolvedValue([{ id: 1, full_name: 'Dipika Maharjan' }]);

    const response = await request(app)
      .get('/api/booking/view_bookings')
      .set('Authorization', 'Bearer validtoken');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, full_name: 'Dipika Maharjan' }]);
  });
});