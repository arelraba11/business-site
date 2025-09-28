import React from "react";
import "../styles/Pages.css";

// Fallback page for undefined routes
export default function NotFound() {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404 — Page Not Found</h1>
      <p className="notfound-text">The page you are looking for does not exist.</p>
    </div>
  );
}