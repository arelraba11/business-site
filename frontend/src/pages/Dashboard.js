import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newService, setNewService] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    fetchAppointments();
    fetchServices();
  }, []);

  async function fetchAppointments() {
    try {
      const token = localStorage.getItem("token");
      const data = await apiRequest("/appointments", "GET", null, token);
      setAppointments(data);
    } catch (err) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }

  async function fetchServices() {
    try {
      const data = await apiRequest("/business", "GET");
      setServices(data.prices || []);
    } catch (err) {
      console.error("Failed to load services");
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

  async function handleAddService(e) {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const updated = await apiRequest(
      "/business",
      "POST",
      { prices: [...services, { service: newService, price: newPrice }] },
      token
    );
    setServices(updated.prices);
    setNewService("");
    setNewPrice("");
    alert("Service added successfully!");
  } catch (err) {
    alert("Failed to add service");
  }
}

async function handleDeleteService(serviceId) {
  try {
    const token = localStorage.getItem("token");
    const updated = await apiRequest(
      `/business/services/${serviceId}`,
      "DELETE",
      null,
      token
    );
    setServices(updated.prices);
    alert("Service deleted successfully");
  } catch (err) {
    alert("Failed to delete service");
  }
}

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* Appointments Section */}
      <h3>Appointments Management</h3>
      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "1em" }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Service</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a._id}>
              <td>{a.client?.username || "N/A"}</td>
              <td>{a.client?.email || "N/A"}</td>
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

      {/* Services Section */}
      <h3 style={{ marginTop: "2em" }}>Services Management</h3>
      <ul>
        {services.map((s) => (
          <li key={s._id}>
            {s.service} – ${s.price}
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleDeleteService(s._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAddService} style={{ marginTop: "1em" }}>
        <input
          type="text"
          placeholder="Service name"
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          required
          style={{ marginLeft: "10px" }}
        />
        <button type="submit" style={{ marginLeft: "10px" }}>
          Add Service
        </button>
      </form>
    </div>
  );
}