import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import "../styles/Pages.css";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newService, setNewService] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [businessName, setBusinessName] = useState("");
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
    } catch {
      // ignore
    }
  }

  async function fetchPosts() {
  try {
    const res = await apiRequest("/posts", "GET");
    setPosts(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.error("Failed to load posts", err);
    setPosts([]);
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
        { name: businessName, prices: services },
        token
      );
      setBusinessName(updated.name || "");
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
    const res = await apiRequest("/posts", "POST", payload, token);
    const newPost = res.data ? res.data : res; 
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
    <div className="dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      {/* Business Info */}
      <div className="dashboard-section business-info">
        <h3 className="section-title">Business Info</h3>
        <form onSubmit={handleBusinessInfoSubmit} className="business-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Business Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">Save Info</button>
          </div>
        </form>
      </div>

      {/* Appointments */}
      <div className="dashboard-section appointments">
        <h3 className="section-title">Appointments</h3>
        <table className="appointments-table">
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
                <td className="table-actions">
                  <button className="btn btn-primary" onClick={() => handleUpdate(a._id, "approved")}>
                    Approve
                  </button>
                  <button className="btn btn-danger" onClick={() => handleUpdate(a._id, "rejected")}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Services */}
      <div className="dashboard-section services">
        <h3 className="section-title">Services</h3>
        <ul className="services-list">
          {services.map((s) => (
            <li key={s._id || s.service} className="service-item">
              {s.service} – ${s.price}
              <button className="btn btn-danger" onClick={() => handleDeleteService(s._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={handleAddService} className="service-form">
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
          />
          <button type="submit" className="btn btn-primary">Add Service</button>
        </form>
      </div>

      {/* Posts */}
      <div className="dashboard-section posts">
        <h3 className="section-title">Posts</h3>
        <form onSubmit={handlePostSubmit} className="post-form">
          <textarea
            placeholder="Write your post content..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            rows={3}
            required
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={postImage}
            onChange={(e) => setPostImage(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Create Post</button>
        </form>

        <ul className="posts-list">
          {posts.map((post) => (
            <li key={post._id || post.content} className="post-item">
              <div className="post-content">{post.content}</div>
              {post.image && (
                <div className="post-image">
                  <img src={post.image} alt="Post" />
                </div>
              )}
              <button className="btn btn-danger" onClick={() => handleDeletePost(post._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}