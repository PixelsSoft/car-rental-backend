import express from "express";
import { getAllRecurringInvoices } from "../controllers/RecurringInvoiceController";

const Router = express.Router();

Router.get("/recurring-invoices", getAllRecurringInvoices);

export default Router;
