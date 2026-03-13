const Invoice = require("../models/Invoice");

const getInvoices = async (query, user) => {
  const filter = {};

  if (user.role === "agent") {
    filter.createdBy = user._id;
  }

  if (query.status) {
    filter.status = query.status;
  }

  return await Invoice.find(filter)
    .populate("client", "name email")
    .populate("createdBy", "name email role");
};

const getInvoiceById = async (id, user) => {
  const filter = { _id: id };

  if (user.role === "agent") {
    filter.createdBy = user._id;
  }

  const invoice = await Invoice.findOne(filter)
    .populate("client", "name email")
    .populate("createdBy", "name email role");

  if (!invoice) {
    const error = new Error("Facture introuvable");
    error.statusCode = 404;
    throw error;
  }

  return invoice;
};

const createInvoice = async (data, user) => {
  if (user.role !== "agent") {
    const error = new Error("Seul un agent peut créer une facture");
    error.statusCode = 403;
    throw error;
  }
  const payload = {
    ...data,
    createdBy: user._id,
    status: "impayée",
    remainingAmount: data.amount,
  };
  return await Invoice.create(payload);
};

const updateInvoice = async (id, data, user) => {
  if (user.role !== "admin") {
    const error = new Error("Seul un admin peut modifier une facture");
    error.statusCode = 403;
    throw error;
  }
  delete data.createdBy;
  delete data.status;
  delete data.remainingAmount;

  const invoice = await Invoice.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!invoice) {
    const error = new Error("Facture introuvable");
    error.statusCode = 404;
    throw error;
  }
  return invoice;
};

const deleteInvoice = async (id, user) => {
  if (user.role !== "admin") {
    const error = new Error("Seul un admin peut supprimer une facture");
    error.statusCode = 403;
    throw error;
  }
  const invoice = await Invoice.findById(id);
  if (!invoice) {
    const error = new Error("Facture introuvable");
    error.statusCode = 404;
    throw error;
  }
  await Invoice.findByIdAndDelete(id);
};

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};