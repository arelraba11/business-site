// Base URL for backend API
const API_URL = "http://localhost:4000/api";

/**
 * Generic helper for making API requests
 * Centralizes fetch logic with JSON and token handling
 *
 * @param {string} endpoint - e.g. "/users/login"
 * @param {string} [method="GET"] - HTTP method
 * @param {Object|null} [body=null] - Request payload
 * @param {string|null} [token=null] - Optional Bearer token
 * @returns {Promise<any>} - Parsed JSON response
 */
export async function apiRequest(endpoint, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  // Throw error with message provided by server if response is not ok
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  return response.json(); // Return parsed JSON payload
}