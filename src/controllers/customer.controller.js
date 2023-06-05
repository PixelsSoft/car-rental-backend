const Customer = require('../models/customer.model')
const ErrorResponse = require('../utils/error-response.util')
const CustomResponse = require('../utils/custom-response.util')

exports.createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body)

    await customer.save()
    res.status(201).json(new CustomResponse(customer))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err))
  }
}

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({})
    res.status(200).json(new CustomResponse(customers))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err))
  }
}

exports.getCustomerProfile = async (req, res) => {
  try {
    const id = req.params.id

    const profile = await Customer.findById({ _id: id })

    if (!profile)
      return res.status(404).json(new CustomResponse(null, 'Not found', false))

    res.status(200).json(new CustomResponse(profile))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err))
  }
}

exports.deleteCustomerProfile = async (req, res) => {
  try {
    const id = req.params.id

    const profile = await Customer.findById({ _id: id })

    if (!profile)
      return res.status(404).json(new CustomResponse(null, 'Not found', false))

    await profile.deleteOne()
    res.status(201).json(new CustomResponse(null, 'Profile deleted'))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err))
  }
}

exports.deactivateProfile = async (req, res) => {
  try {
    const id = req.params.id

    const profile = await Customer.findById({ _id: id })
    if (!profile)
      return res.status(404).json(new CustomResponse(null, 'Not found', false))

    profile.status = 'Deactivated'
    await profile.save()

    res.status(201).json(new CustomResponse(profile))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err))
  }
}
