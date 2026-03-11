const express = require('express');
const router = express.Router();
const { stats } = require('../controllers/statsController');
const protect = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Tableau de bord et statistiques
 */

/**
 * @swagger
 * /api/stats:
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
router.get('/', protect, authorize('admin', 'manager'), stats);

module.exports = router;