const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
  },
  type: String,
  amount: Number,
  description: String,
  date: String,
})

const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense
