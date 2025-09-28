import React from "react";
import { Navigate } from "react-router-dom";

// Protects routes by checking for authentication token
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}