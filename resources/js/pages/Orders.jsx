import axios from "axios";
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
    useEffect,
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
    const [orders, setOrders] = useState([]);

    useEffect(() => {
    fetchOrders();
}, []);

const fetchOrders = async () => {
    try {
        const res = await axios.get(
            "http://localhost:8000/api/orders"
        );

        setOrders(res.data);
        console.log(orders);
    } catch (err) {
        console.log(err);
    }
};

    // FILTER DATA
    const filteredOrders = useMemo(() => {
        return orders.filter((item) => {
            const keyword =
                search.toLowerCase();

            const matchSearch =
                item.customer_name
                    ?.toLowerCase()
                    .includes(keyword) ||
                item.menu?.name
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
            item.status === "pending"
    ).length;
   const confirmedOrders =
    orders.filter(
        (item) =>
            item.status === "confirmed"
    ).length;

const deliveryOrders =
    orders.filter(
        (item) =>
            item.status === "on_delivery"
    ).length;

const completedOrders =
    orders.filter(
        (item) =>
            item.status === "delivered"
    ).length;

    const revenue =
        orders.reduce(
            (total, item) =>
                total +
                Number(item.total_price || 0),
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

    const getStatusStyle = (status) => {
    switch (status) {
        case "delivered":
            return {
                background: "rgba(16,185,129,0.15)",
                color: "#34d399",
            };

        case "confirmed":
            return {
                background: "rgba(59,130,246,0.15)",
                color: "#60a5fa",
            };

        case "on_delivery":
            return {
                background: "rgba(245,158,11,0.15)",
                color: "#fbbf24",
            };

        case "pending":
            return {
                background: "rgba(239,68,68,0.15)",
                color: "#f87171",
            };

        default:
            return {
                background: "rgba(148,163,184,0.15)",
                color: "#cbd5e1",
            };
    }
};

    return (

        <AdminLayout>
            <div className="dash-root">
            <style>{`
.stat-card:hover{
    transform: translateY(-3px);
    box-shadow: 0 16px 48px rgba(0,0,0,.35);
}
`}</style>
            <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

    .dash-root * {
        font-family: 'Inter', system-ui, sans-serif;
        box-sizing: border-box;
    }
`}</style>
            {/* HERO */}
<div
    style={{
        position: "relative",
        borderRadius: "24px",
        padding: "40px",
        background:
            "linear-gradient(135deg,#0d1117 0%,#0f172a 60%,#131c2e 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        overflow: "hidden",
        marginBottom: "24px",
    }}
>
    {/* Grid Texture */}
    <div
        style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
                "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
        }}
    />

    {/* Glow */}
    <div
        style={{
            position: "absolute",
            top: "-80px",
            right: "60px",
            width: "300px",
            height: "300px",
            borderRadius: "999px",
            background: "rgba(59,130,246,0.12)",
            filter: "blur(90px)",
        }}
    />

    <div
        style={{
            position: "absolute",
            bottom: "-60px",
            right: "-40px",
            width: "200px",
            height: "200px",
            borderRadius: "999px",
            background: "rgba(139,92,246,0.1)",
            filter: "blur(70px)",
        }}
    />

    <div
        style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "32px",
            flexWrap: "wrap",
        }}
    >
        {/* LEFT */}
        <div style={{ flex: 1 }}>
            <div
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    background:
                        "rgba(59,130,246,0.1)",
                    border:
                        "1px solid rgba(59,130,246,0.22)",
                    color: "#60a5fa",
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "22px",
                }}
            >
                <span
                    style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "999px",
                        background: "#60a5fa",
                    }}
                />
                Orders Management
            </div>

            <h1
                style={{
                    margin: 0,
                    fontSize:
                        "clamp(28px,3.5vw,44px)",
                    lineHeight: 1.15,
                    color: "white",
                    fontWeight: "800",
                    letterSpacing: "-1.5px",
                }}
            >
                Monitor seluruh
                <br />
                <span
                    style={{
                        background:
                            "linear-gradient(90deg,#60a5fa,#a78bfa)",
                        WebkitBackgroundClip:
                            "text",
                        WebkitTextFillColor:
                            "transparent",
                    }}
                >
                    pesanan customer
                </span>
            </h1>

            <p
                style={{
                    margin: "16px 0 0",
                    color: "#64748b",
                    fontSize: "15px",
                    lineHeight: "1.8",
                    maxWidth: "600px",
                }}
            >
                Kelola dan monitor seluruh
                pesanan catering customer,
                status pengiriman, dan
                transaksi secara realtime
                dalam satu dashboard modern.
            </p>

            <div
                style={{
                    marginTop: "24px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    background:
                        "rgba(255,255,255,0.04)",
                    border:
                        "1px solid rgba(255,255,255,0.07)",
                    color: "#94a3b8",
                    fontSize: "13px",
                }}
            >
                <Clock3
                    size={14}
                    color="#60a5fa"
                />
                Monitoring Order Realtime
            </div>
        </div>

        {/* RIGHT CARD */}
        <div
            style={{
                width: "300px",
                background:
                    "rgba(255,255,255,0.03)",
                border:
                    "1px solid rgba(255,255,255,0.07)",
                borderRadius: "20px",
                padding: "24px",
                backdropFilter: "blur(12px)",
            }}
        >
            <div
                style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "0.08em",
                    textTransform:
                        "uppercase",
                    color: "#475569",
                    marginBottom: "18px",
                }}
            >
                Order Overview
            </div>

            {[
                {
                    label: "Pending",
                    value: pendingOrders,
                    color: "#f59e0b",
                },
                {
                    label: "Completed",
                    value: completedOrders,
                    color: "#22c55e",
                },
                {
                    label: "On Delivery",
                    value: deliveryOrders,
                    color: "#3b82f6",
                },
            ].map((row, i) => (
                <div
                    key={i}
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        padding: "11px 0",
                        borderBottom:
                            i < 2
                                ? "1px solid rgba(255,255,255,0.05)"
                                : "none",
                    }}
                >
                    <span
                        style={{
                            color: "#94a3b8",
                            fontSize: "13px",
                        }}
                    >
                        {row.label}
                    </span>

                    <span
                        style={{
                            color: row.color,
                            fontWeight:
                                "700",
                        }}
                    >
                        {row.value}
                    </span>
                </div>
            ))}

            <div
                style={{
                    marginTop: "18px",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    background:
                        "rgba(34,197,94,0.08)",
                    border:
                        "1px solid rgba(34,197,94,0.15)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                }}
            >
                <ArrowUpRight
                    size={14}
                    color="#22c55e"
                />
                <span
                    style={{
                        color: "#22c55e",
                        fontSize: "13px",
                        fontWeight: "600",
                    }}
                >
                    Sistem order berjalan normal
                </span>
            </div>
        </div>
    </div>
</div>

            {/* STATS */}
<div
    style={{
        display: "grid",
        gridTemplateColumns:
            "repeat(4,minmax(0,1fr))",
        gap: "16px",
        marginBottom: "24px",
    }}
>
    {stats.map((item, index) => (
        <div
            key={index}
            className="stat-card"
            style={{
                background:
                    "linear-gradient(160deg,#0f172a 0%,#0d1117 100%)",
                border: `1px solid ${item.bg.replace(
                    "0.12",
                    "0.25"
                )}`,
                borderRadius: "20px",
                padding: "24px",
                position: "relative",
                overflow: "hidden",
                cursor: "default",
                transition:
                    "transform .2s ease, box-shadow .2s ease",
            }}
        >
            {/* Accent Line */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: "24px",
                    right: "24px",
                    height: "2px",
                    background: `linear-gradient(
                        90deg,
                        ${item.color},
                        transparent
                    )`,
                }}
            />

            {/* Glow */}
            <div
                style={{
                    position: "absolute",
                    top: "-40px",
                    right: "-40px",
                    width: "110px",
                    height: "110px",
                    borderRadius: "999px",
                    background: item.bg,
                    filter: "blur(30px)",
                }}
            />

            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                }}
            >
                {/* Icon */}
                <div
                    style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "14px",
                        background: item.bg,
                        color: item.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "20px",
                    }}
                >
                    {item.icon}
                </div>

                {/* Value */}
                <div
                    style={{
                        color: "white",
                        fontSize: "36px",
                        fontWeight: "800",
                        lineHeight: 1,
                        letterSpacing: "-1px",
                        marginBottom: "8px",
                    }}
                >
                    {item.value}
                </div>

                {/* Title */}
                <div
                    style={{
                        color: "#475569",
                        fontSize: "13px",
                        fontWeight: "500",
                    }}
                >
                    {item.title}
                </div>
            </div>
        </div>
    ))}
</div>

            {/* HEADER */}
<div
    style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px",
        marginBottom: "24px",
    }}
>
    <div>
        <h2
            style={{
                margin: 0,
                color: "white",
                fontSize: "18px",
                fontWeight: "700",
                letterSpacing: "-0.3px",
            }}
        >
            Recent Orders
        </h2>

        <p
            style={{
                margin: "4px 0 0",
                color: "#475569",
                fontSize: "13px",
            }}
        >
            Kelola seluruh pesanan customer
        </p>
    </div>

    <div
        style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            position: "relative",
        }}
    >
        {/* SEARCH */}
        <div
            style={{
                width: "320px",
                height: "42px",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.03)",
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                gap: "10px",
            }}
        >
            <Search
                size={16}
                color="#64748b"
            />

            <input
                type="text"
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                placeholder="Cari customer atau menu..."
                style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "white",
                    fontSize: "13px",
                }}
            />
        </div>

        {/* FILTER BUTTON */}
        <button
            onClick={() =>
                setFilterOpen(!filterOpen)
            }
            style={{
                height: "42px",
                padding: "0 16px",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                background: filterOpen
                    ? "rgba(59,130,246,0.15)"
                    : "rgba(255,255,255,0.03)",
                color: filterOpen
                    ? "#60a5fa"
                    : "#94a3b8",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
            }}
        >
            <Filter size={15} />
            Filter
        </button>

        {/* FILTER MENU */}
        {filterOpen && (
            <div
                style={{
                    position: "absolute",
                    top: "52px",
                    right: 0,
                    width: "220px",
                    background:
                        "linear-gradient(160deg,#0f172a 0%,#111827 100%)",
                    border:
                        "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "14px",
                    padding: "10px",
                    zIndex: 50,
                    boxShadow:
                        "0 20px 40px rgba(0,0,0,.4)",
                }}
            >
                {[
                    "All",
                    "pending",
                    "confirmed",
                    "on_delivery",
                    "delivered",
                ].map((item) => (
                    <button
                        key={item}
                        onClick={() => {
                            setSelectedStatus(item);
                            setFilterOpen(false);
                        }}
                        style={{
                            width: "100%",
                            height: "40px",
                            border: "none",
                            borderRadius: "10px",
                            background:
                                selectedStatus === item
                                    ? "rgba(59,130,246,0.15)"
                                    : "transparent",
                            color:
                                selectedStatus === item
                                    ? "#60a5fa"
                                    : "#cbd5e1",
                            textAlign: "left",
                            padding: "0 12px",
                            cursor: "pointer",
                            fontSize: "13px",
                            marginBottom: "4px",
                        }}
                    >
                        {item}
                    </button>
                ))}
            </div>
        )}
    </div>
</div>
                {/* TABLE */}
<div
    style={{
        width: "100%",
        overflowX: "auto",
        borderRadius: "16px",
    }}
>
    <table
        style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            minWidth: "900px",
        }}
    >
        <thead>
            <tr
                style={{
                    background:
                        "rgba(255,255,255,0.03)",
                }}
            >
                {[
                    "Customer",
                    "Package",
                    "Order Date",
                    "Status",
                    "Total",
                ].map((item, index) => (
                    <th
                        key={index}
                        style={{
                            textAlign: "left",
                            padding: "16px",
                            color: "#94a3b8",
                            fontSize: "12px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            borderBottom:
                                "1px solid rgba(255,255,255,0.06)",

                            ...(index === 0 && {
                                borderTopLeftRadius:
                                    "14px",
                            }),

                            ...(index === 4 && {
                                borderTopRightRadius:
                                    "14px",
                            }),
                        }}
                    >
                        {item}
                    </th>
                ))}
            </tr>
        </thead>

        <tbody>
            {filteredOrders.length > 0 ? (
                filteredOrders.map(
                    (order, index) => (
                        <tr
                            key={index}
                            style={{
                                borderBottom:
                                    "1px solid rgba(255,255,255,0.04)",
                                transition:
                                    "all .2s ease",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background =
                                    "rgba(255,255,255,0.025)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                    "transparent")
                            }
                        >
                            {/* CUSTOMER */}
                            <td
                                style={{
                                    padding: "16px",
                                }}
                            >
                                <div
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        gap: "12px",
                                    }}
                                >
                                    <div
                                        style={{
                                            width:
                                                "38px",
                                            height:
                                                "38px",
                                            borderRadius:
                                                "12px",
                                            background:
                                                "rgba(59,130,246,.15)",
                                            color:
                                                "#60a5fa",
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            fontWeight:
                                                "700",
                                            fontSize:
                                                "14px",
                                        }}
                                    >
                                        {order.customer_name
                                            ?.charAt(
                                                0
                                            )
                                            .toUpperCase()}
                                    </div>

                                    <div>
                                        <div
                                            style={{
                                                color:
                                                    "white",
                                                fontWeight:
                                                    "600",
                                                fontSize:
                                                    "14px",
                                            }}
                                        >
                                            {
                                                order.customer_name
                                            }
                                        </div>

                                        <div
                                            style={{
                                                color:
                                                    "#64748b",
                                                fontSize:
                                                    "12px",
                                            }}
                                        >
                                            Customer
                                        </div>
                                    </div>
                                </div>
                            </td>

                            {/* PACKAGE */}
                            <td
                                style={{
                                    padding: "16px",
                                    color:
                                        "#cbd5e1",
                                    fontSize:
                                        "14px",
                                }}
                            >
                                {
                                    order.menu
                                        ?.name
                                }
                            </td>

                            {/* DATE */}
                            <td
                                style={{
                                    padding: "16px",
                                    color:
                                        "#94a3b8",
                                    fontSize:
                                        "14px",
                                }}
                            >
                                {
                                    order.order_date
                                }
                            </td>

                            {/* STATUS */}
                            <td
                                style={{
                                    padding: "16px",
                                }}
                            >
                                <span
                                    style={{
                                        padding:
                                            "6px 12px",
                                        borderRadius:
                                            "999px",
                                        fontSize:
                                            "12px",
                                        fontWeight:
                                            "600",
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

                            {/* TOTAL */}
                            <td
                                style={{
                                    padding: "16px",
                                    color:
                                        "white",
                                    fontWeight:
                                        "700",
                                    fontSize:
                                        "14px",
                                }}
                            >
                                Rp{" "}
                                {Number(
                                    order.total_price
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
                        colSpan={5}
                        style={{
                            padding:
                                "80px 20px",
                            textAlign:
                                "center",
                            color:
                                "#64748b",
                            fontSize:
                                "14px",
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