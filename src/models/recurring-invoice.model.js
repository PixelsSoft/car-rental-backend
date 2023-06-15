const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['active', 'ended'],
        default: 'active',
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },
    customerName: {
        type: String,
        default: ''
    },
    customerEmail: {
        type: String,
        default: ''
    },
    schedule: {
        type: String,
        default: '',
    },
    nextInvoice: {
        type: Date,
        default: Date.now(),
    },
    invoiceDate: {
        type: String,
        default: Date.now()
    },
    _createdAt: {
        type: Date,
        default: Date.now(),
    },
    total: {
        type: Number,
        default: 0
    },
    notes: {
        type: String,
        default: ''
    },
    items: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Car',
            },
            days: Number,
            price: Number,
        },
    ],
})

const RecurringInvoices = mongoose.model('RecurringInvoice', Schema)

module.exports = RecurringInvoices
