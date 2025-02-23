import joi from 'joi';

const user = joi.object({
  name: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).max(128).required(),
});

function userValidation(req, res, next) {
  const { name, email, password } = req.body;
  const { error } = user.validate({ name, email, password });
  if (error) {
    return res.json(error);
  }
  next();
}

export default userValidation;
