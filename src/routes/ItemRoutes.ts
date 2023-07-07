import express from "express";
import {
  getItemById,
  getItems,
  editItem,
  deleteItem,
  createItem,
} from "../controllers/ItemController";

const Router = express.Router();

Router.post("/items/create", createItem);
Router.put("/items/edit/:id", editItem);

Router.get("/items", getItems);
Router.get("/items/details/:id", getItemById);

Router.delete("/items/delete/:id", deleteItem);
export default Router;
