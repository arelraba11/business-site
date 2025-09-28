// components/Navbar.js
import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    // Sync auth state when token changes in other tabs (localStorage)
    const onStorage = () => setAuthed(!!localStorage.getItem("token"));
    // Custom event used inside app to force auth state refresh
    const onAuthChange = () => setAuthed(!!localStorage.getItem("token"));

    window.addEventListener("storage", onStorage);
    window.addEventListener("authChange", onAuthChange);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authChange", onAuthChange);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setAuthed(false);
    // Trigger custom event to notify all components about logout
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-links">
        {/* NavLink is used here to apply "active" class automatically */}
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
      </div>

      <div className="navbar-auth">
        {authed ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            {/* Simple links, no need for active state */}
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}