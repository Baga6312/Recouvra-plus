const express = require("express");
const router = express.Router();

const invoiceController = require("../controllers/invoiceController");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const {
  createInvoiceSchema,
  updateInvoiceSchema,
} = require("../validators/invoiceValidator");

router.get("/", auth, authorize("admin", "agent"), invoiceController.getInvoices);
router.get("/:id", auth, authorize("admin", "agent"), invoiceController.getInvoiceById);
router.post("/", auth, authorize("agent"), validate(createInvoiceSchema), invoiceController.createInvoice);
router.put("/:id", auth, authorize("admin"), validate(updateInvoiceSchema), invoiceController.updateInvoice);
router.delete("/:id", auth, authorize("admin"), invoiceController.deleteInvoice);

module.exports = router;