const express = require("express");
const router = express.Router();

const clientController = require("../controllers/clientController");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/authMiddleware");
const methodNotAllowed = require('../middlewares/methodNotAllowed');

const {
  createClientSchema,
  updateClientSchema,
} = require("../validators/clientValidator");

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Gestion des clients
 */

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Lister tous les clients
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des clients
 *       401:
 *         description: Non autorisé
 *   post:
 *     summary: Créer un nouveau client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               siret:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [actif, inactif, contentieux]
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Client créé
 *       401:
 *         description: Non autorisé
 */
router.route('/')
  .get(auth, clientController.getClients)
  .post(auth, validate(createClientSchema), clientController.createClient)
  .put(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Récupérer les détails d'un client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID client
 *     responses:
 *       200:
 *         description: Détails du client
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Client non trouvé
 *   put:
 *     summary: Mettre à jour un client
 *     tags: [Clients]
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [actif, inactif, contentieux]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client mis à jour
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Client non trouvé
 *   delete:
 *     summary: Supprimer un client
 *     tags: [Clients]
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
 *         description: Client supprimé
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Client non trouvé
 */
router.route('/:id')
  .get(auth, clientController.getClientById)
  .put(auth, validate(updateClientSchema), clientController.updateClient)
  .delete(auth, clientController.deleteClient)
  .post(methodNotAllowed)
  .patch(methodNotAllowed);

/**
 * @swagger
 * /clients/{id}/invoices:
 *   get:
 *     summary: Lister les factures d'un client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID client
 *     responses:
 *       200:
 *         description: Liste des factures du client
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Client non trouvé
 */
router.route('/:id/invoices')
  .get(auth, clientController.getClientInvoices)
  .post(methodNotAllowed)
  .put(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

module.exports = router;