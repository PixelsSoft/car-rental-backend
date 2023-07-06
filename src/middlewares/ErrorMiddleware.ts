import { NextFunction, Request, Response } from "express";
import logger from "../helpers/Logger";

interface IError extends Error {
  message: string;
  statusCode: number;
  errors?: any[];
  code?: number;
  keyPattern?: any[];
}

const errorMiddleware = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> | void => {
  logger.error(err);
  logger.error("STACK: ", err.stack);

  if (err.name === "ValidationError" && err.errors) {
    const error = Object.values(err.errors)[0].properties.message;
    return res.status(400).json({
      success: false,
      error,
    });
  }

  if (err.code === 11000 && err.keyPattern) {
    let key = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      error: `${key} already exists`,
    });
  }

  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};

export default errorMiddleware;
