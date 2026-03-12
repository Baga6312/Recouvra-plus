const Invoice = require('../models/Invoice');
const RecoveryAction = require('../models/RecoveryAction');
const Payment = require('../models/Payment');
const Client = require('../models/Client');

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

const getStatsOverview = async () => {
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

  const totals = invoiceTotals[0] || {
    totalInvoices: 0,
    totalAmount: 0,
    totalRemaining: 0,
    totalCollected: 0,
  };

  const collectionRate = totals.totalAmount > 0
    ? parseFloat(((totals.totalCollected / totals.totalAmount) * 100).toFixed(1))
    : 0;

  return {
    caTotal: totals.totalAmount,
    tauxRecouvrement: collectionRate,
    nbFactures: totals.totalInvoices,
    totalRecouvre: totals.totalCollected,
    totalEnAttendre: totals.totalRemaining,
  };
};

const getInvoicesByStatus = async () => {
  const statusBreakdown = await Invoice.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        totalRemaining: { $sum: '$remainingAmount' },
        totalCollected: { $sum: { $subtract: ['$amount', '$remainingAmount'] } },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return {
    statuses: statusBreakdown.map(s => ({
      status: s._id,
      count: s.count,
      totalAmount: s.totalAmount,
      totalRemaining: s.totalRemaining,
      totalCollected: s.totalCollected,
    })),
  };
};

const getTopDebtors = async () => {
  const topDebtors = await Invoice.aggregate([
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
        clientId: '$_id',
        clientName: '$client.name',
        clientEmail: '$client.email',
        clientStatus: '$client.status',
        totalInvoices: 1,
        totalAmount: 1,
        totalRemaining: 1,
        totalCollected: 1,
      },
    },
    { $sort: { totalRemaining: -1 } },
    { $limit: 10 },
  ]);

  return { debtors: topDebtors };
};

const getMonthlyEvolution = async () => {
  const monthlyData = await Payment.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$paymentDate' },
          month: { $month: '$paymentDate' },
        },
        totalAmount: { $sum: '$amount' },
        paymentCount: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Format for frontend consumption
  const formatted = monthlyData.map(item => ({
    month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
    totalAmount: item.totalAmount,
    paymentCount: item.paymentCount,
  }));

  return { evolution: formatted };
};

module.exports = { getStats, getStatsOverview, getInvoicesByStatus, getTopDebtors, getMonthlyEvolution };