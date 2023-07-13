import express from "express";
import { createPaymentRecord } from "../controllers/PaymentRecordController";

const Router = express.Router();

Router.post("/payment-record/create", createPaymentRecord);

export default Router;
