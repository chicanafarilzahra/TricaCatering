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

const PAGE_INFO = {
    "/dashboard":          { title: "Dashboard",        subtitle: "Ringkasan aktivitas bisnis catering" },
    "/orders":             { title: "Orders",           subtitle: "Kelola seluruh pesanan customer" },
    "/menus":              { title: "Produk Catering",  subtitle: "Kelola paket dan menu catering" },
    "/stocks":             { title: "Inventori",        subtitle: "Pantau stok bahan dan persediaan" },
    "/productions":        { title: "Produksi",         subtitle: "Pantau aktivitas produksi catering" },
    "/deliveries":         { title: "Pengiriman",       subtitle: "Lacak status pengiriman pesanan" },
    "/admin/sppg":         { title: "SPPG",             subtitle: "Kelola data SPPG" },
    "/admin-validasi-user":{ title: "Validasi User",    subtitle: "Verifikasi akun pengguna baru" },
    "/customers":          { title: "Pelanggan",        subtitle: "Kelola data customer" },
    "/reports":            { title: "Reports",          subtitle: "Lihat laporan bisnis dan analitik" },
};

const DEFAULT_PAGE_INFO = { title: "Dashboard", subtitle: "Catering management system" };

const FONT = "'Inter', system-ui, -apple-system, sans-serif";

