import Item from "../models/Item";
import ErrorHandler from "../helpers/ErrorHandler";
import AsyncHandler from "../helpers/AsyncHandler";
import Invoice from "../models/Invoice";
import Customer from "../models/Customer";

export const createItem = AsyncHandler(async (req, res, next) => {
  let images = [{ url: "", filename: "" }];
  if (req.files) {
    images = (req.files as any).map((file: any) => {
      return {
        filename: file.filename,
        url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
      };
    });
  }

  const item = await Item.create({ ...req.body, images });
  res.status(200).json({ success: true, item, message: "Item created!" });
});

export const getItems = AsyncHandler(async (req, res, next) => {
  const items = await Item.find({});
  res.status(200).json({
    success: true,
    items,
  });
});

export const getItemById = AsyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const item = await Item.findById(id);
  if (!item) return next(new ErrorHandler("Item not found", 404));

  res.status(200).json({ success: true, item });
});

export const deleteItem = AsyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const item = await Item.findById(id);
  if (!item) return next(new ErrorHandler("Item not found", 404));

  const invoicesIds = item.invoiceHistory.map((invoice) => invoice._id);
  await Invoice.deleteMany({ _id: { $in: invoicesIds } });
  await Customer.updateMany(
    { invoices: { $in: invoicesIds } },
    { $pull: { invoices: { $in: invoicesIds } } }
  );

  await item.deleteOne();

  res.status(200).json({
    success: true,
    message: "Item deleted.",
  });
});

export const editItem = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const item = await Item.findById(id);

  if (!item) return next(new ErrorHandler("item not found", 404));

  for (const key in req.body) {
    if (Object.hasOwnProperty.call(req.body, key)) {
      (item as any)[key] = req.body[key];
    }
  }

  if (req.files) {
    item.images = (req.files as any).map((file: any) => {
      return {
        filename: file.filename,
        url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
      };
    });
  }

  await item.save();

  res.status(201).json({
    success: true,
    message: "item updated successfully",
  });
});
