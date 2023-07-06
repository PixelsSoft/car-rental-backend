import express from "express";
import {
  changePassword,
  createUser,
  login,
  forgetPassword,
  resetPassword,
  verifyEmail,
} from "../controllers/UserController";
import upload from "../helpers/upload";

const Router = express.Router();

//PUBLIC ROUTES:
Router.post("/users/create", upload.single("profilePicture"), createUser);
Router.post("/password/forgot", forgetPassword);
Router.post("/users/login", login);
Router.post("/users/change-password", changePassword);

Router.put("/password/reset/:token", resetPassword);
Router.put("/email/verify/:token", verifyEmail);

export default Router;
