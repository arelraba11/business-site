// Base URL for backend API (use .env for flexibility)
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

/**
 * Generic helper for making API requests
 * Handles JSON, tokens, and error parsing consistently
 *
 * @param {string} endpoint - e.g. "/users/login"
 * @param {string} [method="GET"] - HTTP method
 * @param {Object|FormData|null} [body=null] - Request payload
 * @param {string|null} [token=null] - Optional Bearer token
 * @returns {Promise<any>} - Parsed response data
 */
export async function apiRequest(endpoint, method = "GET", body = null, token = null) {
  const headers = {};
  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : null,
    });
  } catch (networkError) {
    throw new Error("Network error – failed to reach server");
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = { message: await response.text() }; // fallback for non-JSON errors
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}