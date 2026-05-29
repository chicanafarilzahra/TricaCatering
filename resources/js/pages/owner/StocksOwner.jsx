// resources/js/pages/owner/StocksOwner.jsx

import { useEffect, useState } from "react";
import axios from "axios";

import {
    Boxes,
    AlertTriangle,
    TrendingDown,
    PackageCheck,
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

export default function StocksOwner() {

    const [stocks, setStocks] =
        useState([]);

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            const res =
                await axios.get(
                    "/api/owner/stocks"
                );

            setStocks(res.data);
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
                    Stock Monitoring
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
                    Monitor inventory
                    levels, stock
                    availability, and
                    critical supply
                    insights in real
                    time.
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
                    title="Total Items"
                    value={
                        stocks.length
                    }
                    icon={
                        <Boxes size={22} />
                    }
                    color="#10b981"
                />

                <MetricCard
                    title="Low Stock"
                    value={
                        stocks.filter(
                            (
                                item
                            ) =>
                                Number(
                                    item.stock
                                ) > 0 &&
                                Number(
                                    item.stock
                                ) <=
                                    Number(
                                        item.minimum_stock ||
                                            5
                                    )
                        ).length
                    }
                    icon={
                        <AlertTriangle
                            size={22}
                        />
                    }
                    color="#f59e0b"
                />

                <MetricCard
                    title="Out of Stock"
                    value={
                        stocks.filter(
                            (
                                item
                            ) =>
                                Number(
                                    item.stock
                                ) === 0
                        ).length
                    }
                    icon={
                        <TrendingDown
                            size={22}
                        />
                    }
                    color="#ef4444"
                />

                <MetricCard
                    title="Available Items"
                    value={
                        stocks.filter(
                            (
                                item
                            ) =>
                                Number(
                                    item.stock
                                ) > 0
                        ).length
                    }
                    icon={
                        <PackageCheck
                            size={22}
                        />
                    }
                    color="#22c55e"
                />
            </div>

            {/* Inventory Table */}
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
                        Inventory Overview
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
                        Current stock
                        levels and item
                        availability.
                    </p>
                </div>

                {stocks.length ===
                0 ? (
                    <EmptyState
                        title="No Stock Data"
                        subtitle="Inventory information will appear here once stock data has been recorded."
                        icon={
                            <Boxes
                                size={38}
                            />
                        }
                    />
                ) : (
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
                                    "Item Name",
                                    "Category",
                                    "Stock",
                                    "Minimum Stock",
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
                            {stocks.map(
                                (
                                    item
                                ) => {
                                    const stock =
                                        Number(
                                            item.stock
                                        );

                                    const min =
                                        Number(
                                            item.minimum_stock ||
                                                5
                                        );

                                    let status =
                                        "Available";

                                    let color =
                                        "#22c55e";

                                    if (
                                        stock ===
                                        0
                                    ) {
                                        status =
                                            "Out of Stock";

                                        color =
                                            "#ef4444";
                                    } else if (
                                        stock <=
                                        min
                                    ) {
                                        status =
                                            "Low Stock";

                                        color =
                                            "#f59e0b";
                                    }

                                    return (
                                        <tr
                                            key={
                                                item.id
                                            }
                                            style={{
                                                borderBottom:
                                                    "1px solid rgba(255,255,255,0.05)",
                                            }}
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
                                                    item.name
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
                                                {item.category ||
                                                    "-"}
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "16px",
                                                    color:
                                                        "white",
                                                    fontWeight:
                                                        "700",
                                                }}
                                            >
                                                {
                                                    item.stock
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
                                                {min}
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "16px",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        padding:
                                                            "6px 12px",
                                                        borderRadius:
                                                            "999px",
                                                        background: `${color}20`,
                                                        border: `1px solid ${color}40`,
                                                        color,
                                                        fontSize:
                                                            "12px",
                                                        fontWeight:
                                                            "700",
                                                    }}
                                                >
                                                    {
                                                        status
                                                    }
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Insights */}
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
                        Stock Insights
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
                        Critical inventory
                        alerts and stock
                        analytics.
                    </p>
                </div>

                {stocks.length ===
                0 ? (
                    <EmptyState
                        title="No Insights Available"
                        subtitle="Stock analytics and inventory alerts will appear here."
                        icon={
                            <AlertTriangle
                                size={38}
                            />
                        }
                    />
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexDirection:
                                "column",
                            gap: "14px",
                        }}
                    >
                        {stocks
                            .filter(
                                (
                                    item
                                ) =>
                                    Number(
                                        item.stock
                                    ) <=
                                    Number(
                                        item.minimum_stock ||
                                            5
                                    )
                            )
                            .map(
                                (
                                    item
                                ) => (
                                    <div
                                        key={
                                            item.id
                                        }
                                        style={{
                                            padding:
                                                "16px",
                                            borderRadius:
                                                "16px",
                                            background:
                                                "rgba(239,68,68,0.08)",
                                            border:
                                                "1px solid rgba(239,68,68,0.20)",
                                            color:
                                                "white",
                                        }}
                                    >
                                        <strong>
                                            {
                                                item.name
                                            }
                                        </strong>
                                        {" "}
                                        stock is
                                        running
                                        low (
                                        {
                                            item.stock
                                        }
                                        )
                                    </div>
                                )
                            )}
                    </div>
                )}
            </div>
        </OwnerLayout>
    );
}