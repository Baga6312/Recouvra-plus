const Client = require("../models/Client");
const Invoice = require("../models/Invoice");

const getClients = async (query, user) => {
  const filter = {};

  if (user.role === "agent") {
    filter.assignedAgent = user._id;
  }

  if (query.status) {
    filter.status = query.status;
  }

  return await Client.find(filter).populate("assignedAgent", "name email role");
};

const getClientById = async (id, user) => {
  const filter = { _id: id };

  if (user.role === "agent") {
    filter.assignedAgent = user._id;
  }

  const client = await Client.findOne(filter).populate("assignedAgent", "name email role");

  if (!client) {
    const error = new Error("Client introuvable");
    error.statusCode = 404;
    throw error;
  }

  return client;
};

const createClient = async (data, user) => {
  if (user.role !== "agent") {
    const error = new Error("Seul un agent peut créer un client");
    error.statusCode = 403;
    throw error;
  }
  const payload = {
    ...data,
    assignedAgent: user._id,
  };
  return await Client.create(payload);
};

const updateClient = async (id, data, user) => {
  const filter = { _id: id };

  if (user.role === "agent") {
    filter.assignedAgent = user._id;
  }

  const client = await Client.findOne(filter);

  if (!client) {
    const error = new Error("Client introuvable");
    error.statusCode = 404;
    throw error;
  }

  Object.assign(client, data);
  await client.save();

  return client;
};

const deleteClient = async (id, user) => {
  const filter = { _id: id };

  if (user.role === "agent") {
    filter.assignedAgent = user._id;
  }

  const client = await Client.findOne(filter);

  if (!client) {
    const error = new Error("Client introuvable");
    error.statusCode = 404;
    throw error;
  }

  const relatedInvoices = await Invoice.countDocuments({ client: id });

  if (relatedInvoices > 0) {
    const error = new Error("Impossible de supprimer un client avec des factures");
    error.statusCode = 409;
    throw error;
  }

  await Client.findByIdAndDelete(id);
};

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};