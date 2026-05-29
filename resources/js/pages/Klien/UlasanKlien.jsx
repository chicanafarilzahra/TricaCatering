import React, { useEffect, useState } from "react";
import axios from "axios";

import SidebarKlien from "../../components/SidebarKlien";
import NavbarKlien from "../../components/NavbarKlien";

export default function UlasanKlien() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get("/api/klien/ulasan") // endpoint API ulasan
      .then((res) => setReviews(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0f172a" }}>
      <SidebarKlien />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <NavbarKlien title="Ulasan & Komplain" />
        <div style={{ padding: "24px", overflowY: "auto" }}>
          <h2 style={{ color: "#ffffff" }}>Ulasan & Komplain</h2>
          {reviews.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>Belum ada ulasan atau komplain.</p>
          ) : (
            <ul style={{ color: "#ffffff" }}>
              {reviews.map((r) => (
                <li key={r.id} style={{ marginBottom: "12px" }}>
                  <strong>{r.title}</strong>: {r.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}