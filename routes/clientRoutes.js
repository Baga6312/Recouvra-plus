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



router.route('/')
  .get(auth, clientController.getClients)
  .post(auth, validate(createClientSchema), clientController.createClient)
  .put(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

router.route('/:id')
  .get(auth, clientController.getClientById)
  .put(auth, validate(updateClientSchema), clientController.updateClient)
  .delete(auth, clientController.deleteClient)
  .post(methodNotAllowed)
  .patch(methodNotAllowed);

router.route('/:id/invoices')
  .get(auth, clientController.getClientInvoices)
  .post(methodNotAllowed)
  .put(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

module.exports = router;