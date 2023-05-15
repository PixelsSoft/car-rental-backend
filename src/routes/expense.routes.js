const express = require('express')
const {addExpense, getExpenses, deleteExpenseById, updateExpense} = require('../controllers/expense.controller')

const router = express.Router()

router.post('/expenses/add', addExpense)
router.get('/expenses', getExpenses)
router.delete('/expenses/:id', deleteExpenseById)
router.patch('/expenses/:id', updateExpense)

module.exports = router