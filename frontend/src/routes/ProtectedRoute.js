import React from "react";
import { Navigate } from "react-router-dom";

// Higher-order component to restrict access to authenticated users only
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  // If token exists → render child component, otherwise redirect to login
  return token ? children : <Navigate to="/login" replace />;
}