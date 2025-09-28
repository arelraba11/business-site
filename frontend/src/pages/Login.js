import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import "../styles/Pages.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await apiRequest("/users/login", "POST", { email, password });

      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("authChange"));

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-input"
        />
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
      {error && <p className="login-error">{error}</p>}
    </div>
  );
}

export default Login;