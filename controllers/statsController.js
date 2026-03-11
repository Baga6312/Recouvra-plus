const asyncHandler = require('express-async-handler');
const { getStats } = require('../services/statsService');

const stats = asyncHandler(async (req, res) => {
  const data = await getStats();
  res.json(data);
});

module.exports = { stats };