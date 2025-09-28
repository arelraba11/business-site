// pages/Home.js
import React, { useEffect, useState } from "react";
import "../styles/Pages.css";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [businessName, setBusinessName] = useState("");
  const [businessImage, setBusinessImage] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchBusiness();
    fetchPosts();
  }, []);

  async function fetchBusiness() {
    try {
      const data = await apiRequest("/business", "GET");
      setBusinessName(data.name || "Business Name");
      setBusinessImage(data.image || "https://via.placeholder.com/800x400");
    } catch {
      setBusinessName("Business Name");
    }
  }

  async function fetchPosts() {
    try {
      const data = await apiRequest("/posts", "GET");
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      setPosts([]);
    }
  }

  const handleBookAppointment = () => {
    if (!token) navigate("/login");
    else navigate("/appointments");
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section" style={{ backgroundImage: `url(${businessImage})` }}>
        <div className="hero-overlay">
          <h1>{businessName}</h1>
          <button onClick={handleBookAppointment} className="btn btn-primary">
            Book Appointment
          </button>
        </div>
      </div>

      {/* Posts Section */}
      <div className="home-posts">
        <h2>Our Posts</h2>
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              {post.image && <img src={post.image} alt="Post" />}
              <p>{post.content}</p>
            </div>
          ))}
          {posts.length === 0 && <p>No posts available</p>}
        </div>
      </div>
    </div>
  );
}