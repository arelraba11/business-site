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

// Routes for appointment-related operations
const router = express.Router();

// Client creates new appointment
router.post("/", auth, createAppointment);

// Retrieve appointments of logged-in user
router.get("/my", auth, getMyAppointments);

// Client cancels their appointment
router.delete("/:id", auth, deleteAppointment);

// Admin retrieves all appointments
router.get("/", [auth, adminOnly], getAllAppointments);

// Admin updates appointment status
router.patch("/:id", [auth, adminOnly], updateAppointmentStatus);

export default router;