const express = require('express');
const router = express.Router();
const { stats, overview, invoicesByStatus, topDebtors, monthlyEvolution } = require('../controllers/statsController');
const protect = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const methodNotAllowed = require('../middlewares/methodNotAllowed');

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Tableau de bord et statistiques
 */

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Statistiques globales du tableau de bord
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques globales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 invoices:
 *                   type: object
 *                   properties:
 *                     totalInvoices:
 *                       type: integer
 *                     totalAmount:
 *                       type: number
 *                     totalRemaining:
 *                       type: number
 *                     totalCollected:
 *                       type: number
 *                     collectionRate:
 *                       type: string
 *                     byStatus:
 *                       type: array
 *                 clients:
 *                   type: array
 *                 recoveryActions:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     byType:
 *                       type: array
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 */
router
  .route('/')
  .get(protect, authorize('admin', 'manager'), stats)
  .post(methodNotAllowed)
  .put(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

/**
 * @swagger
 * /stats/overview:
 *   get:
 *     summary: Aperçu des statistiques principales
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Aperçu des statistiques
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     caTotal:
 *                       type: number
 *                       description: Chiffre d'affaires total (CA)
 *                     tauxRecouvrement:
 *                       type: number
 *                       description: Taux de recouvrement en pourcentage
 *                     nbFactures:
 *                       type: integer
 *                       description: Nombre total de factures
 *                     totalRecouvre:
 *                       type: number
 *                       description: Montant total recouvré
 *                     totalEnAttendre:
 *                       type: number
 *                       description: Montant total en attente de recouvrement
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 */
router
  .route('/overview')
  .get(protect, authorize('admin', 'manager'), overview)
  .post(methodNotAllowed)
  .put(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

/**
 * @swagger
 * /stats/invoices-by-status:
 *   get:
 *     summary: Répartition des factures par statut
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Breakdown by invoice status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     statuses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           status:
 *                             type: string
 *                           count:
 *                             type: integer
 *                           totalAmount:
 *                             type: number
 *                           totalRemaining:
 *                             type: number
 *                           totalCollected:
 *                             type: number
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 */
router
  .route('/invoices-by-status')
  .get(protect, authorize('admin', 'manager'), invoicesByStatus)
  .post(methodNotAllowed)
  .put(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

/**
 * @swagger
 * /stats/top-debtors:
 *   get:
 *     summary: Top 10 clients débiteurs
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top 10 debtors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     debtors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           clientId:
 *                             type: string
 *                           clientName:
 *                             type: string
 *                           clientEmail:
 *                             type: string
 *                           clientStatus:
 *                             type: string
 *                           totalInvoices:
 *                             type: integer
 *                           totalAmount:
 *                             type: number
 *                           totalRemaining:
 *                             type: number
 *                           totalCollected:
 *                             type: number
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 */
router
  .route('/top-debtors')
  .get(protect, authorize('admin', 'manager'), topDebtors)
  .post(methodNotAllowed)
  .put(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

/**
 * @swagger
 * /stats/monthly:
 *   get:
 *     summary: Évolution mensuelle des paiements
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly payment evolution
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     evolution:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: string
 *                             example: "2024-03"
 *                           totalAmount:
 *                             type: number
 *                           paymentCount:
 *                             type: integer
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 */
router
  .route('/monthly')
  .get(protect, authorize('admin', 'manager'), monthlyEvolution)
  .post(methodNotAllowed)
  .put(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

module.exports = router;