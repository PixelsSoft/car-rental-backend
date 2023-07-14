import express from "express";
import {
  createBillingItem,
  getAllBillingItems,
  deleteBillingItem,
  updateBillingItem,
  getBillingItemById,
} from "../controllers/BillingItemController";

const Router = express.Router();

Router.get("/billing-items", getAllBillingItems);
Router.get("/billing-items/details/:id", getBillingItemById);

Router.post("/billing-items/create", createBillingItem);

Router.delete("/billing-items/delete/:id", deleteBillingItem);
Router.put("/billing-items/edit/:id", updateBillingItem);

export default Router;
