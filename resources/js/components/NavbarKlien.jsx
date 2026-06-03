// resources/js/components/NavbarKlien.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUtensils,
  FaClipboardList,
  FaTruck,
  FaFileInvoiceDollar,
  FaStar,
  FaBell,
} from "react-icons/fa";

export default function NavbarKlien({ title }) {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        height: "70px",
        background: "#0f172a",
        color: "#fff",
        gap: "12px",
        flexWrap: "wrap", // agar wrap ketika layar sempit
      }}
    >
      {/* Logo & Dashboard */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "12px",
            background: "#2563eb",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "700",
            fontSize: "18px",
          }}
        >
          TC
        </div>
        <div>
          <div style={{ fontWeight: "700", fontSize: "18px" }}>
            TricaCatering
          </div>
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>
            Client Dashboard
          </div>
        </div>
      </div>

     {/* Menu Links */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
  }}
>
  <NavItem
    to="/klien"
    icon={<FaHome />}
    label="Home"
  />

  <NavItem
    to="/klien/pesan"
    icon={<FaUtensils />}
    label="Pesan Makan"
  />

  <NavItem
    to="/klien/pesanan"
    icon={<FaClipboardList />}
    label="Pesanan Saya"
  />

  <NavItem
    to="/klien/lacak-pengiriman"
    icon={<FaTruck />}
    label="Tracking"
  />

  <NavItem
    to="/klien/invoice"
    icon={<FaFileInvoiceDollar />}
    label="Invoice"
  />

  <NavItem
    to="/klien/ulasan"
    icon={<FaStar />}
    label="Ulasan"
  />
</div>

      {/* User & Notifications */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#2563eb",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textTransform: "uppercase",
            fontWeight: "700",
          }}
        >
          D
        </div>
        <div>
          <div style={{ fontWeight: "700" }}>Dwiky</div>
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>Pelanggan</div>
        </div>
        <button
          style={{
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "700",
          }}
        >
          Logout
        </button>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "#182338",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FaBell />
        </div>
      </div>
    </nav>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 12px",
        borderRadius: "12px",
        textDecoration: "none",
        color: isActive ? "#fff" : "#94a3b8",
        background: isActive ? "#2563eb" : "transparent",
        fontWeight: isActive ? "700" : "500",
        fontSize: "14px",
      })}
    >
      {icon} {label}
    </NavLink>
  );
}