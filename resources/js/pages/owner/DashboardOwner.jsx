// resources/js/pages/Owner/DashboardOwner.jsx

import {
    ShoppingCart,
    Package,
    DollarSign,
    TrendingUp,
    BarChart3,
    ArrowUpRight,
    Clock,
    Zap,
    AlertTriangle,
    Truck,
    CheckCircle2,
    XCircle,
    Wallet,
    Hourglass,
} from "lucide-react";

import OwnerLayout from "../../layouts/OwnerLayout";
import { useEffect, useState } from "react";
import axios from "axios";

/* ─── font ─── */
const FONT = "'Inter', system-ui, -apple-system, sans-serif";

/* ─── design tokens ─── */
const t = {
    cardBg:      "#111827",
    cardBorder:  "rgba(255,255,255,0.07)",
    pageBg:      "#0f172a",
    textPrimary: "#f1f5f9",
    textMuted:   "#64748b",
    textSub:     "#94a3b8",
    radius: {
        sm: "10px",
        md: "14px",
        lg: "18px",
    },
};

/* ─── helpers ─── */
const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

const formatDateTime = (value) => {
    if (!value) return "—";
    try {
        return new Date(value).toLocaleString("id-ID", {
            day: "2-digit", month: "short",
            hour: "2-digit", minute: "2-digit",
        });
    } catch {
        return value;
    }
};

/* ─── stat card config ─── */
const STAT_CARDS = (stats) => [
    {
        title:  "Total Orders",
        value:  stats.totalOrders,
        icon:   <ShoppingCart size={18} />,
        accent: "#6366f1",
        bg:     "rgba(99,102,241,0.10)",
        border: "rgba(99,102,241,0.20)",
    },
    {
        title:  "Packages",
        value:  stats.packages,
        icon:   <Package size={18} />,
        accent: "#f59e0b",
        bg:     "rgba(245,158,11,0.10)",
        border: "rgba(245,158,11,0.20)",
    },
    {
        title:  "Revenue",
        value:  formatRupiah(stats.revenue),
        icon:   <DollarSign size={18} />,
        accent: "#10b981",
        bg:     "rgba(16,185,129,0.10)",
        border: "rgba(16,185,129,0.20)",
    },
];

