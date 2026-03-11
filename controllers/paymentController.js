const asyncHandler = require('express-async-handler');
const { createPayment, getPayments, getPaymentById, updatePayment } = require('../services/paymentService');
const { createPaymentSchema, updatePaymentSchema } = require('../validators/paymentValidator');

const create = asyncHandler(async (req, res) => {
  const { error, value } = createPaymentSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  value.recordedBy = req.user._id;

  const payment = await createPayment(value);
  res.status(201).json(payment);
});

const getAll = asyncHandler(async (req, res) => {
  const { invoice, method, page, limit } = req.query;
  const result = await getPayments({ invoice, method, page, limit });
  res.json(result);
});

const getOne = asyncHandler(async (req, res) => {
  const payment = await getPaymentById(req.params.id);
  if (!payment) return res.status(404).json({ message: 'Paiement introuvable' });
  res.json(payment);
});

const update = asyncHandler(async (req, res) => {
  const { error, value } = updatePaymentSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const payment = await updatePayment(req.params.id, value);
  if (!payment) return res.status(404).json({ message: 'Paiement introuvable' });
  res.json(payment);
});

module.exports = { create, getAll, getOne, update };