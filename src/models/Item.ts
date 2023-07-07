import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: [true, "Make is required"],
    },
    model: {
      type: String,
      default: "",
    },
    daily: {
      type: Number,
      default: 0,
    },
    weekly: {
      type: Number,
      default: 0,
    },
    monthly: {
      type: Number,
      default: 0,
    },
    registrationNumber: {
      type: String,
      required: [true, "Registration number is required"],
    },
    description: {
      type: String,
      default: "",
    },
    images: [
      {
        url: {
          type: String,
          default: "",
        },
        path: {
          type: String,
          default: "",
        },
      },
    ],
    invoiceHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }],
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;
