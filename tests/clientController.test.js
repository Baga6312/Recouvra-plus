const {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} = require('../controllers/clientController');
const clientService = require('../services/clientService');

jest.mock('../services/clientService');

describe('Client Controller - Unit Tests', () => {
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

  describe('createClient', () => {
    it('should create a client successfully', async () => {
      req.body = {
        name: 'John Enterprise',
        email: 'contact@john-enterprise.fr',
        phone: '+33 1 23 45 67 89',
        address: '123 Rue de Paris',
        siret: '12345678901234',
        status: 'actif',
      };

      const mockClient = {
        _id: 'client123',
        name: 'John Enterprise',
        email: 'contact@john-enterprise.fr',
        status: 'actif',
      };

      clientService.createClient.mockResolvedValue(mockClient);

      await createClient(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockClient);
    });

    it('should handle creation error', async () => {
      clientService.createClient.mockRejectedValue(new Error('Validation error'));

      await createClient(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should handle duplicate SIRET error', async () => {
      req.body = {
        name: 'Duplicate SIRET Co',
        siret: '99999999999999',
      };

      clientService.createClient.mockRejectedValue(new Error('SIRET already exists'));

      await createClient(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should create client with minimal fields', async () => {
      req.body = {
        name: 'Minimal Client',
      };

      const mockClient = {
        _id: 'client-minimal',
        name: 'Minimal Client',
        status: 'actif',
      };

      clientService.createClient.mockResolvedValue(mockClient);

      await createClient(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockClient);
    });
  });

  describe('getClients', () => {
    it('should get all clients successfully', async () => {
      const mockResult = {
        data: [
          { _id: '1', name: 'Client 1', status: 'actif' },
          { _id: '2', name: 'Client 2', status: 'inactif' },
          { _id: '3', name: 'Client 3', status: 'contentieux' },
        ],
        pagination: { total: 3, page: 1, limit: 10 },
      };

      clientService.getClients.mockResolvedValue(mockResult);

      await getClients(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should get clients with status filter', async () => {
      req.query = { status: 'contentieux' };
      req.user = undefined;

      const mockResult = {
        data: [
          { _id: '3', name: 'Client 3', status: 'contentieux' },
        ],
        pagination: { total: 1, page: 1, limit: 10 },
      };

      clientService.getClients.mockResolvedValue(mockResult);

      await getClients(req, res, next);

      expect(clientService.getClients).toHaveBeenCalledWith({ status: 'contentieux' }, undefined);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle empty client list', async () => {
      const mockResult = {
        data: [],
        pagination: { total: 0, page: 1, limit: 10 },
      };

      clientService.getClients.mockResolvedValue(mockResult);

      await getClients(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json.mock.calls[0][0].data.length).toBe(0);
    });

    it('should handle pagination parameters', async () => {
      req.query = { page: 2, limit: 5 };
      req.user = undefined;

      const mockResult = {
        data: [{ _id: '10', name: 'Client 10' }],
        pagination: { total: 100, page: 2, limit: 5 },
      };

      clientService.getClients.mockResolvedValue(mockResult);

      await getClients(req, res, next);

      expect(clientService.getClients).toHaveBeenCalledWith({ page: 2, limit: 5 }, undefined);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle service errors', async () => {
      clientService.getClients.mockRejectedValue(new Error('Database error'));

      await getClients(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getClientById', () => {
    it('should get client by id successfully', async () => {
      req.params.id = 'client123';

      const mockClient = {
        _id: 'client123',
        name: 'John Enterprise',
        email: 'contact@john-enterprise.fr',
        status: 'actif',
      };

      clientService.getClientById.mockResolvedValue(mockClient);

      await getClientById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockClient);
    });



    it('should handle service errors', async () => {
      req.params.id = 'client123';

      clientService.getClientById.mockRejectedValue(new Error('Database error'));

      await getClientById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should populate related data for client', async () => {
      req.params.id = 'client123';

      const mockClient = {
        _id: 'client123',
        name: 'John Enterprise',
        assignedAgent: {
          _id: 'agent1',
          name: 'Sophie',
        },
        invoices: [
          { _id: 'inv1', amount: 5000 },
        ],
      };

      clientService.getClientById.mockResolvedValue(mockClient);

      await getClientById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json.mock.calls[0][0].assignedAgent).toBeDefined();
    });
  });

  describe('updateClient', () => {
    it('should update client successfully', async () => {
      req.params.id = 'client123';
      req.body = { status: 'inactif', notes: 'Client inactive' };

      const mockClient = {
        _id: 'client123',
        name: 'John Enterprise',
        status: 'inactif',
        notes: 'Client inactive',
      };

      clientService.updateClient.mockResolvedValue(mockClient);

      await updateClient(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockClient);
    });



    it('should handle update errors', async () => {
      req.params.id = 'client123';
      req.body = { status: 'invalid_status' };

      clientService.updateClient.mockRejectedValue(new Error('Invalid status'));

      await updateClient(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should update client status to contentieux', async () => {
      req.params.id = 'client456';
      req.body = { status: 'contentieux' };

      const mockClient = {
        _id: 'client456',
        name: 'Problem Client',
        status: 'contentieux',
      };

      clientService.updateClient.mockResolvedValue(mockClient);

      await updateClient(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json.mock.calls[0][0].status).toBe('contentieux');
    });

    it('should update client assigned agent', async () => {
      req.params.id = 'client123';
      req.body = { assignedAgent: 'agent_new_id' };
      req.user = undefined;

      const mockClient = {
        _id: 'client123',
        name: 'John Enterprise',
        assignedAgent: 'agent_new_id',
      };

      clientService.updateClient.mockResolvedValue(mockClient);

      await updateClient(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(clientService.updateClient).toHaveBeenCalledWith('client123', { assignedAgent: 'agent_new_id' }, undefined);
    });
  });

  describe('deleteClient', () => {
    it('should delete client successfully', async () => {
      req.params.id = 'client123';

      clientService.deleteClient.mockResolvedValue({ _id: 'client123' });

      await deleteClient(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Client supprimé avec succès' });
    });



    it('should handle deletion errors', async () => {
      req.params.id = 'client123';

      clientService.deleteClient.mockRejectedValue(new Error('Cannot delete client with invoices'));

      await deleteClient(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should prevent deletion if client has active invoices', async () => {
      req.params.id = 'client_with_invoices';

      clientService.deleteClient.mockRejectedValue(
        new Error('Client has unpaid invoices')
      );

      await deleteClient(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should delete client and return success message', async () => {
      req.params.id = 'deletable_client';

      clientService.deleteClient.mockResolvedValue({ _id: 'deletable_client', name: 'Old Client' });

      await deleteClient(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json.mock.calls[0][0].message).toContain('supprimé');
    });
  });

});
