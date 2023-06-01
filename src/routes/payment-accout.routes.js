const {
  createPaymentAccount,
  getAllPaymentAccounts,
} = require('../controllers/payment-account.controller')
const express = require('express')

const Router = express.Router()

Router.get('/payment-accounts', getAllPaymentAccounts)
Router.post('/payment-account/create', createPaymentAccount)

module.exports = Router
