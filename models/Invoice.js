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
      enum: ['impayée', 'partiellement_payée', 'payée', 'en_retard', 'annulée'],
      default: 'impayée',
    },

    remainingAmount: {
        type: Number,
        default: function () {
      return this.amount;
      },
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