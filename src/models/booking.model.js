const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    pickupAddress: String,
    dropoffAddress: String,
    pickupDate: String,
    dropoffDate: String,
    pickupTime: String,
    dropoffTime: String,
    totalAmount: Number,
    protectRental: {
        type: Boolean,
        default: false
    },
    protectPrice: Number,
    tollPass: {
        type: Boolean,
        default: false
    },
    tollPassPrice: Number,
    additionalDriver: {
        type: Boolean,
        default: false
    },
    additonalDriverPrice: Number,
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    vehicleBooked: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car'
    }
})


const Booking = mongoose.model('Booking', bookingSchema)

module.exports = Booking