const Joi = require("joi");

const createInvoiceSchema = Joi.object({
  invoiceNumber: Joi.string().trim().required(),
  client: Joi.string().hex().length(24).required(),
  amount: Joi.number().positive().required(),
  dueDate: Joi.date().required(),
  description: Joi.string().allow("", null).optional(),
});

const updateInvoiceSchema = Joi.object({
  invoiceNumber: Joi.string().trim().optional(),
  client: Joi.string().hex().length(24).optional(),
  amount: Joi.number().positive().optional(),
  dueDate: Joi.date().optional(),
  description: Joi.string().allow("", null).optional(),
});

module.exports = {
  createInvoiceSchema,
  updateInvoiceSchema,
};