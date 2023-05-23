const Customer = require('../models/customer.model')
const ErrorResponse = require('../utils/error-response.util')
const CustomResponse = require('../utils/custom-response.util')

exports.createCustomer = async (req, res) => {
    try {  
        const customer = new Customer(req.body)

        await customer.save()
        res.status(201).json(new CustomResponse(customer))
    } catch(err) {
        res.status(500).json(new ErrorResponse(err))
    }
}

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({})
        res.status(200).json(customers)
    } catch(err) {
        res.status(500).json(new ErrorResponse(err))
    }
}