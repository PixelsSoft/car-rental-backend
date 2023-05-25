require('dotenv').config()
const express = require('express')
const PORT = process.env.PORT || 8001
const connectDb = require('./src/config/db.config')

//Endpoints:
const userRoutes = require('./src/routes/user.routes')
const carRoutes = require('./src/routes/car.routes')
const bookingRoutes = require('./src/routes/booking.routes')
const invoiceRoutes = require('./src/routes/invoice.routes')
const expenseRoutes = require('./src/routes/expense.routes')
const customerRoutes = require('./src/routes/customer.routes')

const app = express()
connectDb()

app.use(express.json())

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  // const allowedOrigins = ['http://localhost:3000', 'http://car-rental-app-dashboard.netlify.app', 'https://car-rental-app-dashboard.netlify.app/'];
  // const origin = req.headers.origin;
  // if (allowedOrigins.includes(origin)) {
  //      res.setHeader('Access-Control-Allow-Origin', origin);
  // }
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.header('Access-Control-Allow-credentials', true)
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, UPDATE, PATCH'
  )
  next()
})

app.use(userRoutes)
app.use(carRoutes)
app.use(bookingRoutes)
app.use(invoiceRoutes)
app.use(expenseRoutes)
app.use(customerRoutes)

app.use('/uploads', express.static('uploads'))

app.listen(PORT, () => {
  console.log('Server started on port: ' + PORT)
})
