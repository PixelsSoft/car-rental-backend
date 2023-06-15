const ErrorResponse = require('../utils/error-response.util')
const CustomResponse = require('../utils/custom-response.util')
const RecurringInvoices = require('../models/recurring-invoice.model')

exports.createRecurringInvoice = async (req, res) => {
    try {
        const nextInvoice = req.body.schedule
        const invoiceDate = req.body.invoiceDate

        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        let recurring_date = parseInt(nextInvoice.split(' ')[1])

        let invoice_date_milliseconds = new Date(invoiceDate).getTime()
        const future_date = invoice_date_milliseconds + (recurring_date * millisecondsPerDay)
        const newRecurringInvoice = await RecurringInvoices.create({...req.body, nextInvoice: future_date})

        res.status(201).json(new CustomResponse(newRecurringInvoice))
    } catch (err) {
        console.log(err)
        res.status(500).json(new ErrorResponse(err))
    }
}

exports.getAllRecurringInvoices = async (req, res) => {
    try {
        const recurringInvoices = await RecurringInvoices.find({})
        res.status(200).json(new CustomResponse(recurringInvoices))
    } catch (err) {
        console.log(err)
        res.status(500).json(new ErrorResponse(err))
    }
}
