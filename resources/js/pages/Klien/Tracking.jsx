import React, { useEffect, useState } from "react";
import axios from "axios";

import SidebarKlien from "../../components/SidebarKlien";
import NavbarKlien from "../../components/NavbarKlien";

export default function Tracking() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("/api/klien/lacak") // endpoint API tracking pengiriman
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0f172a" }}>
      <SidebarKlien />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <NavbarKlien title="Tracking Pengiriman" />
        <div style={{ padding: "24px", overflowY: "auto" }}>
          <h2 style={{ color: "#ffffff", marginBottom: "16px" }}>
            Status Pengiriman
          </h2>
          {orders.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>Tidak ada pengiriman aktif.</p>
          ) : (
            <table style={{ width: "100%", color: "#ffffff", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Pesanan</th>
                  <th>Status</th>
                  <th>Kurir</th>
                  <th>Estimasi Tiba</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, idx) => (
                  <tr key={o.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <td>{idx + 1}</td>
                    <td>{o.menu?.name} ({o.quantity})</td>
                    <td>{o.status}</td>
                    <td>{o.courier?.name}</td>
                    <td>{o.delivery_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}