import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Routes
import userRoutes from "./routes/users.js";
import businessRoutes from "./routes/business.js";
import appointmentRoutes from "./routes/appointments.js";
import postRoutes from "./routes/posts.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);          // Users (auth)
app.use("/api/business", businessRoutes);   // Business info
app.use("/api/appointments", appointmentRoutes); // Appointments
app.use("/api/posts", postRoutes);          // Posts

// Health check
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(4000, () => console.log("Server running on port 4000"));
  })
  .catch((err) => console.error("MongoDB connection error:", err));