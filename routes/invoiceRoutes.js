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

router.route('/')
  .get(auth, invoiceController.getInvoices)
  .post(auth, validate(createInvoiceSchema), invoiceController.createInvoice)
  .put(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

router.route('/:id')
  .get(auth, invoiceController.getInvoiceById)
  .put(auth, validate(updateInvoiceSchema), invoiceController.updateInvoice)
  .delete(auth, invoiceController.deleteInvoice)
  .post(methodNotAllowed)
  .patch(methodNotAllowed);

module.exports = router;