const Invoice = require("../models/Invoice");

const buildInvoiceFilters = (query) => {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.client) {
    filter.client = query.client;
  }

  if (query.startDate || query.endDate) {
    filter.dueDate = {};

    if (query.startDate) {
      filter.dueDate.$gte = new Date(query.startDate);
    }

    if (query.endDate) {
      filter.dueDate.$lte = new Date(query.endDate);
    }
  }

  return filter;
};

const buildSort = (sortBy) => {
  if (sortBy === "amount_asc") return { amount: 1 };
  if (sortBy === "amount_desc") return { amount: -1 };
  return { createdAt: -1 };
};

const createInvoice = async (data) => {
  if (data.remainingAmount === undefined || data.remainingAmount === null) {
    data.remainingAmount = data.amount;
  }

  return await Invoice.create(data);
};

const getInvoices = async ({
  status,
  client,
  startDate,
  endDate,
  sortBy,
  page = 1,
  limit = 10,
}) => {
  const filter = buildInvoiceFilters({ status, client, startDate, endDate });
  const sort = buildSort(sortBy);
  const skip = (Number(page) - 1) * Number(limit);

  const invoices = await Invoice.find(filter)
    .populate("client", "name email siret status")
    .populate("createdBy", "name email role")
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total = await Invoice.countDocuments(filter);

  return {
    data: invoices,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

const getInvoiceById = async (id) => {
  return await Invoice.findById(id)
    .populate("client", "name email siret status")
    .populate("createdBy", "name email role");
};

const updateInvoice = async (id, data) => {
  const existingInvoice = await Invoice.findById(id);

  if (!existingInvoice) {
    return null;
  }

  const updatedData = { ...data };

  const nextAmount =
    updatedData.amount !== undefined ? updatedData.amount : existingInvoice.amount;

  if (updatedData.remainingAmount === undefined || updatedData.remainingAmount === null) {
    updatedData.remainingAmount =
      existingInvoice.remainingAmount !== undefined &&
      existingInvoice.remainingAmount !== null
        ? existingInvoice.remainingAmount
        : nextAmount;
  }

  return await Invoice.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  })
    .populate("client", "name email siret status")
    .populate("createdBy", "name email role");
};

const deleteInvoice = async (id) => {
  return await Invoice.findByIdAndDelete(id);
};

const getInvoicesByClientId = async (clientId) => {
  return await Invoice.find({ client: clientId })
    .populate("client", "name email siret status")
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 });
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getInvoicesByClientId,
};