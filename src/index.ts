import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDb from "./config/db";

dotenv.config();
const PORT = process.env.PORT || 8001;

//connect to db
connectDb();

// configuration
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// routes
import users from "./routes/UserRoutes";
import customers from "./routes/CustomerRoutes";
import invoices from "./routes/InvoiceRoutes";
import items from "./routes/ItemRoutes";

import errorMiddleware from "./middlewares/ErrorMiddleware";

app.use("/api/v1/", users);
app.use("/api/v1", customers);
app.use("/api/v1", invoices);
app.use("/api/v1", items);
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(PORT, () => console.log("Server running on port: " + PORT));
