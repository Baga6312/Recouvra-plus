const express = require('express');
const router = express.Router();
const { create, getAll, getOne, update } = require('../controllers/paymentController');
const protect = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Gestion des paiements
 */

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Liste tous les paiements
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: invoice
 *         schema:
 *           type: string
 *         description: Filtrer par ID de facture
 *       - in: query
 *         name: method
 *         schema:
 *           type: string
 *           enum: [espèces, virement, chèque]
 *         description: Filtrer par méthode de paiement
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
 *         description: Liste des paiements avec pagination
 *       401:
 *         description: Non autorisé
 */
router.get('/', protect, getAll);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Obtenir un paiement par ID
 *     tags: [Payments]
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
 *         description: Paiement trouvé
 *       404:
 *         description: Paiement introuvable
 */
router.get('/:id', protect, getOne);

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Enregistrer un paiement
 *     tags: [Payments]
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
 *               - amount
 *               - method
 *             properties:
 *               invoice:
 *                 type: string
 *                 description: ID de la facture
 *               amount:
 *                 type: number
 *                 description: Montant payé
 *               paymentDate:
 *                 type: string
 *                 format: date
 *               method:
 *                 type: string
 *                 enum: [espèces, virement, chèque]
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Paiement enregistré
 *       400:
 *         description: Données invalides
 */
router.post('/', protect, create);

/**
 * @swagger
 * /api/payments/{id}:
 *   put:
 *     summary: Modifier un paiement
 *     tags: [Payments]
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
 *               amount:
 *                 type: number
 *               paymentDate:
 *                 type: string
 *                 format: date
 *               method:
 *                 type: string
 *                 enum: [espèces, virement, chèque]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Paiement mis à jour
 *       404:
 *         description: Paiement introuvable
 */
router.put('/:id', protect, update);

module.exports = router;