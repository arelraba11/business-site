import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import "../styles/Pages.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await apiRequest("/users/register", "POST", { username, email, password });

      // Dispatch event in case Navbar listens for auth changes
      window.dispatchEvent(new Event("authChange"));

      alert("Registration successful! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Register;