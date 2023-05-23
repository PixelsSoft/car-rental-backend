const express = require('express')
const { getAllCustomers, createCustomer } = require('../controllers/customer.controller')

const router = express.Router()

router.get('/customers', getAllCustomers)

router.post('/customers/create', createCustomer)

module.exports = router