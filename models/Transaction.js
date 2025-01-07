const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userName: { type: String, required: true }, // User's name or email
  amountPaid: { type: Number, required: true }, // Amount in cents (Stripe format)
  paymentDate: { type: Date, default: Date.now }, // Timestamp of the transaction
});

module.exports = mongoose.model('Transaction', transactionSchema);
