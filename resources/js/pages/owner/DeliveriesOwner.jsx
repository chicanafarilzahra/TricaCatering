// resources/js/pages/owner/DeliveriesOwner.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import {
    Truck, Clock, CheckCircle, MapPin,
    LayoutDashboard, XCircle,
} from "lucide-react";
import OwnerLayout from "../../layouts/OwnerLayout";

/* ── font injection ─────────────────────────────────────────── */
if (typeof document !== "undefined" && !document.getElementById("inter-font")) {
    const l = document.createElement("link");
    l.id   = "inter-font";
    l.rel  = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(l);
}

/* ── tokens ─────────────────────────────────────────────────── */
const C = {
    bg:      "#080C14",
    surface: "#0F1623",
    card:    "#141E30",
    border:  "rgba(255,255,255,0.07)",
    borderMd:"rgba(255,255,255,0.10)",
    text:    "#F8FAFC",
    muted:   "#64748B",
    sub:     "#94A3B8",
    font:    "'Inter', system-ui, -apple-system, sans-serif",
};

const bars = {
    green:  "linear-gradient(90deg,#10b981,#34d399)",
    amber:  "linear-gradient(90deg,#f59e0b,#fbbf24)",
    blue:   "linear-gradient(90deg,#3b82f6,#60a5fa)",
    indigo: "linear-gradient(90deg,#6366f1,#818cf8)",
};

/* ── status config ───────────────────────────────────────────── */
const STATUS_MAP = {
    completed: { label: "Selesai",      color: "#10b981", fill: "rgba(16,185,129,.12)",  border: "rgba(16,185,129,.30)" },
    progress:  { label: "Dalam proses", color: "#f59e0b", fill: "rgba(245,158,11,.12)",  border: "rgba(245,158,11,.30)" },
    pending:   { label: "Menunggu",     color: "#6366f1", fill: "rgba(99,102,241,.12)",  border: "rgba(99,102,241,.30)" },
    cancelled: { label: "Dibatalkan",   color: "#ef4444", fill: "rgba(239,68,68,.12)",   border: "rgba(239,68,68,.30)"  },
};

function getStatus(status) {
    return STATUS_MAP[status] ?? {
        label: status ?? "-",
        color: "#64748b",
        fill:  "rgba(100,116,139,.12)",
        border:"rgba(100,116,139,.30)",
    };
}

