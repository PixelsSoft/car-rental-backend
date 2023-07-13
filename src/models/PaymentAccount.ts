import mongoose from "mongoose";

const PaymentAccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Payment Account is required"],
  },
});

const PaymentAccount = mongoose.model("PaymentAccount", PaymentAccountSchema);

export default PaymentAccount;
