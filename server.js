import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import businessRoutes from "./routes/business.js";

// Load environment variables
dotenv.config();
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Business info routes
app.use("/api/business", businessRoutes);

// Basic route to check if server is running
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(4000, () => console.log("Server running on port 4000")))
  .catch((err) => console.log(err));