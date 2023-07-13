import mongoose from "mongoose";

const PaymentMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Payment method name is required"],
  },
});

const PaymentMethod = mongoose.model("PaymentMethod", PaymentMethodSchema);

export default PaymentMethod;
