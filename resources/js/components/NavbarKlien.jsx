// resources/js/components/NavbarKlien.jsx

import React from "react";
import { FaBell } from "react-icons/fa";

export default function NavbarKlien({
  title = "Beranda",
  subtitle = "Selamat datang kembali 👋",
}) {
  return (
    <header
      style={{
        width: "100%",
        height: "105px",
        background: "linear-gradient(90deg,#1e3a8a 0%,#233f91 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 34px",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      {/* LEFT */}
      <div>
        <h1
          style={{
            margin: 0,
            color: "#ffffff",
            fontSize: "28px",
            fontWeight: "800",
            lineHeight: 1.1,
            letterSpacing: "-0.5px",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            margin: "8px 0 0",
            color: "rgba(255,255,255,0.75)",
            fontSize: "15px",
            fontWeight: "400",
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* RIGHT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* NOTIF */}
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: "20px",
            cursor: "pointer",
            transition: "0.2s",
          }}
        >
          <FaBell />
        </div>

        {/* PROFILE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(255,255,255,0.05)",
            padding: "10px 14px",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#3b82f6,#2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "700",
              fontSize: "16px",
              textTransform: "uppercase",
            }}
          >
            D
          </div>

          <div>
            <div
              style={{
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "700",
                lineHeight: 1,
              }}
            >
              Dwiky
            </div>

            <div
              style={{
                marginTop: "5px",
                color: "#94a3b8",
                fontSize: "12px",
              }}
            >
              Pelanggan Catering
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}