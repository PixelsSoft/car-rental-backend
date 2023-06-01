const mongoose = require('mongoose')

const PaymentMethodSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  _createdAt: {
    type: Date,
    default: Date.now(),
  },
})

const PaymentMethod = mongoose.model('PaymentMethod', PaymentMethodSchema)

module.exports = PaymentMethod
