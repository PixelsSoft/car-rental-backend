const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 8001
const connectDb = require('./src/config/db.config')

//Endpoints:
const userRoutes = require('./src/routes/user.routes')
const carRoutes = require('./src/routes/car.routes')
const bookingRoutes = require('./src/routes/booking.routes')
const invoiceRoutes = require('./src/routes/invoice.routes')

const app = express()
connectDb()

app.use(express.json())
app.use(cors({ origin: ['http://localhost:3000', 'http://car-rental-app-dashboard.netlify.app', 'https://car-rental-app-dashboard.netlify.app'], credentials: true }))

app.use(userRoutes)
app.use(carRoutes)
app.use(bookingRoutes)
app.use(invoiceRoutes)

app.listen(PORT, () => {
    console.log('Server started on port: ' + PORT)
})