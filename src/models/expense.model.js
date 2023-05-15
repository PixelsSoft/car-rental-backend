const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
    title: String,
    type: String,
    amount: Number,
    description: String,
    date: String
})


const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense