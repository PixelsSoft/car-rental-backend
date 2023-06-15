const {
    createRecurringInvoice,
    getAllRecurringInvoices
} = require('../controllers/recurring-invoice.controller')
const express = require('express')

const Router = express.Router()

Router.post('/recurring-invoices/create', createRecurringInvoice)
Router.get('/recurring-invoices', getAllRecurringInvoices)

module.exports = Router
