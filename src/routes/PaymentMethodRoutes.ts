import express from "express";
import {
  createPaymentMethod,
  getAllPaymentMethods,
} from "../controllers/PaymentMethodController";

const Router = express.Router();

Router.get("/payment-methods", getAllPaymentMethods);
Router.post("/payment-methods/create", createPaymentMethod);

export default Router;
