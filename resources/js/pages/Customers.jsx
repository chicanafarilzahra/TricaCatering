// resources/js/pages/Customers.jsx

import {
    Users,
    UserCheck,
    ShoppingCart,
    Wallet,
    Search,
    Filter,
    ArrowUpRight,
} from "lucide-react";

import {
    useMemo,
    useRef,
    useState,
} from "react";

import AdminLayout from "../layouts/AdminLayout";

export default function Customers() {
    const customerListRef =
        useRef(null);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const customers = [
        
    ];

    const filteredCustomers =
        useMemo(() => {
            return customers.filter(
                (customer) => {
                    const matchSearch =
                        customer.name
                            .toLowerCase()
                            .includes(
                                search.toLowerCase()
                            ) ||
                        customer.email
                            .toLowerCase()
                            .includes(
                                search.toLowerCase()
                            ) ||
                        customer.phone.includes(
                            search
                        );

                    const matchStatus =
                        statusFilter ===
                            "All" ||
                        customer.status ===
                            statusFilter;

                    return (
                        matchSearch &&
                        matchStatus
                    );
                }
            );
        }, [search, statusFilter]);

    const stats = [
    {
        title: "Total Customers",
        value: customers.length,
        icon: <Users size={22} />,
        color: "#3b82f6",
        bg: "rgba(59,130,246,0.12)",
    },

    {
        title: "Active Customers",
        value: customers.filter(
            (c) =>
                c.status ===
                "Active"
        ).length,
        icon: (
            <UserCheck
                size={22}
            />
        ),
        color: "#10b981",
        bg: "rgba(16,185,129,0.12)",
    },

    {
        title: "Total Orders",
        value: customers.reduce(
            (
                total,
                customer
            ) =>
                total +
                customer.orders,
            0
        ),
        icon: (
            <ShoppingCart
                size={22}
            />
        ),
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.12)",
    },

    {
        title: "Revenue",
        value: customers.length
            ? customers.reduce(
                  (
                      total,
                      customer
                  ) =>
                      total +
                      (customer.revenue ||
                          0),
                  0
              )
            : 0,
        icon: (
            <Wallet size={22} />
        ),
        color: "#8b5cf6",
        bg: "rgba(139,92,246,0.12)",
    },
];

    return (
        <AdminLayout>
            <style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
.customers-root, .customers-root * {
    font-family: 'Inter', system-ui, sans-serif;
    box-sizing: border-box;
}
.stat-card:hover{
    transform: translateY(-3px);
    box-shadow: 0 16px 48px rgba(0,0,0,.35);
}
`}</style>

            <div className="customers-root">

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
                    marginBottom:
                        "30px",
                    boxSizing:
                        "border-box",
                }}
            >
                {/* GLOW */}
                <div
                    style={{
                        position:
                            "absolute",
                        top: "-120px",
                        right: "-80px",
                        width: "260px",
                        height:
                            "260px",
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
                        display: "flex",
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
                            <Users
                                size={15}
                            />
                            Customer
                            Overview
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
                                lineHeight:
                                    1.2,
                                letterSpacing:
                                    "-1px",
                            }}
                        >
                            Customer Data
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
                            Pantau
                            seluruh
                            data
                            customer,
                            aktivitas
                            pemesanan,
                            dan
                            performa
                            layanan
                            catering
                            dalam satu
                            dashboard
                            modern yang
                            clean dan
                            elegant.
                        </p>
                    </div>

                    {/* VIEW REPORTS */}
                    <button
                        onClick={() => {
                            customerListRef.current?.scrollIntoView(
                                {
                                    behavior:
                                        "smooth",
                                }
                            );
                        }}
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
                        "repeat(4,minmax(0,1fr))",
                    gap: "16px",
                    marginBottom:
                        "24px",
                }}
            >
                {stats.map(
                    (item, index) => (
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
                                borderRadius:
                                    "20px",
                                padding:
                                    "24px",
                                position:
                                    "relative",
                                overflow:
                                    "hidden",
                                cursor:
                                    "default",
                                transition:
                                    "transform .2s ease, box-shadow .2s ease",
                            }}
                        >
                            {/* Accent Line */}
                            <div
                                style={{
                                    position:
                                        "absolute",
                                    top: 0,
                                    left:
                                        "24px",
                                    right:
                                        "24px",
                                    height:
                                        "2px",
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
                                    position:
                                        "absolute",
                                    top: "-40px",
                                    right:
                                        "-40px",
                                    width:
                                        "110px",
                                    height:
                                        "110px",
                                    borderRadius:
                                        "999px",
                                    background:
                                        item.bg,
                                    filter:
                                        "blur(30px)",
                                }}
                            />

                            <div
                                style={{
                                    position:
                                        "relative",
                                    zIndex: 2,
                                }}
                            >
                                {/* Icon */}
                                <div
                                    style={{
                                        width:
                                            "44px",
                                        height:
                                            "44px",
                                        borderRadius:
                                            "14px",
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
                                            "20px",
                                    }}
                                >
                                    {
                                        item.icon
                                    }
                                </div>

                                {/* Value */}
                                <div
                                    style={{
                                        color:
                                            "white",
                                        fontSize:
                                            "36px",
                                        fontWeight:
                                            "800",
                                        lineHeight: 1,
                                        letterSpacing:
                                            "-1px",
                                        marginBottom:
                                            "8px",
                                    }}
                                >
                                    {item.title ===
                                    "Revenue"
                                        ? `Rp ${item.value.toLocaleString()}`
                                        : item.value}
                                </div>

                                {/* Title */}
                                <div
                                    style={{
                                        color:
                                            "#475569",
                                        fontSize:
                                            "13px",
                                        fontWeight:
                                            "500",
                                    }}
                                >
                                    {
                                        item.title
                                    }
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* TABLE */}
            <div
                ref={
                    customerListRef
                }
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
                        display: "flex",
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
                            Customer
                            Details
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
                            Registered
                            customers in
                            the system
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
                                size={18}
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
                                placeholder="Search customers..."
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
                        <select
                            value={
                                statusFilter
                            }
                            onChange={(
                                e
                            ) =>
                                setStatusFilter(
                                    e
                                        .target
                                        .value
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
                                    "rgba(255,255,255,0.04)",
                                color:
                                    "white",
                                fontWeight:
                                    "600",
                                cursor:
                                    "pointer",
                                outline:
                                    "none",
                            }}
                        >
                            <option
                                value="All"
                                style={{
                                    color:
                                        "black",
                                }}
                            >
                                All
                            </option>

                            <option
                                value="Active"
                                style={{
                                    color:
                                        "black",
                                }}
                            >
                                Active
                            </option>

                            <option
                                value="Inactive"
                                style={{
                                    color:
                                        "black",
                                }}
                            >
                                Inactive
                            </option>

                            <option
                                value="Pending"
                                style={{
                                    color:
                                        "black",
                                }}
                            >
                                Pending
                            </option>
                        </select>
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
                                    "Customer Name",
                                    "Email",
                                    "Phone",
                                    "Total Orders",
                                    "Status",
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
                            {filteredCustomers.length >
                            0 ? (
                                filteredCustomers.map(
                                    (
                                        customer,
                                        index
                                    ) => (
                                        <tr
                                            key={
                                                index
                                            }
                                            style={{
                                                borderBottom:
                                                    "1px solid rgba(255,255,255,0.05)",
                                            }}
                                        >
                                            <td
                                                style={{
                                                    padding:
                                                        "20px",
                                                    color:
                                                        "white",
                                                }}
                                            >
                                                {
                                                    customer.name
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "20px",
                                                    color:
                                                        "#cbd5e1",
                                                }}
                                            >
                                                {
                                                    customer.email
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "20px",
                                                    color:
                                                        "#cbd5e1",
                                                }}
                                            >
                                                {
                                                    customer.phone
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "20px",
                                                    color:
                                                        "#cbd5e1",
                                                }}
                                            >
                                                {
                                                    customer.orders
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "20px",
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
                                                        background:
                                                            customer.status ===
                                                            "Active"
                                                                ? "rgba(16,185,129,0.15)"
                                                                : customer.status ===
                                                                  "Pending"
                                                                ? "rgba(245,158,11,0.15)"
                                                                : "rgba(239,68,68,0.15)",
                                                        color:
                                                            customer.status ===
                                                            "Active"
                                                                ? "#10b981"
                                                                : customer.status ===
                                                                  "Pending"
                                                                ? "#f59e0b"
                                                                : "#ef4444",
                                                    }}
                                                >
                                                    {
                                                        customer.status
                                                    }
                                                </span>
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
                                        Customer
                                        tidak
                                        ditemukan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
        </AdminLayout>
    );
}