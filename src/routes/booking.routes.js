const { createBooking, getAllBookingsByUserId, endBookingById } = require('../controllers/booking.controller')
const { isAuthenticated } = require('../middleware/auth.middleware')
const express = require('express')
const router = express.Router()

router.get('/bookings', isAuthenticated, getAllBookingsByUserId)
router.post('/bookings/create', isAuthenticated,createBooking)
router.post('/bookings/end/:bookingId', isAuthenticated, endBookingById)

module.exports = router