export default function Navbar() {
    const user     = JSON.parse(localStorage.getItem("user") || "{}");
    const location = useLocation();
    const navigate = useNavigate();

    const [openNotif,      setOpenNotif]      = useState(false);
    const [openUser,       setOpenUser]       = useState(false);
    const [notifications,  setNotifications]  = useState([]);

    const wrapperRef = useRef(null);
    const pageInfo   = PAGE_INFO[location.pathname] || DEFAULT_PAGE_INFO;
    const initial    = user?.name?.charAt(0)?.toUpperCase() || "A";
    const unread     = notifications.filter((n) => !n.read).length;

    useEffect(() => {
        setNotifications(JSON.parse(localStorage.getItem("notifications") || "[]"));
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpenNotif(false);
                setOpenUser(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const markAllRead = () => {
        const updated = notifications.map((n) => ({ ...n, read: true }));
        localStorage.setItem("notifications", JSON.stringify(updated));
        setNotifications(updated);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div style={{
            position:     "sticky",
            top:          0,
            zIndex:       20,
            fontFamily:   FONT,
            height:       "64px",
            background:   "#0d1526",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display:      "flex",
            alignItems:   "center",
            justifyContent: "space-between",
            padding:      "0 24px",
        }}>

            {/* ── LEFT: icon + page title ── */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                    width:          "36px",
                    height:         "36px",
                    borderRadius:   "10px",
                    background:     "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    flexShrink:     0,
                }}>
                    <LayoutGrid size={15} color="white" strokeWidth={2.2} />
                </div>
                <div>
                    <div style={{
                        color:      "white",
                        fontSize:   "14px",
                        fontWeight: "700",
                        lineHeight: 1.1,
                        letterSpacing: "-0.2px",
                    }}>
                        {pageInfo.title}
                    </div>
                    <div style={{
                        color:     "#4a6080",
                        fontSize:  "11px",
                        marginTop: "3px",
                    }}>
                        {pageInfo.subtitle}
                    </div>
                </div>
            </div>

            {/* ── RIGHT: bell + user ── */}
            <div ref={wrapperRef} style={{ position: "relative", display: "flex", alignItems: "center", gap: "6px" }}>

                {/* Bell */}
                <button
                    onClick={() => { setOpenNotif(!openNotif); setOpenUser(false); }}
                    style={{
                        width:          "36px",
                        height:         "36px",
                        borderRadius:   "10px",
                        border:         "1px solid rgba(255,255,255,0.07)",
                        background:     openNotif ? "rgba(59,130,246,0.12)" : "transparent",
                        color:          openNotif ? "#93c5fd" : "#64748b",
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "center",
                        cursor:         "pointer",
                        position:       "relative",
                        transition:     "all 0.15s",
                    }}
                    onMouseEnter={(e) => { if (!openNotif) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                    onMouseLeave={(e) => { if (!openNotif) e.currentTarget.style.background = "transparent"; }}
                >
                    <Bell size={15} />
                    {unread > 0 && (
                        <div style={{
                            position:       "absolute",
                            top:            "5px",
                            right:          "5px",
                            width:          "7px",
                            height:         "7px",
                            borderRadius:   "999px",
                            background:     "#ef4444",
                            border:         "1.5px solid #0d1526",
                        }} />
                    )}
                </button>

                {/* User chip */}
                <div
                    onClick={() => { setOpenUser(!openUser); setOpenNotif(false); }}
                    style={{
                        height:       "36px",
                        padding:      "0 10px 0 6px",
                        borderRadius: "10px",
                        border:       "1px solid rgba(255,255,255,0.07)",
                        background:   openUser ? "rgba(255,255,255,0.06)" : "transparent",
                        display:      "flex",
                        alignItems:   "center",
                        gap:          "8px",
                        cursor:       "pointer",
                        transition:   "all 0.15s",
                    }}
                    onMouseEnter={(e) => { if (!openUser) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={(e) => { if (!openUser) e.currentTarget.style.background = "transparent"; }}
                >
                    {/* Avatar */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                        <div style={{
                            width:          "26px",
                            height:         "26px",
                            borderRadius:   "8px",
                            background:     "linear-gradient(135deg,#06b6d4,#3b82f6)",
                            display:        "flex",
                            alignItems:     "center",
                            justifyContent: "center",
                            fontWeight:     "700",
                            color:          "white",
                            fontSize:       "11px",
                        }}>
                            {initial}
                        </div>
                        <div style={{
                            position:     "absolute",
                            bottom:       "-2px",
                            right:        "-2px",
                            width:        "7px",
                            height:       "7px",
                            borderRadius: "999px",
                            background:   "#22c55e",
                            border:       "1.5px solid #0d1526",
                        }} />
                    </div>

                    <div>
                        <div style={{ color: "#e2e8f0", fontSize: "12px", fontWeight: "600", lineHeight: 1 }}>
                            {user?.name || "Admin"}
                        </div>
                        <div style={{ color: "#4a6080", fontSize: "10px", marginTop: "3px", textTransform: "capitalize" }}>
                            {user?.role || "admin"}
                        </div>
                    </div>

                    <ChevronDown size={12} color="#4a6080" style={{
                        transform:  openUser ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.15s",
                    }} />
                </div>

                {/* ── User dropdown ── */}
                {openUser && (
                    <div style={{
                        position:     "absolute",
                        top:          "44px",
                        right:        0,
                        width:        "190px",
                        background:   "#0d1526",
                        border:       "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "12px",
                        padding:      "6px",
                        boxShadow:    "0 8px 24px rgba(0,0,0,0.4)",
                        zIndex:       99,
                    }}>
                        <button
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: "9px", padding: "9px 10px", background: "transparent", border: "none", borderRadius: "8px", color: "#94a3b8", fontSize: "12px", fontWeight: "500", cursor: "pointer", fontFamily: FONT }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                            <Settings size={13} /> Pengaturan akun
                        </button>
                        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
                        <button
                            onClick={handleLogout}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: "9px", padding: "9px 10px", background: "transparent", border: "none", borderRadius: "8px", color: "#f87171", fontSize: "12px", fontWeight: "500", cursor: "pointer", fontFamily: FONT }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                            <LogOut size={13} /> Logout
                        </button>
                    </div>
                )}

                {/* ── Notification dropdown ── */}
                {openNotif && (
                    <div style={{
                        position:     "absolute",
                        top:          "44px",
                        right:        0,
                        width:        "320px",
                        background:   "#0d1526",
                        border:       "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "14px",
                        overflow:     "hidden",
                        boxShadow:    "0 8px 24px rgba(0,0,0,0.4)",
                        zIndex:       99,
                    }}>
                        {/* Header */}
                        <div style={{
                            padding:      "14px 16px",
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                            display:      "flex",
                            alignItems:   "center",
                            justifyContent: "space-between",
                        }}>
                            <div>
                                <div style={{ color: "#e2e8f0", fontWeight: "700", fontSize: "13px" }}>Notifikasi</div>
                                <div style={{ color: "#4a6080", fontSize: "11px", marginTop: "2px" }}>
                                    {unread > 0 ? `${unread} belum dibaca` : "Semua sudah dibaca"}
                                </div>
                            </div>
                            {unread > 0 && (
                                <button
                                    onClick={markAllRead}
                                    style={{
                                        border:       "none",
                                        background:   "rgba(59,130,246,0.12)",
                                        color:        "#60a5fa",
                                        cursor:       "pointer",
                                        borderRadius: "7px",
                                        padding:      "5px 10px",
                                        fontSize:     "11px",
                                        fontWeight:   "600",
                                        display:      "flex",
                                        alignItems:   "center",
                                        gap:          "4px",
                                        fontFamily:   FONT,
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(59,130,246,0.2)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(59,130,246,0.12)")}
                                >
                                    <CheckCheck size={12} /> Tandai dibaca
                                </button>
                            )}
                        </div>

                        {/* Body */}
                        <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                            {notifications.length === 0 ? (
                                <div style={{ padding: "40px 20px", textAlign: "center", color: "#334155", fontSize: "13px" }}>
                                    <Bell size={22} color="#1e293b" style={{ marginBottom: "10px", display: "block", margin: "0 auto 10px" }} />
                                    Belum ada notifikasi
                                </div>
                            ) : notifications.map((item, i) => (
                                <div key={i} style={{
                                    padding:      "12px 16px",
                                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                                    background:   item.read ? "transparent" : "rgba(59,130,246,0.05)",
                                    display:      "flex",
                                    gap:          "10px",
                                }}>
                                    <div style={{
                                        width:          "32px",
                                        height:         "32px",
                                        borderRadius:   "9px",
                                        flexShrink:     0,
                                        background:     item.read ? "rgba(255,255,255,0.04)" : "rgba(59,130,246,0.12)",
                                        display:        "flex",
                                        alignItems:     "center",
                                        justifyContent: "center",
                                    }}>
                                        <Bell size={12} color={item.read ? "#475569" : "#60a5fa"} />
                                    </div>
                                    <div>
                                        <div style={{ color: item.read ? "#64748b" : "#e2e8f0", fontSize: "12px", fontWeight: "600", marginBottom: "3px" }}>
                                            {item.title}
                                        </div>
                                        <div style={{ color: "#64748b", fontSize: "11px", lineHeight: 1.5 }}>
                                            {item.message}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}