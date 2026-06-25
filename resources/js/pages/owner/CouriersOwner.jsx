// resources/js/pages/owner/CouriersOwner.jsx

import { useEffect, useState } from "react";
import axios from "axios";

import {
    Truck,
    Users,
    CheckCircle,
    Clock,
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

function EmptyState({
    title,
    subtitle,
    icon,
}) {
    return (
        <div
            style={{
                minHeight: "300px",
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
                {icon}
            </div>

            <h3
                style={{
                    margin: 0,
                    fontSize: "28px",
                    fontWeight: "800",
                    color: "white",
                }}
            >
                {title}
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
                {subtitle}
            </p>
        </div>
    );
}

export default function CouriersOwner() {

    const [couriers, setCouriers] =
        useState([]);

    useEffect(() => {
        fetchCouriers();
    }, []);

    const fetchCouriers = async () => {
        try {
            const res =
                await axios.get(
                    "/owner/couriers"
                );

            setCouriers(
                res.data || []
            );
        } catch (err) {
            console.log(err);
        }
    };

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
                    Couriers
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
                    Monitor courier
                    performance,
                    delivery progress,
                    and operational
                    activities in
                    real time.
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
                    title="Total Couriers"
                    value={
                        couriers.length
                    }
                    icon={
                        <Users size={22} />
                    }
                    color="#10b981"
                />

                <MetricCard
                    title="Active Couriers"
                    value={
                        couriers.filter(
                            (c) =>
                                c.status ===
                                "active"
                        ).length
                    }
                    icon={
                        <Truck size={22} />
                    }
                    color="#3b82f6"
                />

                <MetricCard
                    title="On-Time Deliveries"
                    value={
                        couriers.reduce(
                            (
                                total,
                                c
                            ) =>
                                total +
                                Number(
                                    c.completed ||
                                        0
                                ),
                            0
                        )
                    }
                    icon={
                        <CheckCircle
                            size={22}
                        />
                    }
                    color="#22c55e"
                />

                <MetricCard
                    title="Pending Deliveries"
                    value={
                        couriers.reduce(
                            (
                                total,
                                c
                            ) =>
                                total +
                                Number(
                                    c.active_deliveries ||
                                        0
                                ),
                            0
                        )
                    }
                    icon={
                        <Clock size={22} />
                    }
                    color="#f59e0b"
                />
            </div>

            {/* Courier Table */}
            <div
                style={{
                    background:
                        "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))",
                    border:
                        "1px solid rgba(148,163,184,0.08)",
                    borderRadius:
                        "24px",
                    padding: "28px",
                    marginBottom:
                        "24px",
                    boxShadow:
                        "0 16px 40px rgba(0,0,0,0.30)",
                    overflowX: "auto",
                }}
            >
                <div
                    style={{
                        marginBottom:
                            "22px",
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
                        Courier Performance
                    </h2>
                </div>

                <table
                    style={{
                        width: "100%",
                        borderCollapse:
                            "collapse",
                        minWidth:
                            "900px",
                    }}
                >
                    <thead>
                        <tr
                            style={{
                                background:
                                    "rgba(255,255,255,0.04)",
                            }}
                        >
                            {[
                                "Courier Name",
                                "Phone",
                                "Active Deliveries",
                                "Completed",
                                "Status",
                            ].map(
                                (
                                    item
                                ) => (
                                    <th
                                        key={
                                            item
                                        }
                                        style={{
                                            padding:
                                                "16px",
                                            textAlign:
                                                "left",
                                            color:
                                                "#cbd5e1",
                                            fontSize:
                                                "13px",
                                            fontWeight:
                                                "600",
                                            borderBottom:
                                                "1px solid rgba(255,255,255,0.06)",
                                        }}
                                    >
                                        {
                                            item
                                        }
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {couriers.map(
                            (
                                courier
                            ) => (
                                <tr
                                    key={
                                        courier.id
                                    }
                                >
                                    <td
                                        style={{
                                            padding:
                                                "16px",
                                            color:
                                                "white",
                                        }}
                                    >
                                        {
                                            courier.name
                                        }
                                    </td>

                                    <td
                                        style={{
                                            padding:
                                                "16px",
                                            color:
                                                "#cbd5e1",
                                        }}
                                    >
                                        {
                                            courier.phone
                                        }
                                    </td>

                                    <td
                                        style={{
                                            padding:
                                                "16px",
                                            color:
                                                "#cbd5e1",
                                        }}
                                    >
                                        {
                                            courier.active_deliveries
                                        }
                                    </td>

                                    <td
                                        style={{
                                            padding:
                                                "16px",
                                            color:
                                                "#cbd5e1",
                                        }}
                                    >
                                        {
                                            courier.completed
                                        }
                                    </td>

                                    <td
                                        style={{
                                            padding:
                                                "16px",
                                            color:
                                                courier.status ===
                                                "active"
                                                    ? "#22c55e"
                                                    : "#f59e0b",
                                            fontWeight:
                                                "700",
                                        }}
                                    >
                                        {
                                            courier.status
                                        }
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>

                {couriers.length ===
                    0 && (
                    <EmptyState
                        title="No Couriers Found"
                        subtitle="Courier performance data will appear here once operational data has been recorded."
                        icon={
                            <Truck
                                size={
                                    38
                                }
                            />
                        }
                    />
                )}
            </div>
        </OwnerLayout>
    );
}