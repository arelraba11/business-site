import mongoose from "mongoose";

// Appointment schema defines structure for booking system
const appointmentSchema = new mongoose.Schema({
  // Reference to the user who booked the appointment
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  service: {
    type: String,
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  // Appointment status managed by admin
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  // Optional notes related to appointment
  notes: {
    type: String
  }
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;