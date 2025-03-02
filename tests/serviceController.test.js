const request = require('supertest');
const express = require('express');
const { Services } = require('../../models/index.js');
const {
  findAll,
  save,
  findById,
  deleteById,
  update,
} = require('../../controller/serviceController.js');

// Mock the Services model
jest.mock('../../models/index.js', () => ({
  Services: {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn(),
  },
}));

// Create an Express app and use the controller functions
const app = express();
app.use(express.json());
app.get('/services', findAll);
app.post('/services', save);
app.get('/services/:id', findById);
app.delete('/services/:id', deleteById);
app.put('/services/:id', update);

describe('Service Controller', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  // Test GET /services (findAll)
  describe('GET /services', () => {
    it('should fetch all services successfully', async () => {
      const mockServices = [
        { id: 1, Servicename: 'Service 1', Description: 'Description 1', Price: 100 },
        { id: 2, Servicename: 'Service 2', Description: 'Description 2', Price: 200 },
      ];
      Services.findAll.mockResolvedValue(mockServices);

      const response = await request(app).get('/services');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: mockServices,
        message: 'Services retrieved successfully',
      });
    });

    it('should handle errors when fetching services', async () => {
      const mockError = new Error('Database error');
      Services.findAll.mockRejectedValue(mockError);

      const response = await request(app).get('/services');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error retrieving services',
        error: mockError.message,
      });
    });
  });

  // Test POST /services (save)
  describe('POST /services', () => {
    it('should create a new service successfully', async () => {
      const newService = {
        Servicename: 'New Service',
        Description: 'New Description',
        Price: 300,
      };
      Services.create.mockResolvedValue(newService);

      const response = await request(app).post('/services').send(newService);
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        data: newService,
        message: 'Service created successfully',
      });
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidService = {
        Servicename: 'Incomplete Service',
        // Missing Description and Price
      };

      const response = await request(app).post('/services').send(invalidService);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'Servicename, Description, and Price are required',
      });
    });

    it('should handle errors when saving a service', async () => {
      const mockError = new Error('Database error');
      Services.create.mockRejectedValue(mockError);

      const response = await request(app)
        .post('/services')
        .send({ Servicename: 'Service', Description: 'Description', Price: 100 });
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error saving service',
        error: mockError.message,
      });
    });
  });

  // Test GET /services/:id (findById)
  describe('GET /services/:id', () => {
    it('should fetch a service by ID successfully', async () => {
      const mockService = {
        id: 1,
        Servicename: 'Service 1',
        Description: 'Description 1',
        Price: 100,
      };
      Services.findByPk.mockResolvedValue(mockService);

      const response = await request(app).get('/services/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: mockService,
        message: 'Service retrieved successfully',
      });
    });

    it('should return 404 if service is not found', async () => {
      Services.findByPk.mockResolvedValue(null);

      const response = await request(app).get('/services/999');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Service not found' });
    });

    it('should handle errors when fetching a service by ID', async () => {
      const mockError = new Error('Database error');
      Services.findByPk.mockRejectedValue(mockError);

      const response = await request(app).get('/services/1');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error retrieving service',
        error: mockError.message,
      });
    });
  });

  // Test DELETE /services/:id (deleteById)
  describe('DELETE /services/:id', () => {
    it('should delete a service by ID successfully', async () => {
      const mockService = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };
      Services.findByPk.mockResolvedValue(mockService);

      const response = await request(app).delete('/services/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Service deleted successfully' });
    });

    it('should return 404 if service to delete is not found', async () => {
      Services.findByPk.mockResolvedValue(null);

      const response = await request(app).delete('/services/999');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Service not found' });
    });

    it('should handle errors when deleting a service', async () => {
      const mockError = new Error('Database error');
      Services.findByPk.mockRejectedValue(mockError);

      const response = await request(app).delete('/services/1');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error deleting service',
        error: mockError.message,
      });
    });
  });

  // Test PUT /services/:id (update)
  describe('PUT /services/:id', () => {
    it('should update a service by ID successfully', async () => {
      const mockService = {
        id: 1,
        Servicename: 'Updated Service',
        Description: 'Updated Description',
        Price: 200,
        update: jest.fn().mockResolvedValue(true),
      };
      Services.findByPk.mockResolvedValue(mockService);

      const updatedData = {
        Servicename: 'Updated Service',
        Description: 'Updated Description',
        Price: 200,
      };

      const response = await request(app).put('/services/1').send(updatedData);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: mockService,
        message: 'Service updated successfully',
      });
    });

    it('should return 404 if service to update is not found', async () => {
      Services.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .put('/services/999')
        .send({ Servicename: 'Updated Service', Description: 'Updated Description', Price: 200 });
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Service not found' });
    });

    it('should handle errors when updating a service', async () => {
      const mockError = new Error('Database error');
      Services.findByPk.mockRejectedValue(mockError);

      const response = await request(app)
        .put('/services/1')
        .send({ Servicename: 'Updated Service', Description: 'Updated Description', Price: 200 });
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error updating service',
        error: mockError.message,
      });
    });
  });
});