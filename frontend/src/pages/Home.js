import React, { useEffect, useState } from "react";
import "../styles/Pages.css";
import "../styles/Home.css";

import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import HeroSection from "../components/HeroSection";
import PostsSection from "../components/PostsSection";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [businessName, setBusinessName] = useState("");
  const [posts, setPosts] = useState([]);

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
    } catch (err) {
      console.error("Failed to load posts", err);
      setPosts([]);
    }
  }

  const handleBookAppointment = () => {
    if (!token) navigate("/login");
    else navigate("/appointments");
  };

  return (
    <div className="home-container">
      <HeroSection businessName={businessName} onBook={handleBookAppointment} />
      <PostsSection posts={posts} />
    </div>
  );
}