const express = require('express')
const {
  createPaymentMethod,
  getAllPaymentMethods,
} = require('../controllers/payment-method.controller')

const Router = express.Router()

Router.get('/payment-methods', getAllPaymentMethods)
Router.post('/payment-method/create', createPaymentMethod)

module.exports = Router
