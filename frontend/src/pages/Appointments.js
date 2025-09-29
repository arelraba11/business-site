import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import AppointmentForm from "../components/AppointmentForm";
import "../styles/Pages.css";

export default function Appointments() {
  // State
  const [services, setServices] = useState([]);
  const [openingHours, setOpeningHours] = useState({});
  const [selectedService, setSelectedService] = useState(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBusiness() {
      try {
        const data = await apiRequest("/business", "GET");
        setServices(data.prices || []);
        setOpeningHours(data.openingHours || {});
      } catch {
        setError("Failed to load business info");
      } finally {
        setLoading(false);
      }
    }
    fetchBusiness();
  }, []);

  /* ----------------- UI ----------------- */
  if (loading) {
    return <div className="loading">Loading services...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="appointments-container">
      <h2 className="appointments-title">Choose a Service</h2>

      {/* Services list */}
      <ul className="services-list">
        {services.length === 0 ? (
          <li className="service-item">No services available</li>
        ) : (
          services.map((s) => (
            <li key={s._id || s.service} className="service-item">
              {s.service} – ${s.price}
              <button
                className="btn btn-primary"
                onClick={() => setSelectedService(s)}
              >
                Select
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Appointment form */}
      {selectedService && (
        <AppointmentForm
          service={selectedService}
          openingHours={openingHours}
          onCancel={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}