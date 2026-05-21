// resources/js/pages/owner/ReportsOwner.jsx

import {
    FileBarChart2,
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Package,
    BarChart3,
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
                    "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(30,41,59,0.96))",
                border:
                    "1px solid rgba(148,163,184,0.08)",
                borderRadius: "22px",
                padding: "22px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow:
                    "0 14px 36px rgba(0,0,0,0.30)",
            }}
        >
            <div>
                <div
                    style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.7px",
                        marginBottom: "10px",
                    }}
                >
                    {title}
                </div>

                <div
                    style={{
                        fontSize: "30px",
                        fontWeight: "800",
                        color: "white",
                    }}
                >
                    {value}
                </div>
            </div>

            <div
                style={{
                    width: "54px",
                    height: "54px",
                    borderRadius: "18px",
                    background: `${color}15`,
                    border: `1px solid ${color}25`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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
    icon,
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
                    "0 16px 40px rgba(0,0,0,0.30)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    marginBottom: "24px",
                }}
            >
                <div
                    style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "16px",
                        background:
                            "rgba(59,130,246,0.10)",
                        border:
                            "1px solid rgba(59,130,246,0.18)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#60a5fa",
                    }}
                >
                    {icon}
                </div>

                <div>
                    <h3
                        style={{
                            margin: 0,
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "white",
                        }}
                    >
                        {title}
                    </h3>

                    <p
                        style={{
                            margin: "6px 0 0",
                            color: "#94a3b8",
                            fontSize: "14px",
                        }}
                    >
                        {subtitle}
                    </p>
                </div>
            </div>

            {children}
        </div>
    );
}

function EmptyAnalytics({
    title,
    subtitle,
    icon,
}) {
    return (
        <div
            style={{
                minHeight: "260px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: "20px",
            }}
        >
            <div
                style={{
                    width: "82px",
                    height: "82px",
                    borderRadius: "22px",
                    background:
                        "rgba(59,130,246,0.10)",
                    border:
                        "1px solid rgba(59,130,246,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#60a5fa",
                    marginBottom: "22px",
                }}
            >
                {icon}
            </div>

            <h3
                style={{
                    margin: 0,
                    fontSize: "24px",
                    fontWeight: "800",
                    color: "white",
                }}
            >
                {title}
            </h3>

            <p
                style={{
                    margin: "10px 0 0",
                    color: "#94a3b8",
                    fontSize: "14px",
                    maxWidth: "500px",
                    lineHeight: "1.8",
                }}
            >
                {subtitle}
            </p>
        </div>
    );
}

export default function ReportsOwner() {
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
                        fontSize: "34px",
                        fontWeight: "800",
                        color: "white",
                    }}
                >
                    Business Reports
                </h1>

                <p
                    style={{
                        margin: "10px 0 0",
                        color: "#94a3b8",
                        fontSize: "14px",
                        lineHeight: "1.8",
                        maxWidth: "700px",
                    }}
                >
                    Comprehensive overview of sales,
                    revenue, package performance,
                    and operational analytics.
                </p>
            </div>

            {/* Metrics */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "20px",
                    marginBottom: "28px",
                }}
            >
                <MetricCard
                    title="Monthly Revenue"
                    value="Rp -"
                    icon={
                        <DollarSign size={22} />
                    }
                    color="#22c55e"
                />

                <MetricCard
                    title="Growth Rate"
                    value="- %"
                    icon={
                        <TrendingUp size={22} />
                    }
                    color="#3b82f6"
                />

                <MetricCard
                    title="Total Orders"
                    value="-"
                    icon={
                        <ShoppingCart size={22} />
                    }
                    color="#f59e0b"
                />

                <MetricCard
                    title="Reports Generated"
                    value="-"
                    icon={
                        <FileBarChart2
                            size={22}
                        />
                    }
                    color="#8b5cf6"
                />
            </div>

            {/* Analytics Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "24px",
                }}
            >
                {/* Sales Report */}
                <SectionCard
                    title="Sales Report"
                    subtitle="Detailed sales analytics and order trends"
                    icon={
                        <BarChart3 size={22} />
                    }
                >
                    <EmptyAnalytics
                        title="No Sales Data"
                        subtitle="Sales reports and transaction analytics will appear here after orders are processed."
                        icon={
                            <ShoppingCart
                                size={36}
                            />
                        }
                    />
                </SectionCard>

                {/* Revenue Analysis */}
                <SectionCard
                    title="Revenue Analysis"
                    subtitle="Monthly and yearly revenue summary"
                    icon={
                        <DollarSign size={22} />
                    }
                >
                    <EmptyAnalytics
                        title="No Revenue Data"
                        subtitle="Revenue insights and financial summaries will appear here once income records are available."
                        icon={
                            <TrendingUp
                                size={36}
                            />
                        }
                    />
                </SectionCard>

                {/* Best Selling Packages */}
                <SectionCard
                    title="Best Selling Packages"
                    subtitle="Most ordered catering packages"
                    icon={
                        <Package size={22} />
                    }
                >
                    <EmptyAnalytics
                        title="No Package Data"
                        subtitle="Popular catering packages and order rankings will appear here after customer purchases."
                        icon={
                            <Package size={36} />
                        }
                    />
                </SectionCard>
            </div>
        </OwnerLayout>
    );
}