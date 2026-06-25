// resources/js/pages/Dashboard.jsx

import {
    ShoppingCart,
    Users,
    Truck,
    Package,
    TrendingUp,
    Clock3,
    Activity,
    ArrowUpRight,
    Store,
    School,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import AdminLayout from "../layouts/AdminLayout";

export default function Dashboard() {
    const navigate = useNavigate();

    // DATA DARI API/BACKEND
    const orders = [];
    const customers = [];
    const deliveries = [];
    const packages = [];

    // STATS
    const totalOrders =
        orders.length;

    const totalCustomers =
        customers.length;

    const totalDeliveries =
        deliveries.length;

    const totalPackages =
        packages.length;

    const revenue =
        orders.reduce(
            (total, item) =>
                total +
                Number(
                    item.total || 0
                ),
            0
        );

    const pendingOrders =
        orders.filter(
            (item) =>
                item.status ===
                "Pending"
        ).length;

    const recentOrders =
        orders.slice(0, 5);

    const [dashboardData, setDashboardData] =
        useState({
            customers: 0,
            kurirs: 0,
            owners: 0,
            sppgs: 0,
        });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get(
                "http://localhost:8000/api/dashboard-stats"
            );

            setDashboardData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const stats = [
        {
            title: "Customers",
            value: dashboardData.customers,
            icon: <Users size={22} />,
            color: "#3b82f6",
            bg: "rgba(59,130,246,0.12)",
        },
        {
            title: "Kurirs",
            value: dashboardData.kurirs,
            icon: <Truck size={22} />,
            color: "#8b5cf6",
            bg: "rgba(139,92,246,0.12)",
        },
        {
            title: "Owners",
            value: dashboardData.owners,
            icon: <Store size={22} />,
            color: "#10b981",
            bg: "rgba(16,185,129,0.12)",
        },
        {
            title: "SPPG",
            value: dashboardData.sppgs,
            icon: <School size={22} />,
            color: "#f59e0b",
            bg: "rgba(245,158,11,0.12)",
        },
    ];

    return (
        <AdminLayout>
            {/* HERO */}
            <div
                style={{
                    width: "100%",
                    borderRadius: "32px",
                    padding: "38px",
                    background:
                        "linear-gradient(135deg,#0f172a 0%,#111827 45%,#1e293b 100%)",
                    border:
                        "1px solid rgba(255,255,255,0.06)",
                    position: "relative",
                    overflow: "hidden",
                    marginBottom: "30px",
                    boxSizing: "border-box",
                }}
            >
                {/* GLOW */}
                <div
                    style={{
                        position: "absolute",
                        top: "-120px",
                        right: "-80px",
                        width: "260px",
                        height: "260px",
                        borderRadius: "999px",
                        background:
                            "rgba(59,130,246,0.16)",
                        filter: "blur(100px)",
                    }}
                />

                <div
                    style={{
                        position: "relative",
                        zIndex: 2,
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "24px",
                    }}
                >
                    <div>
                        <div
                            style={{
                                display:
                                    "inline-flex",
                                alignItems:
                                    "center",
                                gap: "8px",
                                padding:
                                    "8px 16px",
                                borderRadius:
                                    "999px",
                                background:
                                    "rgba(59,130,246,0.12)",
                                border:
                                    "1px solid rgba(59,130,246,0.18)",
                                color:
                                    "#60a5fa",
                                fontSize:
                                    "13px",
                                fontWeight:
                                    "600",
                                marginBottom:
                                    "20px",
                            }}
                        >
                            <Activity
                                size={15}
                            />
                            Admin Dashboard
                        </div>

                        <h1
                            style={{
                                margin: 0,
                                fontSize:
                                    "42px",
                                lineHeight:
                                    1.2,
                                color:
                                    "white",
                                fontWeight:
                                    "800",
                                maxWidth:
                                    "720px",
                                letterSpacing:
                                    "-1px",
                            }}
                        >
                            Monitor seluruh
                            aktivitas catering
                            dengan dashboard
                            modern & elegant
                        </h1>

                        <p
                            style={{
                                margin:
                                    "18px 0 0",
                                color:
                                    "#94a3b8",
                                fontSize:
                                    "15px",
                                lineHeight:
                                    "30px",
                                maxWidth:
                                    "680px",
                            }}
                        >
                            Kelola order,
                            customer,
                            pengiriman,
                            produksi,
                            hingga laporan
                            catering dalam
                            satu sistem admin
                            yang clean,
                            realtime, dan
                            profesional.
                        </p>
                    </div>

                    {/* RIGHT CARD */}
                    <div
                        style={{
                            width: "320px",
                            background:
                                "rgba(255,255,255,0.04)",
                            border:
                                "1px solid rgba(255,255,255,0.06)",
                            borderRadius:
                                "28px",
                            padding:
                                "26px",
                            backdropFilter:
                                "blur(12px)",
                            boxSizing:
                                "border-box",
                        }}
                    >
                        <div
                            style={{
                                color:
                                    "#94a3b8",
                                fontSize:
                                    "14px",
                                marginBottom:
                                    "12px",
                            }}
                        >
                            System Overview
                        </div>

                        <div
                            style={{
                                fontSize:
                                    "34px",
                                fontWeight:
                                    "800",
                                color:
                                    "white",
                            }}
                        >
                            Active
                        </div>

                        <div
                            style={{
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                gap: "8px",
                                marginTop:
                                    "14px",
                                color:
                                    "#22c55e",
                                fontSize:
                                    "14px",
                                fontWeight:
                                    "600",
                            }}
                        >
                            <ArrowUpRight
                                size={16}
                            />
                            Semua sistem
                            berjalan normal
                        </div>
                    </div>
                </div>
            </div>

            {/* STATS */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(240px,1fr))",
                    gap: "22px",
                    marginBottom: "30px",
                }}
            >
                {stats.map(
                    (item, index) => (
                        <div
                            key={index}
                            style={{
                                background:
                                    "linear-gradient(180deg,#111827 0%,#0f172a 100%)",
                                border:
                                    "1px solid rgba(255,255,255,0.06)",
                                borderRadius:
                                    "26px",
                                padding:
                                    "24px",
                                position:
                                    "relative",
                                overflow:
                                    "hidden",
                                minWidth: 0,
                            }}
                        >
                            <div
                                style={{
                                    position:
                                        "absolute",
                                    top: "-45px",
                                    right:
                                        "-45px",
                                    width:
                                        "130px",
                                    height:
                                        "130px",
                                    borderRadius:
                                        "999px",
                                    background:
                                        item.bg,
                                }}
                            />

                            <div
                                style={{
                                    position:
                                        "relative",
                                    zIndex: 2,
                                }}
                            >
                                <div
                                    style={{
                                        width:
                                            "58px",
                                        height:
                                            "58px",
                                        borderRadius:
                                            "18px",
                                        background:
                                            item.bg,
                                        color:
                                            item.color,
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        marginBottom:
                                            "18px",
                                    }}
                                >
                                    {item.icon}
                                </div>

                                <div
                                    style={{
                                        color:
                                            "#94a3b8",
                                        fontSize:
                                            "14px",
                                        marginBottom:
                                            "10px",
                                    }}
                                >
                                    {
                                        item.title
                                    }
                                </div>

                                <div
                                    style={{
                                        color:
                                            "white",
                                        fontSize:
                                            "34px",
                                        fontWeight:
                                            "800",
                                    }}
                                >
                                    {
                                        item.value
                                    }
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* BOTTOM */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "1.5fr 1fr",
                    gap: "22px",
                }}
            >
                {/* RECENT ORDERS */}
                <div
                    style={{
                        background:
                            "linear-gradient(180deg,#111827 0%,#0f172a 100%)",
                        border:
                            "1px solid rgba(255,255,255,0.06)",
                        borderRadius:
                            "30px",
                        padding:
                            "30px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems:
                                "center",
                            marginBottom:
                                "24px",
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    margin: 0,
                                    color:
                                        "white",
                                    fontSize:
                                        "24px",
                                    fontWeight:
                                        "700",
                                }}
                            >
                                Recent Orders
                            </h2>

                            <p
                                style={{
                                    margin:
                                        "8px 0 0",
                                    color:
                                        "#94a3b8",
                                    fontSize:
                                        "14px",
                                }}
                            >
                                Aktivitas
                                pesanan terbaru
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                navigate(
                                    "/orders"
                                )
                            }
                            style={{
                                height:
                                    "46px",
                                padding:
                                    "0 18px",
                                border:
                                    "1px solid rgba(255,255,255,0.06)",
                                borderRadius:
                                    "14px",
                                background:
                                    "rgba(255,255,255,0.04)",
                                color:
                                    "white",
                                fontWeight:
                                    "600",
                                cursor:
                                    "pointer",
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                gap: "8px",
                            }}
                        >
                            View All
                            <ArrowUpRight
                                size={16}
                            />
                        </button>
                    </div>

                    {recentOrders.length >
                    0 ? (
                        <div
                            style={{
                                display:
                                    "flex",
                                flexDirection:
                                    "column",
                                gap: "14px",
                            }}
                        >
                            {recentOrders.map(
                                (
                                    order,
                                    index
                                ) => (
                                    <div
                                        key={
                                            index
                                        }
                                        style={{
                                            padding:
                                                "18px",
                                            border:
                                                "1px solid rgba(255,255,255,0.06)",
                                            borderRadius:
                                                "18px",
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "center",
                                        }}
                                    >
                                        <div>
                                            <div
                                                style={{
                                                    color:
                                                        "white",
                                                    fontWeight:
                                                        "700",
                                                    marginBottom:
                                                        "6px",
                                                }}
                                            >
                                                {
                                                    order.customer_name
                                                }
                                            </div>

                                            <div
                                                style={{
                                                    color:
                                                        "#94a3b8",
                                                    fontSize:
                                                        "14px",
                                                }}
                                            >
                                                {
                                                    order.package_name
                                                }
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                color:
                                                    "white",
                                                fontWeight:
                                                    "700",
                                            }}
                                        >
                                            Rp{" "}
                                            {Number(
                                                order.total
                                            ).toLocaleString(
                                                "id-ID"
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <div
                            style={{
                                width: "100%",
                                borderRadius:
                                    "22px",
                                border:
                                    "1px dashed rgba(255,255,255,0.08)",
                                padding:
                                    "60px 20px",
                                textAlign:
                                    "center",
                                color:
                                    "#64748b",
                                fontSize:
                                    "15px",
                            }}
                        >
                            Belum ada data
                            orders
                        </div>
                    )}
                </div>

                {/* RIGHT SIDE */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateRows:
                            "1fr 1fr",
                        gap: "22px",
                    }}
                >
                    {/* REVENUE */}
                    <div
                        style={{
                            background:
                                "linear-gradient(180deg,#111827 0%,#0f172a 100%)",
                            border:
                                "1px solid rgba(255,255,255,0.06)",
                            borderRadius:
                                "30px",
                            padding:
                                "28px",
                        }}
                    >
                        <div
                            style={{
                                display:
                                    "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        color:
                                            "#94a3b8",
                                        fontSize:
                                            "14px",
                                        marginBottom:
                                            "10px",
                                    }}
                                >
                                    Revenue
                                </div>

                                <div
                                    style={{
                                        color:
                                            "white",
                                        fontSize:
                                            "34px",
                                        fontWeight:
                                            "800",
                                    }}
                                >
                                    Rp{" "}
                                    {revenue.toLocaleString(
                                        "id-ID"
                                    )}
                                </div>
                            </div>

                            <div
                                style={{
                                    width:
                                        "58px",
                                    height:
                                        "58px",
                                    borderRadius:
                                        "18px",
                                    background:
                                        "rgba(59,130,246,0.12)",
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                }}
                            >
                                <TrendingUp
                                    size={
                                        24
                                    }
                                    color="#60a5fa"
                                />
                            </div>
                        </div>
                    </div>

                    {/* PENDING */}
                    <div
                        style={{
                            background:
                                "linear-gradient(180deg,#111827 0%,#0f172a 100%)",
                            border:
                                "1px solid rgba(255,255,255,0.06)",
                            borderRadius:
                                "30px",
                            padding:
                                "28px",
                        }}
                    >
                        <div
                            style={{
                                display:
                                    "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        color:
                                            "#94a3b8",
                                        fontSize:
                                            "14px",
                                        marginBottom:
                                            "10px",
                                    }}
                                >
                                    Pending
                                    Orders
                                </div>

                                <div
                                    style={{
                                        color:
                                            "white",
                                        fontSize:
                                            "34px",
                                        fontWeight:
                                            "800",
                                    }}
                                >
                                    {
                                        pendingOrders
                                    }
                                </div>
                            </div>

                            <div
                                style={{
                                    width:
                                        "58px",
                                    height:
                                        "58px",
                                    borderRadius:
                                        "18px",
                                    background:
                                        "rgba(245,158,11,0.12)",
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                }}
                            >
                                <Clock3
                                    size={
                                        24
                                    }
                                    color="#f59e0b"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}