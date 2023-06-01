const mongoose = require('mongoose')

const PaymentAccountSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  _createdAt: {
    type: Date,
    default: Date.now(),
  },
})

const PaymentAccount = mongoose.model('PaymentAccount', PaymentAccountSchema)

module.exports = PaymentAccount
