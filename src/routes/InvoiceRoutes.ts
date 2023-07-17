import express from "express";
import {
  createInvoice,
  editInvoice,
  getMonthwiseData,
  getInvoices,
  getSingleInvoiceDetails,
  getInvoiceNumber,
  deleteInvoice,
  getCashFlowData,
} from "../controllers/InvoiceController";

const Router = express.Router();

Router.get("/invoices", getInvoices);
Router.get("/invoices/details/:id", getSingleInvoiceDetails);
Router.get("/invoices/year-data/:year", getMonthwiseData);
Router.get("/invoices/cashflow-data/:year", getCashFlowData);
Router.get("/invoices/get-number", getInvoiceNumber);

Router.post("/invoices/create", createInvoice);
Router.put("/invoices/edit/:id", editInvoice);
Router.delete("/invoices/delete/:id", deleteInvoice);

export default Router;
