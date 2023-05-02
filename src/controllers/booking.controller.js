const Booking = require('../models/booking.model')
const User = require('../models/user.model')
const ErrorResponse = require('../utils/error-response.util')
const CustomResponse = require('../utils/custom-response.util')

exports.createBooking = async (req, res, next) => {
    try {

        let {
            pickupAddress,
            dropoffAddress,
            pickupDate,
            dropoffDate,
            pickupTime,
            dropoffTime,
            totalAmount,
            protectRental,
            protectPrice,
            tollPass,
            tollPassPrice,
            additionalDriver,
            additionalDriverPrice,
            vehicleId
        } = req.body

        if (
            !pickupAddress ||
            !dropoffAddress ||
            !pickupDate ||
            !dropoffDate ||
            !pickupTime ||
            !dropoffTime 
        ) return res.status(400).json(new CustomResponse(null, 'All fields are required'))
        
        let result = await Booking.create({
            pickupAddress,
            dropoffAddress,
            pickupDate,
            dropoffDate,
            pickupTime,
            dropoffTime,
            totalAmount,
            protectRental,
            protectPrice,
            tollPass,
            tollPassPrice,
            additionalDriver,
            additionalDriverPrice,
            bookedBy: req.user._id,
            vehicleBooked: vehicleId
        })
        await result.save()


        const user = await User.findById(req.user._id)
        user.currentlyRented.push(result)
        await user.save()
        res.status(201).json(new CustomResponse(result, 'Booking successful'))
    } catch (err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}

exports.getAllBookingsByUserId = async (req, res, next) => {
    try {
        let result = await Booking.find({bookedBy: req.user._id})
        res.status(200).json(new CustomResponse(result))
    } catch(err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}

exports.endBookingById = async function (req, res, next) {
    try {
        const user = req.user
        const bookingId = req.params.bookingId

        let bookingDetails = user.currentlyRented.find(booking => booking._id.toString() === bookingId)
        
        if(bookingDetails) {
            user.previouslyRented.push(bookingDetails)
            user.currentlyRented.filter(booking => {
                console.log('bookingId: ', booking._id.toString())
                console.log('bookingDetailsId: ', bookingDetails._id.toString())

                return booking._id.toString() !== bookingDetails._id.toString()
            })
        }

        console.log(user.previouslyRented.length)
        console.log(user.currentlyRented.length)

        res.status(200).json(new CustomResponse(null, 'Booking ended'))
    } catch(err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}

