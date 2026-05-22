// resources/js/pages/Kurir/JadwalPengiriman.jsx

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

export default function JadwalPengiriman({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    axios
      .get("/api/kurir/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  const totalPengiriman = orders.length;
  const selesai = orders.filter((o) => o.status === "delivered").length;
  const dikirim = orders.filter((o) => o.status === "on_delivery").length;
  const totalBiaya = orders.reduce((sum, o) => sum + (o.delivery_fee || 0), 0);

  const getStatus = (status) => {
    switch (status) {
      case "pending":
        return { text: "Menunggu", bg: "rgba(59,130,246,0.18)", color: "#60a5fa" };
      case "on_delivery":
        return { text: "Dikirim", bg: "rgba(245,158,11,0.18)", color: "#fbbf24" };
      case "delivered":
        return { text: "Selesai", bg: "rgba(34,197,94,0.18)", color: "#4ade80" };
      default:
        return { text: "Unknown", bg: "rgba(255,255,255,0.1)", color: "#cbd5e1" };
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", overflow: "hidden", background: "#071028" }}>
      {/* SIDEBAR */}
      <div style={{ width: "260px", height: "100%", flexShrink: 0 }}>
        <SidebarKurir onLogout={onLogout} />
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* NAVBAR */}
        <div style={{
          height: "78px",
          flexShrink: 0,
          width: "100%",               // full width main content
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "linear-gradient(90deg,#17306a 0%,#1f3f8b 100%)",
          padding: "0 24px",
          boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          boxSizing: "border-box"
        }}>
          <div>
            <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, margin: 0 }}>
              Jadwal Pengiriman
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}>
              <FaBell style={{ color: "#fff", fontSize: 16 }} />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "24px", background: "#071028", color: "#ffffff" }}>
          {/* HEADER */}
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ margin: 0, fontSize: "34px", fontWeight: "800", color: "#ffffff" }}>
              Jadwal Pengiriman
            </h2>
            <p style={{ marginTop: "8px", color: "#94a3b8", fontSize: "15px" }}>
              Pantau seluruh jadwal pengiriman kurir hari ini.
            </p>
          </div>

          {/* STAT CARD */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: "16px", marginBottom: "24px" }}>
            <StatCard title="Total Pengiriman" value={totalPengiriman} icon={<FaTruck size={26} />} />
            <StatCard title="Sedang Dikirim" value={dikirim} icon={<FaClock size={26} />} />
            <StatCard title="Selesai" value={selesai} icon={<FaCheckCircle size={26} />} />
            <StatCard title="Total Biaya" value={`Rp ${totalBiaya.toLocaleString()}`} icon={<FaMoneyBillWave size={26} />} />
          </div>

          {/* TABLE */}
          <div style={{ background: "#182338", borderRadius: "18px", padding: "20px", boxShadow: "0 8px 25px rgba(0,0,0,0.25)", overflow: "hidden" }}>
            <h3 style={{ marginTop: 0, marginBottom: "18px", fontSize: "22px", fontWeight: "700", color: "#ffffff" }}>Delivery Schedule</h3>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", color: "#f8fafc" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    <th style={thStyle}>No</th>
                    <th style={thStyle}>Klien</th>
                    <th style={thStyle}>Pesanan</th>
                    <th style={thStyle}>Biaya</th>
                    <th style={thStyle}>Waktu</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}>
                        Tidak ada jadwal pengiriman.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o, idx) => {
                      const status = getStatus(o.status);
                      return (
                        <tr key={o.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={tdStyle}>{idx + 1}</td>
                          <td style={tdStyle}>{o.client?.name}</td>
                          <td style={tdStyle}>{o.menu?.name} ({o.quantity} porsi)</td>
                          <td style={tdStyle}>Rp {(o.delivery_fee || 0).toLocaleString()}</td>
                          <td style={tdStyle}>{o.delivery_time}</td>
                          <td style={tdStyle}>
                            <span style={{ padding: "8px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: "700", background: status.bg, color: status.color }}>
                              {status.text}
                            </span>
                          </td>
                          <td style={tdStyle}>
                            {o.status === "pending" && (
                              <button style={{ border: "none", padding: "9px 14px", borderRadius: "10px", background: "linear-gradient(135deg,#2563eb,#3b82f6)", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                                Konfirmasi
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
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
  <div style={{ background: "#182338", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
    <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "rgba(59,130,246,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
      {icon}
    </div>
    <div style={{ fontSize: "14px", color: "#94a3b8" }}>{title}</div>
    <div style={{ fontSize: "30px", fontWeight: "800", color: "#ffffff" }}>{value}</div>
  </div>
);

const thStyle = { padding: "14px 10px", textAlign: "left", color: "#cbd5e1", fontSize: "13px", fontWeight: "700" };
const tdStyle = { padding: "16px 10px", fontSize: "14px", color: "#f8fafc" };