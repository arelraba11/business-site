import React from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Navigate to booking page or login if not authenticated
  const handleBookAppointment = () => {
    if (!token) {
      navigate("/login");
    } else {
      navigate("/appointments");
    }
  };

  // Navigate to user's appointments or login if not authenticated
  const handleMyAppointments = () => {
    if (!token) {
      navigate("/login");
    } else {
      navigate("/my-appointments");
    }
  };

  return (
    <div className="home-container">
      {/* Header: Business name and main image */}
      <div className="home-header">
        <h1>Business Name</h1>
        <img
          src="https://via.placeholder.com/400x200"
          alt="Business"
          className="home-image"
        />
      </div>

      {/* Main action buttons */}
      <div className="home-actions">
        <button onClick={handleBookAppointment}>Book Appointment</button>
        <button onClick={handleMyAppointments}>My Appointments</button>
      </div>

      {/* Example posts section */}
      <div className="home-posts">
        <h2>Latest Posts</h2>
        <div className="post-card">
          <img src="https://via.placeholder.com/300" alt="Post" />
          <p>This is a sample post description.</p>
        </div>
      </div>
    </div>
  );
}