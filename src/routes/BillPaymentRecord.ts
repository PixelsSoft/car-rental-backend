import express from "express";
import { createBillRecord } from "../controllers/BillRecordController";

const Router = express.Router();

Router.post("/bill-record/create", createBillRecord);

export default Router;
