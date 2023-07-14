import AsyncHandler from "../helpers/AsyncHandler";
import ErrorHandler from "../helpers/ErrorHandler";
import Vendor from "../models/Vendors";
import Bill from "../models/Bills";

export const createVendor = AsyncHandler(async (req, res, next) => {
  const newVendor = await Vendor.create(req.body);
  res.status(201).json({
    success: true,
    vendor: newVendor,
    message: "Vendor created",
  });
});

export const getAllVendors = AsyncHandler(async (req, res, next) => {
  const vendors = await Vendor.find({});
  res.status(200).json({
    success: true,
    vendors,
  });
});

export const getVendorById = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const vendor = await Vendor.findById(id);

  if (!vendor) return next(new ErrorHandler("Vendor not found", 404));
  res.status(200).json({
    success: true,
    vendor,
  });
});

export const editVendor = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const vendor = await Vendor.findById(id);

  if (!vendor) return next(new ErrorHandler("vendor not found", 404));

  for (const key in req.body) {
    if (Object.hasOwnProperty.call(req.body, key)) {
      (vendor as any)[key] = req.body[key];
    }
  }

  await vendor.save();

  res.status(201).json({
    success: true,
    message: "vendor updated successfully",
  });
});

export const deleteVendor = AsyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const vendor = await Vendor.findById(id);

  if (!vendor) return next(new ErrorHandler("vendor not found", 404));

  await Bill.deleteMany({ vendor: id }).exec();
  await vendor.deleteOne();
  res.status(200).json({
    success: true,
    message: "vendor deleted!",
  });
});
