const express = require("express");
const router = express.Router();

const clientController = require("../controllers/clientController");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const {
  createClientSchema,
  updateClientSchema,
} = require("../validators/clientValidator");

router.get("/", auth, authorize("admin", "agent"), clientController.getClients);
router.get("/:id", auth, authorize("admin", "agent"), clientController.getClientById);
router.post("/", auth, authorize("agent"), validate(createClientSchema), clientController.createClient);
router.put("/:id", auth, authorize("admin", "agent"), validate(updateClientSchema), clientController.updateClient);
router.delete("/:id", auth, authorize("admin", "agent"), clientController.deleteClient);

module.exports = router;