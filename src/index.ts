import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import connectDb from "./config/db";

dotenv.config();
const PORT = process.env.PORT || 8001;

//connect to db
connectDb();

// configuration
const app = express();
app.use(express.json());
app.use(cors());

// routes
import UserRoutes from "./routes/UserRoutes";
import errorMiddleware from "./middlewares/ErrorMiddleware";

app.use("/api/v1/", UserRoutes);
app.use(errorMiddleware);

app.listen(PORT, () => console.log("Server running on port: " + PORT));
