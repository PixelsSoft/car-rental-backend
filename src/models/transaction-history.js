const mongoose = require('mongoose')

const transactionHistorySchema = new mongoose.Schema({
  date: {
    type: String,
    default: '',
  },
  amount: {
    type: Number,
    default: 0,
  },
  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMethod',
  },

  paymentAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentAccount',
  },
  memo: {
    type: String,
    default: '',
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
  },
})

const TransactionHistory = mongoose.model(
  'TransactionHistory',
  transactionHistorySchema
)

module.exports = TransactionHistory
