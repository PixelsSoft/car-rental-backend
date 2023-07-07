import AsyncHandler from "../helpers/AsyncHandler";
import ErrorHandler from "../helpers/ErrorHandler";
import Customer from "../models/Customer";
import Invoice from "../models/Invoice";
import Item from "../models/Item";

export const createCustomer = AsyncHandler(async (req, res, next) => {
  const customer = await Customer.create(req.body);
  res.status(200).json({
    success: true,
    customer,
    message: "Customer created",
  });
});

export const getCustomers = AsyncHandler(async (req, res, next) => {
  const customers = await Customer.find({});
  res.status(200).json({
    success: true,
    customers,
  });
});

export const getCustomerProfile = AsyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const customer = await Customer.findById(id);

  if (!customer) return next(new ErrorHandler("Customer not found", 404));

  res.status(200).json({
    success: true,
    customer,
  });
});

export const deleteCustomer = AsyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const customer = await Customer.findById(id);

  if (!customer) return next(new ErrorHandler("Customer not found", 404));

  const invoices = customer.invoices.map((invoice) => invoice._id);

  await Invoice.deleteMany({ _id: { $in: invoices } });
  await Item.updateMany(
    { invoiceHistory: { $in: invoices } },
    { $pullAll: { invoiceHistory: invoices } }
  );

  await customer.deleteOne();
  res.status(200).json({
    success: true,
    message: "Customer deleted",
  });
});

export const editCustomer = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const customer = await Customer.findById(id);

  if (!customer) return next(new ErrorHandler("Customer not found", 404));

  for (const key in req.body) {
    if (Object.hasOwnProperty.call(req.body, key)) {
      (customer as any)[key] = req.body[key];
    }
  }

  await customer.save();

  res.status(201).json({
    success: true,
    message: "Customer updated successfully",
  });
});
