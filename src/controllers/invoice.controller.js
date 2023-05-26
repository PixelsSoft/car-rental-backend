const Invoice = require('../models/invoice.model')
const CustomResponse = require('../utils/custom-response.util')
const ErrorResponse = require('../utils/error-response.util')
const sendEmail = require('../utils/sendgrid.util')

exports.createInvoice = async (req, res) => {
  const {
    invoiceNumber,
    customerName,
    customerEmail,
    invoiceDate,
    dueDate,
    items,
    total,
    notes,
  } = req.body
  try {
    const invoice = await Invoice({
      invoiceNo: invoiceNumber,
      customerName: customerName,
      customerEmail: customerEmail,
      invoiceDate: invoiceDate,
      dueDate: dueDate,
      items: items,
      total: total,
      notes,
    })
    await invoice.save()
    sendEmail({
      invoiceNumber,
      customerName,
      customerEmail,
      items,
      total,
      dueDate,
      invoiceDate,
      notes,
    })

    res.status(200).json(new CustomResponse(invoice, 'Invoice created'))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err))
  }
}

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({})
    res.status(200).json(new CustomResponse(invoices))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err))
  }
}

exports.deleteInvoiceById = async (req, res) => {
  try {
    const id = req.params.id
    const invoice = await Invoice.findById({ _id: id })
    if (!invoice)
      return res.status(404).json(new CustomResponse(null, 'Not found'))

    await invoice.deleteOne()
    res.status(200).json(new CustomResponse(null, 'Invoice deleted'))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err))
  }
}

exports.getInvoiceHistoryByCarId = async (req, res) => {
  try {
    console.log('HELLO')
    const id = req.params.id

    const invoices = await Invoice.find({ 'items.item': id })
    res.status(200).json(new CustomResponse(invoices))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err))
  }
}

exports.getTotalAmount = async (req, res) => {
  try {
    const invoices = await Invoice.find({})
    let total = invoices.reduce((acc, invoice) => invoice.total + acc, 0)
    res.status(200).json(new CustomResponse(total))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err))
  }
}

exports.getTotalInflow = async (req, res) => {
  try {
    const invoiceAmounts = await Invoice.aggregate([
      {
        $group: {
          _id: { $month: { $dateFromString: { dateString: '$invoiceDate' } } },
          totalAmount: { $sum: '$total' },
        },
      },
      {
        $project: {
          month: '$_id',
          totalAmount: 1,
          _id: 0,
        },
      },
    ])

    const monthsArray = Array.from({ length: 12 }, (_, i) => i + 1)

    // Iterate over the monthsArray and check if a document exists for that month in invoiceAmounts
    const result = monthsArray.map((month) => {
      const invoice = invoiceAmounts.find((item) => item.month === month)
      return { month, totalAmount: invoice ? invoice.totalAmount : 0 }
    })

    res.status(200).json(new CustomResponse(result))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err))
  }
}
