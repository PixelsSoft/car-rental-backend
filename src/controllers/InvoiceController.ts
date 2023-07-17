import Invoice from "../models/Invoice";
import Customer from "../models/Customer";
import AsyncHandler from "../helpers/AsyncHandler";
import ErrorHandler from "../helpers/ErrorHandler";
import formatInvoiceNumber from "../helpers/FormatInvoiceNumber";
import Item from "../models/Item";
import RecurringInvoice from "../models/RecurringInvoice";
import Bill from "../models/Bills";
import { sendInvoiceEmail } from "../helpers/SendEmail";

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

  for (const item of result) {
    item.invoiceHistory.push(invoice._id);
    await item.save();
  }

  invoiceCustomer.invoices.push(invoice._id);
  await invoiceCustomer.save();

  // TODO: have to implement send invoice to customer email

  sendInvoiceEmail({
    invoiceNumber,
    customerName: invoiceCustomer.name as string,
    customerEmail: invoiceCustomer.email,
    items,
    total,
    dueDate: dueAt,
    invoiceDate: invoice.createdAt,
    notes,
  });

  res.status(201).json({
    success: true,
    invoice,
    message: "Invoice created",
  });
});

export const getInvoices = AsyncHandler(async (req, res, next) => {
  const invoices = await Invoice.find({})
    .populate("customer", "_id name")
    .populate("items.listItem");
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

  console.log(id);

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

interface MonthlyInvoiceData {
  _id: {
    year: number;
    month: number;
  };
  totalRevenue: number;
}

interface MonthlyBillData {
  _id: {
    year: number;
    month: number;
  };
  totalExpenses: number;
}

export const getMonthwiseData = AsyncHandler(async (req, res, next) => {
  const { year } = req.params;
  const yearFilter = parseInt(year as string);

  if (isNaN(yearFilter)) {
    return next(new ErrorHandler("Invalid year query parameter", 400));
  }

  const invoiceData: MonthlyInvoiceData[] =
    await Invoice.aggregate<MonthlyInvoiceData>([
      {
        $match: {
          createdAt: {
            $gte: new Date(yearFilter, 0, 1), // Start of the year
            $lte: new Date(yearFilter, 11, 31), // End of the year
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);

  const billData: MonthlyBillData[] = await Bill.aggregate<MonthlyBillData>([
    {
      $match: {
        date: {
          $gte: new Date(yearFilter, 0, 1), // Start of the year
          $lte: new Date(yearFilter, 11, 31), // End of the year
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        totalExpenses: { $sum: "$total" },
      },
    },
  ]);

  // Combine profits and expenses month-wise
  const monthlyData: {
    [year: number]: {
      [month: number]: {
        profit: number;
        expense: number;
      };
    };
  } = {};

  // Initialize all months with profit and expense as 0 for the given year
  if (!monthlyData[yearFilter]) {
    monthlyData[yearFilter] = {};
  }

  for (let month = 1; month <= 12; month++) {
    if (!monthlyData[yearFilter][month]) {
      monthlyData[yearFilter][month] = {
        profit: 0,
        expense: 0,
      };
    }
  }

  invoiceData.forEach(({ _id, totalRevenue }) => {
    const { month } = _id;
    monthlyData[yearFilter][month].profit = totalRevenue;
  });

  billData.forEach(({ _id, totalExpenses }) => {
    const { month } = _id;
    monthlyData[yearFilter][month].expense = totalExpenses;
  });

  res.status(200).json({
    success: true,
    monthlyData,
  });
});

export const getCashFlowData = AsyncHandler(async (req, res, next) => {
  const { year } = req.params;
  const yearFilter = parseInt(year as string);

  if (isNaN(yearFilter)) {
    return next(new ErrorHandler("Invalid year query parameter", 400));
  }

  const invoiceData: MonthlyInvoiceData[] =
    await Invoice.aggregate<MonthlyInvoiceData>([
      {
        $match: {
          createdAt: {
            $gte: new Date(yearFilter, 0, 1), // Start of the year
            $lte: new Date(yearFilter, 11, 31), // End of the year
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$amountDue" },
        },
      },
    ]);

  const billData: MonthlyBillData[] = await Bill.aggregate<MonthlyBillData>([
    {
      $match: {
        date: {
          $gte: new Date(yearFilter, 0, 1), // Start of the year
          $lte: new Date(yearFilter, 11, 31), // End of the year
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        totalExpenses: { $sum: "$amountDue" },
      },
    },
  ]);

  // Combine profits and expenses month-wise
  const monthlyData: {
    [year: number]: {
      [month: number]: {
        profit: number;
        expense: number;
      };
    };
  } = {};

  // Initialize all months with profit and expense as 0 for the given year
  if (!monthlyData[yearFilter]) {
    monthlyData[yearFilter] = {};
  }

  for (let month = 1; month <= 12; month++) {
    if (!monthlyData[yearFilter][month]) {
      monthlyData[yearFilter][month] = {
        profit: 0,
        expense: 0,
      };
    }
  }

  invoiceData.forEach(({ _id, totalRevenue }) => {
    const { month } = _id;
    monthlyData[yearFilter][month].profit = totalRevenue;
  });

  billData.forEach(({ _id, totalExpenses }) => {
    const { month } = _id;
    monthlyData[yearFilter][month].expense = totalExpenses;
  });

  res.status(200).json({
    success: true,
    data: monthlyData,
  });
});
