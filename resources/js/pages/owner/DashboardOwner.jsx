// resources/js/pages/Owner/DashboardOwner.jsx

import {
    ShoppingCart,
    Users,
    Package,
    DollarSign,
    TrendingUp,
    BarChart3,
    ArrowUpRight,
    Clock,
    Zap,
    Activity,
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
        title:  "Customers",
        value:  stats.customers,
        icon:   <Users size={18} />,
        accent: "#3b82f6",
        bg:     "rgba(59,130,246,0.10)",
        border: "rgba(59,130,246,0.20)",
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
        value:  `Rp ${Number(stats.revenue).toLocaleString("id-ID")}`,
        icon:   <DollarSign size={18} />,
        accent: "#10b981",
        bg:     "rgba(16,185,129,0.10)",
        border: "rgba(16,185,129,0.20)",
    },
];

/* ─── quick insights config ─── */
const INSIGHTS = [
    { label: "Order Growth",       icon: <TrendingUp size={15} />, color: "#6366f1" },
    { label: "Customer Activity",  icon: <Users size={15} />,      color: "#3b82f6" },
    { label: "Operational Status", icon: <Activity size={15} />,   color: "#10b981" },
    { label: "Profit Analysis",    icon: <Zap size={15} />,        color: "#f59e0b" },
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
            {/* top row */}
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

            {/* value */}
            <div style={{
                fontSize: "26px", fontWeight: "700", color: t.textPrimary,
                letterSpacing: "-0.5px", lineHeight: 1,
            }}>
                {value}
            </div>

            {/* change badge — hanya tampil kalau ada data */}
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
                <div style={{
                    width: "34px", height: "34px", borderRadius: t.radius.sm,
                    background: iconBg, border: `1px solid ${iconBorder}`,
                    color: iconColor, display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0,
                }}>
                    {icon}
                </div>
            </div>
            {children}
        </div>
    );
}

/* ─── empty placeholder ─── */
function EmptyPlaceholder({ icon, label, height = 220 }) {
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
   DASHBOARD OWNER
========================================= */
export default function DashboardOwner() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        customers:   0,
        packages:    0,
        revenue:     0,
    });

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await axios.get("/owner/dashboard");
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
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

                {/* ── 4 Stat cards ── */}
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "14px", marginBottom: "20px",
                }}>
                    {cards.map((card, i) => (
                        <StatCard key={i} {...card} />
                    ))}
                </div>

                {/* ── Analytics row ── */}
                <div style={{
                    display: "grid", gridTemplateColumns: "2fr 1fr",
                    gap: "14px", marginBottom: "14px",
                }}>
                    {/* Revenue chart placeholder */}
                    <SectionCard title="Revenue Analytics" icon={<TrendingUp size={16} />}>
                        <EmptyPlaceholder
                            icon={<BarChart3 size={32} />}
                            label="Belum ada data revenue"
                            height={240}
                        />
                    </SectionCard>

                    {/* Quick insights */}
                    <SectionCard title="Quick Insights" icon={<ArrowUpRight size={16} />}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {INSIGHTS.map((item, i) => (
                                <div key={i} style={{
                                    display: "flex", alignItems: "center", gap: "10px",
                                    padding: "12px 14px", borderRadius: t.radius.md,
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.05)",
                                    cursor: "default",
                                }}>
                                    <div style={{
                                        width: "28px", height: "28px", borderRadius: "8px",
                                        background: item.color + "18",
                                        border: `1px solid ${item.color}30`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: item.color, flexShrink: 0,
                                    }}>
                                        {item.icon}
                                    </div>
                                    <span style={{ fontSize: "13px", fontWeight: "500", color: t.textSub }}>
                                        {item.label}
                                    </span>
                                    <ArrowUpRight size={13} style={{ marginLeft: "auto", color: t.textMuted, opacity: 0.5 }} />
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </div>

                {/* ── Latest transactions ── */}
                <SectionCard title="Latest Transactions" icon={<ShoppingCart size={16} />}>
                    <EmptyPlaceholder
                        icon={<ShoppingCart size={28} />}
                        label="Belum ada transaksi"
                        height={180}
                    />
                </SectionCard>

            </div>
        </OwnerLayout>
    );
}