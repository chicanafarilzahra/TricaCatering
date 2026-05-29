// resources/js/components/NavbarKlien.jsx
import React from "react";
import { FaBell, FaSearch } from "react-icons/fa";

export default function NavbarKlien({ title }) {
  return (
    <div
      style={{
        width: "100%",
        height: "78px",
        background: "linear-gradient(90deg,#17306a 0%,#1f3f8b 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 36px",
        boxSizing: "border-box",
        flexShrink: 0,
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <h2 style={{ margin: 0, fontSize: "36px", fontWeight: "800", color: "#fff" }}>
        {title}
      </h2>

      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            cursor: "pointer",
          }}
        >
          <FaBell />
        </div>

        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            cursor: "pointer",
          }}
        >
          <FaSearch />
        </div>
      </div>
    </div>
  );
}