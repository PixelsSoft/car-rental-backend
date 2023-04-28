const mongoose = require('mongoose')

const RegisteredUsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    emergencyContact: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    carType: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    registrationDate: {
        type: String,
        required: true
    },
    pickupDate: {
        type: String,
        required: true
    },
    returnDate: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})


const RegisteredUser = mongoose.model('RegisteredUser', RegisteredUsersSchema)

module.exports = RegisteredUser