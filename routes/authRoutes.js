const express = require('express');
const router = express.Router();
const { register, login, getMe, updateMe, getUsers, updateUserRole } = require('../controllers/authController');
const  protect  = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { registerSchema, loginSchema, validate } = require('../validators/authValidator');
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [agent, manager, admin]
 */
router.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post('/login', validate(loginSchema), login);

// Obtenir son profil
router.get('/me', protect, getMe);

// Modifier son profil
router.put('/me', protect, updateMe);

// Lister tous les utilisateurs (admin seulement)
router.get('/users', protect, authorize('admin'), getUsers);

// Changer le rôle d'un utilisateur (admin seulement)
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);

module.exports = router;
