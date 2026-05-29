// resources/js/pages/Owner/CustomersOwner.jsx

import {
    Users,
    UserPlus,
} from "lucide-react";

import OwnerLayout from "../../layouts/OwnerLayout";

function MetricCard({
    title,
    value = 0,
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
                backdropFilter:
                    "blur(10px)",
            }}
        >
            {/* Left */}
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

            {/* Icon */}
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
                    flexShrink: 0,
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
            {/* Icon */}
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
                <Users size={38} />
            </div>

            {/* Title */}
            <h3
                style={{
                    margin: 0,
                    fontSize: "28px",
                    fontWeight: "800",
                    color: "white",
                    letterSpacing:
                        "-0.5px",
                }}
            >
                No Customer Data
            </h3>

            {/* Description */}
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
                Customer information
                will appear here
                automatically after
                users register and
                place orders in the
                system.
            </p>
        </div>
    );
}

export default function CustomersOwner() {
    return (
        <OwnerLayout>
            {/* Header */}
            <div
                style={{
                    marginBottom: "30px",
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems:
                        "flex-start",
                    flexWrap: "wrap",
                    gap: "20px",
                }}
            >
                <div>
                    <h1
                        style={{
                            margin: 0,
                            fontSize:
                                "34px",
                            fontWeight:
                                "800",
                            color:
                                "white",
                            letterSpacing:
                                "-0.5px",
                        }}
                    >
                        Customers
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
                        View customer
                        growth and
                        monitor all
                        registered client
                        accounts in one
                        executive
                        dashboard.
                    </p>
                </div>
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
                    title="Total Customers"
                    value={0}
                    icon={
                        <Users
                            size={22}
                        />
                    }
                />

                <MetricCard
                    title="New This Month"
                    value={0}
                    icon={
                        <UserPlus
                            size={22}
                        />
                    }
                />

                <MetricCard
                    title="Active Accounts"
                    value={0}
                    icon={
                        <Users
                            size={22}
                        />
                    }
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
                    backdropFilter:
                        "blur(12px)",
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
                        Customer Database
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
                        Registered
                        customers and
                        account activity.
                    </p>
                </div>

                {/* Empty State Only */}
                <EmptyState />
            </div>
        </OwnerLayout>
    );
}