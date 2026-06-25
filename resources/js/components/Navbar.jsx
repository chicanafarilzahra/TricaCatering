import {
    Bell,
    ChevronDown,
    CheckCheck,
    LayoutGrid,
    Settings,
    LogOut,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* =========================
   PAGE TITLE MAP
   Disinkronkan dengan label menu di Sidebar.jsx,
   supaya navbar selalu menunjukkan halaman yang
   sedang aktif (bukan teks statis).
========================= */
const PAGE_INFO = {
    "/dashboard": {
        title: "Dashboard",
        subtitle: "Ringkasan aktivitas bisnis catering",
    },
    "/orders": {
        title: "Orders",
        subtitle: "Kelola seluruh pesanan customer",
    },
    "/menus": {
        title: "Produk Catering",
        subtitle: "Kelola paket dan menu catering",
    },
    "/stocks": {
        title: "Inventori",
        subtitle: "Pantau stok bahan dan persediaan",
    },
    "/productions": {
        title: "Produksi",
        subtitle: "Pantau aktivitas produksi catering",
    },
    "/deliveries": {
        title: "Pengiriman",
        subtitle: "Lacak status pengiriman pesanan",
    },
    "/admin/sppg": {
        title: "SPPG",
        subtitle: "Kelola data SPPG",
    },
    "/admin-validasi-user": {
        title: "Validasi User",
        subtitle: "Verifikasi akun pengguna baru",
    },
    "/customers": {
        title: "Pelanggan",
        subtitle: "Kelola data customer",
    },
    "/reports": {
        title: "Reports & Analytics",
        subtitle: "Lihat laporan bisnis dan analitik",
    },
};

const DEFAULT_PAGE_INFO = {
    title: "Dashboard Control Center",
    subtitle: "Catering management system",
};

export default function Navbar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const location = useLocation();
    const navigate = useNavigate();

    const [openNotif, setOpenNotif] = useState(false);
    const [openUser, setOpenUser] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [hoverBell, setHoverBell] = useState(false);
    const [hoverUser, setHoverUser] = useState(false);
    const [hoverMarkRead, setHoverMarkRead] = useState(false);

    const wrapperRef = useRef(null);

    const pageInfo = PAGE_INFO[location.pathname] || DEFAULT_PAGE_INFO;

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("notifications")) || [];
        setNotifications(data);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpenNotif(false);
                setOpenUser(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unread = notifications.filter((item) => !item.read).length;

    const markAllAsRead = () => {
        const updated = notifications.map((item) => ({ ...item, read: true }));
        localStorage.setItem("notifications", JSON.stringify(updated));
        setNotifications(updated);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div
            style={{
                position: "sticky",
                top: 0,
                zIndex: 20,
                fontFamily:
                    "Inter, Arial, Helvetica, sans-serif",
            }}
        >
            {/* TOP ACCENT LINE — ties navbar visually to sidebar's brand gradient */}
            <div
                style={{
                    height: "2px",
                    background:
                        "linear-gradient(90deg,#3b82f6,#8b5cf6 50%,#06b6d4)",
                    opacity: 0.6,
                }}
            />

            <div
                style={{
                    height: "78px",
                    background:
                        "linear-gradient(180deg,#0b1220,#0f172a)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 18px",
                }}
            >
                {/* LEFT — logo + dynamic page title */}
                <div style={{ display: "flex", alignItems: "center", gap: "11px", minWidth: 0 }}>
                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "12px",
                            background:
                                "linear-gradient(135deg,#3b82f6,#8b5cf6 60%,#06b6d4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow:
                                "0 10px 30px rgba(0,0,0,0.25)",
                            flexShrink: 0,
                        }}
                    >
                        <LayoutGrid size={16} color="white" strokeWidth={2.3} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div
                            key={pageInfo.title}
                            style={{
                                color: "white",
                                fontSize: "14.5px",
                                fontWeight: "700",
                                letterSpacing: "-0.2px",
                                lineHeight: 1.1,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {pageInfo.title}
                        </div>
                        <div
                            style={{
                                color: "#4a6080",
                                fontSize: "11px",
                                marginTop: "3px",
                                letterSpacing: "0.1px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {pageInfo.subtitle}
                        </div>
                    </div>
                </div>

                {/* RIGHT — unified toolbar pill */}
                <div ref={wrapperRef} style={{ position: "relative", flexShrink: 0 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "2px",
                            background:
                                "linear-gradient(180deg,#0b1220,#0f172a)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: "16px",
                            padding: "5px",
                        }}
                    >
                        {/* NOTIFICATION BUTTON */}
                        <button
                            onClick={() => {
                                setOpenNotif(!openNotif);
                                setOpenUser(false);
                            }}
                            onMouseEnter={() => setHoverBell(true)}
                            onMouseLeave={() => setHoverBell(false)}
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                border: "none",
                                background: openNotif
                                    ? "rgba(59,130,246,0.18)"
                                    : hoverBell
                                    ? "rgba(255,255,255,0.06)"
                                    : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                                cursor: "pointer",
                                color: openNotif ? "#93c5fd" : "#94a3b8",
                                transition: "all 0.15s ease",
                            }}
                        >
                            <Bell size={16} />
                            {unread > 0 && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "5px",
                                        right: "5px",
                                        minWidth: "14px",
                                        height: "14px",
                                        padding: "0 3px",
                                        borderRadius: "999px",
                                        background:
                                            "linear-gradient(135deg,#f87171,#ef4444)",
                                        border: "2px solid #0c1424",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "8.5px",
                                        fontWeight: "700",
                                        color: "white",
                                        lineHeight: 1,
                                    }}
                                >
                                    {unread > 9 ? "9+" : unread}
                                </div>
                            )}
                        </button>

                        {/* DIVIDER */}
                        <div
                            style={{
                                width: "1px",
                                height: "20px",
                                background: "rgba(255,255,255,0.08)",
                                margin: "0 4px",
                            }}
                        />

                        {/* USER CHIP */}
                        <div
                            onClick={() => {
                                setOpenUser(!openUser);
                                setOpenNotif(false);
                            }}
                            onMouseEnter={() => setHoverUser(true)}
                            onMouseLeave={() => setHoverUser(false)}
                            style={{
                                height: "36px",
                                padding: "0 8px 0 4px",
                                borderRadius: "10px",
                                background: openUser
                                    ? "rgba(255,255,255,0.07)"
                                    : hoverUser
                                    ? "rgba(255,255,255,0.045)"
                                    : "transparent",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                            }}
                        >
                            <div style={{ position: "relative", flexShrink: 0 }}>
                                <div
                                    style={{
                                        width: "27px",
                                        height: "27px",
                                        borderRadius: "8px",
                                        background:
                                            "linear-gradient(135deg,#06b6d4,#3b82f6)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: "700",
                                        color: "white",
                                        fontSize: "11.5px",
                                        boxShadow:
                                            "0 10px 30px rgba(0,0,0,0.25)",
                                    }}
                                >
                                    {user?.name?.charAt(0)?.toUpperCase() || "A"}
                                </div>
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "-2px",
                                        right: "-2px",
                                        width: "8px",
                                        height: "8px",
                                        borderRadius: "999px",
                                        background: "#22c55e",
                                        border: "2px solid #0c1424",
                                    }}
                                />
                            </div>
                            <div style={{ textAlign: "left" }}>
                                <div
                                    style={{
                                        color: "#e2e8f0",
                                        fontSize: "12.5px",
                                        fontWeight: "600",
                                        lineHeight: 1,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {user?.name || "Admin"}
                                </div>
                                <div
                                    style={{
                                        color: "#4a6080",
                                        fontSize: "10.5px",
                                        marginTop: "3px",
                                        textTransform: "capitalize",
                                    }}
                                >
                                    {user?.role || "admin"}
                                </div>
                            </div>
                            <ChevronDown
                                size={13}
                                color="#4a6080"
                                style={{
                                    transform: openUser
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                    transition: "transform 0.15s ease",
                                }}
                            />
                        </div>
                    </div>

                    {/* USER DROPDOWN */}
                    {openUser && (
                        <div
                            style={{
                                position: "absolute",
                                top: "48px",
                                right: 0,
                                width: "200px",
                                background:
                                    "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "16px",
                                overflow: "hidden",
                                boxShadow:
                                    "0 10px 30px rgba(0,0,0,0.25)",
                                zIndex: 99,
                                padding: "6px",
                            }}
                        >
                            <button
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "9px",
                                    padding: "10px 10px",
                                    background: "transparent",
                                    border: "none",
                                    borderRadius: "9px",
                                    color: "#94a3b8",
                                    fontSize: "12.5px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    textAlign: "left",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                        "rgba(255,255,255,0.05)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = "transparent")
                                }
                            >
                                <Settings size={14} />
                                Pengaturan akun
                            </button>
                            <div
                                style={{
                                    height: "1px",
                                    background: "rgba(255,255,255,0.06)",
                                    margin: "4px 4px",
                                }}
                            />
                            <button
                                onClick={handleLogout}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "9px",
                                    padding: "10px 10px",
                                    background: "transparent",
                                    border: "none",
                                    borderRadius: "9px",
                                    color: "#f87171",
                                    fontSize: "12.5px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    textAlign: "left",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                        "rgba(239,68,68,0.08)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = "transparent")
                                }
                            >
                                <LogOut size={14} />
                                Logout
                            </button>
                        </div>
                    )}

                    {/* NOTIFICATION DROPDOWN */}
                    {openNotif && (
                        <div
                            style={{
                                position: "absolute",
                                top: "48px",
                                right: 0,
                                width: "350px",
                                background: "#0c1628",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "18px",
                                overflow: "hidden",
                                boxShadow:
                                    "0 10px 30px rgba(0,0,0,0.25)",
                                zIndex: 99,
                            }}
                        >
                            {/* HEADER */}
                            <div
                                style={{
                                    padding: "15px 16px",
                                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    background:
                                        "linear-gradient(180deg, rgba(59,130,246,0.06), transparent)",
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            color: "#e2e8f0",
                                            fontWeight: "700",
                                            fontSize: "13.5px",
                                        }}
                                    >
                                        Notifications
                                    </div>
                                    <div
                                        style={{
                                            color: "#4a6080",
                                            fontSize: "11px",
                                            marginTop: "3px",
                                        }}
                                    >
                                        {unread > 0
                                            ? `${unread} belum dibaca`
                                            : "Semua sudah dibaca"}
                                    </div>
                                </div>
                                {unread > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        onMouseEnter={() => setHoverMarkRead(true)}
                                        onMouseLeave={() => setHoverMarkRead(false)}
                                        style={{
                                            border: "none",
                                            background: hoverMarkRead
                                                ? "rgba(59,130,246,0.2)"
                                                : "rgba(59,130,246,0.12)",
                                            color: "#60a5fa",
                                            cursor: "pointer",
                                            borderRadius: "8px",
                                            padding: "6px 11px",
                                            fontSize: "11.5px",
                                            fontWeight: "600",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "5px",
                                            transition: "background 0.15s ease",
                                        }}
                                    >
                                        <CheckCheck size={13} />
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            {/* BODY */}
                            <div style={{ maxHeight: "360px", overflowY: "auto" }}>
                                {notifications.length === 0 ? (
                                    <div
                                        style={{
                                            padding: "52px 20px",
                                            textAlign: "center",
                                            color: "#334155",
                                            fontSize: "13px",
                                        }}
                                    >
                                        <Bell
                                            size={24}
                                            color="#1e293b"
                                            style={{ marginBottom: "10px" }}
                                        />
                                        <div>Belum ada notifikasi</div>
                                    </div>
                                ) : (
                                    notifications.map((item, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                padding: "13px 16px",
                                                borderBottom:
                                                    "1px solid rgba(255,255,255,0.04)",
                                                background: item.read
                                                    ? "transparent"
                                                    : "rgba(59,130,246,0.06)",
                                                display: "flex",
                                                gap: "11px",
                                                alignItems: "flex-start",
                                                transition: "background 0.15s ease",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "38px",
                                                    height: "38px",
                                                    borderRadius: "12px",
                                                    flexShrink: 0,
                                                    background: item.read
                                                        ? "rgba(255,255,255,0.05)"
                                                        : "rgba(59,130,246,0.15)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Bell
                                                    size={13}
                                                    color={item.read ? "#475569" : "#60a5fa"}
                                                />
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <div
                                                    style={{
                                                        color: item.read
                                                            ? "#64748b"
                                                            : "#e2e8f0",
                                                        fontSize: "12.5px",
                                                        fontWeight: "600",
                                                        marginBottom: "4px",
                                                    }}
                                                >
                                                    {item.title}
                                                </div>
                                                <div
                                                    style={{
                                                        color: "#64748b",
                                                        fontSize: "11.5px",
                                                        lineHeight: "1.5",
                                                    }}
                                                >
                                                    {item.message}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}