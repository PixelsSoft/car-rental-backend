import express from "express";
import {
  changePassword,
  createUser,
  login,
} from "../controllers/UserController";

const Router = express.Router();

Router.post("/users/create", createUser);
Router.post("/users/login", login);
Router.post("/users/change-password", changePassword);

export default Router;
