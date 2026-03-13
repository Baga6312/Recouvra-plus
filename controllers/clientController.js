const clientService = require("../services/clientService");

const getClients = async (req, res, next) => {
  try {
    const clients = await clientService.getClients(req.query, req.user);
    res.status(200).json(clients);
  } catch (error) {
    next(error);
  }
};

const getClientById = async (req, res, next) => {
  try {
    const client = await clientService.getClientById(req.params.id, req.user);
    res.status(200).json(client);
  } catch (error) {
    next(error);
  }
};

const createClient = async (req, res, next) => {
  try {
    const client = await clientService.createClient(req.body, req.user);
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const client = await clientService.updateClient(req.params.id, req.body, req.user);
    res.status(200).json(client);
  } catch (error) {
    next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    await clientService.deleteClient(req.params.id, req.user);
    res.status(200).json({ message: "Client supprimé avec succès" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};