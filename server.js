import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import route modules
import userRoutes from "./routes/users.js";
import businessRoutes from "./routes/business.js";
import appointmentRoutes from "./routes/appointments.js";
import postRoutes from "./routes/posts.js";

// Load environment variables from .env
dotenv.config();

const app = express();

// Enable CORS for frontend-backend communication
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Register API routes
app.use("/api/users", userRoutes);                // User auth & management
app.use("/api/business", businessRoutes);         // Business info (name, services)
app.use("/api/appointments", appointmentRoutes);  // Booking system
app.use("/api/posts", postRoutes);                // Blog/updates posts

// Basic health check route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Connect to MongoDB and start Express server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(4000, () => console.log("Server running on port 4000"));
  })
  .catch((err) => console.error("MongoDB connection error:", err));