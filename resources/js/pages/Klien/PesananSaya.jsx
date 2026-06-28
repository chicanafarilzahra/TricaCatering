// resources/js/pages/Klien/PesananSaya.jsx

import React, { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import {
    ClipboardList,
    Search,
    ChevronRight,
    Wallet,
    CheckCircle2,
    Clock3,
    Truck,
    X,
    AlertCircle,
    RefreshCw,
    UtensilsCrossed,
} from "lucide-react";
import NavbarKlien from "../../components/NavbarKlien";

/* ─────────────────── CONSTANTS ─────────────────── */

const FILTERS = ["Semua", "Pending", "Diproses", "Dikirim", "Selesai", "Dibatalkan"];

// Mapping status ASLI dari database (Inggris) -> tampilan (label Indonesia,
// warna, dan filter group). DB tetap menyimpan:
// pending, confirmed, preparing, dispatched, on_delivery, delivered, cancelled
const STATUS_CFG = {
    pending: {
        bg: "rgba(251,146,60,0.1)",  color: "#fb923c", dot: "#fb923c",  border: "rgba(251,146,60,0.2)",
        label: "Pending", filterGroup: "Pending",
    },
    confirmed: {
        bg: "rgba(96,165,250,0.1)",  color: "#60a5fa", dot: "#60a5fa",  border: "rgba(96,165,250,0.2)",
        label: "Disetujui", filterGroup: "Diproses",
    },
    preparing: {
        bg: "rgba(96,165,250,0.1)",  color: "#60a5fa", dot: "#60a5fa",  border: "rgba(96,165,250,0.2)",
        label: "Diproses", filterGroup: "Diproses",
    },
    dispatched: {
        bg: "rgba(167,139,250,0.1)", color: "#a78bfa", dot: "#a78bfa",  border: "rgba(167,139,250,0.2)",
        label: "Dikirim", filterGroup: "Dikirim",
    },
    on_delivery: {
        bg: "rgba(167,139,250,0.1)", color: "#a78bfa", dot: "#a78bfa",  border: "rgba(167,139,250,0.2)",
        label: "Dalam Perjalanan", filterGroup: "Dikirim",
    },
    delivered: {
        bg: "rgba(52,211,153,0.1)",  color: "#34d399", dot: "#34d399",  border: "rgba(52,211,153,0.2)",
        label: "Selesai", filterGroup: "Selesai",
    },
    cancelled: {
        bg: "rgba(248,113,113,0.1)", color: "#f87171", dot: "#f87171",  border: "rgba(248,113,113,0.2)",
        label: "Dibatalkan", filterGroup: "Dibatalkan",
    },
};

/* ─────────────────── HELPERS ─────────────────── */

const getStatusMeta = (status) =>
    STATUS_CFG[status] || {
        bg: "rgba(148,163,184,0.1)", color: "#94a3b8",
        dot: "#94a3b8", border: "rgba(148,163,184,0.2)",
        label: status || "—", filterGroup: null,
    };

const formatRupiah = (v) => "Rp " + Number(v || 0).toLocaleString("id-ID");

const formatTanggal = (d) => {
    if (!d) return "—";
    try {
        return new Date(d).toLocaleString("id-ID", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });
    } catch { return d; }
};

/* ─────────────────── DETAIL MODAL ─────────────────── */

