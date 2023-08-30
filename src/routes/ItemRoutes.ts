import express from "express";

import {
  getItemById,
  getItems,
  editItem,
  deleteItem,
  createItem,
} from "../controllers/ItemController";
// import upload from "../helpers/upload";
import multer from "multer";


////// for test//////
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
const Router = express.Router();

Router.post("/items/create", upload.single("image"), createItem);
Router.put("/items/edit/:id", upload.array("images", 10), editItem);

Router.get("/items", getItems);
Router.get("/items/details/:id", getItemById);

Router.delete("/items/delete/:id", deleteItem);
export default Router;
