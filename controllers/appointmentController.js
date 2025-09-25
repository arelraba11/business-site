import Appointment from "../models/Appointment.js";

// Create new appointment for the logged-in user
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

// Retrieve appointments belonging to the logged-in user
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ client: req.user.id }).populate("client", "username email");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel an appointment if user is owner or admin
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // Only the appointment owner or admin can cancel
    if (appointment.client.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to cancel this appointment" });
    }

    await appointment.deleteOne();
    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve all appointments (restricted to admin users)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("client", "username email");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update the status of an appointment (admin only)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    const { status } = req.body;
    // Accept only 'approved' or 'rejected' as valid status updates
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