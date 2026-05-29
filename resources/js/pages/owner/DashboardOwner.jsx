// resources/js/pages/Owner/DashboardOwner.jsx

import {
    ShoppingCart,
    Users,
    Package,
    DollarSign,
    TrendingUp,
    BarChart3,
    ArrowUpRight,
} from "lucide-react";

import OwnerLayout from "../../layouts/OwnerLayout";

/* =========================================
   SMALL STAT CARD
========================================= */
function StatCard({
    title,
    value = 0,
    icon,
    color,
}) {
    return (
        <div
            style={{
                background:
                    "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))",
                border:
                    "1px solid rgba(255,255,255,0.06)",
                borderRadius: "22px",
                padding: "20px",
                position: "relative",
                overflow: "hidden",
                boxShadow:
                    "0 12px 30px rgba(0,0,0,0.25)",
                backdropFilter: "blur(12px)",
                minHeight: "125px",
                transition:
                    "all 0.25s ease",
            }}
        >
            {/* Glow */}
            <div
                style={{
                    position: "absolute",
                    top: "-30px",
                    right: "-30px",
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background: color,
                    opacity: 0.08,
                    filter: "blur(24px)",
                }}
            />

            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "flex-start",
                    position: "relative",
                    zIndex: 2,
                }}
            >
                {/* Text */}
                <div style={{ flex: 1 }}>
                    <div
                        style={{
                            fontSize: "12px",
                            color: "#94a3b8",
                            fontWeight: "600",
                            textTransform:
                                "uppercase",
                            letterSpacing:
                                "0.5px",
                        }}
                    >
                        {title}
                    </div>

                    <div
                        style={{
                            marginTop: "12px",
                            fontSize: "30px",
                            fontWeight: "800",
                            color: "white",
                            lineHeight: 1,
                        }}
                    >
                        {value}
                    </div>
                </div>

                {/* Icon */}
                <div
                    style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "14px",
                        background:
                            "rgba(255,255,255,0.04)",
                        border:
                            "1px solid rgba(255,255,255,0.06)",
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        color,
                        flexShrink: 0,
                    }}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}

/* =========================================
   SECTION CARD
========================================= */
function AnalyticsCard({
    title,
    icon,
    children,
}) {
    return (
        <div
            style={{
                background:
                    "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))",
                border:
                    "1px solid rgba(255,255,255,0.06)",
                borderRadius: "26px",
                padding: "28px",
                boxShadow:
                    "0 16px 40px rgba(0,0,0,0.28)",
                backdropFilter: "blur(12px)",
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems:
                        "center",
                    marginBottom: "24px",
                }}
            >
                <h3
                    style={{
                        margin: 0,
                        fontSize: "20px",
                        fontWeight:
                            "700",
                        color: "white",
                    }}
                >
                    {title}
                </h3>

                <div
                    style={{
                        width: "50px",
                        height: "50px",
                        borderRadius:
                            "16px",
                        background:
                            "rgba(59,130,246,0.10)",
                        border:
                            "1px solid rgba(59,130,246,0.18)",
                        color: "#60a5fa",
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        flexShrink: 0,
                    }}
                >
                    {icon}
                </div>
            </div>

            {children}
        </div>
    );
}

/* =========================================
   DASHBOARD OWNER
========================================= */
export default function DashboardOwner() {
    return (
        <OwnerLayout>
            {/* HERO */}
            <div
                style={{
                    marginBottom: "32px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        flexWrap: "wrap",
                        gap: "18px",
                    }}
                >
                    <div>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: "38px",
                                fontWeight:
                                    "800",
                                color: "white",
                                lineHeight:
                                    "1.1",
                                letterSpacing:
                                    "-0.8px",
                            }}
                        >
                            Business Overview
                        </h1>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems:
                                "center",
                            gap: "10px",
                            padding:
                                "10px 16px",
                            borderRadius:
                                "14px",
                            background:
                                "rgba(59,130,246,0.08)",
                            border:
                                "1px solid rgba(59,130,246,0.15)",
                            color:
                                "#60a5fa",
                            fontWeight:
                                "600",
                            fontSize:
                                "13px",
                        }}
                    >
                        <TrendingUp
                            size={16}
                        />
                        Executive Dashboard
                    </div>
                </div>
            </div>

            {/* STATS */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "18px",
                    marginBottom: "28px",
                }}
            >
                <StatCard
                    title="Total Orders"
                    value={0}
                    icon={
                        <ShoppingCart
                            size={22}
                        />
                    }
                    color="#8b5cf6"
                />

                <StatCard
                    title="Customers"
                    value={0}
                    icon={
                        <Users size={22} />
                    }
                    color="#3b82f6"
                />

                <StatCard
                    title="Packages"
                    value={0}
                    icon={
                        <Package
                            size={22}
                        />
                    }
                    color="#f59e0b"
                />

                <StatCard
                    title="Revenue"
                    value="Rp 0"
                    icon={
                        <DollarSign
                            size={22}
                        />
                    }
                    color="#10b981"
                />
            </div>

            {/* MAIN SECTION */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "2fr 1fr",
                    gap: "20px",
                    marginBottom: "20px",
                }}
            >
                <AnalyticsCard
                    title="Revenue Analytics"
                    icon={
                        <TrendingUp
                            size={22}
                        />
                    }
                >
                    <div
                        style={{
                            height: "260px",
                            display: "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            color: "#64748b",
                            fontSize: "16px",
                            borderRadius:
                                "18px",
                            border:
                                "1px dashed rgba(255,255,255,0.08)",
                        }}
                    >
                        0 Revenue Data
                    </div>
                </AnalyticsCard>

                <AnalyticsCard
                    title="Quick Insights"
                    icon={
                        <ArrowUpRight
                            size={20}
                        />
                    }
                >
                    <div
                        style={{
                            display:
                                "grid",
                            gap: "12px",
                        }}
                    >
                        {[
                            "Order Growth",
                            "Customer Activity",
                            "Operational Status",
                            "Profit Analysis",
                        ].map(
                            (
                                item,
                                index
                            ) => (
                                <div
                                    key={
                                        index
                                    }
                                    style={{
                                        padding:
                                            "14px 16px",
                                        borderRadius:
                                            "14px",
                                        background:
                                            "rgba(255,255,255,0.03)",
                                        border:
                                            "1px solid rgba(255,255,255,0.05)",
                                        color:
                                            "#e2e8f0",
                                        fontSize:
                                            "13px",
                                        fontWeight:
                                            "500",
                                    }}
                                >
                                    {item}
                                </div>
                            )
                        )}
                    </div>
                </AnalyticsCard>
            </div>

            {/* TRANSACTIONS */}
            <AnalyticsCard
                title="Latest Transactions"
                icon={
                    <ShoppingCart
                        size={20}
                    />
                }
            >
                <div
                    style={{
                        height: "240px",
                        display: "flex",
                        flexDirection:
                            "column",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        borderRadius:
                            "18px",
                        border:
                            "1px dashed rgba(255,255,255,0.08)",
                        color: "#64748b",
                        gap: "14px",
                    }}
                >
                    <BarChart3
                        size={34}
                    />

                    <div
                        style={{
                            fontSize: "16px",
                            fontWeight:
                                "600",
                        }}
                    >
                        0 Transactions
                    </div>
                </div>
            </AnalyticsCard>
        </OwnerLayout>
    );
}