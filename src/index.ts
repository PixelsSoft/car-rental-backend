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
import recurringInvoices from "./routes/RecurringInvoicsRoutes";
import paymentMethods from "./routes/PaymentMethodRoutes";
import paymentAccounts from "./routes/PaymentAccountsRoutes";
import paymentRecords from "./routes/PaymentRecordRoutes";
import vendors from "./routes/VendorsRoutes";
import bills from "./routes/BillsRoutes";
import billingItems from "./routes/BillingItem";
import services from "./routes/ServiceRoutes";
import billRecords from "./routes/BillPaymentRecord";

import errorMiddleware from "./middlewares/ErrorMiddleware";

app.use("/api/v1/", users);
app.use("/api/v1", customers);
app.use("/api/v1", invoices);
app.use("/api/v1", items);
app.use("/api/v1", recurringInvoices);
app.use("/api/v1", paymentMethods);
app.use("/api/v1", paymentAccounts);
app.use("/api/v1", paymentRecords);
app.use("/api/v1", vendors);
app.use("/api/v1", bills);
app.use("/api/v1", billingItems);
app.use("/api/v1", services);
app.use("/api/v1", billRecords);

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(PORT, () => console.log("Server running on port: " + PORT));
