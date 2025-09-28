// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      const token = localStorage.getItem("token");
      const data = await apiRequest("/appointments", "GET", null, token);
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load appointments");
      setLoading(false);
    }
  }

  async function handleUpdate(id, status) {
    try {
      const token = localStorage.getItem("token");
      await apiRequest(`/appointments/${id}`, "PATCH", { status }, token);

      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch (err) {
      alert("Failed to update appointment");
    }
  }

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "1em" }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Service</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Appointments return 'client' not 'user' */}
          {appointments.map((a) => (
            <tr key={a._id}>
              <td>{a.client?.username || a.client?.email || "N/A"}</td>
              <td>{a.service}</td>
              <td>{new Date(a.dateTime).toLocaleDateString()}</td>
              <td>{new Date(a.dateTime).toLocaleTimeString()}</td>
              <td>{a.status}</td>
              <td>
                <button onClick={() => handleUpdate(a._id, "approved")}>
                  Approve
                </button>
                <button
                  style={{ marginLeft: "10px" }}
                  onClick={() => handleUpdate(a._id, "rejected")}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}