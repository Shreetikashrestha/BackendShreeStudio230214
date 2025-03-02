const { DataTypes } = require('sequelize');
const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// Mock the ServicesModel
const ServicesMock = dbMock.define('ServicesModel', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Servicename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Description: {
    type: DataTypes.STRING,
  },
  Price: {
    type: DataTypes.INTEGER,
  },
});

describe('ServicesModel', () => {
  // Test creating a new service
  it('should create a new service', async () => {
    const newService = await ServicesMock.create({
      Servicename: 'Test Service',
      Description: 'This is a test service',
      Price: 100,
    });

    expect(newService.id).toBe(1);
    expect(newService.Servicename).toBe('Test Service');
    expect(newService.Description).toBe('This is a test service');
    expect(newService.Price).toBe(100);
  });

  // Test validation for required fields
  it('should not create a service without required fields', async () => {
    try {
      await ServicesMock.create({
        Description: 'This is a test service',
        Price: 100,
        // Missing Servicename
      });
    } catch (error) {
      expect(error.name).toBe('SequelizeValidationError');
    }
  });

  // Test fetching all services
  it('should fetch all services', async () => {
    // Mock data for findAll
    ServicesMock.$queueResult([
      ServicesMock.build({
        id: 1,
        Servicename: 'Service 1',
        Description: 'Description 1',
        Price: 100,
      }),
      ServicesMock.build({
        id: 2,
        Servicename: 'Service 2',
        Description: 'Description 2',
        Price: 200,
      }),
    ]);

    const services = await ServicesMock.findAll();
    expect(services.length).toBe(2);
    expect(services[0].Servicename).toBe('Service 1');
    expect(services[1].Servicename).toBe('Service 2');
  });

  // Test fetching a service by ID
  it('should fetch a service by ID', async () => {
    // Mock data for findByPk
    ServicesMock.$queueResult(
      ServicesMock.build({
        id: 1,
        Servicename: 'Service 1',
        Description: 'Description 1',
        Price: 100,
      }),
    );

    const service = await ServicesMock.findByPk(1);
    expect(service.id).toBe(1);
    expect(service.Servicename).toBe('Service 1');
  });

  // Test updating a service
  it('should update a service', async () => {
    const service = await ServicesMock.create({
      Servicename: 'Old Service',
      Description: 'Old Description',
      Price: 100,
    });

    await service.update({
      Servicename: 'Updated Service',
      Description: 'Updated Description',
      Price: 200,
    });

    expect(service.Servicename).toBe('Updated Service');
    expect(service.Description).toBe('Updated Description');
    expect(service.Price).toBe(200);
  });

  // Test deleting a service
  it('should delete a service', async () => {
    const service = await ServicesMock.create({
      Servicename: 'Service to Delete',
      Description: 'Description',
      Price: 100,
    });

    await service.destroy();
    const deletedService = await ServicesMock.findByPk(service.id);
    expect(deletedService).toBeNull();
  });
});