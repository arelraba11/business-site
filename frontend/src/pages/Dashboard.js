import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { generateAllTimeOptions } from "../utils/timeUtils";
import "../styles/Pages.css";

// Components
import DashboardTabs from "../components/dashboard/DashboardTabs";
import BusinessInfo from "../components/dashboard/BusinessInfo";
import AppointmentsSection from "../components/dashboard/AppointmentsSection";
import ServicesSection from "../components/dashboard/ServicesSection";
import PostsSection from "../components/dashboard/PostsSection";

export default function Dashboard() {
  const token = localStorage.getItem("token");

  // State
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [openingHours, setOpeningHours] = useState({});
  const [businessName, setBusinessName] = useState("");
  const [posts, setPosts] = useState([]);

  // Form states
  const [newService, setNewService] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState("");

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("appointments");

  useEffect(() => {
    Promise.all([
      fetchAppointments(),
      fetchServices(),
      fetchBusinessInfo(),
      fetchPosts()
    ]).finally(() => setLoading(false));
  }, []);

  /* ----------------- FETCH DATA ----------------- */
  async function fetchAppointments() {
    try {
      const data = await apiRequest("/appointments", "GET", null, token);
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments", err);
      setError("Failed to load appointments");
    }
  }

  async function fetchServices() {
    try {
      const data = await apiRequest("/business", "GET");
      setServices(data.prices || []);
    } catch (err) {
      console.error("Failed to load services", err);
      setError("Failed to load services");
    }
  }

  async function fetchBusinessInfo() {
    try {
      const data = await apiRequest("/business", "GET");
      setBusinessName(data.name || "");
      setOpeningHours(data.openingHours || {});
    } catch (err) {
      console.error("Failed to load business info", err);
      setError("Failed to load business info");
    }
  }

  async function fetchPosts() {
    try {
      const res = await apiRequest("/posts", "GET");
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load posts", err);
      setError("Failed to load posts");
    }
  }

  /* ----------------- HANDLERS ----------------- */
  async function handleUpdate(id, status) {
    try {
      await apiRequest(`/appointments/${id}`, "PATCH", { status }, token);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch (err) {
      console.error("Failed to update appointment", err);
    }
  }

  async function handleAddService(e) {
    e.preventDefault();
    try {
      const updated = await apiRequest(
        "/business",
        "POST",
        { prices: [...services, { service: newService, price: newPrice }] },
        token
      );
      setServices(updated.prices);
      setNewService("");
      setNewPrice("");
    } catch (err) {
      console.error("Failed to add service", err);
    }
  }

  async function handleDeleteService(serviceId) {
    try {
      const updated = await apiRequest(
        `/business/services/${serviceId}`,
        "DELETE",
        null,
        token
      );
      setServices(updated.prices);
    } catch (err) {
      console.error("Failed to delete service", err);
    }
  }

  async function handleBusinessInfoSubmit(e) {
    e.preventDefault();
    try {
      const updated = await apiRequest(
        "/business",
        "POST",
        { name: businessName, prices: services, openingHours },
        token
      );
      setBusinessName(updated.name || "");
      setServices(updated.prices || []);
      setOpeningHours(updated.openingHours || {});
    } catch (err) {
      console.error("Failed to update business info", err);
    }
  }

  async function handlePostSubmit(e) {
    e.preventDefault();
    try {
      const payload = { content: postContent, image: postImage || undefined };
      const res = await apiRequest("/posts", "POST", payload, token);
      const newPost = res.data ? res.data : res;
      setPosts((prev) => [newPost, ...prev]);
      setPostContent("");
      setPostImage("");
    } catch (err) {
      console.error("Failed to create post", err);
    }
  }

  async function handleDeletePost(id) {
    try {
      await apiRequest(`/posts/${id}`, "DELETE", null, token);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  }

  /* ----------------- UI ----------------- */
  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "business" && (
        <BusinessInfo
          businessName={businessName}
          setBusinessName={setBusinessName}
          openingHours={openingHours}
          setOpeningHours={setOpeningHours}
          handleBusinessInfoSubmit={handleBusinessInfoSubmit}
          timeOptions={generateAllTimeOptions()}
        />
      )}

      {activeTab === "appointments" && (
        <AppointmentsSection
          appointments={appointments}
          handleUpdate={handleUpdate}
        />
      )}

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