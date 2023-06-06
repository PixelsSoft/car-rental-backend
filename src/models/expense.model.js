const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
  },
  type: {
    type: String,
    default: '',
  },
  amount: {
    type: Number,
    default: 0,
  },
  amountDue: Number,
  description: String,
  date: String,
  status: {
    type: String,
    enum: ['paid', 'due', 'overdue'],
    default: 'due',
  },

  transactionHistory: [
    {
      date: String,
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
    },
  ],
})

const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense
