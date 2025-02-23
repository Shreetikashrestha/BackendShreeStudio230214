// // routes/BookingRoute.js
// const express = require('express');
// const { findAll, save } = require('../../controller/booking/BookingController');
// const router = express.Router();

// // Get all bookings
// router.get("/view_booking", findAll);

// // Create a new booking
// router.post("/create_booking", save);

// module.exports = router;

// import express from 'express'
// import { bookingController } from "../../controller/booking";
// const router=express.Router();
// router.get("/",bookingController.findAll);
// router.post("/",bookingController.save);




// export  {router as BookingRouter };



// // routes/BookingRoute.js
// const express = require('express');
// const { findAll, save } = require('../../controller/booking/BookingController');
// const router = express.Router();

// // Get all bookings
// router.get("/view_booking", findAll);

// // Create a new booking
// router.post("/create_booking", save);

// module.exports = router;


import express from 'express';
import { findAll, save } from '../../controller/booking/BookingController.js';

const router = express.Router();

// Get all bookings
router.get("/view", findAll);

// Create a new booking
router.post("/create", save);

export { router as BookingRouter };