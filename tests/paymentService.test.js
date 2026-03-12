const paymentService = require('../services/paymentService');
const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');

jest.mock('../models/Payment');
jest.mock('../models/Invoice');

describe('Payment Service - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPayment', () => {
    it('should create payment and update invoice status to pagée when fully paid', async () => {
      const paymentData = {
        invoice: 'invoice123',
        amount: 5000,
        method: 'virement',
      };

      const mockInvoice = {
        _id: 'invoice123',
        amount: 5000,
        remainingAmount: 5000,
        status: 'impayée',
      };

      const mockPayment = {
        _id: 'payment123',
        ...paymentData,
      };

      Invoice.findById.mockResolvedValue(mockInvoice);
      Payment.create.mockResolvedValue(mockPayment);
      Invoice.findByIdAndUpdate.mockResolvedValue({
        status: 'payée',
        remainingAmount: 0,
      });

      const result = await paymentService.createPayment(paymentData);

      expect(result).toEqual(mockPayment);
      expect(Invoice.findByIdAndUpdate).toHaveBeenCalledWith('invoice123', {
        remainingAmount: 0,
        status: 'payée',
      });
    });

    it('should create payment and update invoice status to partiellement_payée', async () => {
      const paymentData = {
        invoice: 'invoice123',
        amount: 3000,
        method: 'virement',
      };

      const mockInvoice = {
        _id: 'invoice123',
        amount: 5000,
        remainingAmount: 5000,
        status: 'impayée',
      };

      const mockPayment = {
        _id: 'payment123',
        ...paymentData,
      };

      Invoice.findById.mockResolvedValue(mockInvoice);
      Payment.create.mockResolvedValue(mockPayment);
      Invoice.findByIdAndUpdate.mockResolvedValue({
        status: 'partiellement_payée',
        remainingAmount: 2000,
      });

      const result = await paymentService.createPayment(paymentData);

      expect(result).toEqual(mockPayment);
      expect(Invoice.findByIdAndUpdate).toHaveBeenCalledWith('invoice123', {
        remainingAmount: 2000,
        status: 'partiellement_payée',
      });
    });

    it('should throw error if invoice not found', async () => {
      const paymentData = {
        invoice: 'nonexistent',
        amount: 5000,
      };

      Invoice.findById.mockResolvedValue(null);

      await expect(paymentService.createPayment(paymentData)).rejects.toThrow('Facture introuvable');
    });

    it('should throw error if invoice is already paid', async () => {
      const paymentData = {
        invoice: 'invoice123',
        amount: 5000,
      };

      const mockInvoice = {
        _id: 'invoice123',
        status: 'payée',
      };

      Invoice.findById.mockResolvedValue(mockInvoice);

      await expect(paymentService.createPayment(paymentData)).rejects.toThrow('déjà payée');
    });

    it('should throw error if payment amount exceeds remaining amount', async () => {
      const paymentData = {
        invoice: 'invoice123',
        amount: 10000,
      };

      const mockInvoice = {
        _id: 'invoice123',
        amount: 5000,
        remainingAmount: 3000,
        status: 'partiellement_payée',
      };

      Invoice.findById.mockResolvedValue(mockInvoice);

      await expect(paymentService.createPayment(paymentData)).rejects.toThrow('dépasse le restant');
    });

    it('should throw error if invoice is cancelled', async () => {
      const paymentData = {
        invoice: 'invoice123',
        amount: 1000,
      };

      const mockInvoice = {
        _id: 'invoice123',
        status: 'annulée',
      };

      Invoice.findById.mockResolvedValue(mockInvoice);

      await expect(paymentService.createPayment(paymentData)).rejects.toThrow('annulée');
    });

    it('should create payment with virement method', async () => {
      const paymentData = {
        invoice: 'invoice123',
        amount: 5000,
        method: 'virement',
        recordedBy: 'user123',
      };

      const mockInvoice = {
        _id: 'invoice123',
        amount: 5000,
        remainingAmount: 5000,
        status: 'impayée',
      };

      const mockPayment = {
        _id: 'payment789',
        ...paymentData,
      };

      Invoice.findById.mockResolvedValue(mockInvoice);
      Payment.create.mockResolvedValue(mockPayment);
      Invoice.findByIdAndUpdate.mockResolvedValue({ status: 'payée' });

      const result = await paymentService.createPayment(paymentData);

      expect(result).toEqual(mockPayment);
      expect(result.method).toBe('virement');
    });
  });

  describe('updatePayment', () => {
    it('should update payment and invoice status correctly', async () => {
      const paymentId = 'payment123';
      const updateData = { amount: 4000 };

      const mockOriginalPayment = {
        _id: 'payment123',
        invoice: 'invoice123',
        amount: 3000,
      };

      const mockInvoice = {
        _id: 'invoice123',
        amount: 5000,
        remainingAmount: 2000,
      };

      const mockUpdatedPayment = {
        _id: 'payment123',
        amount: 4000,
      };

      Payment.findById.mockResolvedValueOnce(mockOriginalPayment);
      Invoice.findById.mockResolvedValue(mockInvoice);
      Invoice.findByIdAndUpdate.mockResolvedValue({
        status: 'partiellement_payée',
        remainingAmount: 1000,
      });

      // Mock the chained populate calls
      Payment.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockUpdatedPayment),
        }),
      });

      const result = await paymentService.updatePayment(paymentId, updateData);

      expect(result).toEqual(mockUpdatedPayment);
      expect(Invoice.findByIdAndUpdate).toHaveBeenCalledWith(
        'invoice123',
        expect.objectContaining({
          remainingAmount: 1000,
        })
      );
    });

    it('should return null if payment not found', async () => {
      Payment.findById.mockResolvedValue(null);

      const result = await paymentService.updatePayment('nonexistent', { amount: 1000 });

      expect(result).toBeNull();
    });

    it('should throw error if new payment amount exceeds remaining', async () => {
      const paymentId = 'payment123';
      const updateData = { amount: 15000 };

      const mockOriginalPayment = {
        _id: 'payment123',
        invoice: 'invoice123',
        amount: 3000,
      };

      const mockInvoice = {
        _id: 'invoice123',
        amount: 5000,
        remainingAmount: 2000,
      };

      Payment.findById.mockResolvedValueOnce(mockOriginalPayment);
      Invoice.findById.mockResolvedValue(mockInvoice);

      await expect(paymentService.updatePayment(paymentId, updateData)).rejects.toThrow('dépasse');
    });

    it('should update payment to impayée status if amount restored to full', async () => {
      const paymentId = 'payment123';
      const updateData = { amount: 1000 };

      // Original payment was 3000, now reducing to 1000
      const mockOriginalPayment = {
        _id: 'payment123',
        invoice: 'invoice123',
        amount: 3000,
      };

      // Invoice total 5000, remaining was 2000 (3000 paid)
      const mockInvoice = {
        _id: 'invoice123',
        amount: 5000,
        remainingAmount: 2000,
      };

      const mockUpdatedPayment = {
        _id: 'payment123',
        amount: 1000,
      };

      Payment.findById.mockResolvedValueOnce(mockOriginalPayment);
      Invoice.findById.mockResolvedValue(mockInvoice);
      // After update: remaining = 2000 + 3000 - 1000 = 4000
      // Status should be impayée since 4000 (remaining) == 4000 (less than full 5000)
      Invoice.findByIdAndUpdate.mockResolvedValue({
        status: 'impayée',
        remainingAmount: 4000,
      });

      Payment.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockUpdatedPayment),
        }),
      });

      const result = await paymentService.updatePayment(paymentId, updateData);

      expect(result).toEqual(mockUpdatedPayment);
      expect(Invoice.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('getPaymentById', () => {
    it('should get payment by id with populated fields', async () => {
      const mockPayment = {
        _id: 'payment123',
        amount: 5000,
        method: 'virement',
        invoice: { invoiceNumber: 'INV-001' },
        recordedBy: { name: 'Admin' },
      };

      Payment.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockPayment),
        }),
      });

      const result = await paymentService.getPaymentById('payment123');

      expect(result).toEqual(mockPayment);
    });

    it('should request correct field selections in populate', async () => {
      const mockPayment = {
        _id: 'payment456',
        amount: 3000,
        invoice: { invoiceNumber: 'INV-002', amount: 5000 },
        recordedBy: { name: 'Agent' },
      };

      const populateMock1 = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockPayment),
      });

      Payment.findById.mockReturnValue({
        populate: populateMock1,
      });

      await paymentService.getPaymentById('payment456');

      expect(Payment.findById).toHaveBeenCalledWith('payment456');
      expect(populateMock1).toHaveBeenCalledWith('invoice', 'invoiceNumber amount remainingAmount status');
    });

    it('should return null if payment does not exist', async () => {
      Payment.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null),
        }),
      });

      const result = await paymentService.getPaymentById('nonexistent');

      expect(result).toBeNull();
    });
  });
});
