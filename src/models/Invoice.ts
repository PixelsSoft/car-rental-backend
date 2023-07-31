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
  PickUpDate: {
    type: Date,
    default: new Date(),
  },
  DropOffDate: {
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
  isRecurring: {
    type: Boolean,
    default: false,
  },
  nextInvoice: {
    type: Number,
    default: 0,
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

  paymentRecords: [
    { type: mongoose.Schema.Types.ObjectId, ref: "PaymentRecord" },
  ],

  items: [
    {
      listItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
      quantity: { type: String, default: 1 },
      price: { type: Number, default: 0 },
    },
  ],
});

const Invoice = mongoose.model("Invoice", InvoiceSchema);

export default Invoice;
