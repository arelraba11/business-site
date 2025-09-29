import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import "../styles/Pages.css";

export default function Appointments() {
  // State for available services, business opening hours, and form handling
  const [services, setServices] = useState([]);
  const [openingHours, setOpeningHours] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch business info (services + opening hours) from backend
    async function fetchBusiness() {
      try {
        const data = await apiRequest("/business", "GET");
        setServices(data.prices || []);
        setOpeningHours(data.openingHours || {});
        setLoading(false);
      } catch (err) {
        setError("Failed to load business info");
        setLoading(false);
      }
    }
    fetchBusiness();
  }, []);

  if (loading) return <p className="appointments-loading">Loading services...</p>;
  if (error) return <p className="appointments-error">{error}</p>;

  // Handle service selection
  function handleSelect(service) {
    setSelectedService(service);
    setDate("");
    setTime("");
  }

  // Generate available time slots based on opening hours + date
  function getAvailableTimes(selectedDate) {
    if (!selectedDate) return [];

    // Identify the weekday name (e.g., Monday)
    const dayName = new Date(selectedDate).toLocaleString("en-US", {
      weekday: "long",
    });

    const hours = openingHours[dayName];
    if (!hours || !hours.includes("-")) return []; // closed that day

    const [open, close] = hours.split("-");
    const times = [];

    let [h, m] = open.split(":").map(Number);
    let [endH, endM] = close.split(":").map(Number);

    while (h < endH || (h === endH && m < endM)) {
      const hour = h.toString().padStart(2, "0");
      const minute = m.toString().padStart(2, "0");
      times.push(`${hour}:${minute}`);
      m += 30;
      if (m === 60) {
        m = 0;
        h++;
      }
    }

    // If the chosen date is today → filter out past times
    const today = new Date();
    const chosen = new Date(selectedDate);
    if (chosen.toDateString() === today.toDateString()) {
      const currentTime = `${today
        .getHours()
        .toString()
        .padStart(2, "0")}:${today.getMinutes() < 30 ? "00" : "30"}`;
      return times.filter((t) => t >= currentTime);
    }

    return times;
  }

  const timeOptions = getAvailableTimes(date);

  // Handle appointment creation
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
      navigate("/"); // Redirect after booking
    } catch (err) {
      alert(err.message || "Failed to book appointment");
    }
  }

  return (
    <div className="appointments-container">
      <h2 className="appointments-title">Choose a Service</h2>

      {/* List of services */}
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
            <strong>{selectedService.service}</strong> – $
            {selectedService.price}
          </p>

          <div className="date-time-form">
            {/* Date picker → restricted to today onwards */}
            <label>
              Date:
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>

            {/* Time picker → synced with opening hours */}
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
          </div>
        </div>
      )}
    </div>
  );
}