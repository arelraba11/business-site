import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Import route handlers
import userRoutes from "./routes/users.js";
import businessRoutes from "./routes/business.js";
import appointmentRoutes from "./routes/appointments.js";

// Load environment variables
dotenv.config();

const app = express();

// Parse JSON request bodies
app.use(express.json());

// API routes
app.use("/api/users", userRoutes);          // User authentication
app.use("/api/business", businessRoutes);  // Business information
app.use("/api/appointments", appointmentRoutes); // Appointments management

// Health check route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(4000, () => console.log("Server running on port 4000"));
  })
  .catch((err) => console.error("MongoDB connection error:", err));