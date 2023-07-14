import express from "express";
import {
  getAllBills,
  createBill,
  editbill,
  deleteBill,
} from "../controllers/Bills";

const Router = express.Router();

Router.get("/bills", getAllBills);
Router.post("/bills/create", createBill);
Router.put("/bills/edit/:id", editbill);
Router.delete("/bills/delete/:id", deleteBill);

export default Router;
