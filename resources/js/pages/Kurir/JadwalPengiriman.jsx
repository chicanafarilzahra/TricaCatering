// resources/js/pages/Kurir/JadwalPengiriman.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock3, MapPin, Truck, CheckCircle2 } from "lucide-react";
import KurirLayout from "../../layouts/KurirLayout";
import { FaBell } from "react-icons/fa";

export default function JadwalPengiriman({ onLogout }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("/api/kurir/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  const getStatus = (status) => {
    switch (status) {
      case "pending":
        return { text: "Menunggu", bg: "rgba(59,130,246,0.15)", color: "#60a5fa" };
      case "on_delivery":
        return { text: "Sedang Dikirim", bg: "rgba(245,158,11,0.15)", color: "#fbbf24" };
      case "delivered":
        return { text: "Selesai", bg: "rgba(34,197,94,0.15)", color: "#4ade80" };
      default:
        return { text: "Unknown", bg: "rgba(107,114,128,0.15)", color: "#d1d5db" };
    }
  };

  return (
    <KurirLayout title="Jadwal Pengiriman" onLogout={onLogout}>
      {/* Container full viewport */}
      <div style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        overflowX: "hidden",
        overflowY: "auto"
      }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: "#ffffff" }}>
            Jadwal Pengiriman
          </h1>
          <p style={{ margin: "8px 0 0", color: "#94a3b8", fontSize: 15, lineHeight: 1.6 }}>
            Monitor seluruh aktivitas pengiriman kurir hari ini secara real-time.
          </p>
        </div>

        {/* Stat Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24
        }}>
          <StatCard title="Total Pengiriman" value={orders.length} icon={<Truck size={20} />} color="#3b82f6" />
          <StatCard title="Sedang Dikirim" value={orders.filter(o => o.status === "on_delivery").length} icon={<Clock3 size={20} />} color="#f59e0b" />
          <StatCard title="Selesai" value={orders.filter(o => o.status === "delivered").length} icon={<CheckCircle2 size={20} />} color="#22c55e" />
        </div>

        {/* Table */}
        <div style={{
          width: "100%",
          background: "linear-gradient(145deg, rgba(17,24,39,0.98), rgba(30,41,59,0.98))",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 22,
          boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
          overflowX: "hidden"
        }}>
          {/* Table Header */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#ffffff" }}>Delivery Schedule</h2>
            <p style={{ margin: "6px 0 0", color: "#94a3b8", fontSize: 14 }}>Daftar lengkap pengiriman aktif kurir.</p>
          </div>

          {/* Table responsive, tanpa horizontal scroll */}
          <div style={{ width: "100%", overflowX: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", color: "#f8fafc", tableLayout: "fixed" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                  <th style={thStyle}>No</th>
                  <th style={thStyle}>Klien</th>
                  <th style={thStyle}>Pesanan</th>
                  <th style={thStyle}>Jenis</th>
                  <th style={thStyle}>Biaya</th>
                  <th style={thStyle}>Waktu</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={noDataStyle}>Tidak ada jadwal pengiriman.</td>
                  </tr>
                ) : (
                  orders.map((o, idx) => {
                    const status = getStatus(o.status);
                    return (
                      <tr key={o.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={tdStyle}>{idx + 1}</td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                            <div style={{
                              width: 40, height: 40, borderRadius: 12,
                              background: "rgba(59,130,246,0.12)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "#60a5fa", flexShrink: 0
                            }}>
                              <MapPin size={18} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 4 }}>{o.client?.name}</div>
                              <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{o.delivery_address}</div>
                            </div>
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ fontWeight: 600, color: "#fff", marginBottom: 4 }}>{o.menu?.name}</div>
                          <div style={{ fontSize: 13, color: "#94a3b8" }}>{o.quantity} porsi</div>
                        </td>
                        <td style={tdStyle}><span style={{ padding: "6px 12px", borderRadius: 999, background: "rgba(139,92,246,0.14)", color: "#c4b5fd", fontSize: 12, fontWeight: 700 }}>{o.type}</span></td>
                        <td style={tdStyle}><span style={{ fontWeight: 700, color: "#fff" }}>Rp {(o.delivery_fee || 0).toLocaleString()}</span></td>
                        <td style={tdStyle}>{o.delivery_time}</td>
                        <td style={tdStyle}><span style={{ padding: "7px 14px", borderRadius: 999, background: status.bg, color: status.color, fontWeight: 700, fontSize: 12 }}>{status.text}</span></td>
                        <td style={tdStyle}>{o.status === "pending" && <button style={btnStyle}>Konfirmasi</button>}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </KurirLayout>
  );
}

// =========================
// Styles
// =========================
function StatCard({ title, value, icon, color }) {
  return (
    <div style={{
      background: "linear-gradient(145deg, rgba(17,24,39,0.98), rgba(30,41,59,0.98))",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 20,
      padding: 22,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
    }}>
      <div>
        <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 8, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: "#fff" }}>{value}</div>
      </div>
      <div style={{
        width: 52, height: 52, borderRadius: 16,
        background: `${color}15`,
        border: `1px solid ${color}25`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color
      }}>{icon}</div>
    </div>
  );
}

const thStyle = { padding: "16px 18px", textAlign: "left", color: "#cbd5e1", fontWeight: 700, fontSize: 13 };
const tdStyle = { padding: "18px", color: "#f8fafc", fontSize: 14, verticalAlign: "top" };
const btnStyle = { border: "none", height: 40, padding: "0 16px", borderRadius: 12, background: "linear-gradient(135deg,#2563eb,#3b82f6)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 18px rgba(37,99,235,0.25)" };
const noDataStyle = { textAlign: "center", padding: "60px 0", color: "#94a3b8", fontSize: 15 };