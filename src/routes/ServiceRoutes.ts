import express from "express";
import {
  getAllServices,
  editService,
  deleteService,
  createService,
} from "../controllers/ServiceController";

const Router = express.Router();

Router.post("/services/create", createService);
Router.get("/services", getAllServices);
Router.delete("/services/delete/:id", deleteService);
Router.put("/services/edit/:id", editService);

export default Router;
