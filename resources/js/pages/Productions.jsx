// resources/js/pages/Productions.jsx
import axios from "axios";
import {
    Factory,
    PackageCheck,
    Clock3,
    BadgeCheck,
    Search,
    Filter,
    Eye,
} from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";

export default function Productions() {
    const tableRef = useRef(null);
    const [search, setSearch] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("All Productions");
    const [productions, setProductions] = useState([]);

    useEffect(() => {
        fetchProductions();
    }, []);

    const fetchProductions = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/productions");
            setProductions(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const filteredProductions = useMemo(() => {
        return productions.filter((item) => {
            const matchSearch =
                item.code?.toLowerCase().includes(search.toLowerCase()) ||
                item.package?.toLowerCase().includes(search.toLowerCase()) ||
                item.status?.toLowerCase().includes(search.toLowerCase());
            const matchFilter =
                selectedFilter === "All Productions" || item.status === selectedFilter;
            return matchSearch && matchFilter;
        });
    }, [productions, search, selectedFilter]);

    const stats = [
        {
            title: "Total Productions",
            value: productions.length,
            icon: <Factory size={22} />,
            color: "#3b82f6",
            bg: "rgba(59,130,246,0.15)",
        },
        {
            title: "Confirmed",
            value: productions.filter((item) => item.status === "confirmed").length,
            icon: <BadgeCheck size={22} />,
            color: "#f59e0b",
            bg: "rgba(245,158,11,0.15)",
        },
        {
            title: "Delivered",
            value: productions.filter((item) => item.status === "delivered").length,
            icon: <Clock3 size={22} />,
            color: "#10b981",
            bg: "rgba(16,185,129,0.15)",
        },
        {
            title: "Packages Produced",
            value: productions.reduce((acc, item) => acc + (item.quantity || 0), 0),
            icon: <PackageCheck size={22} />,
            color: "#8b5cf6",
            bg: "rgba(139,92,246,0.15)",
        },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case "confirmed":
                return { background: "rgba(59,130,246,0.15)", color: "#60a5fa" };
            case "on_delivery":
                return { background: "rgba(245,158,11,0.15)", color: "#fbbf24" };
            case "delivered":
                return { background: "rgba(16,185,129,0.15)", color: "#34d399" };
            case "pending":
                return { background: "rgba(239,68,68,0.15)", color: "#f87171" };
            default:
                return { background: "rgba(148,163,184,0.15)", color: "#cbd5e1" };
        }
    };

    return (
        <AdminLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                .prod-root, .prod-root * {
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
            `}</style>

            <div className="prod-root">

                {/* HERO */}
                <div style={{
                    width: "100%",
                    borderRadius: "32px",
                    padding: "42px",
                    background: "linear-gradient(135deg,#0f172a 0%,#111827 45%,#1e293b 100%)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    position: "relative",
                    overflow: "hidden",
                    marginBottom: "32px",
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
                                <Factory size={15} />
                                Production Activity
                            </div>

                            <h1 style={{
                                margin: 0, color: "white", fontSize: "42px",
                                fontWeight: "800", lineHeight: 1.2, letterSpacing: "-1px",
                            }}>
                                Production<br />Overview
                            </h1>

                            <p style={{
                                margin: "18px 0 0", color: "#94a3b8",
                                fontSize: "15px", lineHeight: "30px", maxWidth: "720px",
                            }}>
                                Pantau seluruh aktivitas produksi, status pengiriman, dan
                                jumlah paket yang diproduksi secara realtime dalam satu dashboard.
                            </p>
                        </div>

                        <button
                            onClick={() => tableRef.current?.scrollIntoView({ behavior: "smooth" })}
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
                            <Eye size={18} />
                            View Details
                        </button>
                    </div>
                </div>

                {/* STATS — 4 kolom 1 baris */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    gap: "16px",
                    marginBottom: "24px",
                }}>
                    {stats.map((item, index) => (
                        <div key={index} className="stat-card" style={{
                            background: "linear-gradient(160deg,#0f172a 0%,#0d1117 100%)",
                            border: `1px solid ${item.bg.replace("0.15", "0.25")}`,
                            borderRadius: "20px",
                            padding: "24px",
                            position: "relative",
                            overflow: "hidden",
                            cursor: "default",
                        }}>
                            {/* Accent Line */}
                            <div style={{
                                position: "absolute", top: 0, left: "24px", right: "24px",
                                height: "2px",
                                background: `linear-gradient(90deg, ${item.color}, transparent)`,
                            }} />

                            {/* Glow */}
                            <div style={{
                                position: "absolute", top: "-40px", right: "-40px",
                                width: "110px", height: "110px", borderRadius: "999px",
                                background: item.bg, filter: "blur(30px)",
                            }} />

                            <div style={{ position: "relative", zIndex: 2 }}>
                                {/* Icon */}
                                <div style={{
                                    width: "44px", height: "44px", borderRadius: "14px",
                                    background: item.bg, color: item.color,
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center", marginBottom: "20px",
                                }}>
                                    {item.icon}
                                </div>

                                {/* Value */}
                                <div style={{
                                    color: "white", fontSize: "36px", fontWeight: "800",
                                    lineHeight: 1, letterSpacing: "-1px", marginBottom: "8px",
                                }}>
                                    {item.value}
                                </div>

                                {/* Title */}
                                <div style={{ color: "#475569", fontSize: "13px", fontWeight: "500" }}>
                                    {item.title}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* TABLE SECTION */}
                <div ref={tableRef} style={{
                    background: "linear-gradient(180deg,#111827 0%,#0f172a 100%)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "30px",
                    padding: "30px",
                    overflow: "hidden",
                }}>
                    {/* Header */}
                    <div style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", flexWrap: "wrap", gap: "18px",
                        marginBottom: "28px",
                    }}>
                        <div>
                            <h2 style={{ margin: 0, color: "white", fontSize: "26px", fontWeight: "700" }}>
                                Production List
                            </h2>
                            <p style={{ margin: "8px 0 0", color: "#94a3b8", fontSize: "14px" }}>
                                Daftar seluruh aktivitas produksi catering
                            </p>
                        </div>

                        <div style={{
                            display: "flex", alignItems: "center",
                            gap: "12px", flexWrap: "wrap", position: "relative",
                        }}>
                            {/* Search */}
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
                                    placeholder="Search productions..."
                                    style={{
                                        flex: 1, background: "transparent",
                                        border: "none", outline: "none",
                                        color: "white", fontSize: "14px",
                                    }}
                                />
                            </div>

                            {/* Filter Button */}
                            <button
                                onClick={() => setFilterOpen(!filterOpen)}
                                style={{
                                    height: "50px", padding: "0 20px",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: "16px",
                                    background: filterOpen ? "#2563eb" : "rgba(255,255,255,0.04)",
                                    color: "white", display: "flex",
                                    alignItems: "center", gap: "10px",
                                    fontWeight: "600", fontSize: "14px",
                                    cursor: "pointer", transition: "all .2s ease",
                                }}
                            >
                                <Filter size={18} />
                                {selectedFilter}
                            </button>

                            {/* Filter Dropdown */}
                            {filterOpen && (
                                <div style={{
                                    position: "absolute", top: "62px", right: 0,
                                    width: "220px", background: "#0f172a",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: "18px", padding: "10px", zIndex: 10,
                                    boxShadow: "0 20px 60px rgba(0,0,0,.5)",
                                }}>
                                    {[
                                        { label: "All Productions", value: "All Productions" },
                                        { label: "Confirmed",       value: "confirmed"       },
                                        { label: "On Delivery",     value: "on_delivery"     },
                                        { label: "Delivered",       value: "delivered"       },
                                    ].map((opt, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setSelectedFilter(opt.value);
                                                setFilterOpen(false);
                                            }}
                                            style={{
                                                width: "100%", height: "44px",
                                                border: "none", borderRadius: "12px",
                                                background: selectedFilter === opt.value
                                                    ? "rgba(59,130,246,0.18)" : "transparent",
                                                color: selectedFilter === opt.value ? "#60a5fa" : "#e2e8f0",
                                                textAlign: "left", padding: "0 14px",
                                                cursor: "pointer", fontSize: "14px",
                                                fontWeight: selectedFilter === opt.value ? "600" : "400",
                                                transition: "all .15s ease",
                                            }}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ width: "100%", overflowX: "auto", borderRadius: "16px" }}>
                        <table style={{
                            width: "100%", borderCollapse: "separate",
                            borderSpacing: 0, minWidth: "900px",
                        }}>
                            <thead>
                                <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                                    {["Production Code", "Package", "Quantity", "Production Date", "Status"].map((col, index) => (
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
                                {filteredProductions.length > 0 ? (
                                    filteredProductions.map((item, index) => (
                                        <tr
                                            key={index}
                                            style={{ transition: "all .2s ease" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.025)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                        >
                                            {/* Code */}
                                            <td style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                    <div style={{
                                                        width: "36px", height: "36px", borderRadius: "10px",
                                                        background: "rgba(59,130,246,.15)", color: "#60a5fa",
                                                        display: "flex", alignItems: "center",
                                                        justifyContent: "center", fontWeight: "700", fontSize: "13px",
                                                    }}>
                                                        {item.code?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <span style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>
                                                        {item.code}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Package */}
                                            <td style={{ padding: "16px", color: "#cbd5e1", fontSize: "14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                {item.package}
                                            </td>

                                            {/* Quantity */}
                                            <td style={{ padding: "16px", color: "white", fontWeight: "600", fontSize: "14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                {item.quantity}
                                            </td>

                                            {/* Date */}
                                            <td style={{ padding: "16px", color: "#94a3b8", fontSize: "14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                {item.date}
                                            </td>

                                            {/* Status */}
                                            <td style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                <span style={{
                                                    padding: "6px 14px", borderRadius: "999px",
                                                    fontSize: "12px", fontWeight: "700",
                                                    ...getStatusStyle(item.status),
                                                }}>
                                                    {item.status}
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
                                            {search
                                                ? `Tidak ada hasil untuk "${search}"`
                                                : "Belum ada data produksi"}
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