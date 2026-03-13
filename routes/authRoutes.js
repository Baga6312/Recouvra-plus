const express = require('express');
const router = express.Router();
const { register, login, getMe, updateMe, getUsers, updateUserRole } = require('../controllers/authController');
const protect = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { registerSchema, loginSchema, updateMeSchema, validate } = require('../validators/authValidator');
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

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur actuel
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *       401:
 *         description: Non autorisé
 *   put:
 *     summary: Mettre à jour le profil utilisateur
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       401:
 *         description: Non autorisé
 */
router.route('/me')
  .get(protect, getMe)
  .put(protect, validate(updateMeSchema), updateMe)
  .post(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Lister tous les utilisateurs
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé (admin uniquement)
 */
router.route('/users')
  .get(protect, authorize('admin'), getUsers)
  .post(methodNotAllowed)
  .put(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

/**
 * @swagger
 * /auth/users/{id}/role:
 *   put:
 *     summary: Mettre à jour le rôle d'un utilisateur
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [agent, manager, admin]
 *     responses:
 *       200:
 *         description: Rôle mis à jour
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé (admin uniquement)
 *       404:
 *         description: Utilisateur non trouvé
 */
router.route('/users/:id/role')
  .put(protect, authorize('admin'), updateUserRole)
  .get(methodNotAllowed)
  .post(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

module.exports = router;