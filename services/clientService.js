const Client = require("../models/Client");

const createClient = async (data) => {
  return await Client.create(data);
};

const getClients = async ({ status, assignedAgent, page = 1, limit = 10 }) => {
  const filter = {};

  if (status) filter.status = status;
  if (assignedAgent) filter.assignedAgent = assignedAgent;

  const skip = (Number(page) - 1) * Number(limit);

  const clients = await Client.find(filter)
    .populate("assignedAgent", "name email role")
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Client.countDocuments(filter);

  return {
    data: clients,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

const getClientById = async (id) => {
  return await Client.findById(id).populate("assignedAgent", "name email role");
};

const updateClient = async (id, data) => {
  return await Client.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const deleteClient = async (id) => {
  const invoicesCount = await Invoice.countDocuments({ client: id });

  if (invoicesCount > 0) {
    const error = new Error("Impossible de supprimer un client ayant des factures liées");
    error.statusCode = 409;
    throw error;
  }

  return await Client.findByIdAndDelete(id);
};

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
};