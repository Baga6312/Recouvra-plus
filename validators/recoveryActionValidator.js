const Joi = require('joi');

const createActionSchema = Joi.object({
  invoice: Joi.string().hex().length(24).required(),
  type: Joi.string().valid('appel', 'email', 'juridique', 'visite').required(),
  actionDate: Joi.date().optional(),
  notes: Joi.string().allow('', null).optional(),
  assignedTo: Joi.string().hex().length(24).required(),
});

const updateActionSchema = Joi.object({
  type: Joi.string().valid('appel', 'email', 'juridique', 'visite').optional(),
  actionDate: Joi.date().optional(),
  notes: Joi.string().allow('', null).optional(),
  assignedTo: Joi.string().hex().length(24).optional(),
});

module.exports = { createActionSchema, updateActionSchema };