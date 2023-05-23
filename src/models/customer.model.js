const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    customer: String,
    address: String,
    IdNumber: String,
    status: {
        type: String,
        enum: ['Active', 'Deactivated'],
        default: 'Active'
    }
})


const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer