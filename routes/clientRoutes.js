const express = require("express");
const router = express.Router();

const clientController = require("../controllers/clientController");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const methodNotAllowed = require("../middlewares/methodNotAllowed");

const {
  createClientSchema,
  updateClientSchema,
} = require("../validators/clientValidator");

router
  .route("/")
  .get(auth, authorize("admin", "manager", "agent"), clientController.getClients)
  .post(
    auth,
    authorize("admin", "manager", "agent"),
    validate(createClientSchema),
    clientController.createClient
  )
  .all(methodNotAllowed);

router
  .route("/:id")
  .get(auth, authorize("admin", "manager", "agent"), clientController.getClientById)
  .put(
    auth,
    authorize("admin", "manager", "agent"),
    validate(updateClientSchema),
    clientController.updateClient
  )
  .delete(auth, authorize("admin"), clientController.deleteClient)
  .all(methodNotAllowed);

router
  .route("/:id/invoices")
  .get(auth, authorize("admin", "manager", "agent"), clientController.getClientInvoices)
  .all(methodNotAllowed);

module.exports = router;