// resources/js/pages/Orders.jsx

import {
    ShoppingCart,
    Clock3,
    CheckCircle2,
    Wallet,
    Search,
    Filter,
    ArrowUpRight,
} from "lucide-react";

import {
    useMemo,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

export default function Orders() {
    const navigate = useNavigate();

    const [search, setSearch] =
        useState("");

    const [filterOpen, setFilterOpen] =
        useState(false);

    const [selectedStatus, setSelectedStatus] =
        useState("All");

    // DATA DARI API/BACKEND
    const orders = [];

    // FILTER DATA
    const filteredOrders = useMemo(() => {
        return orders.filter((item) => {
            const keyword =
                search.toLowerCase();

            const matchSearch =
                item.customer_name
                    ?.toLowerCase()
                    .includes(keyword) ||
                item.package_name
                    ?.toLowerCase()
                    .includes(keyword) ||
                item.status
                    ?.toLowerCase()
                    .includes(keyword);

            const matchFilter =
                selectedStatus ===
                    "All" ||
                item.status ===
                    selectedStatus;

            return (
                matchSearch &&
                matchFilter
            );
        });
    }, [
        orders,
        search,
        selectedStatus,
    ]);

    // STATS
    const totalOrders =
        orders.length;

    const pendingOrders =
        orders.filter(
            (item) =>
                item.status ===
                "Pending"
        ).length;

    const completedOrders =
        orders.filter(
            (item) =>
                item.status ===
                "Completed"
        ).length;

    const revenue =
        orders.reduce(
            (total, item) =>
                total +
                Number(
                    item.total || 0
                ),
            0
        );

   const stats = [
    {
        title: "Total Orders",
        value: totalOrders || 0,
        icon: (
            <ShoppingCart size={22} />
        ),
        color: "#3b82f6",
        bg: "rgba(59,130,246,0.12)",
    },

    {
        title: "Pending Orders",
        value: pendingOrders || 0,
        icon: (
            <Clock3 size={22} />
        ),
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.12)",
    },

    {
        title: "Completed",
        value: completedOrders || 0,
        icon: (
            <CheckCircle2 size={22} />
        ),
        color: "#10b981",
        bg: "rgba(16,185,129,0.12)",
    },

    {
        title: "Revenue",
        value:
            "Rp " +
            (revenue || 0).toLocaleString(
                "id-ID"
            ),
        icon: (
            <Wallet size={22} />
        ),
        color: "#8b5cf6",
        bg: "rgba(139,92,246,0.12)",
    },
];

    const getStatusStyle = (
        status
    ) => {
        switch (status) {
            case "Completed":
                return {
                    background:
                        "rgba(16,185,129,0.15)",
                    color: "#34d399",
                };

            case "Pending":
                return {
                    background:
                        "rgba(245,158,11,0.15)",
                    color: "#fbbf24",
                };

            case "Cancelled":
                return {
                    background:
                        "rgba(239,68,68,0.15)",
                    color: "#f87171",
                };

            default:
                return {
                    background:
                        "rgba(148,163,184,0.15)",
                    color: "#cbd5e1",
                };
        }
    };

    return (
        <AdminLayout>
            {/* HERO */}
            <div
                style={{
                    width: "100%",
                    borderRadius:
                        "32px",
                    padding: "38px",
                    background:
                        "linear-gradient(135deg,#0f172a 0%,#111827 45%,#1e293b 100%)",
                    border:
                        "1px solid rgba(255,255,255,0.06)",
                    position:
                        "relative",
                    overflow:
                        "hidden",
                    marginBottom:
                        "30px",
                    boxSizing:
                        "border-box",
                }}
            >
                <div
                    style={{
                        position:
                            "absolute",
                        top: "-120px",
                        right:
                            "-80px",
                        width: "260px",
                        height: "260px",
                        borderRadius:
                            "999px",
                        background:
                            "rgba(59,130,246,0.16)",
                        filter:
                            "blur(100px)",
                    }}
                />

                <div
                    style={{
                        position:
                            "relative",
                        zIndex: 2,
                        display:
                            "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        flexWrap:
                            "wrap",
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
                            <ShoppingCart
                                size={15}
                            />
                            Orders
                        </div>

                        <h1
                            style={{
                                margin: 0,
                                color:
                                    "white",
                                fontSize:
                                    "42px",
                                fontWeight:
                                    "800",
                            }}
                        >
                            Customer
                            Orders
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
                            Kelola dan
                            monitor
                            seluruh
                            pesanan
                            catering
                            customer
                            dalam satu
                            dashboard
                            modern.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            navigate(
                                "/reports"
                            )
                        }
                        style={{
                            height:
                                "56px",
                            padding:
                                "0 24px",
                            border:
                                "none",
                            borderRadius:
                                "16px",
                            background:
                                "linear-gradient(135deg,#2563eb,#3b82f6)",
                            color:
                                "white",
                            fontWeight:
                                "700",
                            display:
                                "flex",
                            alignItems:
                                "center",
                            gap: "10px",
                            cursor:
                                "pointer",
                            boxShadow:
                                "0 12px 30px rgba(37,99,235,0.35)",
                        }}
                    >
                        View Reports
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
                        "repeat(auto-fit,minmax(240px,1fr))",
                    gap: "22px",
                    marginBottom:
                        "30px",
                }}
            >
                {stats.map(
                    (
                        item,
                        index
                    ) => (
                        <div
                            key={
                                index
                            }
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
                                    {
                                        item.icon
                                    }
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
                                            "30px",
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

            {/* TABLE */}
            <div
                style={{
                    background:
                        "linear-gradient(180deg,#111827 0%,#0f172a 100%)",
                    border:
                        "1px solid rgba(255,255,255,0.06)",
                    borderRadius:
                        "30px",
                    padding: "30px",
                    overflow:
                        "hidden",
                }}
            >
                {/* HEADER */}
                <div
                    style={{
                        display:
                            "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        flexWrap:
                            "wrap",
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
                            Order List
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
                            Incoming
                            catering
                            orders from
                            customers
                        </p>
                    </div>

                    {/* ACTION */}
                    <div
                        style={{
                            display:
                                "flex",
                            alignItems:
                                "center",
                            gap: "12px",
                            flexWrap:
                                "wrap",
                            position:
                                "relative",
                        }}
                    >
                        {/* SEARCH */}
                        <div
                            style={{
                                height:
                                    "50px",
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
                                size={
                                    18
                                }
                                color="#94a3b8"
                            />

                            <input
                                type="text"
                                value={
                                    search
                                }
                                onChange={(
                                    e
                                ) =>
                                    setSearch(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Search orders..."
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
                            onClick={() =>
                                setFilterOpen(
                                    !filterOpen
                                )
                            }
                            style={{
                                height:
                                    "50px",
                                padding:
                                    "0 20px",
                                border:
                                    "1px solid rgba(255,255,255,0.06)",
                                borderRadius:
                                    "16px",
                                background:
                                    filterOpen
                                        ? "#2563eb"
                                        : "rgba(255,255,255,0.04)",
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
                                size={
                                    18
                                }
                            />
                            Filter
                        </button>

                        {/* FILTER MENU */}
                        {filterOpen && (
                            <div
                                style={{
                                    position:
                                        "absolute",
                                    top: "62px",
                                    right: 0,
                                    width:
                                        "220px",
                                    background:
                                        "#0f172a",
                                    border:
                                        "1px solid rgba(255,255,255,0.08)",
                                    borderRadius:
                                        "18px",
                                    padding:
                                        "14px",
                                    zIndex: 10,
                                    boxShadow:
                                        "0 20px 40px rgba(0,0,0,0.35)",
                                }}
                            >
                                {[
                                    "All",
                                    "Pending",
                                    "Completed",
                                    "Cancelled",
                                ].map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <button
                                            key={
                                                index
                                            }
                                            onClick={() => {
                                                setSelectedStatus(
                                                    item
                                                );

                                                setFilterOpen(
                                                    false
                                                );
                                            }}
                                            style={{
                                                width:
                                                    "100%",
                                                height:
                                                    "44px",
                                                border:
                                                    "none",
                                                borderRadius:
                                                    "12px",
                                                background:
                                                    selectedStatus ===
                                                    item
                                                        ? "rgba(59,130,246,0.15)"
                                                        : "transparent",
                                                color:
                                                    "#e2e8f0",
                                                textAlign:
                                                    "left",
                                                padding:
                                                    "0 14px",
                                                cursor:
                                                    "pointer",
                                                marginBottom:
                                                    "4px",
                                            }}
                                        >
                                            {
                                                item
                                            }
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* TABLE */}
                <div
                    style={{
                        width: "100%",
                        overflowX:
                            "auto",
                    }}
                >
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
                            <tr>
                                {[
                                    "Customer",
                                    "Package",
                                    "Order Date",
                                    "Status",
                                    "Total",
                                ].map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <th
                                            key={
                                                index
                                            }
                                            style={{
                                                textAlign:
                                                    "left",
                                                padding:
                                                    "18px 20px",
                                                color:
                                                    "#94a3b8",
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
                            {filteredOrders.length >
                            0 ? (
                                filteredOrders.map(
                                    (
                                        order,
                                        index
                                    ) => (
                                        <tr
                                            key={
                                                index
                                            }
                                            style={{
                                                borderBottom:
                                                    "1px solid rgba(255,255,255,0.04)",
                                            }}
                                        >
                                            <td
                                                style={{
                                                    padding:
                                                        "18px 20px",
                                                    color:
                                                        "white",
                                                }}
                                            >
                                                {
                                                    order.customer_name
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "18px 20px",
                                                    color:
                                                        "#cbd5e1",
                                                }}
                                            >
                                                {
                                                    order.package_name
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "18px 20px",
                                                    color:
                                                        "#cbd5e1",
                                                }}
                                            >
                                                {
                                                    order.order_date
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "18px 20px",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        padding:
                                                            "8px 14px",
                                                        borderRadius:
                                                            "999px",
                                                        fontSize:
                                                            "12px",
                                                        fontWeight:
                                                            "700",
                                                        ...getStatusStyle(
                                                            order.status
                                                        ),
                                                    }}
                                                >
                                                    {
                                                        order.status
                                                    }
                                                </span>
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "18px 20px",
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
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan={
                                            5
                                        }
                                        style={{
                                            padding:
                                                "80px 20px",
                                            textAlign:
                                                "center",
                                            color:
                                                "#64748b",
                                            fontSize:
                                                "15px",
                                        }}
                                    >
                                        {search
                                            ? `Tidak ada hasil untuk "${search}"`
                                            : selectedStatus !==
                                              "All"
                                            ? `Tidak ada data dengan status "${selectedStatus}"`
                                            : "Belum ada data orders"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}