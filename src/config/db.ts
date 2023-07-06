import mongoose from "mongoose";
import logger from "../helpers/Logger";
import winston from "winston";

const connectDb = async (): Promise<winston.Logger | void> => {
  try {
    if (process.env.MONGODB_CONNECTION_STRING) {
      await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
        dbName: process.env.DB_NAME,
      });
      return logger.info("Database connection established");
    }
    logger.error("CONNECTION STRING is not valid.");
  } catch (err: any) {
    if (err.code === 8000) {
      return logger.error("Invalid DB Connection String");
    }
    logger.error(err);
  }
};

export default connectDb;
