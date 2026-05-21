// resources/js/pages/Kurir/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTruck, FaCheckCircle, FaClock, FaMoneyBillWave, FaBell } from "react-icons/fa";
import SidebarKurir from "../../components/SidebarKurir";
import NavbarKurir from "../../components/NavbarKurir";

export default function KurirHome({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    axios.get("/api/kurir/orders")
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  const totalPengiriman = orders.length;
  const selesai = orders.filter(o => o.status === "delivered").length;
  const menunggu = orders.filter(o => o.status === "pending").length;
  const totalBiaya = orders.reduce((sum, o) => sum + (o.delivery_fee || 0), 0);

  return (
    <div style={{
      display: "flex",
      width: "100vw",
      height: "100vh",
      margin: 0,
      padding: 0,
      overflow: "hidden",
      background: "#071028"
    }}>
      {/* Sidebar fix */}
      <div style={{
        width: 260,
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000
      }}>
        <SidebarKurir onLogout={onLogout} />
      </div>

      {/* Main content */}
      <div style={{
        marginLeft: 260,
        width: "calc(100% - 260px)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>{/* Navbar sticky dengan 1 notifikasi di kanan judul */}
        <div style={{
        position: "sticky",
        top: 0,
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: 60,
        background: "#071028",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "0 24px",
        boxSizing: "border-box"
        }}>
        <NavbarKurir title="Dashboard" />
        <div style={{ marginLeft: 16, display: "flex", alignItems: "center" }}>
        </div>
        </div>

        {/* Konten scrollable vertikal */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          background: "#071028",
          color: "#fff",
        }}>
          <div style={{ padding: 24, minHeight: "100%" }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>
                Selamat Pagi, {user?.name || "Kurir"} 
              </h2>
              <p style={{ fontSize: 15, color: "#94a3b8" }}>
                {menunggu} pengiriman menunggu Anda hari ini
              </p>
            </div>

            {/* Stat Cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 16,
              marginBottom: 24
            }}>
              <StatCard title="Total Pengiriman" value={totalPengiriman} icon={<FaTruck />} />
              <StatCard title="Selesai" value={selesai} icon={<FaCheckCircle />} />
              <StatCard title="Menunggu" value={menunggu} icon={<FaClock />} />
              <StatCard title="Total Biaya" value={`Rp ${totalBiaya.toLocaleString()}`} icon={<FaMoneyBillWave />} />
            </div>

            {/* Table */}
            <div style={{
              background: "#182338",
              borderRadius: 16,
              padding: 16,
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              overflowX: "hidden"
            }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 16 }}>
                Pengiriman Hari Ini
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse", color: "#f8fafc" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    <th style={thStyle}>No</th>
                    <th style={thStyle}>Klien</th>
                    <th style={thStyle}>Pesanan</th>
                    <th style={thStyle}>Biaya</th>
                    <th style={thStyle}>Waktu</th>
                    <th style={thStyle}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, idx) => (
                    <tr key={o.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={tdStyle}>{idx + 1}</td>
                      <td style={tdStyle}>{o.client?.name}</td>
                      <td style={tdStyle}>{o.menu?.name} ({o.quantity} porsi)</td>
                      <td style={tdStyle}>Rp {(o.delivery_fee || 0).toLocaleString()}</td>
                      <td style={tdStyle}>{o.delivery_time}</td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: "6px 12px",
                          borderRadius: "999px",
                          fontSize: 13,
                          fontWeight: 600,
                          background: o.status === "delivered" ? "rgba(34,197,94,0.2)" : "rgba(250,204,21,0.18)",
                          color: o.status === "delivered" ? "#4ade80" : "#facc15"
                        }}>
                          {o.status === "delivered" ? "Selesai" : "Menunggu"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div style={{ textAlign: "center", padding: 24, color: "#94a3b8" }}>Tidak ada data pengiriman.</div>
              )}
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
    borderRadius: 16,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    boxShadow: "0 4px 20px rgba(0,0,0,0.25)"
  }}>
    <div style={{
      width: 50, height: 50,
      borderRadius: 12,
      background: "rgba(59,130,246,0.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#3b82f6",
      fontSize: 22
    }}>{icon}</div>
    <div style={{ fontSize: 14, color: "#94a3b8" }}>{title}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>{value}</div>
  </div>
);

const thStyle = { padding: "12px 8px", textAlign: "left", color: "#cbd5e1", fontSize: 14, fontWeight: 600 };
const tdStyle = { padding: "12px 8px", fontSize: 14, color: "#f8fafc" };