/* =========================================
   STAT CARD
========================================= */
function StatCard({ title, value, icon, accent, bg, border, change }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background:    t.cardBg,
                border:        `1px solid ${hovered ? accent + "40" : t.cardBorder}`,
                borderRadius:  t.radius.lg,
                padding:       "20px",
                display:       "flex",
                flexDirection: "column",
                gap:           "14px",
                transition:    "all 0.2s ease",
                cursor:        "default",
                transform:     hovered ? "translateY(-2px)" : "none",
                fontFamily:    FONT,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{
                    fontSize: "11px", fontWeight: "600", color: t.textMuted,
                    textTransform: "uppercase", letterSpacing: "0.9px",
                }}>
                    {title}
                </span>
                <div style={{
                    width: "34px", height: "34px", borderRadius: t.radius.sm,
                    background: bg, border: `1px solid ${border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: accent, flexShrink: 0,
                }}>
                    {icon}
                </div>
            </div>

            <div style={{
                fontSize: "26px", fontWeight: "700", color: t.textPrimary,
                letterSpacing: "-0.5px", lineHeight: 1,
            }}>
                {value}
            </div>

            {change ? (
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: "4px",
                    fontSize: "11px", fontWeight: "600", color: accent,
                    background: bg, border: `1px solid ${border}`,
                    borderRadius: "20px", padding: "3px 10px", alignSelf: "flex-start",
                }}>
                    <ArrowUpRight size={11} />
                    {change}
                </div>
            ) : (
                <div style={{ fontSize: "11px", color: t.textMuted, fontWeight: "500" }}>—</div>
            )}
        </div>
    );
}

/* =========================================
   SECTION CARD
========================================= */
function SectionCard({
    title, icon,
    iconColor  = "#60a5fa",
    iconBg     = "rgba(59,130,246,0.10)",
    iconBorder = "rgba(59,130,246,0.18)",
    right,
    children,
}) {
    return (
        <div style={{
            background: t.cardBg, border: `1px solid ${t.cardBorder}`,
            borderRadius: t.radius.lg, padding: "22px", fontFamily: FONT,
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{
                    margin: 0, fontSize: "15px", fontWeight: "700",
                    color: t.textPrimary, letterSpacing: "-0.2px",
                }}>
                    {title}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {right}
                    <div style={{
                        width: "34px", height: "34px", borderRadius: t.radius.sm,
                        background: iconBg, border: `1px solid ${iconBorder}`,
                        color: iconColor, display: "flex", alignItems: "center",
                        justifyContent: "center", flexShrink: 0,
                    }}>
                        {icon}
                    </div>
                </div>
            </div>
            {children}
        </div>
    );
}

/* ─── empty placeholder ─── */
function EmptyPlaceholder({ icon, label, height = 160 }) {
    return (
        <div style={{
            height, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "10px",
            borderRadius: t.radius.md,
            border: "1px dashed rgba(255,255,255,0.07)",
            color: t.textMuted,
        }}>
            <div style={{ opacity: 0.4 }}>{icon}</div>
            <span style={{ fontSize: "13px", fontWeight: "500" }}>{label}</span>
        </div>
    );
}

/* =========================================
   STOCK STATUS PANEL
========================================= */
function StockStatusPanel({ stocks }) {
    if (!stocks || stocks.length === 0) {
        return <EmptyPlaceholder icon={<Package size={26} />} label="Tidak ada data stok" />;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "260px", overflowY: "auto" }}>
            {stocks.map((item) => {
                const pct     = item.min_stock > 0 ? Math.min((item.stock / item.min_stock) * 100, 100) : 100;
                const low     = item.stock <= item.min_stock;
                const color   = low ? "#ef4444" : "#10b981";
                const bgColor = low ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)";
                const border  = low ? "rgba(239,68,68,0.20)" : "rgba(16,185,129,0.20)";

                return (
                    <div key={item.id} style={{
                        padding: "10px 12px", borderRadius: t.radius.md,
                        background: bgColor, border: `1px solid ${border}`,
                        display: "flex", alignItems: "center", gap: "10px",
                    }}>
                        <div style={{
                            width: "28px", height: "28px", borderRadius: "8px",
                            background: color + "20",
                            border: `1px solid ${color}30`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color, flexShrink: 0,
                        }}>
                            {low ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "13px", fontWeight: "600", color: t.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {item.name}
                            </div>
                            <div style={{ fontSize: "11px", color: t.textMuted, marginTop: "2px" }}>
                                {item.stock} {item.unit} tersisa
                                {item.min_stock > 0 && ` · min. ${item.min_stock} ${item.unit}`}
                            </div>
                        </div>

                        <span style={{
                            fontSize: "11px", fontWeight: "700",
                            color, padding: "2px 8px", borderRadius: "20px",
                            background: color + "18", border: `1px solid ${color}30`,
                            flexShrink: 0,
                        }}>
                            {low ? "Menipis" : "Aman"}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

/* =========================================
   KURIR PANEL
   Kurir adalah user dengan role "kurir" dan owner_id = owner yang login.
   Status pendaftaran memakai enum users.status: pending | approved | rejected.
   Ketersediaan realtime memakai users.is_available (1/0).
========================================= */
const KURIR_STATUS_MAP = {
    approved: { label: "Terdaftar", color: "#10b981", icon: CheckCircle2 },
    pending:  { label: "Menunggu",  color: "#f59e0b", icon: Hourglass },
    rejected: { label: "Ditolak",   color: "#ef4444", icon: XCircle },
};

function KurirPanel({ kurirs }) {
    if (!kurirs || kurirs.length === 0) {
        return <EmptyPlaceholder icon={<Truck size={26} />} label="Belum ada kurir terdaftar" />;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "260px", overflowY: "auto" }}>
            {kurirs.map((kurir) => {
                const meta   = KURIR_STATUS_MAP[kurir.status] ?? KURIR_STATUS_MAP.pending;
                const color  = meta.color;
                const Icon   = meta.icon;
                const online = !!kurir.is_available;

                return (
                    <div key={kurir.id} style={{
                        padding: "10px 12px", borderRadius: t.radius.md,
                        background: color + "10", border: `1px solid ${color}30`,
                        display: "flex", alignItems: "center", gap: "10px",
                    }}>
                        {/* Avatar */}
                        <div style={{ position: "relative", flexShrink: 0 }}>
                            <div style={{
                                width: "32px", height: "32px", borderRadius: "10px",
                                background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "white", fontSize: "13px", fontWeight: "700",
                            }}>
                                {kurir.name?.charAt(0).toUpperCase() ?? "K"}
                            </div>
                            <span title={online ? "Online" : "Offline"} style={{
                                position: "absolute", bottom: "-2px", right: "-2px",
                                width: "10px", height: "10px", borderRadius: "50%",
                                background: online ? "#10b981" : "#475569",
                                border: `2px solid ${t.cardBg}`,
                            }} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "13px", fontWeight: "600", color: t.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {kurir.name}
                            </div>
                            <div style={{ fontSize: "11px", color: t.textMuted, marginTop: "2px" }}>
                                {kurir.phone || "—"}
                            </div>
                        </div>

                        <span style={{
                            display: "inline-flex", alignItems: "center", gap: "4px",
                            fontSize: "11px", fontWeight: "700",
                            color, padding: "2px 8px", borderRadius: "20px",
                            background: color + "18", border: `1px solid ${color}30`,
                            flexShrink: 0,
                        }}>
                            <Icon size={11} />
                            {meta.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

/* =========================================
   REVENUE ANALYTICS CHART (SVG, no external deps)
   Menampilkan revenue bulanan milik owner yang sedang login.
   Data diharapkan dalam bentuk: [{ label: "Jan", revenue: 1200000 }, ...]
========================================= */
function RevenueChart({ data }) {
    const [hoverIdx, setHoverIdx] = useState(null);

    if (!data || data.length === 0) {
        return (
            <EmptyPlaceholder
                icon={<BarChart3 size={32} />}
                label="Belum ada data revenue"
                height={240}
            />
        );
    }

    const width   = 640;
    const height  = 240;
    const padL    = 46;
    const padR    = 12;
    const padT    = 16;
    const padB    = 30;
    const chartW  = width - padL - padR;
    const chartH  = height - padT - padB;

    const maxVal   = Math.max(...data.map(d => d.revenue), 1);
    const niceMax  = maxVal === 0 ? 1 : Math.ceil(maxVal / (maxVal < 1000000 ? 100000 : 1000000)) * (maxVal < 1000000 ? 100000 : 1000000);
    const barGap   = 10;
    const barW     = data.length > 0 ? (chartW / data.length) - barGap : 0;

    const gridLines = 4;

    return (
        <div style={{ width: "100%" }}>
            <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "240px", overflow: "visible" }}>
                {/* grid + y labels */}
                {Array.from({ length: gridLines + 1 }).map((_, i) => {
                    const y   = padT + (chartH / gridLines) * i;
                    const val = niceMax - (niceMax / gridLines) * i;
                    return (
                        <g key={i}>
                            <line x1={padL} y1={y} x2={width - padR} y2={y}
                                stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                            <text x={padL - 8} y={y + 3} textAnchor="end"
                                fontSize="9" fill={t.textMuted} fontFamily={FONT}>
                                {val >= 1000000 ? `${(val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1)}jt` : `${Math.round(val / 1000)}rb`}
                            </text>
                        </g>
                    );
                })}

                {/* bars */}
                {data.map((d, i) => {
                    const barH = niceMax > 0 ? (d.revenue / niceMax) * chartH : 0;
                    const x    = padL + i * (barW + barGap) + barGap / 2;
                    const y    = padT + chartH - barH;
                    const hovered = hoverIdx === i;

                    return (
                        <g key={i}
                           onMouseEnter={() => setHoverIdx(i)}
                           onMouseLeave={() => setHoverIdx(null)}
                           style={{ cursor: "default" }}
                        >
                            <rect
                                x={x} y={y} width={Math.max(barW, 4)} height={Math.max(barH, 2)}
                                rx="5" fill={hovered ? "#34d399" : "#10b981"}
                                opacity={hovered ? 1 : 0.85}
                                style={{ transition: "all 0.15s ease" }}
                            />
                            {hovered && (
                                <text x={x + barW / 2} y={y - 8} textAnchor="middle"
                                    fontSize="10" fontWeight="700" fill={t.textPrimary} fontFamily={FONT}>
                                    {formatRupiah(d.revenue)}
                                </text>
                            )}
                            <text x={x + barW / 2} y={height - 10} textAnchor="middle"
                                fontSize="10" fill={t.textMuted} fontFamily={FONT}>
                                {d.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

/* =========================================
   LATEST TRANSACTIONS PANEL
   Pembayaran terakhir yang DITERIMA (confirmed) oleh owner tsb,
   diambil dari invoice_payments -> invoices -> orders (owner_id).
========================================= */
const TX_TYPE_LABEL = {
    dp:        "DP",
    pelunasan: "Pelunasan",
    full:      "Lunas",
};

function LatestTransactionsPanel({ transactions }) {
    if (!transactions || transactions.length === 0) {
        return (
            <EmptyPlaceholder
                icon={<ShoppingCart size={28} />}
                label="Belum ada transaksi"
                height={180}
            />
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {transactions.map((txItem) => (
                <div key={txItem.id} style={{
                    padding: "12px 14px", borderRadius: t.radius.md,
                    background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.16)",
                    display: "flex", alignItems: "center", gap: "12px",
                }}>
                    <div style={{
                        width: "34px", height: "34px", borderRadius: "10px",
                        background: "rgba(16,185,129,0.14)", border: "1px solid rgba(16,185,129,0.25)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#10b981", flexShrink: 0,
                    }}>
                        <Wallet size={15} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: t.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {txItem.client_name} · {txItem.invoice_number}
                        </div>
                        <div style={{ fontSize: "11px", color: t.textMuted, marginTop: "2px" }}>
                            {formatDateTime(txItem.confirmed_at)}
                        </div>
                    </div>

                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: "#10b981" }}>
                            {formatRupiah(txItem.amount)}
                        </div>
                        <span style={{
                            fontSize: "10px", fontWeight: "700", color: t.textMuted,
                            textTransform: "uppercase", letterSpacing: "0.4px",
                        }}>
                            {TX_TYPE_LABEL[txItem.type] ?? txItem.type}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* =========================================
   DASHBOARD OWNER
========================================= */
export default function DashboardOwner() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        packages:    0,
        revenue:     0,
    });
    const [stocks, setStocks]             = useState([]);
    const [kurirs, setKurirs]             = useState([]);
    const [revenueChart, setRevenueChart] = useState([]);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchDashboard();
        fetchStocks();
        fetchKurirs();
        fetchRevenueAnalytics();
        fetchLatestTransactions();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await axios.get("/owner/dashboard");
            setStats(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchStocks = async () => {
        try {
            const res = await axios.get("/owner/stocks");
            // urutkan: yang menipis dulu
            const sorted = [...(res.data ?? [])].sort((a, b) => {
                const aLow = a.stock <= a.min_stock;
                const bLow = b.stock <= b.min_stock;
                return bLow - aLow;
            });
            setStocks(sorted);
        } catch (err) { console.error(err); }
    };

    // GET /owner/kurirs -> backend scoped to: users where role='kurir' AND owner_id = auth owner id
    const fetchKurirs = async () => {
        try {
            const res = await axios.get("/owner/kurirs");
            setKurirs(res.data ?? []);
        } catch (err) { console.error(err); }
    };

    // GET /owner/revenue-analytics -> expected response:
    // [{ label: "Jan", revenue: 1250000 }, { label: "Feb", revenue: 980000 }, ...]
    // Sum diambil dari invoices/orders milik owner yang login (status paid/delivered), dikelompokkan per bulan.
    const fetchRevenueAnalytics = async () => {
        try {
            const res = await axios.get("/owner/revenue-analytics");
            setRevenueChart(res.data ?? []);
        } catch (err) { console.error(err); }
    };

    // GET /owner/latest-transactions -> expected response (array, terbaru dulu, limit ~5-8):
    // [{ id, invoice_number, client_name, amount, type: "dp"|"pelunasan"|"full", confirmed_at }]
    // Diambil dari invoice_payments (status='confirmed') JOIN invoices JOIN orders (owner_id = auth owner id)
    const fetchLatestTransactions = async () => {
        try {
            const res = await axios.get("/owner/latest-transactions");
            setTransactions(res.data ?? []);
        } catch (err) { console.error(err); }
    };

    const cards = STAT_CARDS(stats);

    return (
        <OwnerLayout>
            <div style={{ fontFamily: FONT }}>

                {/* ── Page header ── */}
                <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", flexWrap: "wrap",
                    gap: "12px", marginBottom: "24px",
                }}>
                    <div>
                        <h1 style={{
                            margin: 0, fontSize: "22px", fontWeight: "700",
                            color: t.textPrimary, letterSpacing: "-0.4px",
                        }}>
                            Business Overview
                        </h1>
                        <p style={{ margin: "4px 0 0", fontSize: "13px", color: t.textMuted, fontWeight: "400" }}>
                            Pantau performa bisnis catering secara real-time
                        </p>
                    </div>

                    <div style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        padding: "8px 14px", borderRadius: t.radius.md,
                        background: "rgba(59,130,246,0.08)",
                        border: "1px solid rgba(59,130,246,0.15)",
                        color: "#60a5fa", fontWeight: "600", fontSize: "12px",
                    }}>
                        <Clock size={14} />
                        Live Dashboard
                    </div>
                </div>

                {/* ── 3 Stat cards ── */}
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "14px", marginBottom: "20px",
                }}>
                    {cards.map((card, i) => (
                        <StatCard key={i} {...card} />
                    ))}
                </div>

                {/* ── Analytics + panels row ── */}
                <div style={{
                    display: "grid", gridTemplateColumns: "2fr 1fr",
                    gap: "14px", marginBottom: "14px",
                }}>
                    {/* Revenue chart */}
                    <SectionCard title="Revenue Analytics" icon={<TrendingUp size={16} />}>
                        <RevenueChart data={revenueChart} />
                    </SectionCard>

                    {/* Right column: Stock + Kurir */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <SectionCard
                            title="Status Stok"
                            icon={<Package size={16} />}
                            iconColor="#f59e0b"
                            iconBg="rgba(245,158,11,0.10)"
                            iconBorder="rgba(245,158,11,0.20)"
                        >
                            <StockStatusPanel stocks={stocks} />
                        </SectionCard>

                        <SectionCard
                            title="Kurir"
                            icon={<Truck size={16} />}
                            iconColor="#a855f7"
                            iconBg="rgba(168,85,247,0.10)"
                            iconBorder="rgba(168,85,247,0.20)"
                        >
                            <KurirPanel kurirs={kurirs} />
                        </SectionCard>
                    </div>
                </div>

                {/* ── Latest transactions ── */}
                <SectionCard title="Latest Transactions" icon={<ShoppingCart size={16} />}>
                    <LatestTransactionsPanel transactions={transactions} />
                </SectionCard>

            </div>
        </OwnerLayout>
    );
}