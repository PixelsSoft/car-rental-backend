import AsyncHandler from "../helpers/AsyncHandler";
import ErrorHandler from "../helpers/ErrorHandler";
import Vendor from "../models/Vendors";
import Bill from "../models/Bills";
import formatInvoiceNumber from "../helpers/FormatInvoiceNumber";
import ExpenseCategory from "../models/ExpenseCategory";

export const createBill = AsyncHandler(async (req, res, next) => {
  const billNumber = await getBillNumber();

  const foundCategory = await ExpenseCategory.findById(req.body.category);
  const newBill = await Bill.create({ ...req.body, billNumber });
  foundCategory?.bills.push(newBill._id);
  await foundCategory?.save();
  res.status(201).json({
    success: true,
    Bill: newBill,
    message: "Bill created",
  });
});

export const getAllBills = AsyncHandler(async (req, res, next) => {
  const Bills = await Bill.find({}).populate("vendor", "name");
  res.status(200).json({
    success: true,
    Bills,
  });
});

export const editbill = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const bill = await Bill.findById(id);

  if (!bill) return next(new ErrorHandler("bill not found", 404));

  for (const key in req.body) {
    if (Object.hasOwnProperty.call(req.body, key)) {
      if (key === "vendor") {
        // Update the vendor reference
        const newVendorId = req.body[key];
        bill.vendor = newVendorId;
      } else if (key === "items") {
        // Update the items array
        const newItems = req.body[key];
        bill.items = newItems;
      } else {
        // Update other properties of the bill
        (bill as any)[key] = req.body[key];
      }
    }
  }

  await bill.save();

  res.status(201).json({
    success: true,
    message: "bill updated successfully",
  });
});

export const deleteBill = AsyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const bill = await Bill.findById(id);

  if (!bill) return next(new ErrorHandler("bill not found", 404));

  await Vendor.updateMany({}, { $pull: { bills: id } }).exec();
  await bill.deleteOne();
  res.status(200).json({
    success: true,
    message: "Bill deleted successfully",
  });
});

export const getBillById = AsyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const bill = await Bill.findById(id)
    .populate("vendor")
    .populate("records")
    .populate("items.listItem");
  if (!bill) return next(new ErrorHandler("bill not found", 404));

  res.status(200).json({
    success: true,
    bill,
  });
});

//helpers

export const getBillNumber = async () => {
  const lastBill = await Bill.findOne().sort({ billNumber: -1 }).exec();

  let nextBillNumber = 1;

  if (lastBill) {
    const highestNumber = lastBill.billNumber;
    nextBillNumber = parseInt(highestNumber) + 1;
  }

  const formattedInvoiceNumber = formatInvoiceNumber(nextBillNumber);
  return formattedInvoiceNumber;
};
