// resources/js/components/SidebarKlien.jsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    FaHome,
    FaUtensils,
    FaClipboardList,
    FaMapMarkerAlt,
    FaFileInvoiceDollar,
    FaCommentDots,
    FaSignOutAlt,
} from "react-icons/fa";

export default function SidebarKlien() {
    const current = window.location.hash;
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // redirect ke landing page
        navigate("/");

        // refresh halaman
        window.location.reload();
    };

    return (
        <div
            style={{
                width: "270px",
                minHeight: "100vh",
                background:
                    "linear-gradient(180deg,#020817 0%,#081633 55%,#0b1736 100%)",
                borderRight:
                    "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexShrink: 0,
                position: "sticky",
                top: 0,
                overflow: "hidden",
            }}
        >
            {/* TOP */}
            <div>
                {/* LOGO */}
                <div
                    style={{
                        padding: "28px 22px 24px",
                        borderBottom:
                            "1px solid rgba(255,255,255,0.05)",
                    }}
                >
                    <h1
                        style={{
                            margin: 0,
                            fontSize: "24px",
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
                            marginTop: "8px",
                            color: "#94a3b8",
                            fontSize: "14px",
                            fontWeight: "500",
                        }}
                    >
                        Klien Panel
                    </p>
                </div>

                {/* MENU */}
                <div
                    style={{
                        padding: "16px 14px",
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
                        active={
                            current ===
                                "#/klien/lacak-pengiriman" ||
                            current ===
                                "#/klien/lacak-pengiriman/"
                        }
                    />

                    <MenuItem
                        to="/klien/invoice"
                        icon={<FaFileInvoiceDollar />}
                        title="Invoice & Tagihan"
                        active={
                            current === "#/klien/invoice" ||
                            current === "#/klien/invoice/"
                        }
                    />

                    <MenuItem
                        to="/klien/ulasan"
                        icon={<FaCommentDots />}
                        title="Ulasan & Komplain"
                        active={
                            current === "#/klien/ulasan" ||
                            current === "#/klien/ulasan/"
                        }
                    />
                </div>
            </div>

            {/* LOGOUT */}
            <div
                style={{
                    padding: "16px 14px",
                    borderTop:
                        "1px solid rgba(255,255,255,0.05)",
                }}
            >
                <button
                    onClick={handleLogout}
                    style={{
                        width: "100%",
                        height: "52px",
                        border: "none",
                        borderRadius: "16px",
                        background:
                            "linear-gradient(90deg,#dc2626,#ef4444)",
                        color: "#ffffff",
                        fontSize: "15px",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "0 18px",
                        cursor: "pointer",
                        boxShadow:
                            "0 10px 25px rgba(239,68,68,0.25)",
                        transition: "0.25s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                            "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                            "translateY(0px)";
                    }}
                >
                    <div
                        style={{
                            fontSize: "17px",
                            width: "22px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <FaSignOutAlt />
                    </div>

                    Logout
                </button>
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
                    gap: "12px",
                    padding: "14px 16px",
                    borderRadius: "16px",
                    marginBottom: "10px",
                    cursor: "pointer",
                    boxSizing: "border-box",
                    transition: "0.25s ease",
                    background: active
                        ? "linear-gradient(90deg,#1d4ed8,#2563eb)"
                        : "transparent",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: active ? "700" : "600",
                    boxShadow: active
                        ? "0 10px 25px rgba(37,99,235,0.25)"
                        : "none",
                }}
            >
                <div
                    style={{
                        fontSize: "17px",
                        width: "22px",
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