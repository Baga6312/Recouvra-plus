const Joi = require("joi");

const createClientSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().allow("", null),
  phone: Joi.string().allow("", null),
  address: Joi.string().allow("", null),
  siret: Joi.string().allow("", null),
  status: Joi.string().valid("actif", "inactif", "contentieux"),
  assignedAgent: Joi.string().hex().length(24).allow(null, ""),
  notes: Joi.string().allow("", null),
});

const updateClientSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email().allow("", null),
  phone: Joi.string().allow("", null),
  address: Joi.string().allow("", null),
  siret: Joi.string().allow("", null),
  status: Joi.string().valid("actif", "inactif", "contentieux"),
  assignedAgent: Joi.string().hex().length(24).allow(null, ""),
  notes: Joi.string().allow("", null),
});

module.exports = {
  createClientSchema,
  updateClientSchema,
};