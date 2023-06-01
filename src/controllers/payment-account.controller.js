const PaymentAccount = require('../models/payment-account.model')
const CustomResponse = require('../utils/custom-response.util')
const ErrorResponse = require('../utils/error-response.util')

exports.createPaymentAccount = async (req, res) => {
  try {
    const method = await PaymentAccount.create(req.body)
    await method.save()
    res
      .status(201)
      .json(new CustomResponse(method, 'New payment account added'))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err))
  }
}

exports.getAllPaymentAccounts = async (req, res) => {
  try {
    const accounts = await PaymentAccount.find({})
    res.status(200).json(new CustomResponse(accounts))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err))
  }
}
