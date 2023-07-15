import express from "express";
import {
  getAllRecurringInvoices,
  endRecurringInvoice,
} from "../controllers/RecurringInvoiceController";

const Router = express.Router();

Router.get("/recurring-invoices", getAllRecurringInvoices);
Router.put("/recurring-invoice/end/:id", endRecurringInvoice);

export default Router;
