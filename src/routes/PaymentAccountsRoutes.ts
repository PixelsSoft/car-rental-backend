import express from "express";
import {
  getAllPaymentAccounts,
  createPaymentAccount,
} from "../controllers/PaymentAccountController";

const Router = express.Router();

Router.get("/payment-accounts", getAllPaymentAccounts);
Router.post("/payment-accounts/create", createPaymentAccount);

export default Router;
