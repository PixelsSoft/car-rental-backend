import mongoose from "mongoose";

const ExpenseCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Expense Category is require"],
  },
  bills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bill" }],
});

const ExpenseCategory = mongoose.model(
  "ExpenseCategory",
  ExpenseCategorySchema
);

export default ExpenseCategory;
