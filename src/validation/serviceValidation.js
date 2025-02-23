import joi from 'joi';

const serviceValidationSchema = joi.object({
  Servicename: joi.string().min(3).max(50).required(),
  Description: joi.string().max(255),
  Price: joi.number().integer().min(1).required(),
});

function serviceValidation(req, res, next) {
  const { Servicename, Description, Price } = req.body;
  const { error } = serviceValidationSchema.validate({ Servicename, Description, Price });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}

export default serviceValidation;
