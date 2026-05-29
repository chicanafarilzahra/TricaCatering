// resources/js/pages/Klien/PesananSaya.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarKlien from "../../components/SidebarKlien";
import NavbarKlien from "../../components/NavbarKlien";

export default function PesananSaya() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("/api/klien/orders", { withCredentials: true })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return { bg: "#fcd34d33", color: "#f59e0b", text: "Menunggu" };
      case "on_delivery":
        return { bg: "#fcd34d33", color: "#f59e0b", text: "Dikirim" };
      case "delivered":
        return { bg: "#4ade8033", color: "#16a34a", text: "Diterima" };
      default:
        return { bg: "#d1d5db33", color: "#6b7280", text: "Unknown" };
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f2ee" }}>
      <Sidebar role="klien" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar role="klien" />

        <main style={{ flex: 1, padding: "30px", boxSizing: "border-box" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px", color: "#332211" }}>
            Pesanan Saya
          </h1>
          <p style={{ marginBottom: "20px", color: "#8b6f4b", fontSize: "15px" }}>
            Riwayat dan status semua pesanan Anda — harga sudah termasuk biaya kurir
          </p>

          <div
            style={{
              background: "#fff7f0",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              border: "1px solid #e0d7c3",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.5fr 1fr 2fr 1fr 1fr 1fr",
                padding: "16px 24px",
                fontWeight: "600",
                color: "#7c5e3e",
                background: "#f1e8d8",
                fontSize: "14px",
              }}
            >
              <div>#</div>
              <div>Tanggal</div>
              <div>Jenis</div>
              <div>Menu</div>
              <div>Porsi</div>
              <div>Total (Termasuk Kurir)</div>
              <div>Status</div>
            </div>

            {orders.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#9e8570" }}>
                Belum ada pesanan
              </div>
            ) : (
              orders.map((o, idx) => {
                const status = getStatusStyle(o.status);
                return (
                  <div
                    key={o.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1.5fr 1fr 2fr 1fr 1fr 1fr",
                      padding: "16px 24px",
                      borderBottom:
                        idx !== orders.length - 1
                          ? "1px solid rgba(0,0,0,0.05)"
                          : "none",
                      fontSize: "14px",
                      alignItems: "center",
                    }}
                  >
                    <div>{o.id}</div>
                    <div>{new Date(o.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</div>
                    <div>{o.type}</div>
                    <div>{o.menu?.name}</div>
                    <div>{o.quantity}</div>
                    <div>
                      <b>Rp {o.total?.toLocaleString()}</b>
                    </div>
                    <div
                      style={{
                        background: status.bg,
                        color: status.color,
                        padding: "6px 12px",
                        borderRadius: "999px",
                        fontWeight: "600",
                        textAlign: "center",
                        fontSize: "12px",
                      }}
                    >
                      {status.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}