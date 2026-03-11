const express = require('express');
const router = express.Router();
const { create, getAll, getOne, update, remove } = require('../controllers/recoveryActionController');
const protect = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const methodNotAllowed = require('../middlewares/methodNotAllowed');

/**
 * @swagger
 * tags:
 *   name: RecoveryActions
 *   description: Actions de recouvrement
 */

/**
 * @swagger
 * /api/recovery-actions:
 *   get:
 *     summary: Liste toutes les actions de recouvrement
 *     tags: [RecoveryActions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: invoice
 *         schema:
 *           type: string
 *         description: Filtrer par ID de facture
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [appel, email, juridique, visite]
 *       - in: query
 *         name: assignedTo
 *         schema:
 *           type: string
 *         description: Filtrer par agent assigné
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste des actions avec pagination
 */
router
  .route('/')
  .get(protect, getAll)
  .post(protect, create)
  .put(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

/**
 * @swagger
 * /api/recovery-actions/{id}:
 *   get:
 *     summary: Obtenir une action par ID
 *     tags: [RecoveryActions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Action trouvée
 *       404:
 *         description: Action introuvable
 */
router
  .route('/:id')
  .get(protect, getOne)
  .put(protect, update)
  .delete(protect, authorize('admin', 'manager'), remove)
  .post(methodNotAllowed)
  .patch(methodNotAllowed);

/**
 * @swagger
 * /api/recovery-actions:
 *   post:
 *     summary: Créer une action de recouvrement
 *     tags: [RecoveryActions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invoice
 *               - type
 *               - assignedTo
 *             properties:
 *               invoice:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [appel, email, juridique, visite]
 *               actionDate:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Action créée
 *       400:
 *         description: Données invalides
 */

/**
 * @swagger
 * /api/recovery-actions/{id}:
 *   put:
 *     summary: Modifier une action
 *     tags: [RecoveryActions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [appel, email, juridique, visite]
 *               actionDate:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Action mise à jour
 *       404:
 *         description: Action introuvable
 */

/**
 * @swagger
 * /api/recovery-actions/{id}:
 *   delete:
 *     summary: Supprimer une action (admin/manager)
 *     tags: [RecoveryActions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Action supprimée
 *       404:
 *         description: Action introuvable
 */
router.delete('/:id', protect, authorize('admin', 'manager'), remove);

module.exports = router;