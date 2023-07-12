import express from "express";
import {
  getItemById,
  getItems,
  editItem,
  deleteItem,
  createItem,
} from "../controllers/ItemController";
import upload from "../helpers/upload";

const Router = express.Router();

Router.post("/items/create", upload.array("images", 10), createItem);
Router.put("/items/edit/:id", upload.array("images", 10), editItem);

Router.get("/items", getItems);
Router.get("/items/details/:id", getItemById);

Router.delete("/items/delete/:id", deleteItem);
export default Router;
