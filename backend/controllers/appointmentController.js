import Appointment from "../models/Appointment.js";
import BusinessInfo from "../models/BusinessInfo.js";

// Create appointment (user) with validations
export const createAppointment = async (req, res) => {
  try {
    const { service, dateTime } = req.body;
    const date = new Date(dateTime);
    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({ message: "Invalid date/time" });
    }

    // Round down to nearest 30 min and clear seconds/millis
    date.setSeconds(0, 0);
    const minutes = date.getMinutes();
    if (minutes >= 30) date.setMinutes(30, 0, 0);
    else date.setMinutes(0, 0, 0);

    // Prevent past bookings
    if (date < new Date()) {
      return res.status(400).json({ message: "Cannot book an appointment in the past" });
    }

    // Business hours check
    const business = await BusinessInfo.findOne();
    if (!business?.openingHours) {
      return res.status(400).json({ message: "Business hours not set" });
    }
    const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const dayName = daysOfWeek[date.getDay()];
    const hours = business.openingHours.get(dayName);
    if (!hours || !hours.includes("-")) {
      return res.status(400).json({ message: "Business closed on this day" });
    }
    const [open, close] = hours.split("-");
    const toMinutes = (str) => {
      const [h, m] = str.split(":").map(Number);
      return h * 60 + m;
    };
    const selectedMinutes = date.getHours() * 60 + date.getMinutes();
    if (selectedMinutes < toMinutes(open) || selectedMinutes >= toMinutes(close)) {
      return res.status(400).json({ message: "Selected time is outside business hours" });
    }

    // Prevent double-booking (same service + same 30-min slot)
    const exists = await Appointment.findOne({ service, dateTime: date });
    if (exists) {
      return res.status(409).json({ message: "This time slot is already booked" });
    }

    // Save appointment
    let appointment = new Appointment({ client: req.user.id, service, dateTime: date });
    await appointment.save();
    appointment = await appointment.populate("client", "username email");
    return res.status(201).json(appointment);
  } catch (err) {
    console.error("createAppointment error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Get logged-in user's appointments
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ client: req.user.id })
      .populate("client", "username email");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel appointment (owner or admin)
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    if (appointment.client.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await appointment.deleteOne();
    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all appointments (admin)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("client", "username email");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update appointment status (admin)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    const { status } = req.body;
    if (status === "approved" || status === "rejected") {
      appointment.status = status;
      await appointment.save();
      await appointment.populate("client", "username email");
      res.json(appointment);
    } else {
      res.status(400).json({ message: "Invalid status" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};