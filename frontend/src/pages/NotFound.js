import React from "react";

// Fallback page for undefined routes
export default function NotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 — Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}