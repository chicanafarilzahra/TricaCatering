// resources/js/pages/Dashboard.jsx

import {
    ShoppingCart,
    Users,
    Truck,
    TrendingUp,
    Clock3,
    Activity,
    ArrowUpRight,
    Store,
    School,
    ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import AdminLayout from "../layouts/AdminLayout";

export default function Dashboard() {
    const navigate = useNavigate();

    const orders = [];
    const revenue = 0;
    const pendingOrders = 0;
    const recentOrders = [];

    const [dashboardData, setDashboardData] = useState({
        customers: 0,
        kurirs:    0,
        owners:    0,
        sppgs:     0,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/dashboard-stats");
            setDashboardData(res.data);
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
                .order-row { transition: background 0.15s ease; }
                .order-row:hover { background: rgba(255,255,255,0.04) !important; }
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
                                Kelola order, customer, pengiriman, produksi,
                                hingga laporan dalam satu sistem admin yang clean dan profesional.
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
                    {/* Recent Orders */}
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
                                    Recent Orders
                                </h2>
                                <p style={{ margin: "4px 0 0", color: "#475569", fontSize: "13px" }}>
                                    Pesanan terbaru masuk
                                </p>
                            </div>
                            <button
                                className="view-all-btn"
                                onClick={() => navigate("/orders")}
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

                        {recentOrders.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                {recentOrders.map((order, index) => (
                                    <div key={index} className="order-row" style={{
                                        padding: "14px 16px", borderRadius: "12px",
                                        display: "flex", justifyContent: "space-between",
                                        alignItems: "center", cursor: "pointer",
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                            <div style={{
                                                width: "38px", height: "38px", borderRadius: "12px",
                                                background: "rgba(59,130,246,0.12)",
                                                border: "1px solid rgba(59,130,246,0.2)",
                                                color: "#60a5fa",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: "14px", fontWeight: "700", flexShrink: 0,
                                            }}>
                                                {(order.customer_name || "?")[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ color: "white", fontWeight: "600", fontSize: "14px", marginBottom: "2px" }}>
                                                    {order.customer_name}
                                                </div>
                                                <div style={{ color: "#475569", fontSize: "12px" }}>
                                                    {order.package_name}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ color: "white", fontWeight: "700", fontSize: "14px" }}>
                                            Rp {Number(order.total).toLocaleString("id-ID")}
                                        </div>
                                    </div>
                                ))}
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
                                    <ShoppingCart size={20} color="#334155" />
                                </div>
                                <div style={{ color: "#475569", fontSize: "14px" }}>
                                    Belum ada pesanan masuk
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right column */}
                    <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: "16px" }}>
                        {/* Revenue */}
                        <div style={{
                            background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
                            border: "1px solid rgba(59,130,246,0.15)",
                            borderRadius: "20px", padding: "26px",
                            position: "relative", overflow: "hidden",
                        }}>
                            <div style={{
                                position: "absolute", top: 0, left: "26px", right: "26px",
                                height: "2px", background: "linear-gradient(90deg, #3b82f6, transparent)",
                            }} />
                            <div style={{
                                position: "absolute", bottom: "-30px", right: "-30px",
                                width: "120px", height: "120px", borderRadius: "999px",
                                background: "rgba(59,130,246,0.08)", filter: "blur(30px)", pointerEvents: "none",
                            }} />
                            <div style={{ position: "relative", zIndex: 2 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                                    <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#475569" }}>
                                        Total Revenue
                                    </div>
                                    <div style={{
                                        width: "38px", height: "38px", borderRadius: "12px",
                                        background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <TrendingUp size={18} color="#60a5fa" />
                                    </div>
                                </div>
                                <div style={{ color: "white", fontSize: "26px", fontWeight: "800", letterSpacing: "-0.8px", lineHeight: 1.2 }}>
                                    Rp {revenue.toLocaleString("id-ID")}
                                </div>
                                <div style={{ marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "5px", color: "#22c55e", fontSize: "12px", fontWeight: "600" }}>
                                    <ArrowUpRight size={13} /> Total keseluruhan
                                </div>
                            </div>
                        </div>

                        {/* Pending Orders */}
                        <div style={{
                            background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
                            border: "1px solid rgba(245,158,11,0.15)",
                            borderRadius: "20px", padding: "26px",
                            position: "relative", overflow: "hidden",
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
                                        Pending Orders
                                    </div>
                                    <div style={{
                                        width: "38px", height: "38px", borderRadius: "12px",
                                        background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <Clock3 size={18} color="#fbbf24" />
                                    </div>
                                </div>
                                <div style={{ color: "white", fontSize: "48px", fontWeight: "800", letterSpacing: "-2px", lineHeight: 1 }}>
                                    {pendingOrders}
                                </div>
                                <div style={{ marginTop: "12px", color: "#475569", fontSize: "12px" }}>
                                    {pendingOrders === 0 ? "Tidak ada antrian" : `${pendingOrders} pesanan menunggu konfirmasi`}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}