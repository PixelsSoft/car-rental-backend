import AsyncHandler from "../helpers/AsyncHandler";
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
