const Joi = require('joi');
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'string.max': 'Le nom ne peut pas dépasser 50 caractères',
    'any.required': 'Le nom est obligatoire',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email invalide',
    'any.required': "L'email est obligatoire",
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
    'any.required': 'Le mot de passe est obligatoire',
  }),
  role: Joi.string().valid('agent', 'manager', 'admin').messages({
    'any.only': 'Le rôle doit être agent, manager ou admin',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email invalide',
    'any.required': "L'email est obligatoire",
  }),
  password: Joi.string().required().messages({
    'any.required': 'Le mot de passe est obligatoire',
  }),
});
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message).join(', '),
      });
    }
    next();
  };
};
module.exports = { registerSchema, loginSchema, validate };