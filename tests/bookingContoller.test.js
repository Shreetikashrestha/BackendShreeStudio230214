// 

const BookingController = require('../src/controller/booking/BookingController');
const { BookingModel, ServicesModel, User } = require('../src/models/index');

jest.mock('../src/models/index', () => ({
  BookingModel: {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    save: jest.fn(),
    destroy: jest.fn(),
  },
  ServicesModel: {
    findByPk: jest.fn(),
    getTableName: jest.fn().mockReturnValue('Services'), // Mock getTableName
  },
  User: {
    findByPk: jest.fn(),
    getTableName: jest.fn().mockReturnValue('Users'), // Mock getTableName
  },
}));

describe('Booking Controller', () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = mockResponse();
  });

  test('should fetch all bookings with user and service details', async () => {
    const mockBookings = [
      {
        id: 1,
        Date: '2025-03-02',
        Day: 'Sunday',
        Time: '10:00 AM',
        Status: 'Pending',
        User: { id: 1, name: 'Dipika Maharjan', email: 'dipika@gmail.com' },
        Service: { id: 1, Servicename: 'Rustic Design', Price: 100 },
      },
    ];

    BookingModel.findAll.mockResolvedValue(mockBookings);
    await BookingController.findAll(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockBookings);
  });

  test('should handle error when fetching all bookings fails', async () => {
    const mockError = new Error('Database error');
    BookingModel.findAll.mockRejectedValue(mockError);

    await BookingController.findAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Failed to retrieve bookings',
      error: mockError.message,
    });
  });

  test('should create a new booking with valid data', async () => {
    req.body = {
      Date: '2025-03-02',
      Day: 'Sunday',
      Time: '10:00 AM',
      Status: 'Pending',
      serviceId: 1,
      userId: 1,
    };

    const mockUser = { id: 1, name: 'shristi ', email: 'shristi@gmail.com' };
    const mockService = { id: 1, Servicename: 'Rustic Design', Price: 100 };
    const mockBooking = {
      id: 1,
      ...req.body,
      User: mockUser,
      Service: mockService,
    };

    User.findByPk.mockResolvedValue(mockUser);
    ServicesModel.findByPk.mockResolvedValue(mockService);
    BookingModel.create.mockResolvedValue(mockBooking);
    BookingModel.findByPk.mockResolvedValue(mockBooking);

    await BookingController.save(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockBooking);
  });

  test('should return 400 if required fields are missing when creating a booking', async () => {
    req.body = {
      Date: '2025-03-02',
      Day: 'Sunday',
      Time: '10:00 AM',
      Status: 'Pending',
      // Missing serviceId and userId
    };

    await BookingController.save(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'All fields, including serviceId and userId, are required',
    });
  });

  test('should return 404 if user or service does not exist when creating a booking', async () => {
    req.body = {
      Date: '2025-03-02',
      Day: 'Sunday',
      Time: '10:00 AM',
      Status: 'Pending',
      serviceId: 1,
      userId: 1,
    };

    User.findByPk.mockResolvedValue(null);
    ServicesModel.findByPk.mockResolvedValue(null);

    await BookingController.save(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });

    User.findByPk.mockResolvedValue({ id: 1 });
    ServicesModel.findByPk.mockResolvedValue(null);

    await BookingController.save(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Service not found' });
  });

  test('should update booking status successfully', async () => {
    req.params.id = 1;
    req.body = { Status: 'Confirmed' };

    const mockBooking = {
      id: 1,
      Status: 'Pending',
      save: jest.fn().mockResolvedValue({ id: 1, Status: 'Confirmed' }),
    };

    BookingModel.findByPk.mockResolvedValue(mockBooking);

    await BookingController.updateStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Booking status updated successfully',
      booking: mockBooking,
    });
  });

  test('should return 400 if status is missing when updating booking status', async () => {
    req.params.id = 1;
    req.body = {}; // Missing Status

    await BookingController.updateStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Status is required' });
  });

  test('should return 404 if booking to update status is not found', async () => {
    req.params.id = 1;
    req.body = { Status: 'Confirmed' };

    BookingModel.findByPk.mockResolvedValue(null);

    await BookingController.updateStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Booking not found' });
  });

  test('should delete a booking successfully', async () => {
    req.params.id = 1;

    const mockBooking = {
      id: 1,
      destroy: jest.fn().mockResolvedValue({}),
    };

    BookingModel.findByPk.mockResolvedValue(mockBooking);

    await BookingController.deleteBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Booking deleted successfully' });
  });

  test('should return 404 if booking to delete is not found', async () => {
    req.params.id = 1;

    BookingModel.findByPk.mockResolvedValue(null);

    await BookingController.deleteBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Booking not found' });
  });

  afterAll(async () => {
    // Close any open database connections or async operations
    await sequelize.close();
  });
});