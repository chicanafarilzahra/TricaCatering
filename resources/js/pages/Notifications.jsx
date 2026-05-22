// resources/js/pages/Notifications.jsx

import {
    Bell,
    AlertTriangle,
    ShoppingCart,
    Package,
    Truck,
    Search,
    Filter,
    CheckCircle2,
    Clock3,
    ArrowUpRight,
} from "lucide-react";

import AdminLayout from "../layouts/AdminLayout";

export default function Notifications() {
    const stats = [
        {
            title: "Total Notifications",
            value: "12",
            icon: <Bell size={22} />,
            color: "#3b82f6",
            bg: "rgba(59,130,246,0.12)",
        },

        {
            title: "Pending Alerts",
            value: "4",
            icon: (
                <AlertTriangle size={22} />
            ),
            color: "#f59e0b",
            bg: "rgba(245,158,11,0.12)",
        },

        {
            title: "Completed",
            value: "6",
            icon: (
                <CheckCircle2 size={22} />
            ),
            color: "#10b981",
            bg: "rgba(16,185,129,0.12)",
        },

        {
            title: "New Orders",
            value: "2",
            icon: (
                <ShoppingCart size={22} />
            ),
            color: "#8b5cf6",
            bg: "rgba(139,92,246,0.12)",
        },
    ];

    const notifications = [
        {
            title: "New Order Received",
            message:
                "Customer placed a new catering order package.",
            icon: (
                <ShoppingCart size={20} />
            ),
            color: "#3b82f6",
            bg: "rgba(59,130,246,0.12)",
            time: "5 minutes ago",
            status: "New",
        },

        {
            title: "Stock Running Low",
            message:
                "Rice stock inventory is running low.",
            icon: (
                <Package size={20} />
            ),
            color: "#f59e0b",
            bg: "rgba(245,158,11,0.12)",
            time: "20 minutes ago",
            status: "Warning",
        },

        {
            title: "Delivery Completed",
            message:
                "Delivery order has been completed successfully.",
            icon: (
                <Truck size={20} />
            ),
            color: "#10b981",
            bg: "rgba(16,185,129,0.12)",
            time: "1 hour ago",
            status: "Completed",
        },

        {
            title: "Production Scheduled",
            message:
                "New production schedule has been created.",
            icon: (
                <Clock3 size={20} />
            ),
            color: "#8b5cf6",
            bg: "rgba(139,92,246,0.12)",
            time: "2 hours ago",
            status: "Info",
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
                            <Bell size={15} />
                            System Notifications
                        </div>

                        <h1
                            style={{
                                margin: 0,
                                color: "white",
                                fontSize:
                                    "42px",
                                fontWeight:
                                    "800",
                                lineHeight:
                                    1.2,
                                letterSpacing:
                                    "-1px",
                            }}
                        >
                            Notifications
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
                                    "720px",
                            }}
                        >
                            Lihat seluruh
                            notifikasi,
                            aktivitas sistem,
                            order terbaru,
                            stok, dan
                            pembaruan penting
                            dalam dashboard
                            modern dan
                            elegant.
                        </p>
                    </div>

                    <button
                        style={{
                            height: "56px",
                            padding:
                                "0 24px",
                            border: "none",
                            borderRadius:
                                "16px",
                            background:
                                "linear-gradient(135deg,#2563eb,#3b82f6)",
                            color: "white",
                            fontWeight:
                                "700",
                            display: "flex",
                            alignItems:
                                "center",
                            gap: "10px",
                            cursor:
                                "pointer",
                            boxShadow:
                                "0 12px 30px rgba(37,99,235,0.35)",
                        }}
                    >
                        View Activity
                        <ArrowUpRight
                            size={18}
                        />
                    </button>
                </div>
            </div>

            {/* STATS */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(4,minmax(0,1fr))",
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

            {/* NOTIFICATION LIST */}
            <div
                style={{
                    background:
                        "linear-gradient(180deg,#111827 0%,#0f172a 100%)",
                    border:
                        "1px solid rgba(255,255,255,0.06)",
                    borderRadius:
                        "30px",
                    padding: "30px",
                    overflow: "hidden",
                }}
            >
                {/* HEADER */}
                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        flexWrap: "wrap",
                        gap: "18px",
                        marginBottom:
                            "28px",
                    }}
                >
                    <div>
                        <h2
                            style={{
                                margin: 0,
                                color:
                                    "white",
                                fontSize:
                                    "26px",
                                fontWeight:
                                    "700",
                            }}
                        >
                            Recent Notifications
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
                            Order updates,
                            stock alerts,
                            and system
                            messages
                        </p>
                    </div>

                    {/* ACTION */}
                    <div
                        style={{
                            display: "flex",
                            alignItems:
                                "center",
                            gap: "12px",
                            flexWrap:
                                "wrap",
                        }}
                    >
                        {/* SEARCH */}
                        <div
                            style={{
                                height: "50px",
                                minWidth:
                                    "250px",
                                border:
                                    "1px solid rgba(255,255,255,0.06)",
                                background:
                                    "rgba(255,255,255,0.04)",
                                borderRadius:
                                    "16px",
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                padding:
                                    "0 16px",
                                gap: "10px",
                            }}
                        >
                            <Search
                                size={18}
                                color="#94a3b8"
                            />

                            <input
                                type="text"
                                placeholder="Search notifications..."
                                style={{
                                    flex: 1,
                                    background:
                                        "transparent",
                                    border:
                                        "none",
                                    outline:
                                        "none",
                                    color:
                                        "white",
                                    fontSize:
                                        "14px",
                                }}
                            />
                        </div>

                        {/* FILTER */}
                        <button
                            style={{
                                height: "50px",
                                padding:
                                    "0 20px",
                                border:
                                    "1px solid rgba(255,255,255,0.06)",
                                borderRadius:
                                    "16px",
                                background:
                                    "rgba(255,255,255,0.04)",
                                color:
                                    "white",
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                gap: "10px",
                                fontWeight:
                                    "600",
                                cursor:
                                    "pointer",
                            }}
                        >
                            <Filter
                                size={18}
                            />
                            Filter
                        </button>
                    </div>
                </div>

                {/* LIST */}
                <div
                    style={{
                        display: "flex",
                        flexDirection:
                            "column",
                        gap: "18px",
                    }}
                >
                    {notifications.map(
                        (
                            item,
                            index
                        ) => (
                            <div
                                key={index}
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "space-between",
                                    gap: "20px",
                                    padding:
                                        "22px",
                                    border:
                                        "1px solid rgba(255,255,255,0.06)",
                                    background:
                                        "rgba(255,255,255,0.03)",
                                    borderRadius:
                                        "22px",
                                    flexWrap:
                                        "wrap",
                                }}
                            >
                                <div
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        gap: "18px",
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
                                        }}
                                    >
                                        {
                                            item.icon
                                        }
                                    </div>

                                    <div>
                                        <div
                                            style={{
                                                color:
                                                    "white",
                                                fontWeight:
                                                    "700",
                                                fontSize:
                                                    "16px",
                                                marginBottom:
                                                    "6px",
                                            }}
                                        >
                                            {
                                                item.title
                                            }
                                        </div>

                                        <div
                                            style={{
                                                color:
                                                    "#94a3b8",
                                                fontSize:
                                                    "14px",
                                                lineHeight:
                                                    "24px",
                                            }}
                                        >
                                            {
                                                item.message
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display:
                                            "flex",
                                        flexDirection:
                                            "column",
                                        alignItems:
                                            "flex-end",
                                        gap: "10px",
                                    }}
                                >
                                    <div
                                        style={{
                                            padding:
                                                "8px 14px",
                                            borderRadius:
                                                "999px",
                                            background:
                                                item.bg,
                                            color:
                                                item.color,
                                            fontSize:
                                                "12px",
                                            fontWeight:
                                                "700",
                                        }}
                                    >
                                        {
                                            item.status
                                        }
                                    </div>

                                    <div
                                        style={{
                                            color:
                                                "#64748b",
                                            fontSize:
                                                "13px",
                                        }}
                                    >
                                        {
                                            item.time
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}