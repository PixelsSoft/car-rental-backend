import mongoose from "mongoose";

const PaymentRecordSchema = new mongoose.Schema({
  paymentDate: {
    type: Date,
    default: new Date(),
  },
  amount: {
    type: Number,
    default: 0,
  },
  paymentAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentAccount",
  },
  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentMethod",
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
  },
});

const PaymentRecord = mongoose.model("PaymentRecord", PaymentRecordSchema);

export default PaymentRecord;
