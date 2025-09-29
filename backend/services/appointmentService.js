// services/appointmentService.js
import Appointment from "../models/Appointment.js";
import BusinessInfo from "../models/BusinessInfo.js";
import { toMinutes, roundTo30, daysOfWeek } from "../utils/timeUtils.js";

// Create appointment with business rules
export async function createAppointmentService(userId, service, dateTime) {
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date/time");
  }

  roundTo30(date);

  if (date < new Date()) {
    throw new Error("Cannot book an appointment in the past");
  }

  const business = await BusinessInfo.findOne();
  if (!business?.openingHours) {
    throw new Error("Business hours not set");
  }

  const dayName = daysOfWeek[date.getDay()];
  const hours = business.openingHours.get(dayName);
  if (!hours || !hours.includes("-")) {
    throw new Error("Business closed on this day");
  }

  const [open, close] = hours.split("-");
  const selectedMinutes = date.getHours() * 60 + date.getMinutes();
  if (selectedMinutes < toMinutes(open) || selectedMinutes >= toMinutes(close)) {
    throw new Error("Selected time is outside business hours");
  }

  const exists = await Appointment.findOne({ service, dateTime: date });
  if (exists) {
    throw new Error("This time slot is already booked");
  }

  let appointment = new Appointment({ client: userId, service, dateTime: date });
  await appointment.save();
  return appointment.populate("client", "username email");
}

// Get appointments by user
export async function getUserAppointments(userId) {
  return Appointment.find({ client: userId }).populate("client", "username email");
}

// Delete appointment
export async function deleteAppointmentById(id, userId, role) {
  const appointment = await Appointment.findById(id);
  if (!appointment) throw new Error("Appointment not found");

  if (appointment.client.toString() !== userId && role !== "admin") {
    throw new Error("Not authorized");
  }

  await appointment.deleteOne();
  return { message: "Appointment cancelled" };
}

// Get all appointments (admin)
export async function getAllAppointmentsService() {
  return Appointment.find().populate("client", "username email");
}

// Update appointment status (admin)
export async function updateAppointmentStatusService(id, status) {
  const appointment = await Appointment.findById(id);
  if (!appointment) throw new Error("Appointment not found");

  if (status !== "approved" && status !== "rejected") {
    throw new Error("Invalid status");
  }

  appointment.status = status;
  await appointment.save();
  return appointment.populate("client", "username email");
}