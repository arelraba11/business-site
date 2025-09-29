import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import "../styles/Pages.css";
import "../styles/Home.css";

import HeroSection from "../components/HeroSection";
import PostsSection from "../components/PostsSection";

export default function Home() {
  const navigate = useNavigate();

  // State
  const [businessName, setBusinessName] = useState("Business Name");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  /* ----------------- FETCH DATA ----------------- */
  useEffect(() => {
    fetchBusiness();
    fetchPosts();
  }, []);

  async function fetchBusiness() {
    try {
      const data = await apiRequest("/business", "GET");
      setBusinessName(data.name || "Business Name");
    } catch {
      setBusinessName("Business Name");
    }
  }

  async function fetchPosts() {
    try {
      const res = await apiRequest("/posts", "GET");
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError("Failed to load posts");
      setPosts([]);
    }
  }

  /* ----------------- HANDLERS ----------------- */
  const handleBookAppointment = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/appointments" : "/login");
  };

  /* ----------------- UI ----------------- */
  return (
    <div className="home-container">
      <HeroSection businessName={businessName} onBook={handleBookAppointment} />

      {error && <p className="error">{error}</p>}
      {posts.length === 0 ? (
        <p className="no-posts">No posts available</p>
      ) : (
        <PostsSection posts={posts} />
      )}
    </div>
  );
}