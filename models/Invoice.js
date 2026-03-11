const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["impayée", "partiellement_payée", "payée", "contentieux", "annulée"],
      default: "impayée",
    },
    remainingAmount: {
      type: Number,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

invoiceSchema.pre("save", function (next) {
  if (this.remainingAmount === undefined || this.remainingAmount === null) {
    this.remainingAmount = this.amount;
  }
  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);