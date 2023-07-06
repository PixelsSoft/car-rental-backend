import { IUserWithMethods } from "../models/User";
import { Response } from "express";
const sendToken = (
  user: IUserWithMethods,
  statusCode: number,
  res: Response
) => {
  // Create JWT token
  const token = user.generateJwtToken();

  //options for cookie
  const options = {
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, user, token });
};

export default sendToken;
