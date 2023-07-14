import mongoose from "mongoose";

const BillRecordSchema = new mongoose.Schema({
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
  bill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bill",
  },
});

const BillRecord = mongoose.model("BillRecord", BillRecordSchema);

export default BillRecord;
