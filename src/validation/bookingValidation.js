import Joi from 'joi';

const bookingSchema = Joi.object({
  Date: Joi.date().required(),
  Day: Joi.string().required(),
  Time: Joi.string().required(),
  Status: Joi.string().valid('Pending', 'Confirmed', 'Cancelled').required(),
  serviceId: Joi.number().integer().required(),
  userId: Joi.number().integer().required(),
});

const validateBooking = (req, res, next) => {
  const { error } = bookingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export default validateBooking;