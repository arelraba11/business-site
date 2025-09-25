import Appointment from "../models/Appointment.js";

// Create new appointment
export const createAppointment = async (req, res) => {
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
};

// Get appointments of logged-in user
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ client: req.user.id }).populate("client", "username email");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel appointment
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // Ensure only the owner (or admin) can cancel
    if (appointment.client.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to cancel this appointment" });
    }

    await appointment.deleteOne();
    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all appointments (admin only)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("client", "username email");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update appointment status (admin only)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    const { status } = req.body;
    if (status === "approved" || status === "rejected") {
      appointment.status = status;
      await appointment.save();
      res.json(appointment);
    } else {
      res.status(400).json({ message: "Invalid status value" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};