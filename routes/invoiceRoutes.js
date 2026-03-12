const express = require("express");
const router = express.Router();

const invoiceController = require("../controllers/invoiceController");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const methodNotAllowed = require("../middlewares/methodNotAllowed");
const {
  createInvoiceSchema,
  updateInvoiceSchema,
} = require("../validators/invoiceValidator");

router
  .route("/")
  .get(auth, authorize("admin", "manager", "agent"), invoiceController.getInvoices)
  .post(
    auth,
    authorize("admin", "manager", "agent"),
    validate(createInvoiceSchema),
    invoiceController.createInvoice
  )
  .all(methodNotAllowed);

router
  .route("/:id")
  .get(auth, authorize("admin", "manager", "agent"), invoiceController.getInvoiceById)
  .put(
    auth,
    authorize("admin", "manager", "agent"),
    validate(updateInvoiceSchema),
    invoiceController.updateInvoice
  )
  .delete(auth, authorize("admin"), invoiceController.deleteInvoice)
  .all(methodNotAllowed);

module.exports = router;