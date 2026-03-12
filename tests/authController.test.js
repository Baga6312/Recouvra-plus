const { register, login } = require('../controllers/authController');
const User = require('../models/User');
const { generateToken } = require('../config/jwtConfig');

jest.mock('../models/User');
jest.mock('../config/jwtConfig');

describe('Auth Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  // ===== REGISTER =====
  describe('register', () => {
    it('should register a new user successfully', async () => {
      req.body = {
        name: 'John Doe',
        email: 'john@test.com',
        password: 'password123',
        role: 'agent',
      };

      const mockUser = {
        _id: '123456',
        toPublicJSON: jest.fn().mockReturnValue({
          _id: '123456',
          name: 'John Doe',
          email: 'john@test.com',
          role: 'agent',
        }),
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);
      generateToken.mockReturnValue('test_token');

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: 'test_token',
        user: mockUser.toPublicJSON(),
      });
    });

    it('should not register if email already exists', async () => {
      req.body = {
        name: 'Jane Doe',
        email: 'jane@test.com',
        password: 'password123',
      };

      User.findOne.mockResolvedValue({ email: 'jane@test.com' });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Cet email est déjà utilisé',
      });
    });

    it('should handle database errors during registration', async () => {
      req.body = {
        name: 'Error User',
        email: 'error@test.com',
        password: 'password123',
      };

      User.findOne.mockRejectedValue(new Error('Database connection error'));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Database connection error',
      });
    });

    it('should register user with default role when not specified', async () => {
      req.body = {
        name: 'Default User',
        email: 'default@test.com',
        password: 'password123',
      };

      const mockUser = {
        _id: '789',
        role: 'agent',
        toPublicJSON: jest.fn().mockReturnValue({
          _id: '789',
          name: 'Default User',
          email: 'default@test.com',
          role: 'agent',
        }),
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);
      generateToken.mockReturnValue('test_token_default');

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json.mock.calls[0][0].user.role).toBe('agent');
    });
  });

  // ===== LOGIN =====
  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      req.body = {
        email: 'admin@test.com',
        password: 'password123',
      };

      const mockUser = {
        _id: '123456',
        email: 'admin@test.com',
        role: 'admin',
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(true),
        toPublicJSON: jest.fn().mockReturnValue({
          _id: '123456',
          email: 'admin@test.com',
          role: 'admin',
        }),
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });
      generateToken.mockReturnValue('test_token');

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: 'test_token',
        user: mockUser.toPublicJSON(),
      });
    });

    it('should reject login with invalid email', async () => {
      req.body = {
        email: 'nonexistent@test.com',
        password: 'password123',
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email ou mot de passe incorrect',
      });
    });

    it('should reject login with incorrect password', async () => {
      req.body = {
        email: 'admin@test.com',
        password: 'wrongpassword',
      };

      const mockUser = {
        _id: '123456',
        email: 'admin@test.com',
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email ou mot de passe incorrect',
      });
    });

    it('should handle server errors during login', async () => {
      req.body = {
        email: 'admin@test.com',
        password: 'password123',
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Database error',
      });
    });

    it('should generate token with correct role on login', async () => {
      req.body = {
        email: 'manager@test.com',
        password: 'password123',
      };

      const mockUser = {
        _id: '555',
        email: 'manager@test.com',
        role: 'manager',
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(true),
        toPublicJSON: jest.fn().mockReturnValue({
          _id: '555',
          email: 'manager@test.com',
          role: 'manager',
        }),
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });
      generateToken.mockReturnValue('manager_token');

      await login(req, res);

      expect(generateToken).toHaveBeenCalledWith('555', 'manager');
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // ===== INVALID TOKEN =====
  describe('Invalid Token Handling', () => {
    it('should reject request with missing token', async () => {
      const protect = require('../middlewares/authMiddleware');
      const next = jest.fn();

      req.headers = {};

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Accès refusé, token manquant',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', async () => {
      const protect = require('../middlewares/authMiddleware');
      const next = jest.fn();

      req.headers = {
        authorization: 'Bearer invalid_token_xyz',
      };

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token invalide',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject if user is inactive after token validation', async () => {
      const protect = require('../middlewares/authMiddleware');
      const next = jest.fn();

      req.headers = {
        authorization: 'Bearer valid_token_123',
      };

      const { verifyToken } = require('../config/jwtConfig');
      verifyToken.mockReturnValue({ id: 'user123', role: 'agent' });

      User.findById.mockResolvedValue({
        _id: 'user123',
        isActive: false,
      });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Utilisateur introuvable ou désactivé',
      });
    });

    it('should accept valid token with active user', async () => {
      const protect = require('../middlewares/authMiddleware');
      const next = jest.fn();

      req.headers = {
        authorization: 'Bearer valid_token_456',
      };

      const { verifyToken } = require('../config/jwtConfig');
      verifyToken.mockReturnValue({ id: 'user456', role: 'admin' });

      const mockUser = {
        _id: 'user456',
        email: 'admin@test.com',
        isActive: true,
      };

      User.findById.mockResolvedValue(mockUser);

      await protect(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toEqual(mockUser);
    });
  });
});
