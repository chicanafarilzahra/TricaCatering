// resources/js/pages/Stocks.jsx

import {
    Boxes,
    AlertTriangle,
    Package,
    CheckCircle2,
    Search,
    ArrowUpRight,
} from "lucide-react";

import {
    useMemo,
    useRef,
    useState,
} from "react";

import AdminLayout from "../layouts/AdminLayout";

export default function Stocks() {
    const stockRef = useRef(null);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const stocks = [];

    const filteredStocks =
        useMemo(() => {
            return stocks.filter(
                (item) => {
                    const matchSearch =
                        item.ingredient
                            ?.toLowerCase()
                            .includes(
                                search.toLowerCase()
                            ) ||
                        item.category
                            ?.toLowerCase()
                            .includes(
                                search.toLowerCase()
                            ) ||
                        item.unit
                            ?.toLowerCase()
                            .includes(
                                search.toLowerCase()
                            );

                    const matchStatus =
                        statusFilter ===
                            "All" ||
                        item.status ===
                            statusFilter;

                    return (
                        matchSearch &&
                        matchStatus
                    );
                }
            );
        }, [stocks, search, statusFilter]);

    const stats = [
        {
            title: "Total Items",
            value: stocks.length,
            icon: <Boxes size={22} />,
            color: "#3b82f6",
            bg: "rgba(59,130,246,0.12)",
        },

        {
            title: "Low Stock",
            value:
                stocks.filter(
                    (item) =>
                        item.status ===
                        "Low Stock"
                ).length,
            icon: (
                <AlertTriangle
                    size={22}
                />
            ),
            color: "#f59e0b",
            bg: "rgba(245,158,11,0.12)",
        },

        {
            title: "Available",
            value:
                stocks.filter(
                    (item) =>
                        item.status ===
                        "Available"
                ).length,
            icon: <Package size={22} />,
            color: "#8b5cf6",
            bg: "rgba(139,92,246,0.12)",
        },

        {
            title: "In Stock",
            value:
                stocks.filter(
                    (item) =>
                        item.status ===
                        "In Stock"
                ).length,
            icon: (
                <CheckCircle2
                    size={22}
                />
            ),
            color: "#10b981",
            bg: "rgba(16,185,129,0.12)",
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
                            <Boxes
                                size={15}
                            />
                            Stock Inventory
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
                            Inventory
                            Stocks
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
                            seluruh stok
                            bahan dan
                            inventory
                            catering
                            secara
                            realtime
                            dalam
                            dashboard
                            modern dengan
                            tampilan
                            clean dan
                            elegant.
                        </p>
                    </div>

                    {/* BUTTON */}
                    <button
                        onClick={() => {
                            stockRef.current?.scrollIntoView(
                                {
                                    behavior:
                                        "smooth",
                                }
                            );
                        }}
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

            {/* TABLE */}
            <div
                ref={stockRef}
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
                            Stock
                            Inventory
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
                            Current
                            ingredient and
                            raw material
                            stock
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
                                placeholder="Search stocks..."
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
                                value="Available"
                                style={{
                                    color:
                                        "black",
                                }}
                            >
                                Available
                            </option>

                            <option
                                value="In Stock"
                                style={{
                                    color:
                                        "black",
                                }}
                            >
                                In Stock
                            </option>

                            <option
                                value="Low Stock"
                                style={{
                                    color:
                                        "black",
                                }}
                            >
                                Low Stock
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
                                    "Ingredient",
                                    "Category",
                                    "Quantity",
                                    "Unit",
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
                            {filteredStocks.length >
                            0 ? (
                                filteredStocks.map(
                                    (
                                        item,
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
                                                    item.ingredient
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
                                                    item.category
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
                                                    item.quantity
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
                                                    item.unit
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
                                                            item.status ===
                                                            "Available"
                                                                ? "rgba(16,185,129,0.15)"
                                                                : item.status ===
                                                                  "Low Stock"
                                                                ? "rgba(245,158,11,0.15)"
                                                                : "rgba(139,92,246,0.15)",
                                                        color:
                                                            item.status ===
                                                            "Available"
                                                                ? "#10b981"
                                                                : item.status ===
                                                                  "Low Stock"
                                                                ? "#f59e0b"
                                                                : "#8b5cf6",
                                                    }}
                                                >
                                                    {
                                                        item.status
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
                                        Stock tidak
                                        ditemukan
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