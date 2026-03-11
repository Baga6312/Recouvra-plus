const express = require('express');
const router = express.Router();
const { register, login, getMe, updateMe, getUsers, updateUserRole } = require('../controllers/authController');
const protect = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { registerSchema, loginSchema, validate } = require('../validators/authValidator');
const methodNotAllowed = require('../middlewares/methodNotAllowed');

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
router.route('/register')
  .post(validate(registerSchema), register)
  .get(methodNotAllowed)
  .put(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

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
router.route('/login')
  .post(validate(loginSchema), login)
  .get(methodNotAllowed)
  .put(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

router.route('/me')
  .get(protect, getMe)
  .put(protect, updateMe)
  .post(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

router.route('/users')
  .get(protect, authorize('admin'), getUsers)
  .post(methodNotAllowed)
  .put(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

router.route('/users/:id/role')
  .put(protect, authorize('admin'), updateUserRole)
  .get(methodNotAllowed)
  .post(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

module.exports = router;