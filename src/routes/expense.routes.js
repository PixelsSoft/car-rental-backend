const express = require('express')
const {
  addExpense,
  getExpenses,
  getRecentExpenses,
  deleteExpenseById,
  updateExpense,
  getTotalExpenseAmount,
  getMonthlyOutflow,
  recordExpensePayment,
} = require('../controllers/expense.controller')

const router = express.Router()

router.post('/expenses/add', addExpense)
router.post('/expenses/record/:id', recordExpensePayment)

router.get('/expenses', getExpenses)
router.get('/expense-total', getTotalExpenseAmount)
router.get('/recent-expenses', getRecentExpenses)
router.get('/expenses/monthly-outflow', getMonthlyOutflow)

router.delete('/expenses/:id', deleteExpenseById)
router.patch('/expenses/:id', updateExpense)

module.exports = router
