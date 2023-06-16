const mongoose = require('mongoose')

const invoiceSchema = new mongoose.Schema({
  invoiceNo: {
    type: String,
  },
  customerName: {
    type: String,
  },
  customerEmail: {
    type: String,
  },
  invoiceDate: {
    type: String,
  },
  dueDate: {
    type: String,
  },
  status: {
    type: String,
    enum: ['paid', 'due', 'overdue'],
    default: 'due',
  },
  items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
      },
      days: {
        type: Number,
        default: 0,
      },
      price: Number,
    },
  ],
  total: {
    type: Number,
    default: 0,
  },
  amountDue: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    default: '',
  },
  transactionHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TransactionHistory',
    },
  ],
})

const Invoice = mongoose.model('Invoice', invoiceSchema)

module.exports = Invoice
