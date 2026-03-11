const asyncHandler = require('express-async-handler');
const {
  createAction,
  getActions,
  getActionById,
  updateAction,
  deleteAction,
} = require('../services/recoveryActionService');
const { createActionSchema, updateActionSchema } = require('../validators/recoveryActionValidator');

const create = asyncHandler(async (req, res) => {
  const { error, value } = createActionSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  value.createdBy = req.user._id;

  const action = await createAction(value);
  res.status(201).json(action);
});

const getAll = asyncHandler(async (req, res) => {
  const { invoice, type, assignedTo, page, limit } = req.query;
  const result = await getActions({ invoice, type, assignedTo, page, limit });
  res.json(result);
});

const getOne = asyncHandler(async (req, res) => {
  const action = await getActionById(req.params.id);
  if (!action) return res.status(404).json({ message: 'Action introuvable' });
  res.json(action);
});

const update = asyncHandler(async (req, res) => {
  const { error, value } = updateActionSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const action = await updateAction(req.params.id, value);
  if (!action) return res.status(404).json({ message: 'Action introuvable' });
  res.json(action);
});

const remove = asyncHandler(async (req, res) => {
  const action = await deleteAction(req.params.id);
  if (!action) return res.status(404).json({ message: 'Action introuvable' });
  res.json({ message: 'Action supprimée avec succès' });
});

module.exports = { create, getAll, getOne, update, remove };