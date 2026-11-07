import Joi from 'joi';

export const instructorLoginSchema = Joi.object({
  username: Joi.string().trim().min(2).max(80).required(),
  // Login accepts short nonempty guesses so incorrect credentials consistently
  // receive the generic 401 instead of revealing a password-length rule.
  password: Joi.string().trim().min(1).max(128).required()
}).unknown(false);

export const instructorSearchSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100),
  department: Joi.string().trim().min(1).max(80)
}).min(1).unknown(false);

export function validateInstructorInput(schema, property) {
  return (req, res, next) => {
    // express-mongo-sanitize removes MongoDB operators; Joi separately defines
    // valid input types, lengths, and allowed fields. Both protections matter.
    const { value, error } = schema.validate(req[property], {
      abortEarly: true,
      convert: true
    });
    if (error) return res.status(400).json({ message: 'Invalid request' });
    req[property] = value;
    return next();
  };
}
