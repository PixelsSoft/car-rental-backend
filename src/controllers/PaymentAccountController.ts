import AsyncHandler from "../helpers/AsyncHandler";
import PaymentAccount from "../models/PaymentAccount";

export const createPaymentAccount = AsyncHandler(async (req, res, next) => {
  const paymentAccount = await PaymentAccount.create(req.body);
  res.status(201).json({
    success: true,
    paymentAccount,
    message: "Payment account created",
  });
});

export const getAllPaymentAccounts = AsyncHandler(async (req, res, next) => {
  const accounts = await PaymentAccount.find({});

  res.status(200).json({
    success: true,
    paymentAccounts: accounts,
  });
});
