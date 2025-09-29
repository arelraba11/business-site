import React from "react";

export default function ServicesSection({
  services,
  newService,
  setNewService,
  newPrice,
  setNewPrice,
  handleAddService,
  handleDeleteService,
}) {
  return (
    <div className="dashboard-section services">
      <h3 className="section-title">Services</h3>
      <ul className="services-list">
        {services.map((s) => (
          <li key={s._id || s.service} className="service-item">
            {s.service} – ${s.price}
            <button
              className="btn btn-danger"
              onClick={() => handleDeleteService(s._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAddService} className="service-form">
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
        />
        <button type="submit" className="btn btn-primary">
          Add Service
        </button>
      </form>
    </div>
  );
}