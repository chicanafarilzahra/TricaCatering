// KurirLayout.jsx
import React from "react";
import SidebarKurir from "../components/SidebarKurir";
import NavbarKurir from "../components/NavbarKurir";
import { FaBell } from "react-icons/fa"; // <-- tambahkan ini

export default function KurirLayout({ children, title, onLogout }) {
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", background: "#071028" }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: 250,
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 1000,
          background: "linear-gradient(180deg,#081120 0%,#0f1f45 100%)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <SidebarKurir onLogout={onLogout} />
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          marginLeft: 250,
          flex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* NAVBAR */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 999,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            height: 60,
            background: "#071028",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <NavbarKurir title={title} />
          {/* Notifikasi 1 icon di kanan */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <FaBell style={{ fontSize: 20, color: "#fff" }} />
          </div>
        </div>

        {/* PAGE */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            background: "linear-gradient(180deg,#071028 0%,#08152f 100%)",
            padding: 0,
            margin: 0,
            color: "#fff",
          }}
        >
          <div style={{ width: "100%", maxWidth: "1400px", margin: 0, padding: 24, boxSizing: "border-box" }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}