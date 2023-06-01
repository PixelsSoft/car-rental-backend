const ErrorResponse = require('../utils/error-response.util')
const Invoice = require('../models/invoice.model')
const CustomResponse = require('../utils/custom-response.util')
const TransactionHistory = require('../models/transaction-history')

exports.createTransaction = async (req, res) => {
  console.log(req.body)
  try {
    if (typeof req.body.amount !== 'number') {
      return res
        .status(400)
        .json(new CustomResponse(null, 'Amount entered is not a number', false))
    }

    const newTransaction = await TransactionHistory.create(req.body)
    await newTransaction.save()

    const invoice = await Invoice.findById(req.body.invoice).populate(
      'transactionHistory'
    )
    invoice.transactionHistory.push(newTransaction)

    let transactionsTotal = invoice.transactionHistory.reduce(
      (acc, history) => {
        console.log('acc', acc)
        console.log('history', history)
        return acc + history.amount
      },
      0
    )
    if (
      invoice.total === transactionsTotal ||
      invoice.total < transactionsTotal
    ) {
      invoice.status = 'paid'
    }

    console.log('===>', invoice.total, transactionsTotal)
    let amountDue = invoice.total - transactionsTotal
    console.log(amountDue)
    invoice.amountDue = amountDue
    console.log(invoice.amountDue)
    await invoice.save()

    res.status(201).json(new CustomResponse(newTransaction))
  } catch (err) {
    res.status(500).json(new ErrorResponse())
  }
}

exports.getTransactionsByInvoiceId = async (req, res) => {
  try {
    const invoiceId = req.params.id

    const transactions = await TransactionHistory.find({ invoice: invoiceId })
    res.status(200).json(new CustomResponse(transactions))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err))
  }
}
