const express = require('express')
const PORT = 8001
const connectDb = require('./src/config/db.config')

//Endpoints:
const userRoutes = require('./src/routes/user.routes')
const carRoutes = require('./src/routes/car.routes')
const bookingRoutes = require('./src/routes/booking.routes')

const app = express()
connectDb()

app.use(express.json())

app.use(userRoutes)
app.use(carRoutes)
app.use(bookingRoutes)

app.listen(PORT, () => {
    console.log('Server started on port: ' + PORT)
})