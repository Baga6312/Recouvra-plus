const Invoice = require('../models/Invoice');
const RecoveryAction = require('../models/RecoveryAction');

const getStats = async () => {
  const invoiceTotals = await Invoice.aggregate([
    {
      $group: {
        _id: null,
        totalInvoices: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        totalRemaining: { $sum: '$remainingAmount' },
        totalCollected: { $sum: { $subtract: ['$amount', '$remainingAmount'] } },
      },
    },
  ]);

  const byStatus = await Invoice.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        totalRemaining: { $sum: '$remainingAmount' },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const perClient = await Invoice.aggregate([
    {
      $group: {
        _id: '$client',
        totalInvoices: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        totalRemaining: { $sum: '$remainingAmount' },
        totalCollected: { $sum: { $subtract: ['$amount', '$remainingAmount'] } },
      },
    },
    {
      $lookup: {
        from: 'clients',
        localField: '_id',
        foreignField: '_id',
        as: 'client',
      },
    },
    { $unwind: '$client' },
    {
      $project: {
        _id: 0,
        client: { _id: '$client._id', name: '$client.name', email: '$client.email' },
        totalInvoices: 1,
        totalAmount: 1,
        totalRemaining: 1,
        totalCollected: 1,
      },
    },
    { $sort: { totalRemaining: -1 } },
  ]);

  const actionsByType = await RecoveryAction.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const totals = invoiceTotals[0] || {
    totalInvoices: 0,
    totalAmount: 0,
    totalRemaining: 0,
    totalCollected: 0,
  };
  delete totals._id;

  return {
    invoices: {
      ...totals,
      collectionRate: totals.totalAmount > 0
        ? `${((totals.totalCollected / totals.totalAmount) * 100).toFixed(1)}%`
        : '0%',
      byStatus,
    },
    clients: perClient,
    recoveryActions: {
      total: actionsByType.reduce((sum, a) => sum + a.count, 0),
      byType: actionsByType,
    },
  };
};

module.exports = { getStats };