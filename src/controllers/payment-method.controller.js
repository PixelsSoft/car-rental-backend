const PaymentMethod = require('../models/payment-method.model')
const ErrorResponse = require('../utils/error-response.util')
const CustomResponse = require('../utils/custom-response.util')

exports.createPaymentMethod = async (req, res) => {
  try {
    const method = await PaymentMethod.create(req.body)
    await method.save()
    res.status(201).json(new CustomResponse(method, 'New payment method added'))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err))
  }
}

exports.getAllPaymentMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.find({})
    res.status(200).json(new CustomResponse(methods))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err))
  }
}
