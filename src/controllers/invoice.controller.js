const Invoice = require('../models/invoice.model')
const CustomResponse = require('../utils/custom-response.util')
const ErrorResponse = require('../utils/error-response.util')
const sendEmail = require('../utils/sendgrid.util')

exports.createInvoice = async (req, res) => {
    const {invoiceNumber, customerName, customerEmail, invoiceDate, dueDate, items, total} = req.body
    try {
        const invoice = await Invoice({
            invoiceNo: invoiceNumber,
            customerName: customerName,
            customerEmail: customerEmail,
            invoiceDate: invoiceDate,
            dueDate: dueDate,
            items: items,
            total: total
        })
        await invoice.save()
        sendEmail({
            invoiceNumber, 
            customerName, 
            customerEmail, 
            items, total, 
            dueDate, 
            invoiceDate
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
    } catch(err) {
        res.status(500).json(new ErrorResponse(err))
    }
} 