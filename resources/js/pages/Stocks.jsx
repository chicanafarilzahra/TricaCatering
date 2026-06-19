// resources/js/pages/Stocks.jsx
import axios from "axios";

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
    useEffect,
} from "react";

import AdminLayout from "../layouts/AdminLayout";

export default function Stocks() {
    const stockRef = useRef(null);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [stocks, setStocks] = useState([]);

    const [selectedGroup, setSelectedGroup] =
    useState(null);

useEffect(() => {
    fetchStocks();
}, []);

const fetchStocks = async () => {
    try {
        const res = await axios.get(
            "http://localhost:8000/api/stocks"
        );

        console.log(
            "API STOCKS",
            JSON.stringify(res.data, null, 2)
        );

        setStocks(res.data);
    } catch (err) {
        console.log(err);
    }
};

    const filteredStocks =
        useMemo(() => {
            return stocks.filter(
                (item) => {
                    const matchSearch =
    item.name
        ?.toLowerCase()
        .includes(
            search.toLowerCase()
        ) ||
    item.tempat
        ?.toLowerCase()
        .includes(
            search.toLowerCase()
        ) ||
    item.source
        ?.toLowerCase()
        .includes(
            search.toLowerCase()
        ) ||
    item.unit
        ?.toLowerCase()
        .includes(
            search.toLowerCase()
        );
                    const stockStatus =
                        item.qty <= item.minimum_stock
                            ? "Low Stock"
                            : "Normal";

const matchStatus =
    statusFilter === "All" ||
    stockStatus === statusFilter;

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
                    item.qty <=
                    item.minimum_stock
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
            title: "Owner Stocks    ",
                value:
                    stocks.filter(
                        (item) =>
                            item.source ===
                            "Owner"
                    ).length,
            icon: <Package size={22} />,
            color: "#8b5cf6",
            bg: "rgba(139,92,246,0.12)",
        },

        {
            title: "Sppg Stock",
            value:
                stocks.filter(
                    (item) =>
                        item.source ===
                        "SPPG"
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
    const groupedStocks = Object.values(
    stocks.reduce((acc, item) => {

        const key =
            item.source +
            "-" +
            item.tempat;

        if (!acc[key]) {
            acc[key] = {
                source: item.source,
                tempat: item.tempat,
                items: [],
            };
        }

        acc[key].items.push(item);

        return acc;

    }, {})
);

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
                                value="Normal"
                                style={{
                                    color:
                                        "black",
                                }}
                            >
                                Normal
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
                                    "Sumber",
                                    "Nama Tempat",
                                    "Aksi",
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
    {groupedStocks.map(
        (group, index) => (
            <tr
                key={index}
                style={{
                    borderBottom:
                        "1px solid rgba(255,255,255,0.05)",
                }}
            >
                <td
                    style={{
                        padding: "20px",
                        color: "white",
                    }}
                >
                    {group.source}
                </td>

                <td
                    style={{
                        padding: "20px",
                        color: "#cbd5e1",
                    }}
                >
                    {group.tempat}
                </td>

                <td
                    style={{
                        padding: "20px",
                    }}
                >
                    <button
                        onClick={() =>
                            setSelectedGroup(group)
                        }
                        style={{
                            background: "#2563eb",
                            border: "none",
                            color: "white",
                            padding:
                                "10px 16px",
                            borderRadius:
                                "10px",
                            cursor:
                                "pointer",
                        }}
                    >
                        Lihat Stock (
                        {group.items.length}
                        )
                    </button>
                </td>
            </tr>
        )
    )}
</tbody>
                    </table>
                </div>
            </div>

            {selectedGroup && (
    <div
        style={{
            position: "fixed",
            inset: 0,
            background:
                "rgba(0,0,0,.7)",
            display: "flex",
            justifyContent:
                "center",
            alignItems:
                "center",
            zIndex: 9999,
        }}
    >
        <div
            style={{
                width: "900px",
                maxWidth: "95%",
                maxHeight: "80vh",
                overflowY: "auto",
                background:
                    "#0f172a",
                borderRadius:
                    "20px",
                padding: "24px",
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
                        "20px",
                }}
            >
                <div>
                    <h2
                        style={{
                            color:
                                "white",
                            margin: 0,
                        }}
                    >
                        {
                            selectedGroup.tempat
                        }
                    </h2>

                    <p
                        style={{
                            color:
                                "#94a3b8",
                            margin:
                                "6px 0 0",
                        }}
                    >
                        {
                            selectedGroup.source
                        }
                    </p>
                </div>

                <button
                    onClick={() =>
                        setSelectedGroup(
                            null
                        )
                    }
                    style={{
                        background:
                            "#ef4444",
                        border: "none",
                        color:
                            "white",
                        padding:
                            "10px 14px",
                        borderRadius:
                            "10px",
                        cursor:
                            "pointer",
                    }}
                >
                    Tutup
                </button>
            </div>

            <table
                style={{
                    width: "100%",
                    borderCollapse:
                        "collapse",
                }}
            >
                <thead>
                    <tr>
                        <th
                            style={{
                                padding:
                                    "12px",
                                color:
                                    "#94a3b8",
                                textAlign:
                                    "left",
                            }}
                        >
                            Bahan
                        </th>

                        <th
                            style={{
                                padding:
                                    "12px",
                                color:
                                    "#94a3b8",
                                textAlign:
                                    "left",
                            }}
                        >
                            Qty
                        </th>

                        <th
                            style={{
                                padding:
                                    "12px",
                                color:
                                    "#94a3b8",
                                textAlign:
                                    "left",
                            }}
                        >
                            Unit
                        </th>

                        <th
                            style={{
                                padding:
                                    "12px",
                                color:
                                    "#94a3b8",
                                textAlign:
                                    "left",
                            }}
                        >
                            Status
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {selectedGroup.items.map(
                        (item) => (
                            <tr
                                key={
                                    item.id
                                }
                            >
                                <td
                                    style={{
                                        padding:
                                            "12px",
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
                                            "12px",
                                        color:
                                            "white",
                                    }}
                                >
                                    {
                                        item.qty
                                    }
                                </td>

                                <td
                                    style={{
                                        padding:
                                            "12px",
                                        color:
                                            "white",
                                    }}
                                >
                                    {
                                        item.unit
                                    }
                                </td>

                                <td
                                    style={{
                                        padding:
                                            "12px",
                                    }}
                                >
                                    <span
                                        style={{
                                            color:
                                                item.qty <=
                                                item.minimum_stock
                                                    ? "#ef4444"
                                                    : "#10b981",
                                        }}
                                    >
                                        {item.qty <=
                                        item.minimum_stock
                                            ? "Low Stock"
                                            : "Normal"}
                                    </span>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    </div>
)}
        </AdminLayout>
    );
}