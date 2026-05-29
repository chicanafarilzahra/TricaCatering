// resources/js/components/SidebarKlien.jsx

import React from "react";
import { Link } from "react-router-dom";

import {
    FaHome,
    FaUtensils,
    FaClipboardList,
    FaMapMarkerAlt,
    FaFileInvoiceDollar,
    FaCommentDots,
} from "react-icons/fa";

export default function SidebarKlien() {
    const current = window.location.hash;

    return (
        <div
            style={{
                width: "335px",
                minHeight: "100vh",
                background:
                    "linear-gradient(180deg,#020817 0%,#081633 55%,#0b1736 100%)",
                borderRight: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                flexShrink: 0,
                position: "sticky",
                top: 0,
                overflow: "hidden",
            }}
        >
            {/* LOGO */}
            <div
                style={{
                    padding: "42px 28px 34px",
                    borderBottom:
                        "1px solid rgba(255,255,255,0.05)",
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        fontSize: "34px",
                        fontWeight: "800",
                        color: "#ffffff",
                        lineHeight: 1.1,
                        letterSpacing: "-1px",
                    }}
                >
                    TricaCatering
                </h1>

                <p
                    style={{
                        marginTop: "10px",
                        color: "#94a3b8",
                        fontSize: "17px",
                        fontWeight: "500",
                    }}
                >
                    Klien Panel
                </p>
            </div>

            {/* MENU */}
            <div
                style={{
                    padding: "22px 18px",
                }}
            >
                <MenuItem
                    to="/klien"
                    icon={<FaHome />}
                    title="Beranda"
                    active={
                        current === "#/klien" ||
                        current === "#/klien/"
                    }
                />

               <MenuItem
                to="/klien/pesan"
                icon={<FaUtensils />}
                title="Pesan Makan"
                active={
                  current === "#/klien/pesan" ||
                  current === "#/klien/pesan/"
                }
              />

              <MenuItem
                to="/klien/pesanan"
                icon={<FaClipboardList />}
                title="Pesanan Saya"
                active={
                  current === "#/klien/pesanan" ||
                  current === "#/klien/pesanan/"
                }
              />

                <MenuItem
                    to="/klien/lacak-pengiriman"
                    icon={<FaMapMarkerAlt />}
                    title="Lacak Pengiriman"
                    active={current.includes(
                        "/klien/lacak-pengiriman"
                    )}
                />

                <MenuItem
                    to="/klien/invoice"
                    icon={<FaFileInvoiceDollar />}
                    title="Invoice & Tagihan"
                    active={current.includes("/klien/invoice")}
                />

                <MenuItem
                    to="/klien/ulasan"
                    icon={<FaCommentDots />}
                    title="Ulasan & Komplain"
                    active={current.includes("/klien/ulasan")}
                />
            </div>
        </div>
    );
}

function MenuItem({
    to,
    icon,
    title,
    active,
}) {
    return (
        <Link
            to={to}
            style={{
                textDecoration: "none",
            }}
        >
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "18px 22px",
                    borderRadius: "22px",
                    marginBottom: "14px",
                    cursor: "pointer",
                    boxSizing: "border-box",
                    transition: "0.25s ease",
                    background: active
                        ? "linear-gradient(90deg,#1d4ed8,#2563eb)"
                        : "transparent",
                    color: "#ffffff",
                    fontSize: "18px",
                    fontWeight: active ? "700" : "600",
                    boxShadow: active
                        ? "0 10px 30px rgba(37,99,235,0.35)"
                        : "none",
                }}
            >
                <div
                    style={{
                        fontSize: "20px",
                        width: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: active ? 1 : 0.95,
                    }}
                >
                    {icon}
                </div>

                <span>{title}</span>
            </div>
        </Link>
    );
}