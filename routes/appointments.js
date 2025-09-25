import express from "express";
import Appointment from "../models/Appointment.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create new appointment
router.post("/", auth, async (req, res) => {
  try {
    const { service, dateTime } = req.body;

    const appointment = new Appointment({
      client: req.user.id,
      service,
      dateTime,
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get appointments of logged-in user
router.get("/my", auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ client: req.user.id }).populate("client", "username email");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel appointment
router.delete("/:id", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // Ensure only the owner (or later admin) can cancel
    if (appointment.client.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to cancel this appointment" });
    }

    await appointment.deleteOne();
    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;