import React, { useEffect, useState } from "react";
import axios from "axios";

import SidebarKlien from "../../components/SidebarKlien";
import NavbarKlien from "../../components/NavbarKlien";

export default function PesanMakan() {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    axios
      .get("/api/klien/menus") // endpoint API untuk daftar menu
      .then((res) => setMenus(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0f172a" }}>
      <SidebarKlien />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <NavbarKlien title="Pesan Makanan" />
        <div style={{ padding: "24px", overflowY: "auto" }}>
          <h2 style={{ color: "#ffffff", marginBottom: "16px" }}>
            Daftar Menu
          </h2>
          <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))" }}>
            {menus.map((menu) => (
              <div
                key={menu.id}
                style={{
                  background: "#182338",
                  borderRadius: "16px",
                  padding: "16px",
                  color: "#ffffff",
                }}
              >
                <h3>{menu.name}</h3>
                <p>{menu.description}</p>
                <p>Rp {menu.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}