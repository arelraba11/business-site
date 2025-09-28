// routes/appointments.js - Appointment routes
import express from "express";
import auth from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";
import {
  createAppointment,
  getMyAppointments,
  deleteAppointment,
  getAllAppointments,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";

const router = express.Router();

// Create new appointment (user)
router.post("/", auth, createAppointment);

// Get logged-in user's appointments
router.get("/my", auth, getMyAppointments);

// Cancel appointment (user)
router.delete("/:id", auth, deleteAppointment);

// Get all appointments (admin only)
router.get("/", auth, isAdmin, getAllAppointments);

// Update appointment status (admin only)
router.patch("/:id", auth, isAdmin, updateAppointmentStatus);

export default router;