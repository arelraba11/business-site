import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import "../styles/Pages.css";

// Components
import DashboardTabs from "../components/dashboard/DashboardTabs";
import BusinessInfo from "../components/dashboard/BusinessInfo";
import AppointmentsSection from "../components/dashboard/AppointmentsSection";
import ServicesSection from "../components/dashboard/ServicesSection";
import PostsSection from "../components/dashboard/PostsSection";

export default function Dashboard() {
  // State for appointments, services, business info, and posts
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [openingHours, setOpeningHours] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newService, setNewService] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState("");

  // State for tabs
  const [activeTab, setActiveTab] = useState("appointments");

  useEffect(() => {
    fetchAppointments();
    fetchServices();
    fetchBusinessInfo();
    fetchPosts();
  }, []);

  // Fetch all appointments
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

  // Fetch services
  async function fetchServices() {
    try {
      const data = await apiRequest("/business", "GET");
      setServices(data.prices || []);
    } catch {
      console.error("Failed to load services");
    }
  }

  // Fetch business info
  async function fetchBusinessInfo() {
    try {
      const data = await apiRequest("/business", "GET");
      setBusinessName(data.name || "");
      setOpeningHours(data.openingHours || {});
    } catch {
      // ignore errors
    }
  }

  // Fetch posts
  async function fetchPosts() {
    try {
      const res = await apiRequest("/posts", "GET");
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load posts", err);
      setPosts([]);
    }
  }

  // Update appointment status
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

  // Add a new service
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

  // Delete a service
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

  // Update business info
  async function handleBusinessInfoSubmit(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updated = await apiRequest(
        "/business",
        "POST",
        { name: businessName, prices: services, openingHours },
        token
      );
      setBusinessName(updated.name || "");
      setServices(updated.prices || []);
      setOpeningHours(updated.openingHours || {});
      alert("Business info updated successfully!");
    } catch (err) {
      alert("Failed to update business info");
      console.error(err);
    }
  }

  // Create a new post
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

  // Delete a post
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

  // Loading/error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Generate time options (00:00, 00:30, 01:00 ... 23:30)
  function generateTimeOptions() {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m of [0, 30]) {
        const hour = h.toString().padStart(2, "0");
        const minute = m.toString().padStart(2, "0");
        times.push(`${hour}:${minute}`);
      }
    }
    return times;
  }
  const timeOptions = generateTimeOptions();

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      {/* Tabs */}
      <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Business Info */}
      {activeTab === "business" && (
        <BusinessInfo
          businessName={businessName}
          setBusinessName={setBusinessName}
          openingHours={openingHours}
          setOpeningHours={setOpeningHours}
          handleBusinessInfoSubmit={handleBusinessInfoSubmit}
          timeOptions={timeOptions}
        />
      )}

      {/* Appointments */}
      {activeTab === "appointments" && (
        <AppointmentsSection
          appointments={appointments}
          handleUpdate={handleUpdate}
        />
      )}

      {/* Services */}
      {activeTab === "services" && (
        <ServicesSection
          services={services}
          newService={newService}
          newPrice={newPrice}
          setNewService={setNewService}
          setNewPrice={setNewPrice}
          handleAddService={handleAddService}
          handleDeleteService={handleDeleteService}
        />
      )}

      {/* Posts */}
      {activeTab === "posts" && (
        <PostsSection
          posts={posts}
          postContent={postContent}
          postImage={postImage}
          setPostContent={setPostContent}
          setPostImage={setPostImage}
          handlePostSubmit={handlePostSubmit}
          handleDeletePost={handleDeletePost}
        />
      )}
    </div>
  );
}