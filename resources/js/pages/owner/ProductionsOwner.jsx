// resources/js/pages/Owner/ProductionsOwner.jsx

import {
    Factory,
    ClipboardList,
    CheckCircle2,
    Clock,
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
                borderRadius: "20px",
                padding: "20px 22px",
                display: "flex",
                justifyContent:
                    "space-between",
                alignItems: "center",
                boxShadow:
                    "0 12px 32px rgba(0,0,0,0.28)",
            }}
        >
            <div>
                <div
                    style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        fontWeight: "600",
                        textTransform:
                            "uppercase",
                        letterSpacing:
                            "0.6px",
                        marginBottom: "8px",
                    }}
                >
                    {title}
                </div>

                <div
                    style={{
                        fontSize: "30px",
                        fontWeight: "800",
                        color: "white",
                        lineHeight: 1,
                    }}
                >
                    {value}
                </div>
            </div>

            <div
                style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "16px",
                    background:
                        "rgba(59,130,246,0.10)",
                    border:
                        "1px solid rgba(59,130,246,0.15)",
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

function EmptyState() {
    return (
        <div
            style={{
                minHeight: "320px",
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
                    width: "84px",
                    height: "84px",
                    borderRadius: "24px",
                    background:
                        "rgba(59,130,246,0.10)",
                    border:
                        "1px solid rgba(59,130,246,0.15)",
                    display: "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "center",
                    color: "#60a5fa",
                    marginBottom: "24px",
                }}
            >
                <Factory size={38} />
            </div>

            <h3
                style={{
                    margin: 0,
                    fontSize: "28px",
                    fontWeight: "800",
                    color: "white",
                }}
            >
                No Production Data
            </h3>

            <p
                style={{
                    margin:
                        "12px 0 0",
                    maxWidth: "520px",
                    color: "#94a3b8",
                    fontSize: "15px",
                    lineHeight: "1.8",
                }}
            >
                Production schedules
                and manufacturing
                activity will appear
                here after operational
                data is recorded.
            </p>
        </div>
    );
}

export default function ProductionsOwner() {
    return (
        <OwnerLayout>
            {/* Header */}
            <div
                style={{
                    marginBottom: "30px",
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
                    Productions
                </h1>

                <p
                    style={{
                        margin:
                            "10px 0 0",
                        color:
                            "#94a3b8",
                        fontSize:
                            "14px",
                        lineHeight:
                            "1.8",
                        maxWidth:
                            "650px",
                    }}
                >
                    Monitor production
                    schedules, progress,
                    and operational
                    performance.
                </p>
            </div>

            {/* Metrics */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "20px",
                    marginBottom:
                        "24px",
                }}
            >
                <MetricCard
                    title="Total Productions"
                    value="-"
                    icon={
                        <Factory
                            size={22}
                        />
                    }
                />

                <MetricCard
                    title="Scheduled"
                    value="-"
                    icon={
                        <ClipboardList
                            size={22}
                        />
                    }
                    color="#8b5cf6"
                />

                <MetricCard
                    title="Completed"
                    value="-"
                    icon={
                        <CheckCircle2
                            size={22}
                        />
                    }
                    color="#22c55e"
                />

                <MetricCard
                    title="In Progress"
                    value="-"
                    icon={
                        <Clock
                            size={22}
                        />
                    }
                    color="#f59e0b"
                />
            </div>

            {/* Main Panel */}
            <div
                style={{
                    background:
                        "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))",
                    border:
                        "1px solid rgba(148,163,184,0.08)",
                    borderRadius:
                        "24px",
                    padding: "28px",
                    boxShadow:
                        "0 16px 40px rgba(0,0,0,0.30)",
                }}
            >
                <div
                    style={{
                        marginBottom:
                            "20px",
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontSize:
                                "22px",
                            fontWeight:
                                "700",
                            color:
                                "white",
                        }}
                    >
                        Production Overview
                    </h2>

                    <p
                        style={{
                            margin:
                                "6px 0 0",
                            color:
                                "#94a3b8",
                            fontSize:
                                "14px",
                        }}
                    >
                        Production
                        schedules and
                        manufacturing
                        performance.
                    </p>
                </div>

                <EmptyState />
            </div>
        </OwnerLayout>
    );
}