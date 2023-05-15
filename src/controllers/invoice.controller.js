const Invoice = require('../models/invoice.model')
const CustomResponse = require('../utils/custom-response.util')
const ErrorResponse = require('../utils/error-response.util')
const sendEmail = require('../utils/sendgrid.util')

exports.createInvoice = async (req, res) => {
    const { invoiceNumber, customerName, customerEmail, invoiceDate, dueDate, items, total } = req.body
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
    } catch (err) {
        res.status(500).json(new ErrorResponse(err))
    }
}

exports.deleteInvoiceById = async (req, res) => {
    try {
        const id = req.params.id
        const invoice = await Invoice.findById({ _id: id })
        if (!invoice) return res.status(404).json(new CustomResponse(null, 'Not found'))

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