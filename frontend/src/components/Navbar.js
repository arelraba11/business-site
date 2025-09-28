// components/Navbar.js
import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    // Update state when localStorage changes
    const syncAuth = () => {
      setAuthed(!!localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", syncAuth);
    window.addEventListener("authChange", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("authChange", syncAuth);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // clear role as well
    setAuthed(false);
    setRole(null);
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-links">
        {/* Public links */}
        <NavLink
          to="/"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          Home
        </NavLink>
        <NavLink
          to="/my-appointments"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          My Appointments
        </NavLink>

        {/* Show Dashboard only if admin */}
        {role === "admin" && (
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Dashboard
          </NavLink>
        )}
      </div>

      <div className="navbar-auth">
        {authed ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}