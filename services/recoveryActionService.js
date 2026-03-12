const RecoveryAction = require('../models/recoveryAction');
const Invoice = require('../models/Invoice');

const STATUS_TRANSITIONS = {
  juridique: 'en_contentieux',
};

const createAction = async (data) => {
  const invoice = await Invoice.findById(data.invoice);
  if (!invoice) {
    const err = new Error('Facture introuvable');
    err.statusCode = 404;
    throw err;
  }

  if (invoice.status === 'payée') {
    const err = new Error('Cette facture est déjà payée');
    err.statusCode = 400;
    throw err;
  }

  if (invoice.status === 'annulée') {
    const err = new Error('Cette facture est annulée');
    err.statusCode = 400;
    throw err;
  }

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

const getActions = async ({ invoice, type, assignedTo, page = 1, limit = 10 }, user) => {
  const filter = {};
  if (invoice)    filter.invoice    = invoice;
  if (type)       filter.type       = type;
  if (assignedTo) filter.assignedTo = assignedTo;

  if (user.role === 'agent') filter.createdBy = user._id;
  
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

const getActionById = async (id, user) => {
  const action = await RecoveryAction.findById(id)
    .populate('invoice', 'invoiceNumber amount remainingAmount status')
    .populate('assignedTo', 'name email role')
    .populate('createdBy', 'name email role');

  if (!action) {
    const err = new Error('Action introuvable');
    err.statusCode = 404;
    throw err;
  }

  if (user.role === 'agent') {
    if (!action.createdBy || action.createdBy._id.toString() !== user._id.toString()) {
      const err = new Error('Accès refusé, cette action ne vous appartient pas');
      err.statusCode = 403;
      throw err;
    }
  }

  return action;
};

const updateAction = async (id, data, user) => {
  const existing = await RecoveryAction.findById(id);

  if (!existing) {
    const err = new Error('Action introuvable');
    err.statusCode = 404;
    throw err;
  }

  if (user.role === 'agent') {
    if (!existing.createdBy || existing.createdBy.toString() !== user._id.toString()) {
      const err = new Error('Accès refusé, cette action ne vous appartient pas');
      err.statusCode = 403;
      throw err;
    }
  }

  const action = await RecoveryAction.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate('invoice', 'invoiceNumber amount remainingAmount status')
    .populate('assignedTo', 'name email role')
    .populate('createdBy', 'name email role');

  if (data.type) {
    const newStatus = STATUS_TRANSITIONS[data.type];
    if (newStatus) {
      await Invoice.findByIdAndUpdate(action.invoice._id, { status: newStatus });
    }
  }

  return action;
};

const deleteAction = async (id) => {
  const action = await RecoveryAction.findByIdAndDelete(id);

  if (!action) {
    const err = new Error('Action introuvable');
    err.statusCode = 404;
    throw err;
  }

  return action;
};

module.exports = { createAction, getActions, getActionById, updateAction, deleteAction };