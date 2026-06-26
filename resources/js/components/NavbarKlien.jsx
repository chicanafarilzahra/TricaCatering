// resources/js/components/NavbarKlien.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUtensils,
  FaClipboardList,
  FaTruck,
  FaFileInvoiceDollar,
  FaStar,
  FaBell,
  FaSignOutAlt,
} from "react-icons/fa";

const NAVBAR_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .nk-root * { font-family: 'Inter', system-ui, sans-serif; box-sizing: border-box; }

  .nk-nav-link {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 13px; border-radius: 10px;
    text-decoration: none; font-size: 13px; font-weight: 500;
    color: #64748b; transition: all .18s ease;
    white-space: nowrap;
  }
  .nk-nav-link:hover { color: #94a3b8 !important; background: rgba(255,255,255,0.05) !important; }
  .nk-nav-link.active {
    color: #ffffff !important;
    background: linear-gradient(90deg, #2563eb, #3b82f6) !important;
    font-weight: 600 !important;
    box-shadow: 0 4px 16px rgba(37,99,235,0.3);
  }

  .nk-logout-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 14px; border-radius: 10px; border: none;
    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
    color: #f87171; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all .18s ease;
    font-family: 'Inter', system-ui, sans-serif;
  }
  .nk-logout-btn:hover {
    background: rgba(239,68,68,0.2) !important;
    border-color: rgba(239,68,68,0.4) !important;
    color: #fca5a5 !important;
  }

  .nk-bell-btn {
    width: 38px; height: 38px; border-radius: 10px; border: none;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
    color: #64748b; display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 15px; transition: all .18s ease;
    position: relative;
  }
  .nk-bell-btn:hover { background: rgba(255,255,255,0.08) !important; color: #94a3b8 !important; }

  .nk-avatar {
    width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 14px; color: #fff;
    border: 1px solid rgba(59,130,246,0.3);
  }

  .nk-dot { animation: nk-pulse 2s ease-in-out infinite; }
  @keyframes nk-pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
`;

export default function NavbarKlien({ title }) {
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <style>{NAVBAR_CSS}</style>
      <nav
        className="nk-root"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px",
          height: "68px",
          background: "linear-gradient(180deg, #0d1117 0%, #0f172a 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          position: "sticky", top: 0, zIndex: 100,
          backdropFilter: "blur(12px)",
          gap: "16px",
        }}
      >
        {/* ── LOGO ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "11px", flexShrink: 0 }}>
          <div style={{
            width: "42px", height: "42px", borderRadius: "12px",
            background: "linear-gradient(135deg, #2563eb, #3b82f6)",
            display: "flex", justifyContent: "center", alignItems: "center",
            fontWeight: "800", fontSize: "16px", color: "#fff",
            boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
            letterSpacing: "-0.5px",
          }}>
            TC
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "15px", color: "#fff", letterSpacing: "-0.3px" }}>
              TricaCatering
            </div>
            <div style={{ fontSize: "11px", color: "#475569", fontWeight: "500" }}>
              Client Dashboard
            </div>
          </div>
        </div>

        {/* ── NAV LINKS ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap",
          flex: 1, justifyContent: "center",
        }}>
          <NavItem to="/klien"                  icon={<FaHome />}             label="Home" end />
          <NavItem to="/klien/pesan"            icon={<FaUtensils />}         label="Pesan Makan" />
          <NavItem to="/klien/pesanan"          icon={<FaClipboardList />}    label="Pesanan" />
          <NavItem to="/klien/lacak-pengiriman" icon={<FaTruck />}            label="Tracking" />
          <NavItem to="/klien/invoice"          icon={<FaFileInvoiceDollar />} label="Invoice" />
          <NavItem to="/klien/ulasan"           icon={<FaStar />}             label="Ulasan" />
        </div>

        {/* ── USER SECTION ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>

          {/* Bell */}
          <button className="nk-bell-btn">
            <FaBell />
            {/* Notification dot */}
            <span style={{
              position: "absolute", top: "8px", right: "8px",
              width: "7px", height: "7px", borderRadius: "999px",
              background: "#3b82f6", border: "1.5px solid #0f172a",
            }} />
          </button>

          {/* Divider */}
          <div style={{ width: "1px", height: "28px", background: "rgba(255,255,255,0.07)" }} />

          {/* Avatar + name */}
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <div className="nk-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: "700", fontSize: "13px", lineHeight: 1.2 }}>
                {user?.name || "User"}
              </div>
              <div style={{
                fontSize: "11px", color: "#475569", fontWeight: "500",
                display: "flex", alignItems: "center", gap: "5px",
              }}>
                <span className="nk-dot" style={{
                  width: "5px", height: "5px", borderRadius: "999px",
                  background: "#22c55e", display: "inline-block",
                }} />
                {user?.role || "Klien"}
              </div>
            </div>
          </div>

          {/* Logout */}
          <button className="nk-logout-btn" onClick={handleLogout}>
            <FaSignOutAlt style={{ fontSize: "12px" }} />
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}

function NavItem({ to, icon, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => "nk-nav-link" + (isActive ? " active" : "")}
    >
      <span style={{ fontSize: "13px" }}>{icon}</span>
      {label}
    </NavLink>
  );
}