function DetailModal({ item, onClose }) {
    if (!item) return null;
    const meta = getStatusMeta(item.status);

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(8px)",
                zIndex: 1000,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "20px",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "24px",
                    padding: "32px",
                    width: "100%", maxWidth: "500px",
                    maxHeight: "90vh", overflowY: "auto",
                    position: "relative",
                }}
            >
                {/* Glow */}
                <div style={{
                    position: "absolute", top: "-60px", right: "-40px",
                    width: "200px", height: "200px", borderRadius: "999px",
                    background: "rgba(59,130,246,0.08)", filter: "blur(60px)",
                    pointerEvents: "none",
                }} />

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", position: "relative", zIndex: 2 }}>
                    <div>
                        <div style={{ color: "white", fontSize: "19px", fontWeight: "700", letterSpacing: "-0.3px" }}>Detail Pesanan</div>
                        <div style={{ color: "#64748b", fontSize: "13px", marginTop: "4px" }}>Order #{item.id}</div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "10px", color: "#94a3b8",
                            width: "36px", height: "36px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", flexShrink: 0,
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Status Badge */}
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: meta.bg, color: meta.color,
                    border: `1px solid ${meta.border}`,
                    padding: "7px 14px", borderRadius: "10px",
                    fontSize: "13px", fontWeight: "700", marginBottom: "24px",
                    position: "relative", zIndex: 2,
                }}>
                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: meta.dot, display: "inline-block" }} />
                    {meta.label}
                </div>

                {/* Menu Info */}
                <div style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "16px", padding: "16px",
                    marginBottom: "24px", position: "relative", zIndex: 2,
                }}>
                    {item.menu?.image_url ? (
                        <img
                            src={item.menu.image_url}
                            alt={item.menu?.name}
                            style={{ width: "56px", height: "56px", borderRadius: "12px", objectFit: "cover", flexShrink: 0 }}
                        />
                    ) : (
                        <div style={{
                            width: "56px", height: "56px", borderRadius: "12px",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, fontSize: "22px",
                        }}>
                            🍽️
                        </div>
                    )}
                    <div>
                        <div style={{ color: "white", fontWeight: "700", fontSize: "16px" }}>
                            {item.menu?.name || "Menu"}
                        </div>
                        {item.menu?.category && (
                            <div style={{ color: "#64748b", fontSize: "13px", marginTop: "3px" }}>
                                {item.menu.category}
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail Rows */}
                <div style={{ position: "relative", zIndex: 2 }}>
                    {[
                        { label: "Tanggal Pesan",  value: formatTanggal(item.created_at) },
                        { label: "Jumlah",         value: `${item.quantity || item.qty || 1} Porsi` },
                        { label: "Harga Satuan",   value: formatRupiah(item.menu?.price || item.price_per_item) },
                        { label: "Total Harga",    value: formatRupiah(item.total_price || item.total), accent: "#34d399" },
                        { label: "Alamat Kirim",   value: item.delivery_address || item.address || "—" },
                        { label: "Tanggal Kirim",  value: formatTanggal(item.delivery_date) },
                    ].map(({ label, value, accent }) => (
                        <div key={label} style={{
                            display: "flex", justifyContent: "space-between",
                            alignItems: "flex-start", gap: "16px",
                            padding: "13px 0",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}>
                            <span style={{ color: "#64748b", fontSize: "14px", flexShrink: 0 }}>{label}</span>
                            <span style={{ color: accent || "white", fontSize: "14px", fontWeight: "600", textAlign: "right" }}>{value}</span>
                        </div>
                    ))}
                </div>

                {item.notes && (
                    <div style={{ marginTop: "20px", position: "relative", zIndex: 2 }}>
                        <div style={{ color: "#475569", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                            Catatan
                        </div>
                        <div style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: "12px", padding: "14px 16px",
                            color: "white", fontSize: "14px", lineHeight: "1.6",
                        }}>
                            {item.notes}
                        </div>
                    </div>
                )}

                {item.payment_proof_url && (
                    <div style={{ marginTop: "20px", position: "relative", zIndex: 2 }}>
                        <div style={{ color: "#475569", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                            Bukti Pembayaran
                        </div>
                        <img
                            src={item.payment_proof_url}
                            alt="Bukti Pembayaran"
                            style={{ width: "100%", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.07)" }}
                        />
                    </div>
                )}

                <button
                    onClick={onClose}
                    style={{
                        marginTop: "24px", width: "100%", height: "48px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.07)",
                        background: "rgba(255,255,255,0.03)",
                        color: "#94a3b8", fontSize: "14px", fontWeight: "600",
                        cursor: "pointer", position: "relative", zIndex: 2,
                    }}
                >
                    Tutup
                </button>
            </div>
        </div>
    );
}

/* ─────────────────── SKELETON ROW ─────────────────── */

function SkeletonRow() {
    const cell = (w) => (
        <td style={{ padding: "18px 20px" }}>
            <div style={{
                height: "16px", width: w, borderRadius: "8px",
                background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)",
                backgroundSize: "600px 100%",
                animation: "ps-shimmer 1.5s infinite linear",
            }} />
        </td>
    );
    return (
        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {cell("80px")} {cell("110px")}
            <td style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                        width: "42px", height: "42px", borderRadius: "10px", flexShrink: 0,
                        background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)",
                        backgroundSize: "600px 100%",
                        animation: "ps-shimmer 1.5s infinite linear",
                    }} />
                    <div>
                        <div style={{ height: "14px", width: "120px", marginBottom: "6px", borderRadius: "6px", background: "rgba(255,255,255,0.05)" }} />
                        <div style={{ height: "11px", width: "60px", borderRadius: "6px", background: "rgba(255,255,255,0.04)" }} />
                    </div>
                </div>
            </td>
            {cell("60px")} {cell("90px")} {cell("80px")} {cell("90px")}
        </tr>
    );
}

