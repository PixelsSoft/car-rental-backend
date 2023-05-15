const Expense = require('../models/expense.model')
const CustomResponse = require('../utils/custom-response.util')
const ErrorResponse = require('../utils/error-response.util')

exports.addExpense = async (req, res) => {
    try {
        const expense = new Expense(req.body)
        await expense.save()
        res.status(200).json(new CustomResponse(expense, 'Expense added'))
    } catch(err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({})

        res.status(200).json(new CustomResponse(expenses))
    } catch(err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}


exports.deleteExpenseById = async (req, res) => {
    console.log('hello')
    try {
        const id = req.params.id
        console.log(id)
        const expense = await Expense.findById({_id: id})

        console.log(expense)
        if(!expense) return res.status(404).json(new CustomResponse(null, 'No expense found'))
        
        await expense.deleteOne()
        res.status(201).json(new CustomResponse(null, 'Expense deleted'))
    } catch (err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}

exports.updateExpense = async (req, res) => {
    try {   
        const id = req.params.id
        const expense = await Expense.findById({_id: id})

        if(!expense) return res.status(404).json(new CustomResponse(null, 'Not found'))

        await Expense.findOneAndUpdate({_id: id}, req.body, {new: true})

        res.status(201).json(new CustomResponse(expense, 'Expense details updated'))
    } catch (err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}