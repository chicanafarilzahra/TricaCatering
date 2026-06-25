// resources/js/pages/Stocks.jsx
import axios from "axios";
import {
    Boxes,
    AlertTriangle,
    Package,
    CheckCircle2,
    Search,
    ArrowUpRight,
    X,
} from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";

export default function Stocks() {
    const stockRef = useRef(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [stocks, setStocks] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/stocks");
            setStocks(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleViewStock = async (group) => {
        try {
            const url =
                group.source === "Owner"
                    ? `http://localhost:8000/api/stocks/owner/${group.id}`
                    : `http://localhost:8000/api/stocks/sppg/${group.id}`;

            const res = await axios.get(url);
            setSelectedGroup({
                ...group,
                items: res.data.data || res.data,
            });
        } catch (err) {
            console.log(err);
        }
    };

    const filteredStocks = useMemo(() => {
        return stocks.filter((item) => {
            const matchSearch =
                item.name?.toLowerCase().includes(search.toLowerCase()) ||
                item.tempat?.toLowerCase().includes(search.toLowerCase()) ||
                item.source?.toLowerCase().includes(search.toLowerCase()) ||
                item.unit?.toLowerCase().includes(search.toLowerCase());
            const stockStatus = item.qty <= item.minimum_stock ? "Low Stock" : "Normal";
            const matchStatus = statusFilter === "All" || stockStatus === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [stocks, search, statusFilter]);

    const stats = [
        {
            title: "Total Items",
            value: stocks.length,
            icon: <Boxes size={22} />,
            color: "#3b82f6",
            bg: "rgba(59,130,246,0.15)",
        },
        {
            title: "Low Stock",
            value: stocks.filter((item) => item.qty <= item.minimum_stock).length,
            icon: <AlertTriangle size={22} />,
            color: "#f59e0b",
            bg: "rgba(245,158,11,0.15)",
        },
        {
            title: "Owner Stocks",
            value: stocks.filter((item) => item.source === "Owner").length,
            icon: <Package size={22} />,
            color: "#8b5cf6",
            bg: "rgba(139,92,246,0.15)",
        },
        {
            title: "Sppg Stock",
            value: stocks.filter((item) => item.source === "SPPG").length,
            icon: <CheckCircle2 size={22} />,
            color: "#10b981",
            bg: "rgba(16,185,129,0.15)",
        },
    ];

    const groupedStocks = Object.values(
        stocks.reduce((acc, item) => {
            const key = item.source + "-" + item.tempat;
            if (!acc[key]) {
                acc[key] = {
                    id: item.id,
                    source: item.source,
                    tempat: item.tempat,
                    jumlah_bahan: item.jumlah_bahan,
                    items: [],
                };
            }
            acc[key].items.push(item);
            return acc;
        }, {})
    );

    const modalStats = selectedGroup
        ? [
              {
                  title: "Total Items",
                  value: selectedGroup.items?.length || 0,
                  icon: <Boxes size={20} />,
                  color: "#3b82f6",
                  bg: "rgba(59,130,246,0.12)",
              },
              {
                  title: "Normal Stock",
                  value: selectedGroup.items?.filter((i) => i.qty > i.minimum_stock).length || 0,
                  icon: <CheckCircle2 size={20} />,
                  color: "#10b981",
                  bg: "rgba(16,185,129,0.12)",
              },
              {
                  title: "Low Stock",
                  value: selectedGroup.items?.filter((i) => i.qty <= i.minimum_stock).length || 0,
                  icon: <AlertTriangle size={20} />,
                  color: "#ef4444",
                  bg: "rgba(239,68,68,0.12)",
              },
          ]
        : [];

    return (
        <AdminLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                .dash-root, .dash-root * {
                    font-family: 'Inter', system-ui, sans-serif;
                    box-sizing: border-box;
                }
                .stat-card {
                    transition: transform .2s ease, box-shadow .2s ease;
                }
                .stat-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 16px 48px rgba(0,0,0,.35);
                }
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.7);
                    backdrop-filter: blur(6px);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    animation: fadeIn .2s ease;
                }
                .modal-panel {
                    background: linear-gradient(180deg,#111827 0%,#0f172a 100%);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 28px;
                    width: 100%;
                    max-width: 860px;
                    max-height: 90vh;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    animation: slideUp .25s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(32px); opacity: 0; }
                    to   { transform: translateY(0);    opacity: 1; }
                }
            `}</style>

            <div className="dash-root">

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
                                <Boxes size={15} />
                                Inventory Management
                            </div>
                            <h1 style={{
                                margin: 0, color: "white", fontSize: "42px",
                                fontWeight: "800", lineHeight: 1.2, letterSpacing: "-1px",
                            }}>
                                Stock Inventory<br />Overview
                            </h1>
                            <p style={{
                                margin: "18px 0 0", color: "#94a3b8",
                                fontSize: "15px", lineHeight: "30px", maxWidth: "720px",
                            }}>
                                Pantau seluruh stok bahan, inventory catering, dan persediaan SPPG
                                secara realtime dalam satu dashboard modern yang cepat, rapi, dan mudah digunakan.
                            </p>
                        </div>
                        <button
                            onClick={() => stockRef.current?.scrollIntoView({ behavior: "smooth" })}
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
                            <ArrowUpRight size={18} />
                            View Inventory
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
                <div ref={stockRef} style={{
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
                                Stock Inventory
                            </h2>
                            <p style={{ margin: "8px 0 0", color: "#94a3b8", fontSize: "14px" }}>
                                Available stock data from Owner Catering & SPPG
                            </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                            <div style={{
                                height: "50px", minWidth: "280px",
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
                                    placeholder="Search stock location..."
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
                                    cursor: "pointer", outline: "none", minWidth: "150px",
                                }}
                            >
                                <option value="All" style={{ color: "black" }}>All Status</option>
                                <option value="Normal" style={{ color: "black" }}>Normal</option>
                                <option value="Low Stock" style={{ color: "black" }}>Low Stock</option>
                            </select>
                        </div>
                    </div>

                    {/* Grouped Table */}
                    <div style={{ width: "100%", overflowX: "auto", borderRadius: "16px" }}>
                        <table style={{
                            width: "100%", borderCollapse: "separate",
                            borderSpacing: 0, minWidth: "600px",
                        }}>
                            <thead>
                                <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                                    {["Sumber", "Nama Tempat", "Aksi"].map((col, index) => (
                                        <th key={index} style={{
                                            textAlign: "left", padding: "16px",
                                            color: "#94a3b8", fontSize: "12px",
                                            fontWeight: "700", textTransform: "uppercase",
                                            letterSpacing: ".08em",
                                            borderBottom: "1px solid rgba(255,255,255,.06)",
                                            ...(index === 0 && { borderTopLeftRadius: "14px" }),
                                            ...(index === 2 && { borderTopRightRadius: "14px" }),
                                        }}>
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {groupedStocks.map((group, index) => (
                                    <tr
                                        key={index}
                                        style={{ transition: "all .2s ease" }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.025)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                    >
                                        <td style={{ padding: "16px" }}>
                                            <span style={{
                                                padding: "8px 14px", borderRadius: "999px",
                                                background: group.source === "Owner"
                                                    ? "rgba(139,92,246,.15)"
                                                    : "rgba(16,185,129,.15)",
                                                color: group.source === "Owner" ? "#a78bfa" : "#34d399",
                                                fontSize: "12px", fontWeight: "700",
                                            }}>
                                                {group.source}
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <div style={{
                                                    width: "40px", height: "40px", borderRadius: "12px",
                                                    background: "rgba(59,130,246,.15)", color: "#60a5fa",
                                                    display: "flex", alignItems: "center",
                                                    justifyContent: "center", fontWeight: "700",
                                                }}>
                                                    {group.tempat?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>
                                                        {group.tempat}
                                                    </div>
                                                    <div style={{ color: "#64748b", fontSize: "12px" }}>
                                                        {group.jumlah_bahan ?? group.items.length} item stok
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <button
                                                onClick={() => handleViewStock(group)}
                                                style={{
                                                    border: "none", borderRadius: "12px",
                                                    padding: "10px 18px",
                                                    background: "linear-gradient(135deg,#2563eb,#3b82f6)",
                                                    color: "white", fontWeight: "600",
                                                    cursor: "pointer",
                                                    boxShadow: "0 8px 20px rgba(37,99,235,.25)",
                                                }}
                                            >
                                                View Stock ({group.jumlah_bahan ?? group.items.length})
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── MODAL ── */}
            {selectedGroup && (
                <div
                    className="modal-overlay"
                    style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setSelectedGroup(null);
                    }}
                >
                    <div className="modal-panel">

                        {/* Modal Header */}
                        <div style={{
                            padding: "24px 28px",
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                            display: "flex", alignItems: "center",
                            justifyContent: "space-between", gap: "16px",
                            flexShrink: 0,
                        }}>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <span style={{
                                        padding: "6px 12px", borderRadius: "999px", fontSize: "12px",
                                        fontWeight: "700",
                                        background: selectedGroup.source === "Owner"
                                            ? "rgba(139,92,246,.15)" : "rgba(16,185,129,.15)",
                                        color: selectedGroup.source === "Owner" ? "#a78bfa" : "#34d399",
                                    }}>
                                        {selectedGroup.source}
                                    </span>
                                    <h2 style={{ margin: 0, color: "white", fontSize: "20px", fontWeight: "700" }}>
                                        {selectedGroup.tempat}
                                    </h2>
                                </div>
                                <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "13px" }}>
                                    Detail stok bahan — {selectedGroup.items?.length} item
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedGroup(null)}
                                style={{
                                    width: "40px", height: "40px", borderRadius: "12px",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    background: "rgba(255,255,255,0.05)",
                                    color: "#94a3b8", display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    cursor: "pointer", flexShrink: 0,
                                }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Stats */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3,1fr)",
                            gap: "16px",
                            padding: "20px 28px",
                            flexShrink: 0,
                        }}>
                            {modalStats.map((item, index) => (
                                <div key={index} className="stat-card" style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: "18px",
                                    padding: "18px 20px",
                                    display: "flex", alignItems: "center", gap: "14px",
                                }}>
                                    <div style={{
                                        width: "44px", height: "44px", borderRadius: "14px",
                                        background: item.bg, color: item.color, flexShrink: 0,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <div style={{ color: "#64748b", fontSize: "12px", fontWeight: "500" }}>
                                            {item.title}
                                        </div>
                                        <div style={{ color: "white", fontSize: "26px", fontWeight: "800", lineHeight: 1.2 }}>
                                            {item.value}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Modal Table */}
                        <div style={{ overflowY: "auto", flex: 1, padding: "0 28px 28px" }}>
                            <table style={{
                                width: "100%", borderCollapse: "separate", borderSpacing: 0,
                            }}>
                                <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                    <tr style={{ background: "#0f172a" }}>
                                        {["Nama Bahan", "Qty", "Unit", "Minimum", "Status"].map((col, index) => (
                                            <th key={index} style={{
                                                textAlign: "left", padding: "14px 12px",
                                                color: "#94a3b8", fontSize: "11px", fontWeight: "700",
                                                textTransform: "uppercase", letterSpacing: "0.08em",
                                                borderBottom: "1px solid rgba(255,255,255,0.06)",
                                            }}>
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedGroup.items.map((item) => (
                                        <tr
                                            key={item.id}
                                            style={{ transition: "all .2s ease" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                        >
                                            <td style={{ padding: "14px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                    <div style={{
                                                        width: "34px", height: "34px", borderRadius: "10px",
                                                        background: "rgba(59,130,246,.15)", color: "#60a5fa",
                                                        display: "flex", alignItems: "center",
                                                        justifyContent: "center", fontWeight: "700", fontSize: "13px",
                                                    }}>
                                                        {item.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <span style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ padding: "14px 12px", color: "white", fontWeight: "600", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                {item.qty}
                                            </td>
                                            <td style={{ padding: "14px 12px", color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                {item.unit}
                                            </td>
                                            <td style={{ padding: "14px 12px", color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                {item.minimum_stock}
                                            </td>
                                            <td style={{ padding: "14px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                <span style={{
                                                    padding: "5px 10px", borderRadius: "999px",
                                                    fontSize: "12px", fontWeight: "600",
                                                    background: item.qty <= item.minimum_stock
                                                        ? "rgba(239,68,68,.15)" : "rgba(16,185,129,.15)",
                                                    color: item.qty <= item.minimum_stock ? "#ef4444" : "#10b981",
                                                }}>
                                                    {item.qty <= item.minimum_stock ? "Low Stock" : "Normal"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            )}

        </AdminLayout>
    );
}