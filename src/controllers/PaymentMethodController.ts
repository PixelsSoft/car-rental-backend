import AsyncHandler from "../helpers/AsyncHandler";
import PaymentMethod from "../models/PaymentMethod";

export const createPaymentMethod = AsyncHandler(async (req, res, next) => {
  const paymentMethod = await PaymentMethod.create(req.body);
  res.status(200).json({
    success: true,
    paymentMethod,
    message: "Payment  method added",
  });
});

export const getAllPaymentMethods = AsyncHandler(async (req, res, next) => {
  const paymentMethods = await PaymentMethod.find({});
  res.status(200).json({
    success: true,
    paymentMethods,
  });
});