/* ─────────────────── STAT CARD ─────────────────── */

function StatCard({ label, value, icon, color, accent, bg, border }) {
    return (
        <div style={{
            background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
            border: `1px solid ${border}`,
            borderRadius: "20px",
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            flex: "1 1 180px",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            cursor: "default",
        }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
        >
            {/* Top accent line */}
            <div style={{
                position: "absolute", top: 0, left: "24px", right: "24px",
                height: "2px", borderRadius: "0 0 4px 4px",
                background: `linear-gradient(90deg, ${accent}, transparent)`,
            }} />
            {/* Glow blob */}
            <div style={{
                position: "absolute", top: "-40px", right: "-40px",
                width: "110px", height: "110px", borderRadius: "999px",
                background: bg, filter: "blur(30px)", pointerEvents: "none",
            }} />

            <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{
                    width: "44px", height: "44px", borderRadius: "14px",
                    background: bg, border: `1px solid ${border}`,
                    color, display: "flex", alignItems: "center",
                    justifyContent: "center", marginBottom: "20px",
                }}>
                    {icon}
                </div>
                <div style={{ color: "white", fontSize: "26px", fontWeight: "800", lineHeight: 1, letterSpacing: "-0.8px", marginBottom: "8px" }}>
                    {value}
                </div>
                <div style={{ color: "#475569", fontSize: "13px", fontWeight: "500" }}>
                    {label}
                </div>
            </div>
        </div>
    );
}

/* ─────────────────── MAIN COMPONENT ─────────────────── */

