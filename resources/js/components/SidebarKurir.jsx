// resources/js/components/SidebarKurir.jsx

import { Link, useLocation } from "react-router-dom";

import {
    FaHome,
    FaCalendarAlt,
    FaTruck,
    FaMapMarkedAlt,
    FaClipboardList,
    FaSignOutAlt,
} from "react-icons/fa";

export default function SidebarKurir({
    onLogout,
}) {
    const location =
        useLocation();

    const menuStyle = (path) => ({
        display: "flex",
        alignItems: "center",
        gap: "14px",

        width: "100%",

        padding: "14px 16px",

        borderRadius: "14px",

        textDecoration:
            "none",

        color:
            location.pathname ===
            path
                ? "#ffffff"
                : "#94a3b8",

        background:
            location.pathname ===
            path
                ? "linear-gradient(90deg, rgba(37,99,235,0.35), rgba(59,130,246,0.18))"
                : "transparent",

        border:
            location.pathname ===
            path
                ? "1px solid rgba(96,165,250,0.18)"
                : "1px solid transparent",

        fontWeight:
            location.pathname ===
            path
                ? "700"
                : "500",

        fontSize: "14px",

        boxSizing:
            "border-box",

        transition:
            "all 0.22s ease",
    });

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
            return;
        }

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        window.location.href =
            "/#/login";
    };

    return (
        <aside
            style={{
                width: "100%",
                height: "100vh",

                display: "flex",

                flexDirection:
                    "column",

                justifyContent:
                    "space-between",

                padding:
                    "24px 16px",

                boxSizing:
                    "border-box",

                background:
                    "linear-gradient(180deg,#08101f 0%, #0f172a 45%, #111827 100%)",

                borderRight:
                    "1px solid rgba(255,255,255,0.05)",

                overflow: "hidden",
            }}
        >
            {/* TOP */}
            <div>
                {/* LOGO */}
                <div
                    style={{
                        padding:
                            "0 6px",
                        marginBottom:
                            "36px",
                    }}
                >
                    <h1
                        style={{
                            margin: 0,

                            fontSize:
                                "28px",

                            fontWeight:
                                "800",

                            color:
                                "#ffffff",

                            letterSpacing:
                                "-0.8px",
                        }}
                    >
                        TricaCatering
                    </h1>

                    <p
                        style={{
                            margin:
                                "8px 0 0",

                            color:
                                "#64748b",

                            fontSize:
                                "13px",

                            fontWeight:
                                "500",
                        }}
                    >
                        Kurir Panel
                    </p>
                </div>

                {/* MENU */}
                <nav
                    style={{
                        display:
                            "flex",

                        flexDirection:
                            "column",

                        gap: "8px",
                    }}
                >
                    <Link
                        to="/kurir"
                        style={menuStyle(
                            "/kurir"
                        )}
                    >
                        <FaHome
                            size={15}
                        />
                        Home
                    </Link>

                    <Link
                        to="/kurir/jadwal"
                        style={menuStyle(
                            "/kurir/jadwal"
                        )}
                    >
                        <FaCalendarAlt
                            size={15}
                        />
                        Jadwal
                        Pengiriman
                    </Link>

                    <Link
                        to="/kurir/aktif"
                        style={menuStyle(
                            "/kurir/aktif"
                        )}
                    >
                        <FaTruck
                            size={15}
                        />
                        Pengiriman
                        Aktif
                    </Link>

                    <Link
                        to="/kurir/rute"
                        style={menuStyle(
                            "/kurir/rute"
                        )}
                    >
                        <FaMapMarkedAlt
                            size={15}
                        />
                        Rute Hari Ini
                    </Link>

                    <Link
                        to="/kurir/laporan"
                        style={menuStyle(
                            "/kurir/laporan"
                        )}
                    >
                        <FaClipboardList
                            size={15}
                        />
                        Laporan
                        Harian
                    </Link>
                </nav>
            </div>

            {/* BOTTOM */}
            <div>
                <button
                    onClick={
                        handleLogout
                    }
                    style={{
                        width: "100%",

                        height: "48px",

                        border: "none",

                        borderRadius:
                            "14px",

                        background:
                            "linear-gradient(90deg,#dc2626,#ef4444)",

                        color:
                            "white",

                        display: "flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        gap: "10px",

                        fontSize:
                            "14px",

                        fontWeight:
                            "700",

                        cursor:
                            "pointer",

                        boxShadow:
                            "0 10px 25px rgba(239,68,68,0.25)",
                    }}
                >
                    <FaSignOutAlt />
                    Logout
                </button>

                <div
                    style={{
                        marginTop:
                            "18px",

                        textAlign:
                            "center",

                        color:
                            "#64748b",

                        fontSize:
                            "12px",
                    }}
                >
                    © 2026
                    TricaCatering
                </div>
            </div>
        </aside>
    );
}