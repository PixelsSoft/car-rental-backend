import express from "express";
import {
  createExpenseCategory,
  getAllExpenseCategories,
  getExpenseBreakdown,
} from "../controllers/ExpenseCategory";

const Router = express.Router();

Router.post("/expense-categories/create", createExpenseCategory);
Router.get("/expense-categories", getAllExpenseCategories);
Router.get("/expense-breakdown", getExpenseBreakdown);

export default Router;