export default function PesananSaya() {
    const [pesanan, setPesanan]   = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);
    const [filter, setFilter]     = useState("Semua");
    const [search, setSearch]     = useState("");
    const [detailItem, setDetailItem] = useState(null);

    const getPesanan = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get("/klien/orders");
            const raw = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            const sorted = [...raw].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setPesanan(sorted);
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Gagal memuat data pesanan.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.background = "#020817";
        getPesanan();
    }, [getPesanan]);

    const countStatus = useCallback(
        (filterName) => pesanan.filter((p) => getStatusMeta(p.status).filterGroup === filterName).length,
        [pesanan]
    );

    const filtered = useMemo(() => {
        let list = filter === "Semua"
            ? pesanan
            : pesanan.filter((p) => getStatusMeta(p.status).filterGroup === filter);
        const kw = search.trim().toLowerCase();
        if (kw) {
            list = list.filter((p) => {
                const menu  = (p.menu?.name || "").toLowerCase();
                const id    = String(p.id || "");
                const notes = (p.notes || "").toLowerCase();
                const addr  = (p.delivery_address || p.address || "").toLowerCase();
                return menu.includes(kw) || id.includes(kw) || notes.includes(kw) || addr.includes(kw);
            });
        }
        return list;
    }, [pesanan, filter, search]);

    const totalBelanja = useMemo(
        () => pesanan.filter((p) => p.status === "delivered").reduce((acc, p) => acc + Number(p.total_price || p.total || 0), 0),
        [pesanan]
    );

    const stats = [
        {
            label: "Total Pesanan",
            value: pesanan.length,
            icon: <ClipboardList size={20} />,
            color: "#60a5fa", accent: "#3b82f6",
            bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)",
        },
        {
            label: "Diproses",
            value: countStatus("Diproses"),
            icon: <Clock3 size={20} />,
            color: "#a78bfa", accent: "#8b5cf6",
            bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)",
        },
        {
            label: "Pesanan Selesai",
            value: countStatus("Selesai"),
            icon: <CheckCircle2 size={20} />,
            color: "#34d399", accent: "#10b981",
            bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)",
        },
        {
            label: "Total Belanja",
            value: formatRupiah(totalBelanja),
            icon: <Wallet size={20} />,
            color: "#fbbf24", accent: "#f59e0b",
            bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)",
        },
    ];

    return (
        <div style={{ width: "100%", minHeight: "100vh", background: "#020817" }}>
            <NavbarKlien />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

                .ps-wrap * {
                    font-family: 'Inter', system-ui, sans-serif;
                    box-sizing: border-box;
                }

                @keyframes ps-shimmer {
                    0%   { background-position: -600px 0; }
                    100% { background-position: 600px 0; }
                }

                .ps-filter-btn {
                    transition: all 0.15s;
                }

                .ps-row {
                    transition: background 0.15s ease;
                }
                .ps-row:hover {
                    background: rgba(255,255,255,0.025) !important;
                }

                .ps-detail-btn {
                    transition: background 0.15s;
                }
                .ps-detail-btn:hover {
                    background: rgba(96,165,250,0.08) !important;
                }

                .ps-scroll {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .ps-scroll::-webkit-scrollbar { display: none; }

                .pulse-dot {
                    animation: pulse 2s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }

                @media (max-width: 860px) {
                    .ps-stats-grid { flex-wrap: wrap !important; }
                    .ps-filters { flex-wrap: wrap !important; }
                }
            `}</style>

            <div className="ps-wrap" style={{ padding: "30px" }}>

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
                    {/* Grid texture */}
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
                        background: "rgba(59,130,246,0.1)", filter: "blur(90px)",
                        pointerEvents: "none",
                    }} />
                    <div style={{
                        position: "absolute", bottom: "-60px", right: "-40px",
                        width: "200px", height: "200px", borderRadius: "999px",
                        background: "rgba(139,92,246,0.1)", filter: "blur(70px)",
                        pointerEvents: "none",
                    }} />

                    <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
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
                                Pesanan Saya
                            </div>

                            <h1 style={{
                                margin: 0,
                                fontSize: "clamp(28px, 3.5vw, 42px)",
                                lineHeight: 1.15,
                                color: "white",
                                fontWeight: "800",
                                letterSpacing: "-1.5px",
                            }}>
                                Kelola Pesanan
                                <br />
                                <span style={{
                                    background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}>
                                    Catering Anda 🍱
                                </span>
                            </h1>

                            <p style={{
                                margin: "16px 0 0",
                                color: "#64748b",
                                fontSize: "15px",
                                lineHeight: "1.8",
                                maxWidth: "520px",
                            }}>
                                Lihat status, detail, dan riwayat seluruh pesanan catering
                                dalam satu tampilan yang rapi dan mudah dipantau.
                            </p>
                        </div>

                        {/* Search — pojok kanan hero */}
                        <div style={{ width: "280px", flexShrink: 0 }}>
                            <div style={{
                                fontSize: "11px", fontWeight: "700",
                                letterSpacing: "0.08em", textTransform: "uppercase",
                                color: "#475569", marginBottom: "12px",
                            }}>
                                Cari Pesanan
                            </div>
                            <div style={{ position: "relative" }}>
                                <Search size={15} style={{
                                    position: "absolute", left: "14px", top: "50%",
                                    transform: "translateY(-50%)", color: "#475569",
                                    pointerEvents: "none",
                                }} />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Menu, ID, catatan..."
                                    style={{
                                        width: "100%", height: "46px",
                                        background: "rgba(255,255,255,0.04)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        borderRadius: "14px",
                                        padding: "0 16px 0 40px",
                                        color: "white", fontSize: "14px", outline: "none",
                                        transition: "border-color 0.15s",
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = "rgba(96,165,250,0.4)"}
                                    onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── STATS GRID ── */}
                {!loading && pesanan.length > 0 && (
                    <div className="ps-stats-grid" style={{
                        display: "flex", gap: "16px", flexWrap: "wrap",
                        marginBottom: "24px",
                    }}>
                        {stats.map((item, i) => (
                            <StatCard key={i} {...item} />
                        ))}
                    </div>
                )}

                {/* ── FILTER TABS ── */}
                <div className="ps-filters" style={{
                    display: "flex", gap: "8px",
                    marginBottom: "20px", flexWrap: "wrap",
                }}>
                    {FILTERS.map((f) => {
                        const active = filter === f;
                        const count  = f === "Semua" ? pesanan.length : countStatus(f);
                        return (
                            <button
                                key={f}
                                className="ps-filter-btn"
                                onClick={() => setFilter(f)}
                                style={{
                                    display: "flex", alignItems: "center", gap: "6px",
                                    padding: "9px 16px", borderRadius: "999px",
                                    border: `1px solid ${active ? "transparent" : "rgba(255,255,255,0.07)"}`,
                                    background: active
                                        ? "linear-gradient(90deg, #2563eb, #3b82f6)"
                                        : "transparent",
                                    color: active ? "white" : "#94a3b8",
                                    fontSize: "13px", fontWeight: "600",
                                    cursor: "pointer", whiteSpace: "nowrap",
                                }}
                            >
                                {f}
                                <span style={{
                                    fontSize: "11px", padding: "2px 7px", borderRadius: "999px",
                                    background: active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)",
                                    color: active ? "white" : "#64748b",
                                }}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ── ERROR ── */}
                {error && !loading && (
                    <div style={{
                        background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
                        border: "1px solid rgba(248,113,113,0.2)",
                        borderRadius: "20px", padding: "48px 32px", textAlign: "center",
                    }}>
                        <AlertCircle size={40} color="#f87171" style={{ marginBottom: "16px" }} />
                        <div style={{ color: "#f87171", fontWeight: "700", fontSize: "17px", marginBottom: "8px" }}>
                            Terjadi Kesalahan
                        </div>
                        <p style={{ color: "#64748b", marginBottom: "24px" }}>{error}</p>
                        <button
                            onClick={getPesanan}
                            style={{
                                display: "inline-flex", alignItems: "center", gap: "8px",
                                background: "linear-gradient(90deg, #2563eb, #3b82f6)",
                                border: "none", borderRadius: "12px",
                                padding: "12px 28px", color: "white",
                                fontSize: "14px", fontWeight: "700", cursor: "pointer",
                            }}
                        >
                            <RefreshCw size={15} /> Coba Lagi
                        </button>
                    </div>
                )}

                {/* ── TABLE ── */}
                {!error && (
                    <div style={{
                        background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "20px",
                        overflow: "hidden",
                    }}>
                        <div className="ps-scroll" style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                        {["Order ID", "Tanggal", "Menu", "Jumlah", "Total", "Status", "Aksi"].map((h) => (
                                            <th key={h} style={{
                                                padding: "16px 20px",
                                                color: "#475569", fontSize: "11px", fontWeight: "700",
                                                textTransform: "uppercase", letterSpacing: "0.08em",
                                                textAlign: "left", whiteSpace: "nowrap",
                                            }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {/* Skeleton */}
                                    {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

                                    {/* Empty */}
                                    {!loading && filtered.length === 0 && (
                                        <tr>
                                            <td colSpan={7} style={{ padding: "64px 20px", textAlign: "center" }}>
                                                <div style={{
                                                    width: "56px", height: "56px", borderRadius: "16px",
                                                    background: "rgba(255,255,255,0.04)",
                                                    border: "1px solid rgba(255,255,255,0.07)",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    margin: "0 auto 20px",
                                                }}>
                                                    <UtensilsCrossed size={22} color="#334155" />
                                                </div>
                                                <div style={{ color: "white", fontWeight: "700", fontSize: "17px", marginBottom: "8px" }}>
                                                    {pesanan.length === 0 ? "Belum ada pesanan" : "Tidak ada pesanan yang cocok"}
                                                </div>
                                                <p style={{ color: "#475569", margin: 0, fontSize: "14px" }}>
                                                    {pesanan.length === 0
                                                        ? "Pesanan catering Anda akan tampil di sini setelah memesan."
                                                        : "Coba ubah filter atau kata kunci pencarian."}
                                                </p>
                                            </td>
                                        </tr>
                                    )}

                                    {/* Data Rows */}
                                    {!loading && filtered.map((item, idx) => {
                                        const meta   = getStatusMeta(item.status);
                                        const isLast = idx === filtered.length - 1;

                                        return (
                                            <tr
                                                key={item.id}
                                                className="ps-row"
                                                style={{
                                                    borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.05)",
                                                    cursor: "default",
                                                }}
                                            >
                                                {/* ID */}
                                                <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                                                    <span style={{ color: "#60a5fa", fontWeight: "700", fontSize: "13px" }}>
                                                        #{item.id}
                                                    </span>
                                                </td>

                                                {/* Tanggal */}
                                                <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                                                    <div style={{ color: "white", fontSize: "13px" }}>
                                                        {new Date(item.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                                                    </div>
                                                    <div style={{ color: "#64748b", fontSize: "11px", marginTop: "2px" }}>
                                                        {new Date(item.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                                                    </div>
                                                </td>

                                                {/* Menu */}
                                                <td style={{ padding: "16px 20px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                        {item.menu?.image_url ? (
                                                            <img
                                                                src={item.menu.image_url}
                                                                alt={item.menu?.name}
                                                                style={{ width: "42px", height: "42px", borderRadius: "10px", objectFit: "cover", flexShrink: 0 }}
                                                            />
                                                        ) : (
                                                            <div style={{
                                                                width: "42px", height: "42px", borderRadius: "10px",
                                                                background: "rgba(255,255,255,0.05)",
                                                                border: "1px solid rgba(255,255,255,0.07)",
                                                                display: "flex", alignItems: "center",
                                                                justifyContent: "center", fontSize: "18px", flexShrink: 0,
                                                            }}>
                                                                🍽️
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>
                                                                {item.menu?.name || "Menu"}
                                                            </div>
                                                            {item.menu?.category && (
                                                                <div style={{ color: "#64748b", fontSize: "11px", marginTop: "2px" }}>
                                                                    {item.menu.category}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Jumlah */}
                                                <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                                                    <span style={{ color: "white", fontSize: "14px" }}>
                                                        {item.quantity || item.qty || 1} Porsi
                                                    </span>
                                                </td>

                                                {/* Total */}
                                                <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                                                    <span style={{ color: "#34d399", fontSize: "14px", fontWeight: "700" }}>
                                                        {formatRupiah(item.total_price || item.total)}
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                                                    <span style={{
                                                        display: "inline-flex", alignItems: "center", gap: "6px",
                                                        background: meta.bg,
                                                        border: `1px solid ${meta.border}`,
                                                        color: meta.color,
                                                        padding: "5px 12px", borderRadius: "8px",
                                                        fontSize: "12px", fontWeight: "700",
                                                    }}>
                                                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: meta.dot, display: "inline-block" }} />
                                                        {meta.label}
                                                    </span>
                                                </td>

                                                {/* Aksi */}
                                                <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                                                    <button
                                                        className="ps-detail-btn"
                                                        onClick={() => setDetailItem(item)}
                                                        style={{
                                                            display: "inline-flex", alignItems: "center", gap: "6px",
                                                            padding: "8px 16px", borderRadius: "10px",
                                                            border: "1px solid rgba(255,255,255,0.07)",
                                                            background: "transparent",
                                                            color: "#60a5fa",
                                                            fontSize: "13px", fontWeight: "600",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        Lihat Detail
                                                        <ChevronRight size={13} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        {!loading && filtered.length > 0 && (
                            <div style={{
                                padding: "14px 22px",
                                borderTop: "1px solid rgba(255,255,255,0.05)",
                                color: "#475569", fontSize: "13px",
                            }}>
                                Menampilkan{" "}
                                <strong style={{ color: "white" }}>{filtered.length}</strong>
                                {" "}dari{" "}
                                <strong style={{ color: "white" }}>{pesanan.length}</strong>
                                {" "}pesanan
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── DETAIL MODAL ── */}
            {detailItem && (
                <DetailModal item={detailItem} onClose={() => setDetailItem(null)} />
            )}
        </div>
    );
}