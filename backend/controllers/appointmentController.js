// controllers/appointmentController.js
import {
  createAppointmentService,
  getUserAppointments,
  deleteAppointmentById,
  getAllAppointmentsService,
  updateAppointmentStatusService,
} from "../services/appointmentService.js";

export const createAppointment = async (req, res) => {
  try {
    const appointment = await createAppointmentService(req.user.id, req.body.service, req.body.dateTime);
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await getUserAppointments(req.user.id);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const result = await deleteAppointmentById(req.params.id, req.user.id, req.user.role);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await getAllAppointmentsService();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await updateAppointmentStatusService(req.params.id, req.body.status);
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};