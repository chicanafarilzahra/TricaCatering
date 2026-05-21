// resources/js/pages/owner/RevenueOwner.jsx

import {
    DollarSign,
    TrendingUp,
    Calendar,
    Wallet,
} from "lucide-react";

import OwnerLayout from "../../layouts/OwnerLayout";

function MetricCard({
    title,
    value = "-",
    icon,
    color = "#60a5fa",
}) {
    return (
        <div
            style={{
                background:
                    "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))",
                border:
                    "1px solid rgba(148,163,184,0.08)",
                borderRadius: "22px",
                padding: "22px",
                display: "flex",
                justifyContent:
                    "space-between",
                alignItems: "center",
                boxShadow:
                    "0 16px 40px rgba(0,0,0,0.30)",
            }}
        >
            <div>
                <div
                    style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        fontWeight: "700",
                        textTransform:
                            "uppercase",
                        letterSpacing:
                            "0.7px",
                        marginBottom: "10px",
                    }}
                >
                    {title}
                </div>

                <div
                    style={{
                        fontSize: "32px",
                        fontWeight: "800",
                        color: "#ffffff",
                        lineHeight: 1,
                    }}
                >
                    {value}
                </div>
            </div>

            <div
                style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "18px",
                    background:
                        "rgba(59,130,246,0.12)",
                    border:
                        "1px solid rgba(59,130,246,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "center",
                    color,
                }}
            >
                {icon}
            </div>
        </div>
    );
}

function SectionCard({
    title,
    subtitle,
    children,
}) {
    return (
        <div
            style={{
                background:
                    "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(30,41,59,0.96))",
                border:
                    "1px solid rgba(148,163,184,0.08)",
                borderRadius: "24px",
                padding: "28px",
                boxShadow:
                    "0 18px 45px rgba(0,0,0,0.28)",
                marginBottom: "24px",
            }}
        >
            <div
                style={{
                    marginBottom: "22px",
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "#ffffff",
                    }}
                >
                    {title}
                </h2>

                <p
                    style={{
                        margin:
                            "8px 0 0",
                        color:
                            "#94a3b8",
                        fontSize:
                            "14px",
                        lineHeight:
                            "1.7",
                    }}
                >
                    {subtitle}
                </p>
            </div>

            {children}
        </div>
    );
}

function EmptyState({
    title,
    subtitle,
    icon,
}) {
    return (
        <div
            style={{
                minHeight: "280px",
                display: "flex",
                flexDirection: "column",
                justifyContent:
                    "center",
                alignItems: "center",
                textAlign: "center",
                padding: "20px",
            }}
        >
            <div
                style={{
                    width: "86px",
                    height: "86px",
                    borderRadius: "24px",
                    background:
                        "rgba(59,130,246,0.10)",
                    border:
                        "1px solid rgba(59,130,246,0.16)",
                    display: "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "center",
                    color: "#60a5fa",
                    marginBottom: "24px",
                }}
            >
                {icon}
            </div>

            <h3
                style={{
                    margin: 0,
                    fontSize: "28px",
                    fontWeight: "800",
                    color: "#ffffff",
                }}
            >
                {title}
            </h3>

            <p
                style={{
                    margin:
                        "14px 0 0",
                    maxWidth: "520px",
                    color: "#94a3b8",
                    fontSize: "15px",
                    lineHeight: "1.9",
                }}
            >
                {subtitle}
            </p>
        </div>
    );
}

export default function RevenueOwner() {
    return (
        <OwnerLayout>
            {/* Header */}
            <div
                style={{
                    marginBottom: "32px",
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        fontSize: "36px",
                        fontWeight: "800",
                        color: "#ffffff",
                    }}
                >
                    Revenue
                </h1>

                <p
                    style={{
                        margin:
                            "10px 0 0",
                        color:
                            "#94a3b8",
                        fontSize:
                            "15px",
                        lineHeight:
                            "1.8",
                        maxWidth:
                            "680px",
                    }}
                >
                    Monitor company
                    revenue, operational
                    expenses, profit
                    growth, and overall
                    financial performance.
                </p>
            </div>

            {/* Summary Cards */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(240px,1fr))",
                    gap: "20px",
                    marginBottom:
                        "24px",
                }}
            >
                <MetricCard
                    title="Today's Revenue"
                    value="Rp -"
                    icon={
                        <DollarSign
                            size={24}
                        />
                    }
                    color="#22c55e"
                />

                <MetricCard
                    title="This Month"
                    value="Rp -"
                    icon={
                        <Calendar
                            size={24}
                        />
                    }
                    color="#3b82f6"
                />

                <MetricCard
                    title="Growth"
                    value="- %"
                    icon={
                        <TrendingUp
                            size={24}
                        />
                    }
                    color="#f59e0b"
                />

                <MetricCard
                    title="Net Profit"
                    value="Rp -"
                    icon={
                        <Wallet
                            size={24}
                        />
                    }
                    color="#8b5cf6"
                />
            </div>

            {/* Monthly Revenue */}
            <SectionCard
                title="Monthly Revenue"
                subtitle="Income overview and monthly financial growth performance."
            >
                <EmptyState
                    title="No Revenue Data"
                    subtitle="Monthly revenue reports and financial records will appear here once business transactions are available."
                    icon={
                        <DollarSign
                            size={40}
                        />
                    }
                />
            </SectionCard>

            {/* Expense Analysis */}
            <SectionCard
                title="Expense Analysis"
                subtitle="Track operational costs, spending activity, and business expenses."
            >
                <EmptyState
                    title="No Expense Data"
                    subtitle="Expense analysis and operational cost reports will appear here."
                    icon={
                        <Wallet
                            size={40}
                        />
                    }
                />
            </SectionCard>

            {/* Profit Summary */}
            <SectionCard
                title="Profit Summary"
                subtitle="Revenue performance after operational and production expenses."
            >
                <EmptyState
                    title="No Profit Data"
                    subtitle="Profit summaries and net income analytics will appear here."
                    icon={
                        <TrendingUp
                            size={40}
                        />
                    }
                />
            </SectionCard>
        </OwnerLayout>
    );
}