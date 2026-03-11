const Joi = require('joi');

const createPaymentSchema = Joi.object({
  invoice: Joi.string().hex().length(24).required(),
  amount: Joi.number().positive().required(),
  paymentDate: Joi.date().optional(),
  method: Joi.string().valid('espèces', 'virement', 'chèque').required(),
  notes: Joi.string().allow('', null).optional(),
  recordedBy: Joi.string().hex().length(24).allow('', null).optional(),
});

const updatePaymentSchema = Joi.object({
  amount: Joi.number().positive().optional(),
  paymentDate: Joi.date().optional(),
  method: Joi.string().valid('espèces', 'virement', 'chèque').optional(),
  notes: Joi.string().allow('', null).optional(),
});

module.exports = { createPaymentSchema, updatePaymentSchema };