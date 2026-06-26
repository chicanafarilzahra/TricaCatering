// resources/js/pages/Owner/CustomersOwner.jsx
import { Users, UserPlus, UserCheck, LayoutDashboard, Clock, Info } from "lucide-react";
import OwnerLayout from "../../layouts/OwnerLayout";

/* ── font injection (run once) ──────────────────────────────── */
if (typeof document !== "undefined" && !document.getElementById("inter-font")) {
    const link = document.createElement("link");
    link.id = "inter-font";
    link.rel = "stylesheet";
    link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
}

/* ── design tokens ──────────────────────────────────────────── */
const T = {
    bg: "#080C14",
    surface: "#0F1623",
    surfaceHover: "#141E30",
    border: "rgba(255,255,255,0.07)",
    borderStrong: "rgba(255,255,255,0.12)",
    textPrimary: "#F8FAFC",
    textMuted: "#64748B",
    textFaint: "#334155",
    font: "'Inter', system-ui, -apple-system, sans-serif",
};

const accentBars = {
    indigo: "linear-gradient(90deg, #6366f1, #818cf8)",
    violet: "linear-gradient(90deg, #8b5cf6, #a78bfa)",
    sky:    "linear-gradient(90deg, #0ea5e9, #38bdf8)",
};

/* ── MetricCard ─────────────────────────────────────────────── */
function MetricCard({ label, value, icon: Icon, accent = "indigo" }) {
    return (
        <div
            style={{
                background: T.surface,
                border: `0.5px solid ${T.border}`,
                borderRadius: "14px",
                padding: "20px 22px",
                position: "relative",
                overflow: "hidden",
                fontFamily: T.font,
            }}
        >
            {/* top accent line */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: accentBars[accent],
                }}
            />

            <div
                style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: T.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    marginBottom: "12px",
                }}
            >
                {label}
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                }}
            >
                <div
                    style={{
                        fontSize: "32px",
                        fontWeight: 800,
                        color: T.textPrimary,
                        letterSpacing: "-1.5px",
                        lineHeight: 1,
                    }}
                >
                    {value ?? "—"}
                </div>

                <div
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        background: T.surfaceHover,
                        border: `0.5px solid ${T.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: T.textMuted,
                        flexShrink: 0,
                    }}
                >
                    <Icon size={18} strokeWidth={1.7} />
                </div>
            </div>
        </div>
    );
}

/* ── EmptyState ─────────────────────────────────────────────── */
function EmptyState() {
    return (
        <div
            style={{
                padding: "56px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                fontFamily: T.font,
            }}
        >
            <div
                style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "20px",
                    background: T.surfaceHover,
                    border: `0.5px solid ${T.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: T.textMuted,
                    marginBottom: "20px",
                }}
            >
                <Users size={30} strokeWidth={1.5} />
            </div>

            <h3
                style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: T.textPrimary,
                    letterSpacing: "-0.3px",
                    margin: 0,
                }}
            >
                No customers yet
            </h3>

            <p
                style={{
                    marginTop: "10px",
                    fontSize: "13.5px",
                    color: T.textMuted,
                    lineHeight: "1.75",
                    maxWidth: "420px",
                }}
            >
                Customer records will appear here once users register and place
                their first order in the system.
            </p>

            <div
                style={{
                    marginTop: "22px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    color: T.textMuted,
                    background: T.surfaceHover,
                    border: `0.5px solid ${T.border}`,
                    borderRadius: "8px",
                    padding: "8px 14px",
                }}
            >
                <Info size={14} strokeWidth={1.7} />
                Data updates automatically — no refresh needed
            </div>
        </div>
    );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function CustomersOwner() {
    return (
        <OwnerLayout>
            <div style={{ fontFamily: T.font }}>

                {/* Header */}
                <div style={{ marginBottom: "32px" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: T.textMuted,
                            textTransform: "uppercase",
                            letterSpacing: "0.8px",
                            marginBottom: "14px",
                        }}
                    >
                        <LayoutDashboard size={13} strokeWidth={2} />
                        <span>Owner</span>
                        <span style={{ color: T.textFaint }}>›</span>
                        <span>Customers</span>
                    </div>

                    <h1
                        style={{
                            fontSize: "28px",
                            fontWeight: 800,
                            color: T.textPrimary,
                            letterSpacing: "-0.8px",
                            lineHeight: 1.1,
                            margin: 0,
                        }}
                    >
                        Customers
                    </h1>

                    <p
                        style={{
                            marginTop: "10px",
                            fontSize: "13.5px",
                            color: T.textMuted,
                            lineHeight: "1.7",
                            maxWidth: "600px",
                        }}
                    >
                        Track customer growth and manage all registered client accounts
                        from one place.
                    </p>
                </div>

                {/* Metric Cards — always 3 columns */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "14px",
                        marginBottom: "24px",
                    }}
                >
                    <MetricCard
                        label="Total customers"
                        value={null}
                        icon={Users}
                        accent="indigo"
                    />
                    <MetricCard
                        label="New this month"
                        value={null}
                        icon={UserPlus}
                        accent="violet"
                    />
                    <MetricCard
                        label="Active accounts"
                        value={null}
                        icon={UserCheck}
                        accent="sky"
                    />
                </div>

                {/* Main Panel */}
                <div
                    style={{
                        background: T.surface,
                        border: `0.5px solid ${T.border}`,
                        borderRadius: "16px",
                        overflow: "hidden",
                    }}
                >
                    {/* Panel header */}
                    <div
                        style={{
                            padding: "22px 26px 18px",
                            borderBottom: `0.5px solid ${T.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    fontSize: "15px",
                                    fontWeight: 700,
                                    color: T.textPrimary,
                                }}
                            >
                                Customer database
                            </div>
                            <div
                                style={{
                                    fontSize: "12.5px",
                                    color: T.textMuted,
                                    marginTop: "3px",
                                }}
                            >
                                Registered accounts and activity
                            </div>
                        </div>

                        {/* Live badge */}
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                                fontSize: "11px",
                                fontWeight: 600,
                                color: T.textMuted,
                                background: T.surfaceHover,
                                border: `0.5px solid ${T.border}`,
                                borderRadius: "20px",
                                padding: "4px 10px",
                                letterSpacing: "0.2px",
                            }}
                        >
                            <Clock size={11} strokeWidth={2} />
                            Live
                        </div>
                    </div>

                    <EmptyState />
                </div>
            </div>
        </OwnerLayout>
    );
}