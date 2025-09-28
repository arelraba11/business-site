import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newService, setNewService] = useState("");
  const [newPrice, setNewPrice] = useState("");
  // Business Info
  const [businessName, setBusinessName] = useState("");
  const [businessImage, setBusinessImage] = useState("");
  // Posts
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState("");

  useEffect(() => {
    fetchAppointments();
    fetchServices();
    fetchBusinessInfo();
    fetchPosts();
  }, []);

  async function fetchAppointments() {
    try {
      const token = localStorage.getItem("token");
      const data = await apiRequest("/appointments", "GET", null, token);
      setAppointments(data);
    } catch {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }

  async function fetchServices() {
    try {
      const data = await apiRequest("/business", "GET");
      setServices(data.prices || []);
    } catch {
      console.error("Failed to load services");
    }
  }

  async function fetchBusinessInfo() {
    try {
      const data = await apiRequest("/business", "GET");
      setBusinessName(data.name || "");
      setBusinessImage(data.image || "");
    } catch {
      // ignore
    }
  }

  async function fetchPosts() {
    try {
      const data = await apiRequest("/posts", "GET");
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    }
  }

  async function handleUpdate(id, status) {
    try {
      const token = localStorage.getItem("token");
      await apiRequest(`/appointments/${id}`, "PATCH", { status }, token);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch {
      alert("Failed to update appointment");
    }
  }

  async function handleAddService(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updated = await apiRequest(
        "/business",
        "POST",
        { prices: [...services, { service: newService, price: newPrice }] },
        token
      );
      setServices(updated.prices);
      setNewService("");
      setNewPrice("");
      alert("Service added successfully!");
    } catch {
      alert("Failed to add service");
    }
  }

  async function handleDeleteService(serviceId) {
    try {
      const token = localStorage.getItem("token");
      const updated = await apiRequest(
        `/business/services/${serviceId}`,
        "DELETE",
        null,
        token
      );
      setServices(updated.prices);
      alert("Service deleted successfully");
    } catch {
      alert("Failed to delete service");
    }
  }

  async function handleBusinessInfoSubmit(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updated = await apiRequest(
        "/business",
        "POST",
        { name: businessName, image: businessImage, prices: services },
        token
      );
      setBusinessName(updated.name || "");
      setBusinessImage(updated.image || "");
      setServices(updated.prices || []);
      alert("Business info updated successfully!");
    } catch {
      alert("Failed to update business info");
    }
  }

  async function handlePostSubmit(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = { content: postContent };
      if (postImage) payload.image = postImage;
      const newPost = await apiRequest("/posts", "POST", payload, token);
      setPosts((prev) => [newPost, ...prev]);
      setPostContent("");
      setPostImage("");
      alert("Post created successfully!");
    } catch {
      alert("Failed to create post");
    }
  }

  async function handleDeletePost(id) {
    try {
      const token = localStorage.getItem("token");
      await apiRequest(`/posts/${id}`, "DELETE", null, token);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      alert("Post deleted successfully");
    } catch {
      alert("Failed to delete post");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* Business Info */}
      <h3>Business Info</h3>
      <form onSubmit={handleBusinessInfoSubmit} style={{ marginBottom: "2em" }}>
        <div>
          <label>
            Business Name:{" "}
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              style={{ marginRight: "10px" }}
            />
          </label>
          <label>
            Image URL:{" "}
            <input
              type="text"
              value={businessImage}
              onChange={(e) => setBusinessImage(e.target.value)}
              style={{ marginLeft: "10px" }}
            />
          </label>
          <button type="submit" style={{ marginLeft: "10px" }}>
            Save Info
          </button>
        </div>
        {businessImage && (
          <div style={{ marginTop: "1em" }}>
            <img src={businessImage} alt="Business" style={{ maxWidth: "200px" }} />
          </div>
        )}
      </form>

      {/* Appointments */}
      <h3>Appointments</h3>
      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "1em" }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Service</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a._id}>
              <td>{a.client?.username || "N/A"}</td>
              <td>{a.client?.email || "N/A"}</td>
              <td>{a.service}</td>
              <td>{new Date(a.dateTime).toLocaleDateString()}</td>
              <td>{new Date(a.dateTime).toLocaleTimeString()}</td>
              <td>{a.status}</td>
              <td>
                <button onClick={() => handleUpdate(a._id, "approved")}>
                  Approve
                </button>
                <button
                  style={{ marginLeft: "10px" }}
                  onClick={() => handleUpdate(a._id, "rejected")}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Services */}
      <h3 style={{ marginTop: "2em" }}>Services</h3>
      <ul>
        {services.map((s) => (
          <li key={s._id}>
            {s.service} – ${s.price}
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleDeleteService(s._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAddService} style={{ marginTop: "1em" }}>
        <input
          type="text"
          placeholder="Service name"
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          required
          style={{ marginLeft: "10px" }}
        />
        <button type="submit" style={{ marginLeft: "10px" }}>
          Add Service
        </button>
      </form>

      {/* Posts */}
      <h3>Posts</h3>
      <form onSubmit={handlePostSubmit} style={{ marginBottom: "1em" }}>
        <div>
          <textarea
            placeholder="Write your post content..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            rows={3}
            style={{ width: "60%", marginRight: "10px" }}
            required
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={postImage}
            onChange={(e) => setPostImage(e.target.value)}
            style={{ width: "30%" }}
          />
        </div>
        <button type="submit" style={{ marginTop: "0.5em" }}>
          Create Post
        </button>
      </form>
      <ul>
        {posts.map((post) => (
          <li key={post._id} style={{ border: "1px solid #ccc", padding: "1em", marginBottom: "1em" }}>
            <div>{post.content}</div>
            {post.image && (
              <div>
                <img src={post.image} alt="Post" style={{ maxWidth: "200px", marginTop: "0.5em" }} />
              </div>
            )}
            <button
              onClick={() => handleDeletePost(post._id)}
              style={{ marginTop: "0.5em" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}