const Expense = require('../models/expense.model')
const CustomResponse = require('../utils/custom-response.util')
const ErrorResponse = require('../utils/error-response.util')

exports.addExpense = async (req, res) => {
  try {
    const expense = new Expense(req.body)
    expense.amountDue = req.body.amount
    await expense.save()
    res.status(200).json(new CustomResponse(expense, 'Expense added'))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err.stack))
  }
}

exports.getExpenses = async (req, res) => {
  try {
    const { from, to } = req.query
    const query = {}

    if (from && to) {
      query.date = {
        $gte: from,
        $lte: to,
      }
    }
    const expenses = await Expense.find(query).populate('vendor')
    res.status(200).json(new CustomResponse(expenses))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err.stack))
  }
}

exports.getTotalExpenseAmount = async (req, res) => {
  try {
    const expenses = await Expense.find({})

    let total = expenses.reduce((acc, expense) => acc + expense.amount, 0)
    res.status(200).json(new CustomResponse(total))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err.stack))
  }
}

exports.deleteExpenseById = async (req, res) => {
  try {
    const id = req.params.id
    const expense = await Expense.findById({ _id: id })

    if (!expense)
      return res.status(404).json(new CustomResponse(null, 'No expense found'))

    await expense.deleteOne()
    res.status(201).json(new CustomResponse(null, 'Expense deleted'))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err.stack))
  }
}

exports.updateExpense = async (req, res) => {
  try {
    const id = req.params.id
    const expense = await Expense.findById({ _id: id })

    if (!expense)
      return res.status(404).json(new CustomResponse(null, 'Not found'))

    await Expense.findOneAndUpdate({ _id: id }, req.body, { new: true })

    res.status(201).json(new CustomResponse(expense, 'Expense details updated'))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err.stack))
  }
}

exports.getRecentExpenses = async (req, res) => {
  try {
    const recentExpenses = await Expense.find()
      .populate('vendor')
      .sort({ _id: -1 })
      .limit(5)
    res.status(200).json(new CustomResponse(recentExpenses))
  } catch (err) {
    console.log(err.stack)
    res.status(500).json(new ErrorResponse(err))
  }
}

exports.getMonthlyOutflow = async (req, res) => {
  try {
    const expenseAmounts = await Expense.aggregate([
      {
        $group: {
          _id: { $month: { $dateFromString: { dateString: '$date' } } },
          totalAmount: { $sum: '$amount' },
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

    const result = monthsArray.map((month) => {
      const expense = expenseAmounts.find((item) => item.month === month)
      return { month, totalAmount: expense ? expense.totalAmount : 0 }
    })

    res.status(200).json(new CustomResponse(result))
  } catch (err) {
    console.log(err.stack)
    res.status(500).json(new ErrorResponse(err))
  }
}

exports.recordExpensePayment = async (req, res) => {
  try {
    const id = req.params.id
    const { date, amount, paymentMethod, paymentAccount, memo } = req.body
    const expense = await Expense.findById({ _id: id })

    if (!expense)
      return res.status(404).json(new CustomResponse(null, 'Not found', false))

    if (amount >= expense.amount) {
      expense.amountDue = 0
    } else {
      expense.amountDue = expense.amountDue - amount
    }

    if (expense.amountDue <= 0) {
      expense.status = 'paid'
    }

    expense.transactionHistory.push({
      date,
      amount,
      paymentMethod,
      paymentAccount,
      memo,
    })

    await expense.save()
    res.status(201).json(new CustomResponse(null, 'Success'))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err))
  }
}
