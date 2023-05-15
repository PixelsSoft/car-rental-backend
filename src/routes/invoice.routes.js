const express = require('express')
const {createInvoice, getAllInvoices, deleteInvoiceById, getInvoiceHistoryByCarId, getTotalAmount} = require('../controllers/invoice.controller')
const router = express.Router()


router.get('/invoices', getAllInvoices)
router.get('/invoices/history/:id', getInvoiceHistoryByCarId)
router.get('/invoices/total', getTotalAmount)

router.post('/invoice/create', createInvoice)
router.delete('/invoices/:id', deleteInvoiceById)

module.exports = router