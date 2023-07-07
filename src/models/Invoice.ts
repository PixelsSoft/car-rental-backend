import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    default: "0000",
  },
  PoSoNumber: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  dueAt: {
    type: Date,
    default: new Date(),
  },
  total: {
    type: Number,
    default: 0,
  },
  amountDue: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: [
      "paid",
      "due",
      "overdue",
      "partial",
      "unsent",
      "draft",
      "active",
      "inactive",
      "cancelled",
    ],
    default: "due",
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
});

const Invoice = mongoose.model("Invoice", InvoiceSchema);

export default Invoice;
