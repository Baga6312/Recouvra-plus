const express = require("express");
const router = express.Router();

const clientController = require("../controllers/clientController");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const {
  createClientSchema,
  updateClientSchema,
} = require("../validators/clientValidator");

router.get("/", auth, clientController.getClients);
router.get("/:id", auth, clientController.getClientById);
router.post("/", auth, validate(createClientSchema), clientController.createClient);
router.put("/:id", auth, validate(updateClientSchema), clientController.updateClient);
router.delete("/:id", auth, clientController.deleteClient);
router.get("/:id/invoices", auth, clientController.getClientInvoices);

module.exports = router;