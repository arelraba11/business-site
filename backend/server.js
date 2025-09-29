import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/index.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Use centralized routes
app.use("/api", routes);

app.get("/", (req, res) => res.send("Server is running!"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(4000, () => console.log("Server running on port 4000"));
  })
  .catch((err) => console.error("MongoDB connection error:", err));