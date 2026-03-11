const clientService = require("../services/clientService");
const invoiceService = require("../services/invoiceService");

const createClient = async (req, res, next) => {
  try {
    const client = await clientService.createClient(req.body);
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

const getClients = async (req, res, next) => {
  try {
    const result = await clientService.getClients(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getClientById = async (req, res, next) => {
  try {
    const client = await clientService.getClientById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client introuvable" });
    }

    res.status(200).json(client);
  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const client = await clientService.updateClient(req.params.id, req.body);

    if (!client) {
      return res.status(404).json({ message: "Client introuvable" });
    }

    res.status(200).json(client);
  } catch (error) {
    next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    const client = await clientService.deleteClient(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client introuvable" });
    }

    res.status(200).json({ message: "Client supprimé avec succès" });
  } catch (error) {
    next(error);
  }
};

const getClientInvoices = async (req, res, next) => {
  try {
    const invoices = await invoiceService.getInvoicesByClientId(req.params.id);
    res.status(200).json(invoices);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  getClientInvoices,
};