import mongoose from "mongoose";

const BillsSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },
  status: {
    type: String,
    enum: ["paid", "due", "overdue"],
  },
  date: {
    type: Date,
    default: new Date(),
  },
  dueDate: {
    type: Date,
    default: new Date(),
  },
  billNumber: {
    type: String,
    default: "0000",
  },
  notes: {
    type: String,
    default: "",
  },
  total: {
    type: String,
    default: 0,
  },
  amountDue: {
    type: String,
    default: 0,
  },
  items: [
    {
      listItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BillingItem",
      },
      quantity: {
        type: Number,
        default: 1,
      },
      price: {
        type: Number,
        default: 0,
      },
      description: {
        type: String,
        default: "",
      },
    },
  ],
});

const Bill = mongoose.model("Bill", BillsSchema);

export default Bill;
