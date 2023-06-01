const {
  createTransaction,
  getTransactionsByInvoiceId,
} = require('../controllers/transaction-history.controller')

const express = require('express')
const Router = express.Router()

Router.get('/transaction-history/:id', getTransactionsByInvoiceId)
Router.post('/transaction-history/create', createTransaction)

module.exports = Router
