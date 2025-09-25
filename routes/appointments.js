import express from "express";
import auth from "../middleware/auth.js";
import adminOnly from "../middleware/isAdmin.js";
import {
  createAppointment,
  getMyAppointments,
  deleteAppointment,
  getAllAppointments,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";

const router = express.Router();

// Create new appointment
router.post("/", auth, createAppointment);

// Get appointments of logged-in user
router.get("/my", auth, getMyAppointments);

// Cancel appointment
router.delete("/:id", auth, deleteAppointment);

// Get all appointments (admin only)
router.get("/", [auth, adminOnly], getAllAppointments);

// Update appointment status (admin only)
router.patch("/:id", [auth, adminOnly], updateAppointmentStatus);

export default router;