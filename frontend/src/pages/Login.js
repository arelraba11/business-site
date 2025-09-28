import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import "../styles/Pages.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");       // store user email
  const [password, setPassword] = useState(""); // store user password
  const [error, setError] = useState("");       // store error message

  // Handle login form submission
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // Send login request to backend
      const data = await apiRequest("/users/login", "POST", { email, password });

      // Save token in localStorage to persist authentication
      localStorage.setItem("token", data.token);
      // Trigger custom event to update auth state across app
      window.dispatchEvent(new Event("authChange"));

      alert("Login successful!");
      navigate("/"); // redirect to homepage
    } catch (err) {
      setError(err.message); // show error if login fails
    }
  }

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-input"
        />
        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      {/* Show error message if login fails */}
      {error && <p className="login-error">{error}</p>}
    </div>
  );
}

export default Login;