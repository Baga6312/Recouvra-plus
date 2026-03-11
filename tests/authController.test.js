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
  });
});
