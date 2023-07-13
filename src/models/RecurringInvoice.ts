import mongoose from "mongoose";

const RecurringInvoiceSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  invoices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
    },
  ],
  amount: {
    type: String,
    default: 0,
  },
});

const RecurringInvoice = mongoose.model(
  "RecurringInvoice",
  RecurringInvoiceSchema
);

export default RecurringInvoice;
