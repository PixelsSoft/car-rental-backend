import AsyncHandler from "../helpers/AsyncHandler";
import ExpenseCategory from "../models/ExpenseCategory";
import Bill from "../models/Bills";

export const createExpenseCategory = AsyncHandler(async (req, res, next) => {
  const newCategory = await ExpenseCategory.create(req.body);
  res.status(201).json({
    success: true,
    message: "Success",
  });
});

export const getAllExpenseCategories = AsyncHandler(async (req, res, next) => {
  const categories = await ExpenseCategory.find({});
  res.status(200).json({
    success: true,
    categories,
  });
});

export const getExpenseBreakdown = AsyncHandler(async (req, res, next) => {
  const allBills = await Bill.find().populate("category", "name");

  let totalAmount = 0;
  allBills.forEach((bill) => {
    totalAmount += bill.total;
  });

  const categoryBillsMap = new Map();
  allBills.forEach((bill) => {
    const categoryId = bill.category?._id.toString();
    if (!categoryBillsMap.has(categoryId)) {
      categoryBillsMap.set(categoryId, []);
    }
    categoryBillsMap.get(categoryId).push(bill);
  });

  const categoryBreakdown = [];
  for (const [categoryId, bills] of categoryBillsMap) {
    const category = await ExpenseCategory.findById(categoryId, "name");
    let categoryTotal = 0;
    bills.forEach((bill: any) => {
      categoryTotal += bill.total;
    });
    const percentage = ((categoryTotal / totalAmount) * 100).toFixed(2);
    categoryBreakdown.push({
      category: category?.name,
      totalAmount: categoryTotal,
      percentage,
    });
  }

  res.status(200).json({
    success: true,
    data: categoryBreakdown,
  });
});
