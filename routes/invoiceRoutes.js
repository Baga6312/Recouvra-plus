const express = require("express");
const router = express.Router();

const invoiceController = require("../controllers/invoiceController");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/authMiddleware");
const methodNotAllowed = require('../middlewares/methodNotAllowed');
const {
  createInvoiceSchema,
  updateInvoiceSchema,
} = require("../validators/invoiceValidator");

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Gestion des factures
 */

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Lister toutes les factures
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des factures
 *       401:
 *         description: Non autorisé
 *   post:
 *     summary: Créer une nouvelle facture
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [invoiceNumber, client, amount, dueDate]
 *             properties:
 *               invoiceNumber:
 *                 type: string
 *               client:
 *                 type: string
 *                 description: ID du client
 *               amount:
 *                 type: number
 *                 minimum: 0
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [impayée, partiellement_payée, payée, en_retard, annulée]
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Facture créée
 *       401:
 *         description: Non autorisé
 */
router.route('/')
  .get(auth, invoiceController.getInvoices)
  .post(auth, validate(createInvoiceSchema), invoiceController.createInvoice)
  .put(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

/**
 * @swagger
 * /invoices/{id}:
 *   get:
 *     summary: Récupérer les détails d'une facture
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID facture
 *     responses:
 *       200:
 *         description: Détails de la facture
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Facture non trouvée
 *   put:
 *     summary: Mettre à jour une facture
 *     tags: [Invoices]
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
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [impayée, partiellement_payée, payée, en_retard, annulée]
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Facture mise à jour
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Facture non trouvée
 *   delete:
 *     summary: Supprimer une facture
 *     tags: [Invoices]
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
 *         description: Facture supprimée
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Facture non trouvée
 */
router.route('/:id')
  .get(auth, invoiceController.getInvoiceById)
  .put(auth, validate(updateInvoiceSchema), invoiceController.updateInvoice)
  .delete(auth, invoiceController.deleteInvoice)
  .post(methodNotAllowed)
  .patch(methodNotAllowed);

module.exports = router;