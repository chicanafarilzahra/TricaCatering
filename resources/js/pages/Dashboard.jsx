// resources/js/pages/Dashboard.jsx

import {
    Users,
    Truck,
    Clock3,
    Activity,
    Store,
    School,
    ChevronRight,
    CheckCircle2,
    UserCheck,
    MapPin,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import AdminLayout from "../layouts/AdminLayout";

export default function Dashboard() {
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState({
        customers: 0,
        kurirs:    0,
        owners:    0,
        sppgs:     0,
    });

    const [sppgList, setSppgList] = useState([]);
    const [pendingUsers, setPendingUsers] = useState(0);
    const [verifiedUsers, setVerifiedUsers] = useState(0);

    useEffect(() => {
        fetchStats();
        fetchSppgSummary();
        fetchValidationSummary();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/dashboard-stats");
            setDashboardData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSppgSummary = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            const res = await axios.get("http://localhost:8000/api/sppg/distribusi", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            setSppgList(Array.isArray(res.data) ? res.data : (res.data?.data || []));
        } catch (err) {
            console.error(err);
        }
    };

    const fetchValidationSummary = async () => {
        try {
            const res = await axios.get("/users");

            const VALIDATABLE_ROLES = ["owner", "kurir", "operator_sppg"];
            const relevantUsers = res.data.filter((u) =>
                VALIDATABLE_ROLES.includes(u.role)
            );

            const pending  = relevantUsers.filter((u) => u.status === "pending").length;
            const approved = relevantUsers.filter((u) => u.status === "approved").length;

            setPendingUsers(pending);
            setVerifiedUsers(approved);
        } catch (err) {
            console.error(err);
        }
    };

    const stats = [
        {
            title:  "Customers",
            value:  dashboardData.customers,
            icon:   <Users size={20} />,
            color:  "#60a5fa",
            accent: "#3b82f6",
            bg:     "rgba(59,130,246,0.08)",
            border: "rgba(59,130,246,0.2)",
        },
        {
            title:  "Kurirs",
            value:  dashboardData.kurirs,
            icon:   <Truck size={20} />,
            color:  "#a78bfa",
            accent: "#8b5cf6",
            bg:     "rgba(139,92,246,0.08)",
            border: "rgba(139,92,246,0.2)",
        },
        {
            title:  "Owners",
            value:  dashboardData.owners,
            icon:   <Store size={20} />,
            color:  "#34d399",
            accent: "#10b981",
            bg:     "rgba(16,185,129,0.08)",
            border: "rgba(16,185,129,0.2)",
        },
        {
            title:  "SPPG",
            value:  dashboardData.sppgs,
            icon:   <School size={20} />,
            color:  "#fbbf24",
            accent: "#f59e0b",
            bg:     "rgba(245,158,11,0.08)",
            border: "rgba(245,158,11,0.2)",
        },
    ];

    const now     = new Date();
    const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

    return (
        <AdminLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                .dash-root * { font-family: 'Inter', system-ui, sans-serif; box-sizing: border-box; }
                .stat-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                .stat-card:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(0,0,0,0.35); }
                .sppg-row { transition: background 0.15s ease; }
                .sppg-row:hover { background: rgba(255,255,255,0.04) !important; }
                .view-all-btn { transition: background 0.15s ease, color 0.15s ease; }
                .view-all-btn:hover { background: rgba(255,255,255,0.08) !important; }
                .pulse-dot { animation: pulse 2s ease-in-out infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
                @media (max-width: 900px) {
                    .bottom-grid { grid-template-columns: 1fr !important; }
                    .hero-inner { flex-direction: column !important; }
                }
            `}</style>

            <div className="dash-root">

                {/* ── HERO ── */}
                <div style={{
                    position: "relative", borderRadius: "24px", padding: "40px",
                    background: "linear-gradient(135deg, #0d1117 0%, #0f172a 60%, #131c2e 100%)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    overflow: "hidden", marginBottom: "24px",
                }}>
                    <div style={{
                        position: "absolute", inset: 0,
                        backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
                        backgroundSize: "28px 28px", pointerEvents: "none",
                    }} />
                    <div style={{
                        position: "absolute", top: "-80px", right: "60px",
                        width: "300px", height: "300px", borderRadius: "999px",
                        background: "rgba(59,130,246,0.12)", filter: "blur(90px)", pointerEvents: "none",
                    }} />
                    <div style={{
                        position: "absolute", bottom: "-60px", right: "-40px",
                        width: "200px", height: "200px", borderRadius: "999px",
                        background: "rgba(139,92,246,0.1)", filter: "blur(70px)", pointerEvents: "none",
                    }} />

                    <div className="hero-inner" style={{
                        position: "relative", zIndex: 2,
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", gap: "32px", flexWrap: "wrap",
                    }}>
                        {/* Left */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: "8px",
                                padding: "6px 14px", borderRadius: "999px",
                                background: "rgba(59,130,246,0.1)",
                                border: "1px solid rgba(59,130,246,0.22)",
                                color: "#60a5fa", fontSize: "12px", fontWeight: "600",
                                letterSpacing: "0.04em", textTransform: "uppercase",
                                marginBottom: "22px",
                            }}>
                                <span className="pulse-dot" style={{
                                    width: "6px", height: "6px", borderRadius: "999px",
                                    background: "#60a5fa", display: "inline-block",
                                }} />
                                Admin Dashboard
                            </div>

                            <h1 style={{
                                margin: 0,
                                fontSize: "clamp(28px, 3.5vw, 44px)",
                                lineHeight: 1.15, color: "white",
                                fontWeight: "800", letterSpacing: "-1.5px", maxWidth: "600px",
                            }}>
                                Monitor aktivitas
                                <br />
                                <span style={{
                                    background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
                                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                                }}>
                                    catering secara realtime
                                </span>
                            </h1>

                            <p style={{
                                margin: "16px 0 0", color: "#64748b",
                                fontSize: "15px", lineHeight: "1.8", maxWidth: "560px",
                            }}>
                                Kelola SPPG, customer, pengiriman, inventori,
                                hingga validasi user dalam satu sistem admin yang clean dan profesional.
                            </p>
                        </div>

                        {/* Right — date & time card */}
                        <div style={{
                            flexShrink: 0,
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: "20px", padding: "24px 28px",
                            display: "flex", flexDirection: "column",
                            alignItems: "center", gap: "8px",
                            backdropFilter: "blur(12px)",
                            minWidth: "200px",
                        }}>
                            <div style={{
                                display: "flex", alignItems: "center", gap: "6px",
                                fontSize: "11px", fontWeight: "700",
                                color: "#60a5fa", textTransform: "uppercase",
                                letterSpacing: "0.08em",
                            }}>
                                <Activity size={12} color="#60a5fa" />
                                Live
                            </div>
                            <div style={{
                                fontSize: "38px", fontWeight: "800",
                                color: "white", letterSpacing: "-2px", lineHeight: 1,
                            }}>
                                {timeStr}
                            </div>
                            <div style={{
                                fontSize: "12px", color: "#64748b",
                                fontWeight: "500", textAlign: "center", lineHeight: 1.5,
                            }}>
                                {dateStr}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── STATS GRID ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px", marginBottom: "24px",
                }}>
                    {stats.map((item, index) => (
                        <div key={index} className="stat-card" style={{
                            background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
                            border: `1px solid ${item.border}`,
                            borderRadius: "20px", padding: "24px",
                            position: "relative", overflow: "hidden", cursor: "default",
                        }}>
                            <div style={{
                                position: "absolute", top: 0, left: "24px", right: "24px",
                                height: "2px", borderRadius: "0 0 4px 4px",
                                background: `linear-gradient(90deg, ${item.accent}, transparent)`,
                            }} />
                            <div style={{
                                position: "absolute", top: "-40px", right: "-40px",
                                width: "110px", height: "110px", borderRadius: "999px",
                                background: item.bg, filter: "blur(30px)", pointerEvents: "none",
                            }} />
                            <div style={{ position: "relative", zIndex: 2 }}>
                                <div style={{
                                    width: "44px", height: "44px", borderRadius: "14px",
                                    background: item.bg, border: `1px solid ${item.border}`,
                                    color: item.color,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    marginBottom: "20px",
                                }}>
                                    {item.icon}
                                </div>
                                <div style={{
                                    color: "white", fontSize: "36px", fontWeight: "800",
                                    lineHeight: 1, letterSpacing: "-1px", marginBottom: "8px",
                                }}>
                                    {item.value.toLocaleString()}
                                </div>
                                <div style={{ color: "#475569", fontSize: "13px", fontWeight: "500" }}>
                                    {item.title}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── BOTTOM GRID ── */}
                <div className="bottom-grid" style={{
                    display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "16px",
                }}>
                    {/* SPPG Summary */}
                    <div style={{
                        background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "20px", padding: "28px",
                    }}>
                        <div style={{
                            display: "flex", justifyContent: "space-between",
                            alignItems: "flex-start", marginBottom: "24px",
                        }}>
                            <div>
                                <h2 style={{ margin: 0, color: "white", fontSize: "18px", fontWeight: "700", letterSpacing: "-0.3px" }}>
                                    Ringkasan SPPG
                                </h2>
                                <p style={{ margin: "4px 0 0", color: "#475569", fontSize: "13px" }}>
                                    Daftar SPPG terdaftar dalam sistem
                                </p>
                            </div>
                            <button
                                className="view-all-btn"
                                onClick={() => navigate("/admin/sppg")}
                                style={{
                                    height: "38px", padding: "0 16px",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: "10px", background: "rgba(255,255,255,0.03)",
                                    color: "#94a3b8", fontWeight: "600",
                                    cursor: "pointer", fontSize: "13px",
                                    display: "flex", alignItems: "center", gap: "6px",
                                }}
                            >
                                Lihat Semua <ChevronRight size={14} />
                            </button>
                        </div>

                        {sppgList.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                {sppgList.slice(0, 5).map((item, index) => {
                                    const statusStyle = (() => {
                                        switch (item.status) {
                                            case "Diproses":  return { background: "rgba(148,163,184,0.15)", color: "#94a3b8" };
                                            case "Disiapkan": return { background: "rgba(59,130,246,0.15)",  color: "#60a5fa" };
                                            case "Dikirim":   return { background: "rgba(245,158,11,0.15)",  color: "#fbbf24" };
                                            case "Selesai":   return { background: "rgba(16,185,129,0.15)", color: "#34d399" };
                                            default:          return { background: "rgba(148,163,184,0.15)", color: "#cbd5e1" };
                                        }
                                    })();
                                    return (
                                    <div key={index} className="sppg-row" style={{
                                        padding: "14px 16px", borderRadius: "12px",
                                        display: "flex", justifyContent: "space-between",
                                        alignItems: "center", cursor: "pointer",
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                            <div style={{
                                                width: "38px", height: "38px", borderRadius: "12px",
                                                background: "rgba(245,158,11,0.12)",
                                                border: "1px solid rgba(245,158,11,0.2)",
                                                color: "#fbbf24",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                flexShrink: 0,
                                            }}>
                                                <School size={17} />
                                            </div>
                                            <div>
                                                <div style={{ color: "white", fontWeight: "600", fontSize: "14px", marginBottom: "2px" }}>
                                                    {item.sekolah?.nama_sekolah || "-"}
                                                </div>
                                                <div style={{ color: "#475569", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                                                    <MapPin size={11} />
                                                    {item.menu?.nama_menu || "Menu belum diisi"}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{
                                            padding: "5px 12px", borderRadius: "999px",
                                            fontSize: "11px", fontWeight: "700",
                                            ...statusStyle,
                                        }}>
                                            {item.status || "-"}
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{
                                borderRadius: "14px", border: "1px dashed rgba(255,255,255,0.07)",
                                padding: "56px 20px", textAlign: "center",
                            }}>
                                <div style={{
                                    width: "48px", height: "48px", borderRadius: "14px",
                                    background: "rgba(255,255,255,0.04)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    margin: "0 auto 16px",
                                }}>
                                    <School size={20} color="#334155" />
                                </div>
                                <div style={{ color: "#475569", fontSize: "14px" }}>
                                    Belum ada data SPPG
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right column */}
                    <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: "16px" }}>
                        {/* Verified Users */}
                        <div style={{
                            background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
                            border: "1px solid rgba(34,197,94,0.15)",
                            borderRadius: "20px", padding: "26px",
                            position: "relative", overflow: "hidden",
                        }}>
                            <div style={{
                                position: "absolute", top: 0, left: "26px", right: "26px",
                                height: "2px", background: "linear-gradient(90deg, #22c55e, transparent)",
                            }} />
                            <div style={{
                                position: "absolute", bottom: "-30px", right: "-30px",
                                width: "120px", height: "120px", borderRadius: "999px",
                                background: "rgba(34,197,94,0.08)", filter: "blur(30px)", pointerEvents: "none",
                            }} />
                            <div style={{ position: "relative", zIndex: 2 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                                    <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#475569" }}>
                                        User Tervalidasi
                                    </div>
                                    <div style={{
                                        width: "38px", height: "38px", borderRadius: "12px",
                                        background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <CheckCircle2 size={18} color="#22c55e" />
                                    </div>
                                </div>
                                <div style={{ color: "white", fontSize: "48px", fontWeight: "800", letterSpacing: "-2px", lineHeight: 1 }}>
                                    {verifiedUsers}
                                </div>
                                <div style={{ marginTop: "12px", color: "#475569", fontSize: "12px" }}>
                                    Akun sudah diverifikasi admin
                                </div>
                            </div>
                        </div>

                        {/* Pending Validation */}
                        <div
                            onClick={() => navigate("/admin-validasi-user")}
                            style={{
                                background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
                                border: "1px solid rgba(245,158,11,0.15)",
                                borderRadius: "20px", padding: "26px",
                                position: "relative", overflow: "hidden", cursor: "pointer",
                            }}>
                            <div style={{
                                position: "absolute", top: 0, left: "26px", right: "26px",
                                height: "2px", background: "linear-gradient(90deg, #f59e0b, transparent)",
                            }} />
                            <div style={{
                                position: "absolute", bottom: "-30px", right: "-30px",
                                width: "120px", height: "120px", borderRadius: "999px",
                                background: "rgba(245,158,11,0.07)", filter: "blur(30px)", pointerEvents: "none",
                            }} />
                            <div style={{ position: "relative", zIndex: 2 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                                    <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#475569" }}>
                                        Menunggu Validasi
                                    </div>
                                    <div style={{
                                        width: "38px", height: "38px", borderRadius: "12px",
                                        background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <UserCheck size={18} color="#fbbf24" />
                                    </div>
                                </div>
                                <div style={{ color: "white", fontSize: "48px", fontWeight: "800", letterSpacing: "-2px", lineHeight: 1 }}>
                                    {pendingUsers}
                                </div>
                                <div style={{ marginTop: "12px", color: "#475569", fontSize: "12px" }}>
                                    {pendingUsers === 0 ? "Tidak ada user menunggu" : `${pendingUsers} user menunggu validasi`}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}