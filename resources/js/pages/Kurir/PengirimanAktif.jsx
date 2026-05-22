// resources/js/pages/Kurir/PengirimanAktif.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

import SidebarKurir from "../../components/SidebarKurir";
import NavbarKurir from "../../components/NavbarKurir";
import { FaTruck, FaClock, FaCheckCircle } from "react-icons/fa";

export default function PengirimanAktif({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    axios
      .get("/api/kurir/orders")
      .then((res) =>
        setOrders(res.data.filter((o) => o.status === "on_delivery"))
      )
      .catch((err) => console.error(err));
  }, []);

  const total = orders.length;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        overflow: "hidden",
        background: "#071028",
      }}
    >
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
        <div style={{ width: "100%", height: "78px", flexShrink: 0 }}>
          <NavbarKurir title="Pengiriman Aktif" />
        </div>

        {/* CONTENT */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "24px",
            background: "#071028",
            color: "#ffffff",
          }}
        >
          {/* HEADER */}
          <div style={{ marginBottom: "24px" }}>
            <h2
              style={{
                margin: 0,
                fontSize: "34px",
                fontWeight: "800",
                color: "#ffffff",
              }}
            >
              Pengiriman Aktif
            </h2>
            <p
              style={{
                marginTop: "8px",
                color: "#94a3b8",
                fontSize: "15px",
              }}
            >
              Daftar pengiriman yang sedang berjalan hari ini
            </p>
          </div>

          {/* STATS CARD */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <StatCard title="Total Pengiriman Aktif" value={total} icon={<FaTruck />} />
          </div>

          {/* TABLE */}
          <div
            style={{
              background: "#182338",
              borderRadius: "18px",
              padding: "20px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: "18px",
                fontSize: "22px",
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              Pengiriman Aktif Hari Ini
            </h3>

            <div style={{ width: "100%", overflowX: "hidden" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  color: "#f8fafc",
                }}
              >
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    <th style={thStyle}>No</th>
                    <th style={thStyle}>Klien</th>
                    <th style={thStyle}>Pesanan</th>
                    <th style={thStyle}>Alamat</th>
                    <th style={thStyle}>Waktu</th>
                    <th style={thStyle}>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}>
                        Tidak ada pengiriman aktif hari ini.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o, idx) => (
                      <tr key={o.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={tdStyle}>{idx + 1}</td>
                        <td style={tdStyle}>{o.client?.name}</td>
                        <td style={tdStyle}>
                          {o.menu?.name} ({o.quantity} porsi)
                        </td>
                        <td style={tdStyle}>{o.delivery_address}</td>
                        <td style={tdStyle}>{o.delivery_time}</td>
                        <td style={tdStyle}>
                          <span
                            style={{
                              background: "#f59e0b",
                              color: "#fff",
                              padding: "6px 14px",
                              borderRadius: "999px",
                              fontWeight: 600,
                              fontSize: "13px",
                            }}
                          >
                            Sedang Dikirim
                          </span>
                        </td>
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

/* CARD */
const StatCard = ({ title, value, icon }) => (
  <div
    style={{
      background: "#182338",
      borderRadius: "16px",
      padding: "18px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
    }}
  >
    <div
      style={{
        width: "48px",
        height: "48px",
        borderRadius: "14px",
        background: "rgba(59,130,246,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#3b82f6",
        fontSize: "20px",
      }}
    >
      {icon}
    </div>

    <div style={{ fontSize: "14px", color: "#94a3b8" }}>{title}</div>

    <div style={{ fontSize: "30px", fontWeight: "800", color: "#ffffff" }}>{value}</div>
  </div>
);

const thStyle = {
  padding: "14px 10px",
  textAlign: "left",
  color: "#cbd5e1",
  fontSize: "13px",
  fontWeight: "700",
};

const tdStyle = {
  padding: "16px 10px",
  fontSize: "14px",
  color: "#f8fafc",
};