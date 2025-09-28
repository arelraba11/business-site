import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  // Track if user is authenticated based on presence of token
  const [authed, setAuthed] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    // Update state when localStorage changes (other tabs)
    const onStorage = () => setAuthed(!!localStorage.getItem("token"));
    // Update state when custom "authChange" event is dispatched (same tab)
    const onAuthChange = () => setAuthed(!!localStorage.getItem("token"));

    window.addEventListener("storage", onStorage);
    window.addEventListener("authChange", onAuthChange);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authChange", onAuthChange);
    };
  }, []);

  // Handle logout: clear token, notify app, redirect to login
  function handleLogout() {
    localStorage.removeItem("token");
    setAuthed(false);
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  }

  // Style for active vs. inactive nav links
  const linkStyle = ({ isActive }) => ({
    marginRight: 12,
    textDecoration: isActive ? "underline" : "none",
  });

  return (
    <nav style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
      <NavLink to="/" style={linkStyle}>Home</NavLink>

      <span style={{ float: "right" }}>
        {authed ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: 12 }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </span>
    </nav>
  );
}