/* ── StatCard ───────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, bar }) {
    return (
        <div style={{
            background: C.surface, border: `0.5px solid ${C.border}`,
            borderRadius: "12px", padding: "18px 20px",
            position: "relative", overflow: "hidden", fontFamily: C.font,
        }}>
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: "2px", background: bar,
            }} />
            <div style={{
                fontSize: "11px", fontWeight: 600, color: C.muted,
                textTransform: "uppercase", letterSpacing: ".7px", marginBottom: "10px",
            }}>{label}</div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div style={{
                    fontSize: "30px", fontWeight: 800, color: C.text,
                    letterSpacing: "-1.2px", lineHeight: 1,
                }}>{value ?? "—"}</div>
                <div style={{
                    width: "38px", height: "38px", borderRadius: "9px",
                    background: C.card, border: `0.5px solid ${C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: C.muted, flexShrink: 0,
                }}>
                    <Icon size={18} strokeWidth={1.7} />
                </div>
            </div>
        </div>
    );
}

/* ── EmptyState ─────────────────────────────────────────────── */
function EmptyState({ title, subtitle, icon: Icon }) {
    return (
        <div style={{
            padding: "48px 20px", display: "flex",
            flexDirection: "column", alignItems: "center", textAlign: "center",
            fontFamily: C.font,
        }}>
            <div style={{
                width: "60px", height: "60px", borderRadius: "16px",
                background: C.card, border: `0.5px solid ${C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: C.muted, marginBottom: "16px",
            }}>
                <Icon size={26} strokeWidth={1.4} />
            </div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: C.text, marginBottom: "6px" }}>{title}</div>
            <p style={{ fontSize: "13px", color: C.muted, lineHeight: "1.7", maxWidth: "360px", margin: 0 }}>{subtitle}</p>
        </div>
    );
}

/* ── SectionBox ─────────────────────────────────────────────── */
function SectionBox({ title, subtitle, children }) {
    return (
        <div style={{
            background: C.surface, border: `0.5px solid ${C.border}`,
            borderRadius: "14px", overflow: "hidden", marginBottom: "18px",
        }}>
            <div style={{ padding: "18px 22px", borderBottom: `0.5px solid ${C.border}` }}>
                <div style={{ fontSize: "15px", fontWeight: 700, color: C.text }}>{title}</div>
                {subtitle && <div style={{ fontSize: "12px", color: C.muted, marginTop: "3px" }}>{subtitle}</div>}
            </div>
            {children}
        </div>
    );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function DeliveriesOwner() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState(null);
    const [filter,     setFilter]     = useState("all");

    useEffect(() => { fetchDeliveries(); }, []);

    const fetchDeliveries = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get("/owner/deliveries");
            setDeliveries(Array.isArray(res.data) ? res.data : res.data?.data ?? []);
        } catch (err) {
            console.error(err);
            setError("Gagal memuat data pengiriman.");
        } finally {
            setLoading(false);
        }
    };

    /* ── derived ── */
    const totalCount     = deliveries.length;
    const progressCount  = deliveries.filter(d => d.status === "progress").length;
    const completedCount = deliveries.filter(d => d.status === "completed").length;
    const destCount      = [...new Set(deliveries.map(d => d.destination).filter(Boolean))].length;

    const FILTERS = [
        { key: "all",       label: "Semua" },
        { key: "progress",  label: "Dalam proses" },
        { key: "completed", label: "Selesai" },
        { key: "pending",   label: "Menunggu" },
        { key: "cancelled", label: "Dibatalkan" },
    ];

    const filtered = filter === "all"
        ? deliveries
        : deliveries.filter(d => d.status === filter);

    /* ── courier performance summary ── */
    const courierMap = {};
    deliveries.forEach(d => {
        if (!d.courier_name) return;
        if (!courierMap[d.courier_name]) courierMap[d.courier_name] = { total: 0, completed: 0 };
        courierMap[d.courier_name].total++;
        if (d.status === "completed") courierMap[d.courier_name].completed++;
    });
    const courierStats = Object.entries(courierMap).map(([name, v]) => ({
        name,
        total: v.total,
        completed: v.completed,
        rate: v.total > 0 ? Math.round((v.completed / v.total) * 100) : 0,
    })).sort((a, b) => b.total - a.total);

    return (
        <OwnerLayout>
            <div style={{ fontFamily: C.font }}>

                {/* ── header ── */}
                <div style={{ marginBottom: "28px" }}>
                    <div style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        fontSize: "11px", fontWeight: 600, color: C.muted,
                        textTransform: "uppercase", letterSpacing: ".8px",
                        marginBottom: "14px",
                    }}>
                        <LayoutDashboard size={13} strokeWidth={2} />
                        <span>Owner</span>
                        <span style={{ color: "#1E293B" }}>›</span>
                        <span>Pengiriman</span>
                    </div>
                    <h1 style={{
                        fontSize: "28px", fontWeight: 800, color: C.text,
                        letterSpacing: "-.8px", lineHeight: 1.1, margin: 0,
                    }}>Manajemen pengiriman</h1>
                    <p style={{ marginTop: "8px", fontSize: "13.5px", color: C.muted, lineHeight: "1.7" }}>
                        Pantau aktivitas pengiriman, performa kurir, dan status pengiriman secara real-time.
                    </p>
                </div>

                {/* ── stat cards — 4 col 1 row ── */}
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(4,1fr)",
                    gap: "12px", marginBottom: "22px",
                }}>
                    <StatCard label="Total pengiriman" value={totalCount     || null} icon={Truck}        bar={bars.green}  />
                    <StatCard label="Dalam proses"     value={progressCount  || null} icon={Clock}        bar={bars.amber}  />
                    <StatCard label="Selesai"          value={completedCount || null} icon={CheckCircle}  bar={bars.blue}   />
                    <StatCard label="Tujuan unik"      value={destCount      || null} icon={MapPin}       bar={bars.indigo} />
                </div>

                {/* ── delivery tracking table ── */}
                <SectionBox
                    title="Tracking pengiriman"
                    subtitle="Status dan detail seluruh pengiriman aktif maupun yang sudah selesai"
                >
                    {/* filter tabs */}
                    <div style={{ padding: "12px 22px", borderBottom: `0.5px solid ${C.border}`, display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {FILTERS.map(f => {
                            const count = f.key === "all"
                                ? deliveries.length
                                : deliveries.filter(d => d.status === f.key).length;
                            const active = filter === f.key;
                            return (
                                <button key={f.key} onClick={() => setFilter(f.key)} style={{
                                    height: "28px", padding: "0 12px", borderRadius: "6px", cursor: "pointer",
                                    border: `0.5px solid ${active ? "rgba(99,102,241,.40)" : C.border}`,
                                    background: active ? "rgba(99,102,241,.12)" : "transparent",
                                    color: active ? "#a5b4fc" : C.muted,
                                    fontFamily: C.font, fontSize: "12px", fontWeight: 600,
                                }}>
                                    {f.label} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {/* loading */}
                    {loading && (
                        <div style={{ padding: "40px", textAlign: "center", color: C.muted, fontSize: "13px" }}>
                            Memuat data...
                        </div>
                    )}

                    {/* error */}
                    {!loading && error && (
                        <div style={{ padding: "40px", textAlign: "center", color: "#ef4444", fontSize: "13px" }}>
                            {error}
                        </div>
                    )}

                    {/* empty */}
                    {!loading && !error && filtered.length === 0 && (
                        <EmptyState
                            title="Belum ada data pengiriman"
                            subtitle="Data tracking pengiriman akan muncul otomatis setelah ada pesanan yang dikirim."
                            icon={Truck}
                        />
                    )}

                    {/* table */}
                    {!loading && !error && filtered.length > 0 && (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{
                                width: "100%", borderCollapse: "collapse",
                                fontSize: "13px", minWidth: "640px",
                            }}>
                                <thead>
                                    <tr>
                                        {["Pelanggan", "Kurir", "Tujuan", "Status"].map(h => (
                                            <th key={h} style={{
                                                padding: "11px 16px", textAlign: "left",
                                                fontSize: "11px", fontWeight: 600,
                                                color: C.muted, textTransform: "uppercase",
                                                letterSpacing: ".6px",
                                                borderBottom: `0.5px solid ${C.border}`,
                                                whiteSpace: "nowrap",
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(item => {
                                        const st = getStatus(item.status);
                                        return (
                                            <tr key={item.id} style={{ borderBottom: `0.5px solid rgba(255,255,255,.04)` }}>
                                                <td style={{ padding: "12px 16px", fontWeight: 600, color: C.text }}>
                                                    {item.customer_name ?? "-"}
                                                </td>
                                                <td style={{ padding: "12px 16px", color: C.sub }}>
                                                    {item.courier_name ?? "-"}
                                                </td>
                                                <td style={{ padding: "12px 16px", color: C.sub, maxWidth: "200px" }}>
                                                    {item.destination ?? "-"}
                                                </td>
                                                <td style={{ padding: "12px 16px" }}>
                                                    <span style={{
                                                        display: "inline-flex", alignItems: "center",
                                                        fontSize: "11px", fontWeight: 600,
                                                        padding: "3px 10px", borderRadius: "20px",
                                                        background: st.fill,
                                                        border: `0.5px solid ${st.border}`,
                                                        color: st.color,
                                                    }}>{st.label}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </SectionBox>

                {/* ── courier performance ── */}
                <SectionBox
                    title="Performa kurir"
                    subtitle="Ringkasan total pengiriman dan tingkat keberhasilan per kurir"
                >
                    {courierStats.length === 0 ? (
                        <EmptyState
                            title="Belum ada data kurir"
                            subtitle="Statistik performa kurir akan muncul setelah ada pengiriman yang diproses."
                            icon={Truck}
                        />
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{
                                width: "100%", borderCollapse: "collapse",
                                fontSize: "13px", minWidth: "500px",
                            }}>
                                <thead>
                                    <tr>
                                        {["Nama kurir", "Total", "Selesai", "Tingkat keberhasilan"].map(h => (
                                            <th key={h} style={{
                                                padding: "11px 16px", textAlign: "left",
                                                fontSize: "11px", fontWeight: 600,
                                                color: C.muted, textTransform: "uppercase",
                                                letterSpacing: ".6px",
                                                borderBottom: `0.5px solid ${C.border}`,
                                                whiteSpace: "nowrap",
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {courierStats.map((c, i) => (
                                        <tr key={i} style={{ borderBottom: `0.5px solid rgba(255,255,255,.04)` }}>
                                            <td style={{ padding: "12px 16px", fontWeight: 600, color: C.text }}>
                                                {c.name}
                                            </td>
                                            <td style={{ padding: "12px 16px", fontWeight: 700, color: C.text }}>
                                                {c.total}
                                            </td>
                                            <td style={{ padding: "12px 16px", color: C.sub }}>
                                                {c.completed}
                                            </td>
                                            <td style={{ padding: "12px 16px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                    {/* progress bar */}
                                                    <div style={{
                                                        flex: 1, maxWidth: "120px", height: "5px",
                                                        borderRadius: "99px",
                                                        background: "rgba(255,255,255,.06)",
                                                        overflow: "hidden",
                                                    }}>
                                                        <div style={{
                                                            height: "100%", borderRadius: "99px",
                                                            width: `${c.rate}%`,
                                                            background: c.rate >= 80
                                                                ? "linear-gradient(90deg,#10b981,#34d399)"
                                                                : c.rate >= 50
                                                                    ? "linear-gradient(90deg,#f59e0b,#fbbf24)"
                                                                    : "linear-gradient(90deg,#ef4444,#f87171)",
                                                        }} />
                                                    </div>
                                                    <span style={{
                                                        fontSize: "12px", fontWeight: 700,
                                                        color: c.rate >= 80 ? "#10b981" : c.rate >= 50 ? "#f59e0b" : "#ef4444",
                                                        minWidth: "36px",
                                                    }}>
                                                        {c.rate}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </SectionBox>

            </div>
        </OwnerLayout>
    );
}