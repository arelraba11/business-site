import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import AppointmentForm from "../components/AppointmentForm";
import "../styles/Pages.css";

export default function Appointments() {
  const [services, setServices] = useState([]);
  const [openingHours, setOpeningHours] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedService, setSelectedService] = useState(null);

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

  if (loading) return <p>Loading services...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="appointments-container">
      <h2 className="appointments-title">Choose a Service</h2>

      {/* Services list */}
      <ul className="services-list">
        {services.map((s) => (
          <li key={s._id} className="service-item">
            {s.service} – ${s.price}
            <button className="btn btn-primary" onClick={() => setSelectedService(s)}>
              Select
            </button>
          </li>
        ))}
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