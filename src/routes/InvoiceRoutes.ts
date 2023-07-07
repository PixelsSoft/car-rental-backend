import express from "express";
import {
  createInvoice,
  editInvoice,
  getInvoiceByCustomerId,
  getInvoices,
  getSingleInvoiceDetails,
  getInvoiceNumber,
  deleteInvoice,
} from "../controllers/InvoiceController";

const Router = express.Router();

Router.get("/invoices", getInvoices);
Router.get("/invoices/details/:id", getSingleInvoiceDetails);
Router.get("/invoices/customer/:id", getInvoiceByCustomerId);
Router.get("/invoices/get-number", getInvoiceNumber);

Router.post("/invoices/create", createInvoice);
Router.put("/invoices/edit/:id", editInvoice);
Router.delete("/invoices/delete/:id", deleteInvoice);

export default Router;
