// resources/js/pages/Kurir/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaMoneyBillWave,
  FaBell,
} from "react-icons/fa";

import SidebarKurir from "../../components/SidebarKurir";
import NavbarKurir from "../../components/NavbarKurir";

export default function KurirHome({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    axios
      .get("/kurir/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  const totalPengiriman = orders.length;
  const selesai = orders.filter((o) => o.status === "delivered").length;
  const menunggu = orders.filter((o) => o.status === "pending").length;
  const totalBiaya = orders.reduce((sum, o) => sum + (o.delivery_fee || 0), 0);

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", overflow: "hidden", background: "#071028" }}>
      {/* SIDEBAR */}
      <div style={{ width: "260px", height: "100%", flexShrink: 0 }}>
        <SidebarKurir onLogout={onLogout} />
      </div>

      {/* MAIN */}
<div
  style={{
    flex: 1,
    minWidth: 0,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    background: "#071028",
  }}
>
  {/* NAVBAR */}
  <div
    style={{
      height: "72px",
      flexShrink: 0,
      width: "100%", // full width main content
      background: "linear-gradient(90deg,#17306a 0%,#1f3f8b 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      boxSizing: "border-box",
    }}
  >
    <div>
      <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, margin: 0 }}>
        Dashboard
      </h1>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: "rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <FaBell style={{ color: "#fff", fontSize: 18 }} />
      </div>
    </div>
  </div>

        {/* CONTENT */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "26px", background: "#071028", color: "#ffffff" }}>
          {/* HEADER */}
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ margin: 0, fontSize: "34px", fontWeight: "800", color: "#ffffff", lineHeight: 1.2 }}>
              Selamat Pagi, {user?.name || "Kurir"}
            </h1>
            <p style={{ marginTop: "8px", color: "#94a3b8", fontSize: "15px" }}>
              {menunggu} pengiriman menunggu Anda hari ini
            </p>
          </div>

          {/* STAT CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "18px", marginBottom: "26px" }}>
            <StatCard title="Total Pengiriman" value={totalPengiriman} icon={<FaTruck />} />
            <StatCard title="Selesai" value={selesai} icon={<FaCheckCircle />} />
            <StatCard title="Menunggu" value={menunggu} icon={<FaClock />} />
            <StatCard title="Total Biaya" value={`Rp ${totalBiaya.toLocaleString()}`} icon={<FaMoneyBillWave />} />
          </div>

          {/* TABLE */}
          <div style={{ background: "#182338", borderRadius: "20px", padding: "22px", boxShadow: "0 8px 24px rgba(0,0,0,0.24)" }}>
            <h3 style={{ marginTop: 0, marginBottom: "18px", fontSize: "22px", fontWeight: "700", color: "#ffffff" }}>
              Pengiriman Hari Ini
            </h3>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", color: "#f8fafc" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                    <th style={thStyle}>No</th>
                    <th style={thStyle}>Klien</th>
                    <th style={thStyle}>Pesanan</th>
                    <th style={thStyle}>Biaya</th>
                    <th style={thStyle}>Waktu</th>
                    <th style={thStyle}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "34px", color: "#94a3b8" }}>
                        Tidak ada data pengiriman.
                      </td>
                    </tr>
                  )}
                  {orders.map((o, idx) => (
                    <tr key={o.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={tdStyle}>{idx + 1}</td>
                      <td style={tdStyle}>{o.client?.name}</td>
                      <td style={tdStyle}>{o.menu?.name} ({o.quantity} porsi)</td>
                      <td style={tdStyle}>Rp {(o.delivery_fee || 0).toLocaleString()}</td>
                      <td style={tdStyle}>{o.delivery_time}</td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: "7px 14px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: "700",
                          background: o.status === "delivered" ? "rgba(34,197,94,0.18)" : "rgba(250,204,21,0.18)",
                          color: o.status === "delivered" ? "#4ade80" : "#facc15",
                        }}>
                          {o.status === "delivered" ? "Selesai" : "Menunggu"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon }) => (
  <div style={{
    background: "#182338",
    borderRadius: "18px",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    minHeight: "165px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.20)"
  }}>
    <div style={{
      width: "50px",
      height: "50px",
      borderRadius: "14px",
      background: "rgba(59,130,246,0.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#3b82f6",
      fontSize: "20px",
    }}>{icon}</div>
    <div style={{ fontSize: "14px", color: "#94a3b8" }}>{title}</div>
    <div style={{ fontSize: "30px", fontWeight: "800", color: "#ffffff", lineHeight: 1.1 }}>{value}</div>
  </div>
);

const thStyle = { padding: "14px 12px", textAlign: "left", color: "#cbd5e1", fontSize: "14px", fontWeight: "700" };
const tdStyle = { padding: "16px 12px", fontSize: "14px", color: "#f8fafc" };