import {
    Truck,
    Clock3,
    CheckCircle2,
    PackageCheck,
    Search,
    ArrowUpRight,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";

export default function Deliveries() {
    const deliveryListRef = useRef(null);
    const [search, setSearch]             = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [deliveries, setDeliveries]     = useState([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch("/api/admin/distribusis")
            .then((res) => {
                if (!res.ok) throw new Error("Gagal mengambil data");
                return res.json();
            })
            .then((data) => {
                setDeliveries(data);
                setError(null);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const filteredDeliveries = useMemo(() => {
        return deliveries.filter((delivery) => {
            const matchSearch =
                delivery.sppgName?.toLowerCase().includes(search.toLowerCase()) ||
                delivery.sekolah?.toLowerCase().includes(search.toLowerCase()) ||
                delivery.courier?.toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === "All" || delivery.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [deliveries, search, statusFilter]);

    const stats = [
        {
            title: "Total Distribusi",
            value: deliveries.length,
            icon: <Truck size={22} />,
            color: "#3b82f6",
            bg: "rgba(59,130,246,0.15)",
        },
        {
            title: "Dikirim",
            value: deliveries.filter((d) => d.status === "Dikirim").length,
            icon: <Clock3 size={22} />,
            color: "#f59e0b",
            bg: "rgba(245,158,11,0.15)",
        },
        {
            title: "Selesai",
            value: deliveries.filter((d) => d.status === "Selesai").length,
            icon: <CheckCircle2 size={22} />,
            color: "#10b981",
            bg: "rgba(16,185,129,0.15)",
        },
        {
            title: "Diproses",
            value: deliveries.filter((d) => d.status === "Diproses").length,
            icon: <PackageCheck size={22} />,
            color: "#8b5cf6",
            bg: "rgba(139,92,246,0.15)",
        },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case "Diproses":  return { background: "rgba(148,163,184,0.15)", color: "#94a3b8" };
            case "Disiapkan": return { background: "rgba(59,130,246,0.15)",  color: "#60a5fa" };
            case "Dikirim":   return { background: "rgba(245,158,11,0.15)",  color: "#fbbf24" };
            case "Selesai":   return { background: "rgba(16,185,129,0.15)",  color: "#34d399" };
            default:          return { background: "rgba(148,163,184,0.15)", color: "#cbd5e1" };
        }
    };

    return (
        <AdminLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                .del-root, .del-root * {
                    font-family: 'Inter', system-ui, sans-serif;
                    box-sizing: border-box;
                }
                .stat-card {
                    transition: transform .2s ease, box-shadow .2s ease;
                    cursor: default;
                }
                .stat-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 16px 48px rgba(0,0,0,.35);
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
            `}</style>

            <div className="del-root">

                {/* HERO */}
                <div style={{
                    width: "100%", borderRadius: "32px", padding: "42px",
                    background: "linear-gradient(135deg,#0f172a 0%,#111827 45%,#1e293b 100%)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    position: "relative", overflow: "hidden", marginBottom: "32px",
                }}>
                    <div style={{
                        position: "absolute", top: "-120px", right: "-80px",
                        width: "280px", height: "280px", borderRadius: "999px",
                        background: "rgba(59,130,246,0.18)", filter: "blur(120px)",
                    }} />
                    <div style={{
                        position: "relative", zIndex: 2,
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", flexWrap: "wrap", gap: "24px",
                    }}>
                        <div>
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: "8px",
                                padding: "8px 16px", borderRadius: "999px",
                                background: "rgba(59,130,246,0.12)",
                                border: "1px solid rgba(59,130,246,0.18)",
                                color: "#60a5fa", fontSize: "13px", fontWeight: "600",
                                marginBottom: "20px",
                            }}>
                                <Truck size={15} />
                                Delivery Tracking
                            </div>
                            <h1 style={{
                                margin: 0, color: "white", fontSize: "42px",
                                fontWeight: "800", lineHeight: 1.2, letterSpacing: "-1px",
                            }}>
                                Delivery<br />Overview
                            </h1>
                            <p style={{
                                margin: "18px 0 0", color: "#94a3b8",
                                fontSize: "15px", lineHeight: "30px", maxWidth: "720px",
                            }}>
                                Pantau seluruh aktivitas pengiriman catering secara realtime
                                dengan dashboard modern yang clean, elegant, dan profesional.
                            </p>
                        </div>
                        <button
                            onClick={() => deliveryListRef.current?.scrollIntoView({ behavior: "smooth" })}
                            style={{
                                height: "56px", padding: "0 24px", border: "none",
                                borderRadius: "16px",
                                background: "linear-gradient(135deg,#2563eb,#3b82f6)",
                                color: "white", fontWeight: "700", fontSize: "14px",
                                display: "flex", alignItems: "center", gap: "10px",
                                cursor: "pointer", boxShadow: "0 12px 30px rgba(37,99,235,0.35)",
                                transition: "all .2s ease",
                            }}
                        >
                            View Reports
                            <ArrowUpRight size={18} />
                        </button>
                    </div>
                </div>

                {/* STATS */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    gap: "16px", marginBottom: "24px",
                }}>
                    {stats.map((item, index) => (
                        <div key={index} className="stat-card" style={{
                            background: "linear-gradient(160deg,#0f172a 0%,#0d1117 100%)",
                            border: `1px solid ${item.bg.replace("0.15", "0.25")}`,
                            borderRadius: "20px", padding: "24px",
                            position: "relative", overflow: "hidden",
                        }}>
                            <div style={{
                                position: "absolute", top: 0, left: "24px", right: "24px",
                                height: "2px",
                                background: `linear-gradient(90deg, ${item.color}, transparent)`,
                            }} />
                            <div style={{
                                position: "absolute", top: "-40px", right: "-40px",
                                width: "110px", height: "110px", borderRadius: "999px",
                                background: item.bg, filter: "blur(30px)",
                            }} />
                            <div style={{ position: "relative", zIndex: 2 }}>
                                <div style={{
                                    width: "44px", height: "44px", borderRadius: "14px",
                                    background: item.bg, color: item.color,
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center", marginBottom: "20px",
                                }}>
                                    {item.icon}
                                </div>
                                <div style={{
                                    color: "white", fontSize: "36px", fontWeight: "800",
                                    lineHeight: 1, letterSpacing: "-1px", marginBottom: "8px",
                                }}>
                                    {loading ? "—" : item.value}
                                </div>
                                <div style={{ color: "#475569", fontSize: "13px", fontWeight: "500" }}>
                                    {item.title}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* TABLE SECTION */}
                <div ref={deliveryListRef} style={{
                    background: "linear-gradient(180deg,#111827 0%,#0f172a 100%)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "30px", padding: "30px", overflow: "hidden",
                }}>
                    <div style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", flexWrap: "wrap", gap: "18px",
                        marginBottom: "28px",
                    }}>
                        <div>
                            <h2 style={{ margin: 0, color: "white", fontSize: "26px", fontWeight: "700" }}>
                                Delivery List
                            </h2>
                            <p style={{ margin: "8px 0 0", color: "#94a3b8", fontSize: "14px" }}>
                                Delivery and shipment data
                            </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                            <div style={{
                                height: "50px", minWidth: "260px",
                                border: "1px solid rgba(255,255,255,0.06)",
                                background: "rgba(255,255,255,0.04)",
                                borderRadius: "16px", display: "flex",
                                alignItems: "center", padding: "0 16px", gap: "10px",
                            }}>
                                <Search size={18} color="#94a3b8" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari SPPG, sekolah..."
                                    style={{
                                        flex: 1, background: "transparent",
                                        border: "none", outline: "none",
                                        color: "white", fontSize: "14px",
                                    }}
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{
                                    height: "50px", padding: "0 18px",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: "16px",
                                    background: "rgba(255,255,255,0.04)",
                                    color: "white", fontWeight: "600",
                                    fontSize: "14px", cursor: "pointer", outline: "none",
                                    minWidth: "150px",
                                }}
                            >
                                <option value="All"      style={{ color: "black" }}>All Status</option>
                                <option value="Diproses" style={{ color: "black" }}>Diproses</option>
                                <option value="Disiapkan" style={{ color: "black" }}>Disiapkan</option>
                                <option value="Dikirim"  style={{ color: "black" }}>Dikirim</option>
                                <option value="Selesai"  style={{ color: "black" }}>Selesai</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            padding: "14px 20px", borderRadius: "12px",
                            background: "rgba(239,68,68,0.1)",
                            border: "1px solid rgba(239,68,68,0.2)",
                            color: "#f87171", fontSize: "14px", marginBottom: "20px",
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <div style={{ width: "100%", overflowX: "auto", borderRadius: "16px" }}>
                        <table style={{
                            width: "100%", borderCollapse: "separate",
                            borderSpacing: 0, minWidth: "800px",
                        }}>
                            <thead>
                                <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                                    {["Nama SPPG", "Nama Sekolah", "Akun Operator", "Tanggal", "Status"].map((col, index) => (
                                        <th key={index} style={{
                                            textAlign: "left", padding: "16px",
                                            color: "#94a3b8", fontSize: "12px",
                                            fontWeight: "700", textTransform: "uppercase",
                                            letterSpacing: ".08em",
                                            borderBottom: "1px solid rgba(255,255,255,.06)",
                                            ...(index === 0 && { borderTopLeftRadius: "14px" }),
                                            ...(index === 4 && { borderTopRightRadius: "14px" }),
                                        }}>
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i}>
                                            {[...Array(5)].map((_, j) => (
                                                <td key={j} style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                    <div style={{
                                                        height: "16px", borderRadius: "8px",
                                                        background: "rgba(255,255,255,0.06)",
                                                        width: j === 4 ? "80px" : "100%",
                                                        animation: "pulse 1.5s ease infinite",
                                                    }} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : filteredDeliveries.length > 0 ? (
                                    filteredDeliveries.map((delivery, index) => (
                                        <tr
                                            key={index}
                                            style={{ transition: "all .2s ease" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.025)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                        >
                                            {/* Nama SPPG */}
                                            <td style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                    <div style={{
                                                        width: "36px", height: "36px", borderRadius: "10px",
                                                        background: "rgba(59,130,246,.15)", color: "#60a5fa",
                                                        display: "flex", alignItems: "center",
                                                        justifyContent: "center", fontWeight: "700", fontSize: "13px",
                                                    }}>
                                                        {delivery.sppgName?.charAt(0)?.toUpperCase() ?? "S"}
                                                    </div>
                                                    <span style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>
                                                        {delivery.sppgName}
                                                    </span>
                                                </div>
                                            </td>
                                            {/* Nama Sekolah */}
                                            <td style={{ padding: "16px", color: "#cbd5e1", fontSize: "14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                {delivery.sekolah}
                                            </td>
                                            {/* Akun Operator (email/username SPPG) */}
                                            <td style={{ padding: "16px", color: "#94a3b8", fontSize: "14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                {delivery.courier}
                                            </td>
                                            {/* Tanggal */}
                                            <td style={{ padding: "16px", color: "#94a3b8", fontSize: "14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                {delivery.date}
                                            </td>
                                            {/* Status */}
                                            <td style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                <span style={{
                                                    padding: "6px 14px", borderRadius: "999px",
                                                    fontSize: "12px", fontWeight: "700",
                                                    ...getStatusStyle(delivery.status),
                                                }}>
                                                    {delivery.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} style={{
                                            padding: "80px 20px", textAlign: "center",
                                            color: "#64748b", fontSize: "15px",
                                        }}>
                                            Belum ada data delivery
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}