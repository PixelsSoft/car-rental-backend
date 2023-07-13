import AsyncHandler from "../helpers/AsyncHandler";
import ErrorHandler from "../helpers/ErrorHandler";
import Invoice from "../models/Invoice";
import PaymentRecord from "../models/PaymentRecord";

export const createPaymentRecord = AsyncHandler(async (req, res, next) => {
  console.log("hello");
  const { invoice, amount, paymentAccount, paymentMethod } = req.body;

  const foundInvoice = await Invoice.findById(invoice._id);

  if (!foundInvoice) return next(new ErrorHandler("No invoice found", 404));

  if (foundInvoice.status === "paid")
    return next(new ErrorHandler("Invoice is already paid", 400));

  if (amount <= 0)
    return next(new ErrorHandler("amount should be greater than 0", 400));

  const newRecord = await PaymentRecord.create({
    invoice,
    amount,
    paymentAccount,
    paymentMethod,
  });

  if (amount >= foundInvoice.amountDue) {
    console.log("if");
    foundInvoice.status = "paid";
    foundInvoice.amountDue = 0;
  } else {
    console.log("else");
    foundInvoice.amountDue = foundInvoice.amountDue - amount;
  }

  if (amount === foundInvoice.total * 0.5) {
    console.log("if");
    foundInvoice.status = "partial";
  }

  foundInvoice.paymentRecords.push(newRecord._id);
  await foundInvoice.save();
  res.status(200).json({
    success: true,
    paymentRecord: newRecord,
    message: "Payment record created",
  });
});
