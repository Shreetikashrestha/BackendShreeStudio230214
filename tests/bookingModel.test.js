const request = require('supertest');
const express = require('express');
const { BookingRouter } = require('../../routes/booking/BookingRouter');
const { validateBooking } = require('../../validation/bookingValidation');

// Mock the controller functions
jest.mock('../../controller/booking/BookingController', () => ({
  findAll: jest.fn((req, res) => res.status(200).json({ message: 'All bookings fetched' })),
  save: jest.fn((req, res) => res.status(201).json({ message: 'Booking created' })),
  updateStatus: jest.fn((req, res) => res.status(200).json({ message: 'Booking status updated' })),
  deleteBooking: jest.fn((req, res) => res.status(200).json({ message: 'Booking deleted' })),
}));

// Mock the validation middleware
jest.mock('../../validation/bookingValidation', () => ({
  validateBooking: jest.fn((req, res, next) => next()),
}));

// Create an Express app and use the BookingRouter
const app = express();
app.use(express.json());
app.use('/bookings', BookingRouter);

describe('Booking Routes', () => {
  // Test GET /bookings/view
  it('should fetch all bookings', async () => {
    const response = await request(app).get('/bookings/view');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'All bookings fetched' });
  });

  // Test POST /bookings/create
  it('should create a new booking', async () => {
    const newBooking = {
      Date: '2025-03-01',
      Day: 'Monday',
      Time: '10:00:00',
      Status: 'Pending',
      serviceId: 1,
      userId: 1,
    };
    const response = await request(app).post('/bookings/create').send(newBooking);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Booking created' });
  });

  // Test PUT /bookings/update/:id
  it('should update booking status', async () => {
    const updatedBooking = {
      Status: 'Confirmed',
    };
    const response = await request(app).put('/bookings/update/1').send(updatedBooking);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Booking status updated' });
  });

  // Test DELETE /bookings/delete/:id
  it('should delete a booking', async () => {
    const response = await request(app).delete('/bookings/delete/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Booking deleted' });
  });

  // Test POST /bookings/create with validation
  it('should validate booking data before creating', async () => {
    const invalidBooking = {
      // Missing required fields
      Date: '2025-03-01',
      Day: 'Monday',
    };
    const response = await request(app).post('/bookings/create').send(invalidBooking);
    expect(validateBooking).toHaveBeenCalled(); // Ensure validation middleware is called
    expect(response.status).toBe(201); // Assuming validation passes and controller is called
  });
});