// src/pages/MyAppointments.js
import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import "../styles/Pages.css";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const token = localStorage.getItem("token");
        const data = await apiRequest("/appointments/my", "GET", null, token);
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchAppointments();
  }, []);

  async function handleCancel(id) {
    try {
      const token = localStorage.getItem("token");
      await apiRequest(`/appointments/${id}`, "DELETE", null, token);
      setAppointments(appointments.filter((a) => a._id !== id));
    } catch (err) {
      alert("Failed to cancel appointment: " + err.message);
    }
  }

  return (
    <div className="myappointments-container">
      <h2 className="myappointments-title">My Appointments</h2>
      {error && <p className="myappointments-error">{error}</p>}
      {appointments.length === 0 ? (
        <p className="myappointments-empty">No appointments found.</p>
      ) : (
        <table className="myappointments-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <td>{appt.service}</td>
                <td>{new Date(appt.dateTime).toLocaleString()}</td>
                <td>{appt.status}</td>
                <td>
                  {appt.status !== "cancelled" && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleCancel(appt._id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}