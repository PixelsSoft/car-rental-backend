import Invoice from "../models/Invoice";
import Customer from "../models/Customer";
import AsyncHandler from "../helpers/AsyncHandler";
import ErrorHandler from "../helpers/ErrorHandler";
import formatInvoiceNumber from "../helpers/FormatInvoiceNumber";
import Item from "../models/Item";
import RecurringInvoice from "../models/RecurringInvoice";

export const createInvoice = AsyncHandler(async (req, res, next) => {
  const {
    PoSoNumber,
    dueAt,
    total,
    amountDue,
    notes,
    customer,
    items,
    isRecurring,
    nextInvoice,
  } = req.body;

  const invoiceCustomer = await Customer.findById(customer);
  if (!invoiceCustomer)
    return next(new ErrorHandler("Customer not found", 404));

  const invoiceNumber = await getInvoiceNumber();
  const invoice = await Invoice.create({
    invoiceNumber,
    PoSoNumber,
    dueAt: dueAt ? dueAt : new Date(),
    total,
    amountDue,
    notes,
    customer,
    items,
    isRecurring,
    nextInvoice,
  });

  if (isRecurring) {
    const recurringInvoice = await RecurringInvoice.create({
      status: "active",
      customer,
      amount: total,
    });

    recurringInvoice.invoices.push(invoice._id);
    await recurringInvoice.save();
  }

  const listItemIds = items.map((item: any) => item.listItem);

  const result = await Item.find({ _id: { $in: listItemIds } });

  result.forEach(async (item) => {
    item.invoiceHistory.push(invoice._id);
    await item.save();
  });

  invoiceCustomer.invoices.push(invoice._id);
  await invoiceCustomer.save();

  // TODO: have to implement send invoice to customer email

  res.status(201).json({
    success: true,
    invoice,
    message: "Invoice created",
  });
});

export const getInvoices = AsyncHandler(async (req, res, next) => {
  const invoices = await Invoice.find({}).populate("customer", "_id name");
  res.status(200).json({
    success: true,
    invoices,
  });
});

export const getInvoiceNumber = async () => {
  const lastInvoice = await Invoice.findOne()
    .sort({ invoiceNumber: -1 })
    .exec();

  let nextInvoiceNumber = 1;

  if (lastInvoice) {
    const highestNumber = lastInvoice.invoiceNumber;
    nextInvoiceNumber = parseInt(highestNumber) + 1;
  }

  const formattedInvoiceNumber = formatInvoiceNumber(nextInvoiceNumber);
  return formattedInvoiceNumber;
};

export const getSingleInvoiceDetails = AsyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const invoice = await Invoice.findById(id)
    .populate("customer")
    .populate("paymentRecords")
    .populate("items.listItem");

  if (!invoice) return next(new ErrorHandler("Invoice not found", 404));

  res.status(200).json({
    success: true,
    invoice,
  });
});

export const deleteInvoice = AsyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const invoice = await Invoice.findById(id);
  if (!invoice) return next(new ErrorHandler("Invoice not found", 404));

  await Customer.findByIdAndUpdate(invoice.customer, {
    $pull: { invoices: invoice._id },
  });

  await Item.updateMany(
    { invoiceHistory: invoice._id },
    { $pull: { invoiceHistory: invoice._id } }
  );

  await invoice.deleteOne();
  res.status(200).json({ success: true, message: "Invoice deleted" });
});

export const editInvoice = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const invoice = await Invoice.findById(id);

  if (!invoice) return next(new ErrorHandler("Invoice not found", 404));

  for (const key in req.body) {
    if (Object.hasOwnProperty.call(req.body, key)) {
      (invoice as any)[key] = req.body[key];
    }
  }

  await invoice.save();

  res.status(201).json({
    success: true,
    message: "invoice updated successfully",
  });
});

export const getTotalOverdues = AsyncHandler(async (req, res, next) => {
  const invoices = await Invoice.find({ status: "overdue" });
  let total = invoices.reduce((acc, inv) => {
    return acc + inv.amountDue;
  }, 0);

  res.status(200).json({
    success: true,
    overdue: total,
  });
});

export const dueWithin30Days = AsyncHandler(async (req, res, next) => {
  const currentDate = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

  const invoices = await Invoice.find({
    dueAt: {
      $gte: currentDate,
      $lte: thirtyDaysFromNow,
    },
  });

  let total = invoices.reduce((acc, inv) => acc + inv.amountDue, 0);

  res.status(200).json({
    success: true,
    amountDue: total,
  });
});

export const upcomingPayouts = AsyncHandler(async (req, res, next) => {
  const invoices = await Invoice.find({ status: "due" });
  let total = invoices.reduce((acc, inv) => {
    return acc + inv.amountDue;
  }, 0);

  res.status(200).json({
    success: true,
    upcoming_payouts: total,
  });
});

export const getUnpaidInvoices = AsyncHandler(async (req, res, next) => {
  const invoices = await Invoice.find({ status: "due" });
  res.status(200).json({
    success: true,
    invoices,
  });
});

export const getInvoiceByCustomerId = AsyncHandler(
  async (req, res, next) => {}
);
