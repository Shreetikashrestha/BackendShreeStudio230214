// src/controller/booking/BookingController.js
import { BookingModel as Booking } from '../../models/booking/BookingModel.js';
import { ServicesModel, User } from '../../models/index.js';

// Get all bookings with related User and Service data
export const findAll = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "email"] // Include user details
                },
                {
                    model: ServicesModel,
                    attributes: ["id", "Servicename", "Price"] // Include service details
                }
            ]
        });

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error retrieving bookings:", error);
        res.status(500).json({ message: "Failed to retrieve bookings", error: error.message });
    }
};

// Save a new booking with User and Service relationship
export const save = async (req, res) => {
    const { Date, Day, Time, Status, serviceId, userId } = req.body;

    // Validate required fields
    if (!Date || !Day || !Time || !Status || !serviceId || !userId) {
        return res.status(400).json({ message: "All fields, including serviceId and userId, are required" });
    }

    try {
        // Check if service and user exist
        const serviceExists = await ServicesModel.findByPk(serviceId);
        const userExists = await User.findByPk(userId);
        console.log(serviceExists,userExists)
        if (!serviceExists) {
            return res.status(404).json({ message: "Service not found" });
        }
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create booking
        const newBooking = await Booking.create({
            Date,
            Day,
            Time,
            Status,
            serviceId,
            userId
        });

        // Fetch created booking with user and service details
        const bookingWithDetails = await Booking.findByPk(newBooking.id, {
            include: [
                { model: User, attributes: ["id", "name", "email"] },
                { model: ServicesModel, attributes: ["id", "Servicename", "Price"] }
            ]
        });

        res.status(201).json(bookingWithDetails);
    } catch (error) {
        console.error("Error saving booking:", error);
        res.status(500).json({ message: "Failed to save booking", error: error.message });
    }
};
