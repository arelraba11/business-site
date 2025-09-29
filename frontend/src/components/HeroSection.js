import React from "react";

export default function HeroSection({ businessName, onBook }) {
  return (
    <div className="hero-section">
      <img src="/heroPage.jpg" alt="Hero" className="hero-image" />
      <div className="hero-overlay">
        <h1>{businessName}</h1>
        <button onClick={onBook} className="btn btn-primary">
          Book Appointment
        </button>
      </div>
    </div>
  );
}