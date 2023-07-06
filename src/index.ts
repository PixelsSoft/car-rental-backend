import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 8001;

const app = express();
app.use(express.json());
app.use(cors());

app.listen(PORT, () => console.log("Server running on port: " + PORT));
