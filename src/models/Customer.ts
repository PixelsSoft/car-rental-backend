import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customer field is required"],
    },
    firstName: {
      type: String,
      required: [true, "Customer field is required"],
    },
    lastName: {
      type: String,
      required: [true, "Customer field is required"],
    },
    email: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    accountNumber: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    drivinglicense: [
      {
        url: {
          type: String,
          default: "",
        },
        filename: {
          type: String,
          default: "",
        },
      },
    ],
    invoices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
      },
    ],
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", CustomerSchema);

export default Customer;
