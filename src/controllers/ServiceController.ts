import AsyncHandler from "../helpers/AsyncHandler";
import ErrorHandler from "../helpers/ErrorHandler";
import Item from "../models/Item";
import Service from "../models/Service";

// Get all services
export const getAllServices = AsyncHandler(async (req, res, next) => {
  const services = await Service.find({});
  res.status(200).json({
    success: true,
    services,
  });
});

// Create a service
export const createService = AsyncHandler(async (req, res, next) => {
  const newService = await Service.create(req.body);
  res.status(201).json({
    success: true,
    service: newService,
    message: "Service created",
  });
});

// Edit a service
export const editService = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const service = await Service.findById(id);

  if (!service) {
    return next(new ErrorHandler("Service not found", 404));
  }

  for (const key in req.body) {
    if (Object.hasOwnProperty.call(req.body, key)) {
      if (key === "item") {
        service.item = req.body.item;
      } else {
        (service as any)[key] = req.body[key];
      }
    }
  }

  await service.save();

  res.status(200).json({
    success: true,
    message: "Service updated successfully",
  });
});

// Delete a service
export const deleteService = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const service = await Service.findById(id);

  if (!service) {
    return next(new ErrorHandler("Service not found", 404));
  }

  await service.deleteOne();

  res.status(200).json({
    success: true,
    message: "Service deleted",
  });
});
