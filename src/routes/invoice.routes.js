const express = require('express')
const {createInvoice, getAllInvoices} = require('../controllers/invoice.controller')
const router = express.Router()


router.get('/invoices', getAllInvoices)
router.post('/invoice/create', createInvoice)

module.exports = router