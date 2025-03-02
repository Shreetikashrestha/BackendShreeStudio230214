const request = require('supertest');
const express = require('express');
const { serviceRouter } = require('../../routes/serviceRouter.js');
const { findAll, findById, deleteById, save, update } = require('../../controller/services/ServicesController.js');
const serviceValidation = require('../../validation/serviceValidation.js');

// Mock the controller functions
jest.mock('../../controller/services/ServicesController.js', () => ({
  findAll: jest.fn((req, res) => res.status(200).json({ message: 'All services fetched' })),
  findById: jest.fn((req, res) => res.status(200).json({ message: 'Service fetched by ID' })),
  deleteById: jest.fn((req, res) => res.status(200).json({ message: 'Service deleted' })),
  save: jest.fn((req, res) => res.status(201).json({ message: 'Service created' })),
  update: jest.fn((req, res) => res.status(200).json({ message: 'Service updated' })),
}));

// Mock the validation middleware
jest.mock('../../validation/serviceValidation.js', () => ({
  serviceValidation: jest.fn((req, res, next) => next()),
}));

// Create an Express app and use the serviceRouter
const app = express();
app.use(express.json());
app.use('/services', serviceRouter);

describe('Service Router', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  // Test GET /services/view_services (findAll)
  describe('GET /services/view_services', () => {
    it('should fetch all services successfully', async () => {
      const response = await request(app).get('/services/view_services');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'All services fetched' });
    });
  });

  // Test POST /services/ (save)
  describe('POST /services/', () => {
    it('should create a new service successfully', async () => {
      const newService = {
        Servicename: 'New Service',
        Description: 'New Description',
        Price: 100,
      };

      const response = await request(app).post('/services/').send(newService);
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'Service created' });
      expect(serviceValidation).toHaveBeenCalled(); // Ensure validation middleware is called
    });
  });

  // Test GET /services/:id (findById)
  describe('GET /services/:id', () => {
    it('should fetch a service by ID successfully', async () => {
      const response = await request(app).get('/services/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Service fetched by ID' });
    });
  });

  // Test PUT /services/:id (update)
  describe('PUT /services/:id', () => {
    it('should update a service by ID successfully', async () => {
      const updatedService = {
        Servicename: 'Updated Service',
        Description: 'Updated Description',
        Price: 200,
      };

      const response = await request(app).put('/services/1').send(updatedService);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Service updated' });
    });
  });

  // Test DELETE /services/:id (deleteById)
  describe('DELETE /services/:id', () => {
    it('should delete a service by ID successfully', async () => {
      const response = await request(app).delete('/services/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Service deleted' });
    });
  });
});