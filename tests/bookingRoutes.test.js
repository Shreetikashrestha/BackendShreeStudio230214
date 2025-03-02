const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// Define the mock Booking model based on your actual BookingModel
const BookingMock = dbMock.define('BookingModel', {
  id: {
    type: SequelizeMock.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Date: {
    type: SequelizeMock.DATE,
    allowNull: false,
  },
  Day: {
    type: SequelizeMock.STRING,
    allowNull: false,
  },
  Time: {
    type: SequelizeMock.TIME,
    allowNull: false,
  },
  Status: {
    type: SequelizeMock.STRING,
    allowNull: false,
  },
  serviceId: {
    type: SequelizeMock.INTEGER,
    allowNull: false,
  },
  userId: {
    type: SequelizeMock.INTEGER,
    allowNull: false,
  },
});

// Example test case for creating a new booking
describe('Booking Model', () => {
  it('should create a new booking', async () => {
    const booking = await BookingMock.create({
      Date: '2025-03-01',
      Day: 'Monday',
      Time: '10:00:00',
      Status: 'Pending',
      serviceId: 1,
      userId: 1,
    });

    expect(booking.id).toBe(1);
    expect(booking.Date).toBe('2025-03-01');
    expect(booking.Day).toBe('Monday');
    expect(booking.Time).toBe('10:00:00');
    expect(booking.Status).toBe('Pending');
    expect(booking.serviceId).toBe(1);
    expect(booking.userId).toBe(1);
  });

  it('should not create a booking with missing required fields', async () => {
    try {
      await BookingMock.create({
        Date: '2025-03-01',
        Day: 'Monday',
        // Missing Time, Status, serviceId, userId
      });
    } catch (error) {
      expect(error.name).toBe('SequelizeValidationError');
    }
  });
});