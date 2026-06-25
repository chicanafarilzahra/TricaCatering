// resources/js/pages/SPPG.jsx
import {
    School,
    Package,
    Truck,
    CheckCircle2,
    Search,
    Filter,
    ArrowUpRight,
} from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../layouts/AdminLayout";

export default function SPPG() {
    const activityRef = useRef(null);
    const [search, setSearch] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const [distribusi, setDistribusi] = useState([]);

    useEffect(() => {
        fetchDistribusi();
    }, []);

    const fetchDistribusi = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8000/api/sppg/distribusi", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            setDistribusi(res.data);
        } catch (error) {
            console.error("Gagal mengambil distribusi:", error.response?.data || error.message);
        }
    };

    const sppgData = Array.isArray(distribusi) ? distribusi : [];

    const totalSchools = new Set(sppgData.map((item) => item.sekolah?.nama)).size;
    const totalPackages = new Set(sppgData.map((item) => item.menu?.name)).size;

    const filteredData = useMemo(() => {
        let data = [...sppgData];
        if (showFilter) {
            data = data.filter((item) =>
                statusFilter === "All" ? true : item.status === statusFilter
            );
        }
        if (search) {
            data = data.filter((item) =>
                [item.sekolah?.nama, item.menu?.name, item.status]
                    .join(" ")
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }
        return data;
    }, [search, sppgData, showFilter, statusFilter]);

    const stats = [
        {
            title: "Schools",
            value: totalSchools,
            icon: <School size={22} />,
            color: "#3b82f6",
            gradient: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
            border: "#3b82f6",
            bg: "rgba(59,130,246,0.15)",
        },
        {
            title: "Packages",
            value: totalPackages,
            icon: <Package size={22} />,
            color: "#8b5cf6",
            gradient: "linear-gradient(135deg,#5b21b6,#8b5cf6)",
            border: "#8b5cf6",
            bg: "rgba(139,92,246,0.15)",
        },
        {
            title: "Deliveries",
            value: sppgData.filter((item) => item.status === "on_delivery").length,
            icon: <Truck size={22} />,
            color: "#10b981",
            gradient: "linear-gradient(135deg,#065f46,#10b981)",
            border: "#10b981",
            bg: "rgba(16,185,129,0.15)",
        },
        {
            title: "Completed",
            value: sppgData.filter((item) => item.status === "delivered").length,
            icon: <CheckCircle2 size={22} />,
            color: "#f59e0b",
            gradient: "linear-gradient(135deg,#b45309,#f59e0b)",
            border: "#f59e0b",
            bg: "rgba(245,158,11,0.15)",
        },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case "delivered":    return { background: "rgba(16,185,129,0.14)", color: "#34d399" };
            case "on_delivery":  return { background: "rgba(59,130,246,0.14)", color: "#60a5fa" };
            case "pending":      return { background: "rgba(245,158,11,0.14)", color: "#fbbf24" };
            default:             return { background: "rgba(148,163,184,0.14)", color: "#cbd5e1" };
        }
    };

    return (
        <AdminLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                .sppg-root, .sppg-root * {
                    font-family: 'Inter', system-ui, sans-serif;
                    box-sizing: border-box;
                }
                .stat-card {
                    transition: all .25s ease;
                    cursor: default;
                }
                .stat-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 50px rgba(0,0,0,.4);
                }
            `}</style>

            <div className="sppg-root">

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
                                <School size={15} />
                                SPPG Management
                            </div>

                            <h1 style={{
                                margin: 0, color: "white", fontSize: "42px",
                                fontWeight: "800", lineHeight: 1.2, letterSpacing: "-1px",
                            }}>
                                School Food<br />Services
                            </h1>

                            <p style={{
                                margin: "18px 0 0", color: "#94a3b8",
                                fontSize: "15px", lineHeight: "30px", maxWidth: "720px",
                            }}>
                                Kelola dan pantau seluruh aktivitas layanan makanan sekolah
                                dengan dashboard modern yang clean, elegant, dan realtime.
                            </p>
                        </div>

                        <button
                            onClick={() => activityRef.current?.scrollIntoView({ behavior: "smooth" })}
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

                {/* STATS — 4 kolom 1 baris */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "22px",
                    marginBottom: "30px",
                }}>
                    {stats.map((item, index) => (
                        <div key={index} className="stat-card" style={{
                            background: "linear-gradient(180deg,#111827 0%,#0f172a 100%)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderTop: `2px solid ${item.border}`,
                            borderRadius: "22px",
                            padding: "28px 24px 24px",
                            position: "relative",
                            overflow: "hidden",
                        }}>
                            <div style={{
                                position: "absolute", top: 0, left: 0, right: 0,
                                height: "60px",
                                background: `linear-gradient(180deg, ${item.bg} 0%, transparent 100%)`,
                                pointerEvents: "none",
                            }} />
                            <div style={{ position: "relative", zIndex: 2 }}>
                                <div style={{
                                    width: "52px", height: "52px", borderRadius: "16px",
                                    background: item.gradient, color: "white",
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center", marginBottom: "20px",
                                    boxShadow: `0 8px 20px ${item.bg}`,
                                }}>
                                    {item.icon}
                                </div>
                                <div style={{ color: "white", fontSize: "36px", fontWeight: "800", lineHeight: 1, marginBottom: "8px" }}>
                                    {item.value}
                                </div>
                                <div style={{ color: "#64748b", fontSize: "13px", fontWeight: "500" }}>
                                    {item.title}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* TABLE SECTION */}
                <div ref={activityRef} style={{
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
                                SPPG Activity
                            </h2>
                            <p style={{ margin: "8px 0 0", color: "#94a3b8", fontSize: "14px" }}>
                                School meal production and distribution
                            </p>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
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
                                    placeholder="Search activity..."
                                    style={{
                                        flex: 1, background: "transparent",
                                        border: "none", outline: "none",
                                        color: "white", fontSize: "14px",
                                    }}
                                />
                            </div>

                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                style={{
                                    height: "50px", padding: "0 20px",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: "16px",
                                    background: showFilter
                                        ? "linear-gradient(135deg,#2563eb,#3b82f6)"
                                        : "rgba(255,255,255,0.04)",
                                    color: "white", display: "flex",
                                    alignItems: "center", gap: "10px",
                                    fontWeight: "600", fontSize: "14px",
                                    cursor: "pointer", transition: "all .2s ease",
                                }}
                            >
                                <Filter size={18} />
                                {showFilter ? "Filter Active" : "Filter"}
                            </button>

                            {/* Filter Select */}
                            {showFilter && (
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    style={{
                                        height: "50px", padding: "0 18px",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        borderRadius: "16px",
                                        background: "rgba(255,255,255,0.04)",
                                        color: "white", fontWeight: "600",
                                        fontSize: "14px", cursor: "pointer",
                                        outline: "none", minWidth: "150px",
                                    }}
                                >
                                    <option value="All" style={{ color: "black" }}>All Status</option>
                                    <option value="delivered" style={{ color: "black" }}>Delivered</option>
                                    <option value="on_delivery" style={{ color: "black" }}>On Delivery</option>
                                    <option value="pending" style={{ color: "black" }}>Pending</option>
                                </select>
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
                                    {["School", "Package", "Total Meals", "Delivery Date", "Status"].map((col, index) => (
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
                                {filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr
                                            key={index}
                                            style={{ transition: "all .2s ease" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.025)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                        >
                                            {/* School */}
                                            <td style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                    <div style={{
                                                        width: "36px", height: "36px", borderRadius: "10px",
                                                        background: "rgba(59,130,246,.15)", color: "#60a5fa",
                                                        display: "flex", alignItems: "center",
                                                        justifyContent: "center", fontWeight: "700", fontSize: "13px",
                                                    }}>
                                                        {item.sekolah?.nama?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <span style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>
                                                        {item.sekolah?.nama}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Package */}
                                            <td style={{ padding: "16px", color: "#cbd5e1", fontSize: "14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                {item.menu?.name}
                                            </td>

                                            {/* Total Meals */}
                                            <td style={{ padding: "16px", color: "white", fontWeight: "600", fontSize: "14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                {item.jumlah_porsi}
                                            </td>

                                            {/* Delivery Date */}
                                            <td style={{ padding: "16px", color: "#94a3b8", fontSize: "14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                {item.tanggal_distribusi}
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
                                                : showFilter
                                                ? "Tidak ada data sesuai filter"
                                                : "Belum ada data SPPG"}
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