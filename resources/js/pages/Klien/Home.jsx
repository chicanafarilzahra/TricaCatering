// resources/js/pages/Klien/Home.jsx

import { useEffect, useState } from "react";
import axios from "axios";

import {
    ClipboardList,
    Truck,
    Clock3,
    CheckCircle2,
    UtensilsCrossed,
    Wallet,
    Activity,
    ArrowUpRight,
    Sparkles,
    ChevronRight,
    History,
} from "lucide-react";

import NavbarKlien from "../../components/NavbarKlien";

export default function HomeKlien() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.background = "#020817";

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        axios
            .get("/klien/pesanan")
            .then((res) => {
                setOrders(res.data || []);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const activeOrders = orders.filter((item) =>
        ["pending", "confirmed", "on_delivery"].includes(item.status)
    );

    const selesai = orders.filter((item) => item.status === "delivered");

    const totalTransaksi = orders.reduce(
        (sum, item) => sum + Number(item.total_price || 0),
        0
    );

    const onDelivery = activeOrders.some((o) => o.status === "on_delivery");

    const stats = [
        {
            title: "Total Pesanan",
            value: orders.length,
            icon: <ClipboardList size={20} />,
            color: "#60a5fa",
            accent: "#3b82f6",
            bg: "rgba(59,130,246,0.08)",
            border: "rgba(59,130,246,0.2)",
        },
        {
            title: "Pesanan Aktif",
            value: activeOrders.length,
            icon: <Truck size={20} />,
            color: "#a78bfa",
            accent: "#8b5cf6",
            bg: "rgba(139,92,246,0.08)",
            border: "rgba(139,92,246,0.2)",
        },
        {
            title: "Pesanan Selesai",
            value: selesai.length,
            icon: <CheckCircle2 size={20} />,
            color: "#34d399",
            accent: "#10b981",
            bg: "rgba(16,185,129,0.08)",
            border: "rgba(16,185,129,0.2)",
        },
        {
            title: "Total Transaksi",
            value: `Rp ${totalTransaksi.toLocaleString("id-ID")}`,
            icon: <Wallet size={20} />,
            color: "#fbbf24",
            accent: "#f59e0b",
            bg: "rgba(245,158,11,0.08)",
            border: "rgba(245,158,11,0.2)",
        },
    ];

    const now = new Date();
    const timeStr = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });
    const dateStr = now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const quickMenu = [
        {
            icon: <UtensilsCrossed size={22} />,
            title: "Pesan Makanan",
            desc: "Pesan menu catering harian dengan cepat.",
            color: "#60a5fa",
            bg: "rgba(59,130,246,0.1)",
            border: "rgba(59,130,246,0.2)",
        },
        {
            icon: <Truck size={22} />,
            title: "Tracking Pesanan",
            desc: "Pantau posisi pengiriman secara realtime.",
            color: "#a78bfa",
            bg: "rgba(139,92,246,0.1)",
            border: "rgba(139,92,246,0.2)",
        },
        {
            icon: <History size={22} />,
            title: "Riwayat Pesanan",
            desc: "Lihat seluruh histori transaksi Anda.",
            color: "#fbbf24",
            bg: "rgba(245,158,11,0.1)",
            border: "rgba(245,158,11,0.2)",
        },
    ];

    return (
        <div style={{ width: "100%", minHeight: "100vh", background: "#020817" }}>
            <NavbarKlien />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

                .klien-home * {
                    font-family: 'Inter', system-ui, sans-serif;
                    box-sizing: border-box;
                }

                .stat-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .stat-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 16px 48px rgba(0,0,0,0.35);
                }

                .quick-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
                    cursor: pointer;
                }
                .quick-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 16px 40px rgba(0,0,0,0.3);
                }

                .activity-row {
                    transition: background 0.15s ease;
                }
                .activity-row:hover {
                    background: rgba(255,255,255,0.04) !important;
                }

                .pulse-dot {
                    animation: pulse 2s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }

                @media (max-width: 900px) {
                    .bottom-grid-klien {
                        grid-template-columns: 1fr !important;
                    }
                    .hero-inner-klien {
                        flex-direction: column !important;
                    }
                    .hero-card-klien {
                        width: 100% !important;
                    }
                }
            `}</style>

            <div className="klien-home" style={{ padding: "30px" }}>
                {/* ── HERO ── */}
                <div style={{
                    position: "relative",
                    borderRadius: "24px",
                    padding: "40px",
                    background: "linear-gradient(135deg, #0d1117 0%, #0f172a 60%, #131c2e 100%)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    overflow: "hidden",
                    marginBottom: "24px",
                }}>
                    {/* Grid texture overlay */}
                    <div style={{
                        position: "absolute", inset: 0,
                        backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                        pointerEvents: "none",
                    }} />

                    {/* Glow orbs */}
                    <div style={{
                        position: "absolute", top: "-80px", right: "60px",
                        width: "300px", height: "300px", borderRadius: "999px",
                        background: "rgba(59,130,246,0.12)", filter: "blur(90px)",
                        pointerEvents: "none",
                    }} />
                    <div style={{
                        position: "absolute", bottom: "-60px", right: "-40px",
                        width: "200px", height: "200px", borderRadius: "999px",
                        background: "rgba(139,92,246,0.1)", filter: "blur(70px)",
                        pointerEvents: "none",
                    }} />

                    <div className="hero-inner-klien" style={{
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
                                Klien Dashboard
                            </div>

                            <h1 style={{
                                margin: 0,
                                fontSize: "clamp(28px, 3.5vw, 44px)",
                                lineHeight: 1.15,
                                color: "white",
                                fontWeight: "800",
                                letterSpacing: "-1.5px",
                                maxWidth: "600px",
                            }}>
                                Selamat datang,
                                <br />
                                <span style={{
                                    background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}>
                                    {user?.name || "Klien"} 👋
                                </span>
                            </h1>

                            <p style={{
                                margin: "16px 0 0",
                                color: "#64748b",
                                fontSize: "15px",
                                lineHeight: "1.8",
                                maxWidth: "560px",
                            }}>
                                Kelola pesanan catering, pantau pengiriman, lihat
                                invoice dan riwayat transaksi dalam satu dashboard.
                            </p>

                            <div style={{
                                marginTop: "28px",
                                display: "inline-flex", alignItems: "center", gap: "10px",
                                padding: "8px 16px", borderRadius: "12px",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                color: "#94a3b8", fontSize: "13px",
                            }}>
                                <Activity size={14} color="#60a5fa" />
                                <span>{dateStr}</span>
                                <span style={{
                                    width: "1px", height: "14px",
                                    background: "rgba(255,255,255,0.1)",
                                }} />
                                <span style={{ color: "white", fontWeight: "600" }}>{timeStr}</span>
                            </div>
                        </div>

                        {/* Right status card */}
                        <div className="hero-card-klien" style={{
                            width: "300px", flexShrink: 0,
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: "20px", padding: "24px",
                            backdropFilter: "blur(12px)",
                        }}>
                            <div style={{
                                fontSize: "11px", fontWeight: "700",
                                letterSpacing: "0.08em", textTransform: "uppercase",
                                color: "#475569", marginBottom: "18px",
                            }}>
                                Status Pesanan
                            </div>

                            {[
                                { label: "Pesanan Masuk", active: true },
                                { label: "Diproses Dapur", active: activeOrders.length > 0 },
                                { label: "Pengiriman", active: onDelivery },
                            ].map((row, i) => (
                                <div key={i} style={{
                                    display: "flex", justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "11px 0",
                                    borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none",
                                }}>
                                    <span style={{ color: "#94a3b8", fontSize: "13px" }}>{row.label}</span>
                                    <div style={{
                                        display: "flex", alignItems: "center", gap: "6px",
                                        color: row.active ? "#22c55e" : "#475569",
                                        fontSize: "12px", fontWeight: "600",
                                    }}>
                                        <span style={{
                                            width: "6px", height: "6px",
                                            borderRadius: "999px",
                                            background: row.active ? "#22c55e" : "#334155",
                                        }} />
                                        {row.active ? "Berjalan" : "Menunggu"}
                                    </div>
                                </div>
                            ))}

                            <div style={{
                                marginTop: "18px", padding: "12px 14px",
                                borderRadius: "12px",
                                background: "rgba(59,130,246,0.08)",
                                border: "1px solid rgba(59,130,246,0.15)",
                                display: "flex", alignItems: "center", gap: "8px",
                            }}>
                                <Sparkles size={14} color="#60a5fa" />
                                <span style={{ color: "#60a5fa", fontSize: "13px", fontWeight: "600" }}>
                                    {activeOrders.length > 0
                                        ? `${activeOrders.length} pesanan sedang berjalan`
                                        : "Tidak ada pesanan aktif"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── STATS GRID ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px",
                    marginBottom: "24px",
                }}>
                    {stats.map((item, index) => (
                        <div key={index} className="stat-card" style={{
                            background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
                            border: `1px solid ${item.border}`,
                            borderRadius: "20px",
                            padding: "24px",
                            position: "relative",
                            overflow: "hidden",
                            cursor: "default",
                        }}>
                            <div style={{
                                position: "absolute", top: 0, left: "24px", right: "24px",
                                height: "2px", borderRadius: "0 0 4px 4px",
                                background: `linear-gradient(90deg, ${item.accent}, transparent)`,
                            }} />

                            <div style={{
                                position: "absolute", top: "-40px", right: "-40px",
                                width: "110px", height: "110px", borderRadius: "999px",
                                background: item.bg, filter: "blur(30px)",
                                pointerEvents: "none",
                            }} />

                            <div style={{ position: "relative", zIndex: 2 }}>
                                <div style={{
                                    width: "44px", height: "44px", borderRadius: "14px",
                                    background: item.bg,
                                    border: `1px solid ${item.border}`,
                                    color: item.color,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    marginBottom: "20px",
                                }}>
                                    {item.icon}
                                </div>

                                <div style={{
                                    color: "white", fontSize: "26px",
                                    fontWeight: "800", lineHeight: 1,
                                    letterSpacing: "-0.8px", marginBottom: "8px",
                                }}>
                                    {item.value}
                                </div>

                                <div style={{
                                    color: "#475569", fontSize: "13px",
                                    fontWeight: "500", letterSpacing: "0.01em",
                                }}>
                                    {item.title}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── BOTTOM GRID ── */}
                <div className="bottom-grid-klien" style={{
                    display: "grid",
                    gridTemplateColumns: "1.6fr 1fr",
                    gap: "16px",
                    marginBottom: "24px",
                }}>
                    {/* ── TIMELINE STATUS ── */}
                    <div style={{
                        background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "20px",
                        padding: "28px",
                    }}>
                        <div style={{ marginBottom: "24px" }}>
                            <h2 style={{
                                margin: 0, color: "white",
                                fontSize: "18px", fontWeight: "700",
                                letterSpacing: "-0.3px",
                            }}>
                                Status Pengiriman
                            </h2>
                            <p style={{ margin: "4px 0 0", color: "#475569", fontSize: "13px" }}>
                                Tahapan pesanan Anda saat ini
                            </p>
                        </div>

                        <TimelineItem
                            active
                            title="Pesanan Masuk"
                            subtitle="Pesanan berhasil diterima sistem"
                        />
                        <TimelineItem
                            active={activeOrders.length > 0}
                            title="Diproses Dapur"
                            subtitle="Makanan sedang disiapkan"
                        />
                        <TimelineItem
                            progress={onDelivery}
                            title="Pengiriman"
                            subtitle="Kurir sedang menuju lokasi"
                        />
                        <TimelineItem
                            title="Pesanan Sampai"
                            subtitle="Menunggu diterima pelanggan"
                            last
                        />
                    </div>

                    {/* ── AKTIVITAS ── */}
                    <div style={{
                        background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "20px",
                        padding: "28px",
                    }}>
                        <div style={{
                            display: "flex", justifyContent: "space-between",
                            alignItems: "flex-start", marginBottom: "20px",
                        }}>
                            <div>
                                <h2 style={{
                                    margin: 0, color: "white",
                                    fontSize: "18px", fontWeight: "700",
                                    letterSpacing: "-0.3px",
                                }}>
                                    Aktivitas Terbaru
                                </h2>
                                <p style={{ margin: "4px 0 0", color: "#475569", fontSize: "13px" }}>
                                    Histori pesanan terakhir
                                </p>
                            </div>
                            <ChevronRight size={16} color="#334155" />
                        </div>

                        {orders.length === 0 ? (
                            <div style={{
                                borderRadius: "14px",
                                border: "1px dashed rgba(255,255,255,0.07)",
                                padding: "40px 20px",
                                textAlign: "center",
                            }}>
                                <div style={{
                                    width: "48px", height: "48px",
                                    borderRadius: "14px",
                                    background: "rgba(255,255,255,0.04)",
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center", margin: "0 auto 16px",
                                }}>
                                    <ClipboardList size={20} color="#334155" />
                                </div>
                                <div style={{ color: "#475569", fontSize: "14px" }}>
                                    Belum ada aktivitas.
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                {orders.slice(0, 5).map((item) => (
                                    <div key={item.id} className="activity-row" style={{
                                        padding: "14px 10px",
                                        borderRadius: "12px",
                                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                                    }}>
                                        <div style={{
                                            color: "white", fontWeight: "700", fontSize: "14px",
                                        }}>
                                            Pesanan #{item.id}
                                        </div>
                                        <div style={{
                                            color: "#94a3b8", marginTop: "4px", fontSize: "13px",
                                        }}>
                                            Status : {item.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── MENU CEPAT ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "16px",
                }}>
                    {quickMenu.map((item, index) => (
                        <div key={index} className="quick-card" style={{
                            background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
                            border: `1px solid ${item.border}`,
                            borderRadius: "20px",
                            padding: "26px",
                            position: "relative",
                            overflow: "hidden",
                        }}>
                            <div style={{
                                position: "absolute", top: 0, left: "26px", right: "26px",
                                height: "2px",
                                background: `linear-gradient(90deg, ${item.color}, transparent)`,
                            }} />

                            <div style={{
                                width: "44px", height: "44px", borderRadius: "14px",
                                background: item.bg,
                                border: `1px solid ${item.border}`,
                                color: item.color,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginBottom: "18px",
                            }}>
                                {item.icon}
                            </div>

                            <h3 style={{
                                color: "white", margin: "0 0 8px",
                                fontSize: "15px", fontWeight: "700",
                            }}>
                                {item.title}
                            </h3>

                            <p style={{
                                color: "#64748b", margin: 0,
                                fontSize: "13px", lineHeight: 1.7,
                            }}>
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ===================== */

function TimelineItem({ title, subtitle, active, progress, last }) {
    return (
        <div style={{
            display: "flex",
            gap: "15px",
            marginBottom: last ? 0 : "25px",
        }}>
            <div style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                marginTop: "4px",
                flexShrink: 0,
                background: active ? "#3b82f6" : progress ? "#60a5fa" : "#1e293b",
                border: active || progress ? "none" : "1px solid #334155",
                boxShadow: active
                    ? "0 0 0 3px rgba(59,130,246,0.15)"
                    : progress
                    ? "0 0 0 3px rgba(96,165,250,0.15)"
                    : "none",
            }} />

            <div>
                <div style={{ color: "white", fontWeight: "700", fontSize: "14px" }}>
                    {title}
                </div>
                <div style={{ color: "#64748b", marginTop: "4px", fontSize: "13px" }}>
                    {subtitle}
                </div>
            </div>
        </div>
    );
}