import AsyncHandler from "../helpers/AsyncHandler";
import ErrorHandler from "../helpers/ErrorHandler";
import RecurringInvoice from "../models/RecurringInvoice";

export const getAllRecurringInvoices = AsyncHandler(async (req, res, next) => {
  const invoices = await RecurringInvoice.find({})
    .populate("invoices")
    .populate("customer");
  res.status(200).json({
    success: true,
    invoices,
  });
});

export const endRecurringInvoice = AsyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const recurringInvoice = await RecurringInvoice.findById(id);

  if (!recurringInvoice)
    return next(new ErrorHandler("Recurring Invoice not found", 404));

  recurringInvoice.status = "inactive";
  await recurringInvoice.save();
  res.status(201).json({
    success: true,
    message: "Recurring invoice changed to inactive",
  });
});
