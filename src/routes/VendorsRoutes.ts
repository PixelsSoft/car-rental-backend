import express from "express";
import {
  getAllVendors,
  deleteVendor,
  editVendor,
  createVendor,
} from "../controllers/VendorController";

const Router = express.Router();

Router.get("/vendors", getAllVendors);
Router.delete("/vendors/delete/:id", deleteVendor);
Router.put("/vendors/edit/:id", editVendor);
Router.post("/vendors/create", createVendor);

export default Router;
