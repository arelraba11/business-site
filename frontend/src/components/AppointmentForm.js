import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import { getAvailableTimes } from "../utils/timeUtils";

export default function AppointmentForm({ service, openingHours, onCancel }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const navigate = useNavigate();

  const timeOptions = getAvailableTimes(date, openingHours);

  async function handleConfirm() {
    if (!date || !time) return alert("Please select a valid date and time.");
    try {
      const token = localStorage.getItem("token");
      await apiRequest(
        "/appointments",
        "POST",
        { service: service.service, dateTime: new Date(`${date}T${time}`) },
        token
      );
      alert("Appointment booked successfully!");
      navigate("/");
    } catch (err) {
      alert(err.message || "Failed to book appointment");
    }
  }

  return (
    <div className="selected-service-card">
      <h3 className="selected-service-title">Selected Service</h3>
      <p>
        <strong>{service.service}</strong> – ${service.price}
      </p>

      <div className="date-time-form">
        <label>
          Date:
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label>
          Time:
          {date && timeOptions.length === 0 ? (
            <p className="appointments-error">Closed on this day</p>
          ) : (
            <select value={time} onChange={(e) => setTime(e.target.value)}>
              <option value="">Select time</option>
              {timeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
        </label>

        <button className="btn btn-primary" onClick={handleConfirm}>
          Confirm Appointment
        </button>
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}