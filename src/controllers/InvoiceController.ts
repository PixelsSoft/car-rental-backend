import Invoice from "../models/Invoice";
import Customer from "../models/Customer";
import AsyncHandler from "../helpers/AsyncHandler";
import ErrorHandler from "../helpers/ErrorHandler";
import formatInvoiceNumber from "../helpers/FormatInvoiceNumber";
import Item from "../models/Item";

export const createInvoice = AsyncHandler(async (req, res, next) => {
  const {
    PoSoNumber,
    createdAt,
    dueAt,
    total,
    amountDue,
    notes,
    customer,
    items,
  } = req.body;

  const invoiceCustomer = await Customer.findById(customer);
  if (!invoiceCustomer)
    return next(new ErrorHandler("Customer not found", 404));

  const invoiceNumber = await getInvoiceNumber();
  const invoice = await Invoice.create({
    invoiceNumber,
    PoSoNumber,
    createdAt,
    dueAt,
    total,
    amountDue,
    notes,
    customer,
    items,
  });

  const result = await Item.find({ _id: { $in: items } });

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
  const invoices = await Invoice.find({});
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

  const invoice = await Invoice.findById(id);
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

export const getInvoiceByCustomerId = AsyncHandler(
  async (req, res, next) => {}
);
