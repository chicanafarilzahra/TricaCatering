// resources/js/components/SidebarKlien.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUtensils,
  FaClipboardList,
  FaMapMarkerAlt,
  FaFileInvoiceDollar,
  FaCommentDots,
} from "react-icons/fa";

export default function SidebarKlien({ activePage }) {
  const menuItems = [
    { title: "Beranda", icon: <FaHome />, path: "/klien/home" },
    { title: "Pesan Makan", icon: <FaUtensils />, path: "/klien/pesan" },
    { title: "Pesanan Saya", icon: <FaClipboardList />, path: "/klien/pesanan" },
    { title: "Lacak Pengiriman", icon: <FaMapMarkerAlt />, path: "/klien/lacak" },
    { title: "Invoice & Tagihan", icon: <FaFileInvoiceDollar />, path: "/klien/invoice" },
    { title: "Ulasan & Komplain", icon: <FaCommentDots />, path: "/klien/ulasan" },
  ];

  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "#020b26",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px 0",
      }}
    >
      <div>
        <div style={{ padding: "24px 28px", marginBottom: "32px" }}>
          <h1 style={{ color: "#fff", fontSize: "32px", fontWeight: "800", margin: 0 }}>
            TricaCatering
          </h1>
          <p style={{ color: "#94a3b8", marginTop: "8px" }}>Klien Panel</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "12px 20px",
                borderRadius: "12px",
                background: activePage === item.title ? "#1f3f8b" : "transparent",
                color: "#fff",
                textDecoration: "none",
                fontWeight: activePage === item.title ? "700" : "500",
                transition: "0.3s",
              }}
            >
              <div style={{ fontSize: "18px" }}>{item.icon}</div>
              {item.title}
            </Link>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 28px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#2563eb,#3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "18px",
            }}
          >
            SR
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#fff" }}>
              Siti Rahayu
            </div>
            <div style={{ fontSize: "13px", color: "#94a3b8" }}>Klien Harian</div>
          </div>
        </div>
      </div>
    </div>
  );
}