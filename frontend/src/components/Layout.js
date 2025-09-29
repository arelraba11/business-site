import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout-main">{children}</main>
      <Footer />
    </div>
  );
}