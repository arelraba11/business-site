// backend/routes/index.js
import express from "express";
import userRoutes from "./users.js";
import businessRoutes from "./business.js";
import appointmentRoutes from "./appointments.js";
import postRoutes from "./posts.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/business", businessRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/posts", postRoutes);

export default router;