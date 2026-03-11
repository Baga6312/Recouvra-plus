const Joi = require("joi");

const createInvoiceSchema = Joi.object({
  invoiceNumber: Joi.string().trim().required(),
  client: Joi.string().hex().length(24).required(),
  amount: Joi.number().positive().required(),
  dueDate: Joi.date().required(),
  status: Joi.string()
    .valid("impayée", "partiellement_payée", "payée", "contentieux", "annulée")
    .optional(),
  remainingAmount: Joi.number().min(0).optional(),
  description: Joi.string().allow("", null).optional(),
  createdBy: Joi.string().hex().length(24).allow("", null).optional(),
});

const updateInvoiceSchema = Joi.object({
  invoiceNumber: Joi.string().trim().optional(),
  client: Joi.string().hex().length(24).optional(),
  amount: Joi.number().positive().optional(),
  dueDate: Joi.date().optional(),
  status: Joi.string()
    .valid("impayée", "partiellement_payée", "payée", "contentieux", "annulée")
    .optional(),
  remainingAmount: Joi.number().min(0).optional(),
  description: Joi.string().allow("", null).optional(),
  createdBy: Joi.string().hex().length(24).allow("", null).optional(),
});

module.exports = {
  createInvoiceSchema,
  updateInvoiceSchema,
};