import Appointment from "../models/Appointment.js";
import BusinessInfo from "../models/BusinessInfo.js";

// Create appointment (user)
export const createAppointment = async (req, res) => {
  try {
    const { service, dateTime } = req.body;
    const date = new Date(dateTime);

    if (date < new Date()) {
      return res.status(400).json({ message: "Cannot book an appointment in the past" });
    }

    const business = await BusinessInfo.findOne();
    if (!business || !business.openingHours) {
      return res.status(400).json({ message: "Business hours not set" });
    }

    const daysOfWeek = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    const dayName = daysOfWeek[date.getDay()];
    const hours = business.openingHours.get(dayName);

    if (!hours || !hours.includes("-")) {
      return res.status(400).json({ message: "Business closed on this day" });
    }

    const [open, close] = hours.split("-");
    const selectedTime = date.toTimeString().slice(0, 5); // "HH:MM"

    if (selectedTime < open || selectedTime > close) {
      return res.status(400).json({ message: "Selected time is outside business hours" });
    }

    let appointment = new Appointment({
      client: req.user.id,
      service,
      dateTime: date,
    });

    await appointment.save();
    appointment = await appointment.populate("client", "username email");

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
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