const RecoveryAction = require('../models/recoveryAction');
const Invoice = require('../models/Invoice');

const STATUS_TRANSITIONS = {
  juridique: 'en_contentieux',
};

const createAction = async (data) => {
  const invoice = await Invoice.findById(data.invoice);
  if (!invoice) throw new Error('Facture introuvable');

  if (invoice.status === 'payée') throw new Error('Cette facture est déjà payée');
  if (invoice.status === 'annulée') throw new Error('Cette facture est annulée');

  const action = await RecoveryAction.create(data);

  const newStatus = STATUS_TRANSITIONS[data.type];
  if (newStatus && invoice.status !== newStatus) {
    await Invoice.findByIdAndUpdate(data.invoice, { status: newStatus });
  }

  return action.populate([
    { path: 'invoice', select: 'invoiceNumber amount remainingAmount status' },
    { path: 'assignedTo', select: 'name email role' },
    { path: 'createdBy', select: 'name email role' },
  ]);
};

const getActions = async ({ invoice, type, assignedTo, page = 1, limit = 10 }) => {
  const filter = {};
  if (invoice)    filter.invoice    = invoice;
  if (type)       filter.type       = type;
  if (assignedTo) filter.assignedTo = assignedTo;

  const skip = (Number(page) - 1) * Number(limit);

  const actions = await RecoveryAction.find(filter)
    .populate('invoice', 'invoiceNumber amount remainingAmount status')
    .populate('assignedTo', 'name email role')
    .populate('createdBy', 'name email role')
    .sort({ actionDate: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await RecoveryAction.countDocuments(filter);

  return {
    data: actions,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

const getActionById = async (id) => {
  return await RecoveryAction.findById(id)
    .populate('invoice', 'invoiceNumber amount remainingAmount status')
    .populate('assignedTo', 'name email role')
    .populate('createdBy', 'name email role');
};

const updateAction = async (id, data) => {
  const action = await RecoveryAction.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate('invoice', 'invoiceNumber amount remainingAmount status')
    .populate('assignedTo', 'name email role')
    .populate('createdBy', 'name email role');

  if (!action) return null;

  if (data.type) {
    const newStatus = STATUS_TRANSITIONS[data.type];
    if (newStatus) {
      await Invoice.findByIdAndUpdate(action.invoice._id, { status: newStatus });
    }
  }

  return action;
};

const deleteAction = async (id) => {
  return await RecoveryAction.findByIdAndDelete(id);
};

module.exports = { createAction, getActions, getActionById, updateAction, deleteAction };