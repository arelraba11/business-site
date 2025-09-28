import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import "../styles/Pages.css";

export default function Appointments() {
  // State for available services and form handling
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch services list from backend (prices array inside business info)
    async function fetchServices() {
      try {
        const data = await apiRequest("/business", "GET");
        setServices(data.prices || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load services");
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  if (loading) return <p className="appointments-loading">Loading services...</p>;
  if (error) return <p className="appointments-error">{error}</p>;

  // Select a service and reset date/time inputs
  function handleSelect(service) {
    setSelectedService(service);
    setDate("");
    setTime("");
  }

  // Confirm appointment creation
  async function handleConfirm() {
    if (!date || !time) {
      alert("Please select a valid date and time.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await apiRequest(
        "/appointments",
        "POST",
        {
          service: selectedService.service,
          dateTime: new Date(`${date}T${time}`), // Combine date and time
        },
        token
      );

      alert("Appointment booked successfully!");
      navigate("/"); // Redirect to homepage after booking
    } catch (err) {
      alert(err.message || "Failed to book appointment");
    }
  }

  return (
    <div className="appointments-container">
      <h2 className="appointments-title">Choose a Service</h2>

      <ul className="services-list">
        {services.map((s) => (
          <li key={s._id} className="service-item">
            {s.service} – ${s.price}
            <button
              className="btn btn-primary"
              onClick={() => handleSelect(s)}
            >
              Select
            </button>
          </li>
        ))}
      </ul>

      {/* Show form only when a service is selected */}
      {selectedService && (
        <div className="selected-service-card">
          <h3 className="selected-service-title">Selected Service</h3>
          <p className="selected-service-info">
            <strong>{selectedService.service}</strong> – ${selectedService.price}
          </p>

          <div className="date-time-form">
            <label>
              Date:
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label>
              Time:
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </label>
            <button className="btn btn-primary" onClick={handleConfirm}>
              Confirm Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}