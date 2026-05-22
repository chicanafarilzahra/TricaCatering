// resources/js/pages/Kurir/PengirimanAktif.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaTruck,
  FaMoneyBillWave,
  FaBell,
} from "react-icons/fa";

import SidebarKurir from "../../components/SidebarKurir";
import NavbarKurir from "../../components/NavbarKurir";

export default function PengirimanAktif({ onLogout }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("/api/kurir/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Filter pengiriman aktif
  const activeOrders = orders.filter((o) => o.status === "on_delivery");
  const totalBiaya = activeOrders.reduce((sum, o) => sum + (o.delivery_fee || 0), 0);

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", overflow: "hidden", background: "#071028" }}>
      {/* SIDEBAR */}
      <div style={{ width: "260px", height: "100%", flexShrink: 0 }}>
        <SidebarKurir onLogout={onLogout} />
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
{/* NAVBAR */}
<div
  style={{
    width: "100%",          // full width dari main content
    height: "78px",
    flexShrink: 0,
    position: "sticky",
    top: 0,
    zIndex: 1000,
  }}
>
  <NavbarKurir title="Pengiriman Aktif" />
</div>

        {/* CONTENT */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "24px", background: "#071028", color: "#ffffff" }}>
          {/* HEADER */}
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ margin: 0, fontSize: "34px", fontWeight: "800", color: "#ffffff" }}>
              Pengiriman Aktif
            </h2>
            <p style={{ marginTop: "8px", color: "#94a3b8", fontSize: "15px" }}>
              Pantau seluruh pengiriman yang sedang berlangsung hari ini.
            </p>
          </div>

          {/* STAT CARD */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px", marginBottom: "24px" }}>
            <StatCard title="Pengiriman Aktif" value={activeOrders.length} icon={<FaTruck size={26} />} />
            <StatCard title="Total Biaya" value={`Rp ${totalBiaya.toLocaleString()}`} icon={<FaMoneyBillWave size={26} />} />
          </div>

          {/* TABLE */}
          <div style={{ background: "#182338", borderRadius: "18px", padding: "20px", boxShadow: "0 8px 25px rgba(0,0,0,0.25)", overflow: "hidden" }}>
            <h3 style={{ marginTop: 0, marginBottom: "18px", fontSize: "22px", fontWeight: "700", color: "#ffffff" }}>
              Daftar Pengiriman Aktif
            </h3>

            <div style={{ width: "100%", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", color: "#f8fafc" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    <th style={thStyle}>No</th>
                    <th style={thStyle}>Klien</th>
                    <th style={thStyle}>Pesanan</th>
                    <th style={thStyle}>Alamat</th>
                    <th style={thStyle}>Waktu</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Biaya</th>
                  </tr>
                </thead>
                <tbody>
                  {activeOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}>
                        Tidak ada pengiriman aktif.
                      </td>
                    </tr>
                  ) : (
                    activeOrders.map((o, idx) => (
                      <tr key={o.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={tdStyle}>{idx + 1}</td>
                        <td style={tdStyle}>{o.client?.name}</td>
                        <td style={tdStyle}>{o.menu?.name} ({o.quantity} porsi)</td>
                        <td style={{ ...tdStyle, maxWidth: "220px" }}>{o.delivery_address}</td>
                        <td style={tdStyle}>{o.delivery_time}</td>
                        <td style={tdStyle}>
                          <span style={{ padding: "6px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700", background: "rgba(245,158,11,0.18)", color: "#fbbf24" }}>
                            Sedang Dikirim
                          </span>
                        </td>
                        <td style={tdStyle}>Rp {(o.delivery_fee || 0).toLocaleString()}</td>
                      </tr>
                    ))
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
    <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(59,130,246,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", fontSize: "20px" }}>
      {icon}
    </div>
    <div style={{ fontSize: "14px", color: "#94a3b8" }}>{title}</div>
    <div style={{ fontSize: "30px", fontWeight: "800", color: "#ffffff" }}>{value}</div>
  </div>
);

const thStyle = { padding: "14px 10px", textAlign: "left", color: "#cbd5e1", fontSize: "13px", fontWeight: "700" };
const tdStyle = { padding: "16px 10px", fontSize: "14px", color: "#f8fafc" };