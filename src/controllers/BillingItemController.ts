import AsyncHandler from "../helpers/AsyncHandler";
import ErrorHandler from "../helpers/ErrorHandler";
import BillingItem from "../models/BillingItem";

export const createBillingItem = AsyncHandler(async (req, res, next) => {
  const { name, description, price } = req.body;

  const newItem = await BillingItem.create({ name, description, price });

  res.status(201).json({
    success: true,
    item: newItem,
    message: "Success",
  });
});

export const getAllBillingItems = AsyncHandler(async (req, res, next) => {
  const items = await BillingItem.find();

  res.status(200).json({
    success: true,
    items,
  });
});

export const getBillingItemById = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const item = await BillingItem.findById(id);

  if (!item) {
    return next(new ErrorHandler("Billing item not found", 404));
  }

  res.status(200).json({
    success: true,
    item,
  });
});

export const updateBillingItem = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const billingItem = await BillingItem.findById(id);

    if (!billingItem) {
      return next(new ErrorHandler("Billing item not found", 404));
    }

    for (const key in req.body) {
      if (Object.hasOwnProperty.call(req.body, key)) {
        (billingItem as any)[key] = req.body[key];
      }
    }

    const updatedItem = await billingItem.save();

    res.status(200).json({
      success: true,
      updatedItem,
      message: "Product updated",
    });
  } catch (error) {
    next(new ErrorHandler("Failed to update billing item", 500));
  }
});

export const deleteBillingItem = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedItem = await BillingItem.findByIdAndRemove(id);

  if (!deletedItem) {
    return next(new ErrorHandler("Billing item not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Billing item deleted successfully",
  });
});
