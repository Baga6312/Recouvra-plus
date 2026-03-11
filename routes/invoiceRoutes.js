const express = require("express");
const router = express.Router();

const invoiceController = require("../controllers/invoiceController");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/authMiddleware");
const {
  createInvoiceSchema,
  updateInvoiceSchema,
} = require("../validators/invoiceValidator");

router.get("/", auth, invoiceController.getInvoices);
router.get("/:id", auth, invoiceController.getInvoiceById);
router.post("/", auth, validate(createInvoiceSchema), invoiceController.createInvoice);
router.put("/:id", auth, validate(updateInvoiceSchema), invoiceController.updateInvoice);
router.delete("/:id", auth, invoiceController.deleteInvoice);

module.exports = router;