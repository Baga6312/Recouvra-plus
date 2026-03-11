const mongoose = require('mongoose');

const recoveryActionSchema = new mongoose.Schema(
  {
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      required: true,
    },
    type: {
      type: String,
      enum: ['appel', 'email', 'juridique', 'visite'],
      required: true,
    },
    actionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);
module.exports = mongoose.models.RecoveryAction || mongoose.model('RecoveryAction', recoveryActionSchema);