import mongoose from "mongoose";

const BillingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Item name is required"],
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: String,
    required: [true, "Item price is required"],
  },
});

const BillingItem = mongoose.model("BillingItem", BillingItemSchema);

export default BillingItem;
