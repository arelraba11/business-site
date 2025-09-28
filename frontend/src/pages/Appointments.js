import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

export default function Appointments() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
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

  if (loading) return <p>Loading services...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  function handleSelect(service) {
    setSelectedService(service);
    setDate("");
    setTime("");
  }

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
          dateTime: new Date(`${date}T${time}`),
        },
        token
      );

      alert("Appointment booked successfully!");
      navigate("/"); // redirect to homepage
    } catch (err) {
      alert(err.message || "Failed to book appointment");
    }
  }

  return (
    <div>
      <h2>Choose a Service</h2>
      <ul>
        {services.map((s) => (
          <li key={s._id}>
            {s.service} – ${s.price}
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleSelect(s)}
            >
              Select
            </button>
          </li>
        ))}
      </ul>

      {selectedService && (
        <div style={{ marginTop: "2em", border: "1px solid #ccc", padding: "1em" }}>
          <h3>Selected Service</h3>
          <p>
            <strong>{selectedService.service}</strong> – ${selectedService.price}
          </p>

          <div style={{ marginTop: "1em" }}>
            <label>
              Date:{" "}
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <br />
            <label>
              Time:{" "}
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </label>
            <br />
            <button onClick={handleConfirm} style={{ marginTop: "10px" }}>
              Confirm Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}