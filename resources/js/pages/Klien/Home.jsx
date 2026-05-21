// resources/js/pages/Klien/Home.jsx

import React, { useEffect, useState } from "react";
import SidebarKlien from "../../components/SidebarKlien";
import NavbarKlien from "../../components/NavbarKlien";
import axios from "axios";

export default function Home({ onLogout }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Ambil data user login
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // Ambil data pesanan hari ini
    axios
      .get("/api/klien/orders-today")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  const totalAktif = orders.length;
  const estimasiTiba = orders.length
    ? orders[0].estimated_time // contoh, ambil dari pesanan pertama
    : "-";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        background: "#081225",
      }}
    >
      {/* Sidebar */}
      <SidebarKlien onLogout={onLogout} />

      {/* Konten utama */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          background: "#0b1730",
          margin: 0,
          padding: 0,
        }}
      >
        {/* Navbar */}
        <NavbarKlien title="Beranda" />

        {/* Main */}
        <div
          style={{
            flex: 1,
            padding: "30px",
            background: "linear-gradient(180deg,#0b1730 0%,#102347 100%)",
            color: "#f8fafc",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: "30px" }}>
            <h1
              style={{
                fontSize: "30px",
                fontWeight: "700",
                margin: 0,
                color: "#ffffff",
              }}
            >
              Selamat Pagi, {user?.name || "Klien"} 👋
            </h1>
            <p
              style={{
                marginTop: "10px",
                color: "#94a3b8",
                fontSize: "15px",
              }}
            >
              Pesanan harian Anda aktif hari ini
            </p>
          </div>

          {/* Card Statistik */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <div style={cardStyle}>
              <div style={cardLabel}>Pesanan Aktif</div>
              <div style={cardNumber}>{totalAktif}</div>
            </div>
            <div style={cardStyle}>
              <div style={cardLabel}>Estimasi Tiba</div>
              <div style={cardNumber}>{estimasiTiba}</div>
            </div>
          </div>

          {/* Status Pesanan */}
          <div
            style={{
              width: "100%",
              background: "#132544",
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {orders.map((o, idx) => (
              <div
                key={o.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3fr 1fr",
                  padding: "18px 24px",
                  alignItems: "center",
                  borderBottom:
                    idx !== orders.length - 1
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "none",
                  transition: "0.3s",
                }}
              >
                <div style={{ color: "#93c5fd", fontSize: "14px" }}>
                  {o.time}
                </div>
                <div style={{ color: "#f8fafc", fontSize: "14px" }}>
                  {o.status_detail}
                </div>
                <div>
                  <span
                    style={{
                      padding: "7px 14px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: o.status === "delivered" ? "#16a34a" : "#f59e0b",
                      color: "#fff",
                    }}
                  >
                    {o.status === "delivered" ? "Terkirim" : "Menunggu"}
                  </span>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "#94a3b8",
                }}
              >
                Tidak ada pesanan hari ini
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "linear-gradient(135deg,#17306a 0%,#1d4ed8 100%)",
  borderRadius: "18px",
  padding: "24px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
  border: "1px solid rgba(255,255,255,0.05)",
};

const cardLabel = {
  fontSize: "14px",
  color: "#cbd5e1",
  marginBottom: "10px",
};

const cardNumber = {
  fontSize: "30px",
  fontWeight: "700",
  color: "#ffffff",
};