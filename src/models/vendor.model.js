const mongoose = require('mongoose')

const VendorSchema = new mongoose.Schema({
  name: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  firstName: {
    type: String,
    default: '',
  },
  lastName: {
    type: String,
    default: '',
  },
})

const Vendor = mongoose.model('Vendor', VendorSchema)

module.exports = Vendor
