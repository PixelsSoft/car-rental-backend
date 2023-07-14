import AsyncHandler from "../helpers/AsyncHandler";
import ErrorHandler from "../helpers/ErrorHandler";
import BillRecord from "../models/BillRecord";
import Bill from "../models/Bills";

export const createBillRecord = AsyncHandler(async (req, res, next) => {
  const { bill, amount, paymentAccount, paymentMethod } = req.body;

  const foundBill = await Bill.findById(bill._id);

  if (!foundBill) return next(new ErrorHandler("No invoice found", 404));

  if (foundBill.status === "paid")
    return next(new ErrorHandler("Invoice is already paid", 400));

  if (amount <= 0)
    return next(new ErrorHandler("amount should be greater than 0", 400));

  const newRecord = await BillRecord.create({
    bill,
    amount,
    paymentAccount,
    paymentMethod,
  });

  if (amount >= foundBill.amountDue) {
    foundBill.status = "paid";
    foundBill.amountDue = 0;
  } else {
    foundBill.amountDue = foundBill.amountDue - amount;
  }

  if (amount === foundBill.total / 2) {
    foundBill.status = "partial";
  }

  foundBill.records.push(newRecord._id);
  await foundBill.save();
  res.status(200).json({
    success: true,
    billRecord: newRecord,
    message: "Payment record created",
  });
});
