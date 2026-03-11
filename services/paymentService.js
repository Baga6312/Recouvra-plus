const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');

const createPayment = async (data) => {
  const invoice = await Invoice.findById(data.invoice);
  if (!invoice) throw new Error('Facture introuvable');

  if (invoice.status === 'payée') throw new Error('Cette facture est déjà payée');
  if (invoice.status === 'annulée') throw new Error('Cette facture est annulée');

  const remaining = invoice.remainingAmount ?? invoice.amount;
  if (data.amount > remaining) {
    throw new Error(`Le montant dépasse le restant dû (${remaining})`);
  }

  const payment = await Payment.create(data);

  const newRemaining = remaining - data.amount;

  let newStatus;
  if (newRemaining === 0) {
    newStatus = 'payée';
  } else if (newRemaining < invoice.amount) {
    newStatus = 'partiellement_payée';
  } else {
    newStatus = invoice.status;
  }

  await Invoice.findByIdAndUpdate(data.invoice, {
    remainingAmount: newRemaining,
    status: newStatus,
  });

  return payment;
};

const getPayments = async ({ invoice, method, page = 1, limit = 10 }) => {
  const filter = {};
  if (invoice) filter.invoice = invoice;
  if (method) filter.method = method;

  const skip = (Number(page) - 1) * Number(limit);

  const payments = await Payment.find(filter)
    .populate('invoice', 'invoiceNumber amount remainingAmount status')
    .populate('recordedBy', 'name email role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Payment.countDocuments(filter);

  return {
    data: payments,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

const getPaymentById = async (id) => {
  return await Payment.findById(id)
    .populate('invoice', 'invoiceNumber amount remainingAmount status')
    .populate('recordedBy', 'name email role');
};

const updatePayment = async (id, data) => {
  const original = await Payment.findById(id);
  if (!original) return null;

  if (data.amount !== undefined) {
    const invoice = await Invoice.findById(original.invoice);
    if (!invoice) throw new Error('Facture introuvable');

    const restoredRemaining = (invoice.remainingAmount ?? 0) + original.amount;
    const newRemaining = restoredRemaining - data.amount;

    if (newRemaining < 0) {
      throw new Error(`Le montant dépasse le restant dû (${restoredRemaining})`);
    }

    let newStatus;
    if (newRemaining === 0) {
      newStatus = 'payée';
    } else if (newRemaining < invoice.amount) {
      newStatus = 'partiellement_payée';
    } else {
      newStatus = 'impayée';
    }

    await Invoice.findByIdAndUpdate(original.invoice, {
      remainingAmount: newRemaining,
      status: newStatus,
    });
  }

  return await Payment.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('invoice', 'invoiceNumber amount remainingAmount status')
    .populate('recordedBy', 'name email role');
};

module.exports = { createPayment, getPayments, getPaymentById, updatePayment };