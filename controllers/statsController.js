const asyncHandler = require('express-async-handler');
const { getStats, getStatsOverview, getInvoicesByStatus, getTopDebtors, getMonthlyEvolution } = require('../services/statsService');

const stats = asyncHandler(async (req, res) => {
  const data = await getStats();
  res.json(data);
});

const overview = asyncHandler(async (req, res) => {
  const data = await getStatsOverview();
  res.json({ success: true, data });
});

const invoicesByStatus = asyncHandler(async (req, res) => {
  const data = await getInvoicesByStatus();
  res.json({ success: true, data });
});

const topDebtors = asyncHandler(async (req, res) => {
  const data = await getTopDebtors();
  res.json({ success: true, data });
});

const monthlyEvolution = asyncHandler(async (req, res) => {
  const data = await getMonthlyEvolution();
  res.json({ success: true, data });
});

module.exports = { stats, overview, invoicesByStatus, topDebtors, monthlyEvolution };