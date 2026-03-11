const invoiceService = require("../services/invoiceService");

const createInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.createInvoice(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
};

const getInvoices = async (req, res, next) => {
  try {
    const result = await invoiceService.getInvoices(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Facture introuvable" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    next(error);
  }
};

const updateInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.updateInvoice(req.params.id, req.body);

    if (!invoice) {
      return res.status(404).json({ message: "Facture introuvable" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    next(error);
  }
};

const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.deleteInvoice(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Facture introuvable" });
    }

    res.status(200).json({ message: "Facture supprimée avec succès" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};