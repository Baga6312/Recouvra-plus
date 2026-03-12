const { createInvoice, getInvoices, getInvoiceById, updateInvoice } = require('../controllers/invoiceController');
const invoiceService = require('../services/invoiceService');

jest.mock('../services/invoiceService');

describe('Invoice Controller - Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('createInvoice', () => {
    it('should create an invoice successfully', async () => {
      req.body = {
        invoiceNumber: 'INV-001',
        client: 'client123',
        amount: 5000,
        dueDate: '2024-12-31',
      };

      const mockInvoice = {
        _id: 'invoice123',
        invoiceNumber: 'INV-001',
        amount: 5000,
        status: 'impayée',
      };

      invoiceService.createInvoice.mockResolvedValue(mockInvoice);

      await createInvoice(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockInvoice);
    });

    it('should handle creation error', async () => {
      invoiceService.createInvoice.mockRejectedValue(new Error('Validation error'));

      await createInvoice(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('Validation error'));
    });
  });

  describe('getInvoices', () => {
    it('should get all invoices', async () => {
      const mockResult = {
        data: [
          { _id: '1', invoiceNumber: 'INV-001', amount: 5000 },
          { _id: '2', invoiceNumber: 'INV-002', amount: 3000 },
        ],
      };

      invoiceService.getInvoices.mockResolvedValue(mockResult);

      await getInvoices(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });

  describe('getInvoiceById', () => {
    it('should get invoice by id successfully', async () => {
      req.params.id = 'invoice123';

      const mockInvoice = {
        _id: 'invoice123',
        invoiceNumber: 'INV-001',
        amount: 5000,
      };

      invoiceService.getInvoiceById.mockResolvedValue(mockInvoice);

      await getInvoiceById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockInvoice);
    });

    it('should return 404 if invoice not found', async () => {
      req.params.id = 'nonexistent';

      invoiceService.getInvoiceById.mockResolvedValue(null);

      await getInvoiceById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Facture introuvable' });
    });
  });

  describe('updateInvoice', () => {
    it('should update invoice status successfully', async () => {
      req.params.id = 'invoice123';
      req.body = { status: 'payée' };

      const mockInvoice = {
        _id: 'invoice123',
        invoiceNumber: 'INV-001',
        status: 'payée',
        amount: 5000,
      };

      invoiceService.updateInvoice.mockResolvedValue(mockInvoice);

      await updateInvoice(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockInvoice);
    });

    it('should return 404 if invoice to update not found', async () => {
      req.params.id = 'nonexistent';
      req.body = { status: 'payée' };

      invoiceService.updateInvoice.mockResolvedValue(null);

      await updateInvoice(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Facture introuvable' });
    });

    it('should handle update errors', async () => {
      req.params.id = 'invoice123';
      req.body = { status: 'invalid_status' };

      invoiceService.updateInvoice.mockRejectedValue(new Error('Invalid status'));

      await updateInvoice(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should update invoice to partiellement_payée', async () => {
      req.params.id = 'inv456';
      req.body = { status: 'partiellement_payée', remainingAmount: 2500 };

      const mockInvoice = {
        _id: 'inv456',
        amount: 5000,
        remainingAmount: 2500,
        status: 'partiellement_payée',
      };

      invoiceService.updateInvoice.mockResolvedValue(mockInvoice);

      await updateInvoice(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockInvoice);
    });
  });

  describe('deleteInvoice', () => {
    it('should delete invoice successfully', async () => {
      req.params.id = 'invoice123';

      invoiceService.deleteInvoice.mockResolvedValue({ _id: 'invoice123' });

      const { deleteInvoice } = require('../controllers/invoiceController');
      await deleteInvoice(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Facture supprimée avec succès' });
    });

    it('should return 404 if invoice to delete not found', async () => {
      req.params.id = 'nonexistent';

      invoiceService.deleteInvoice.mockResolvedValue(null);

      const { deleteInvoice } = require('../controllers/invoiceController');
      await deleteInvoice(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle deletion errors', async () => {
      req.params.id = 'invoice123';

      invoiceService.deleteInvoice.mockRejectedValue(new Error('Cannot delete invoiced'));

      const { deleteInvoice } = require('../controllers/invoiceController');
      await deleteInvoice(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
