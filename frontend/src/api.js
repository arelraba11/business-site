// Base URL for backend API
const API_URL = "http://localhost:4000/api";

/**
 * Generic helper for making API requests to the backend
 * @param {string} endpoint - API endpoint (e.g. "/users/login")
 * @param {string} method - HTTP method (default: GET)
 * @param {Object|null} body - Request payload (default: null)
 * @param {string|null} token - Optional auth token for protected routes
 */
export async function apiRequest(endpoint, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Perform fetch request
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  // Handle errors by throwing message from server
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  // Parse and return JSON response
  return response.json();
}