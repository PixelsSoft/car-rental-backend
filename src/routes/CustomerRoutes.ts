import express from "express";
import {
  getCustomerProfile,
  getCustomers,
  editCustomer,
  createCustomer,
  deleteCustomer,
} from "../controllers/CustomerController";

const Router = express.Router();

Router.get("/customers", getCustomers);
Router.get("/customers/profile/:id", getCustomerProfile);

Router.post("/customers/create", createCustomer);
Router.put("/customers/edit/:id", editCustomer);

Router.delete("/customers/delete/:id", deleteCustomer);

export default Router;
