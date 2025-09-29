import React from "react";

export default function DashboardTabs({ activeTab, setActiveTab }) {
  return (
    <div className="dashboard-tabs">
      <button
        className={activeTab === "business" ? "active" : ""}
        onClick={() => setActiveTab("business")}
      >
        Business Info
      </button>
      <button
        className={activeTab === "appointments" ? "active" : ""}
        onClick={() => setActiveTab("appointments")}
      >
        Appointments
      </button>
      <button
        className={activeTab === "services" ? "active" : ""}
        onClick={() => setActiveTab("services")}
      >
        Services
      </button>
      <button
        className={activeTab === "posts" ? "active" : ""}
        onClick={() => setActiveTab("posts")}
      >
        Posts
      </button>
    </div>
  );
}