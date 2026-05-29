// resources/js/pages/SPPG.jsx

import {
    School,
    Package,
    Truck,
    CheckCircle2,
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

export default function SPPG() {
    const activityRef = useRef(null);

    const [search, setSearch] =
        useState("");

    const [showFilter, setShowFilter] =
        useState(false);

    const [statusFilter, setStatusFilter] =
        useState("All");

    const sppgData = [];

    const filteredData = useMemo(() => {
        let data = [...sppgData];

        if (showFilter) {
            data = data.filter((item) =>
                statusFilter === "All"
                    ? true
                    : item.status ===
                      statusFilter
            );
        }

        if (search) {
            data = data.filter((item) =>
                [
                    item.school,
                    item.package,
                    item.status,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )
            );
        }

        return data;
    }, [
        search,
        sppgData,
        showFilter,
        statusFilter,
    ]);

    const stats = [
        {
            title: "Schools",
            value: sppgData.length,
            icon: <School size={22} />,
            color: "#3b82f6",
            bg: "rgba(59,130,246,0.12)",
        },

        {
            title: "Packages",
            value: sppgData.length,
            icon: <Package size={22} />,
            color: "#8b5cf6",
            bg: "rgba(139,92,246,0.12)",
        },

        {
            title: "Deliveries",
            value: sppgData.filter(
                (item) =>
                    item.status ===
                    "On Delivery"
            ).length,
            icon: <Truck size={22} />,
            color: "#10b981",
            bg: "rgba(16,185,129,0.12)",
        },

        {
            title: "Completed",
            value: sppgData.filter(
                (item) =>
                    item.status ===
                    "Completed"
            ).length,
            icon: (
                <CheckCircle2 size={22} />
            ),
            color: "#f59e0b",
            bg: "rgba(245,158,11,0.12)",
        },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case "Completed":
                return {
                    background:
                        "rgba(16,185,129,0.14)",
                    color: "#34d399",
                };

            case "On Delivery":
                return {
                    background:
                        "rgba(59,130,246,0.14)",
                    color: "#60a5fa",
                };

            case "Pending":
                return {
                    background:
                        "rgba(245,158,11,0.14)",
                    color: "#fbbf24",
                };

            default:
                return {
                    background:
                        "rgba(148,163,184,0.14)",
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
                            <School
                                size={15}
                            />
                            SPPG Management
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
                            School Food
                            Services
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
                            pantau seluruh
                            aktivitas layanan
                            makanan sekolah
                            dengan dashboard
                            modern yang
                            clean, elegant,
                            dan realtime.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            activityRef.current?.scrollIntoView(
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

            {/* TABLE */}
            <div
                ref={activityRef}
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
                            SPPG Activity
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
                            School meal
                            production and
                            distribution
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
                                value={search}
                                onChange={(
                                    e
                                ) =>
                                    setSearch(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Search activity..."
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
                        <div
                            style={{
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                gap: "10px",
                                flexWrap:
                                    "wrap",
                            }}
                        >
                            <button
                                onClick={() =>
                                    setShowFilter(
                                        !showFilter
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
                                        showFilter
                                            ? "linear-gradient(135deg,#2563eb,#3b82f6)"
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
                                    size={18}
                                />
                                {showFilter
                                    ? "Filter Active"
                                    : "Filter"}
                            </button>

                            {showFilter && (
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
                                        border:
                                            "1px solid rgba(255,255,255,0.06)",
                                        background:
                                            "rgba(255,255,255,0.04)",
                                        borderRadius:
                                            "16px",
                                        padding:
                                            "0 16px",
                                        color:
                                            "white",
                                        outline:
                                            "none",
                                        cursor:
                                            "pointer",
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
                                        Status
                                    </option>

                                    <option
                                        value="Completed"
                                        style={{
                                            color:
                                                "black",
                                        }}
                                    >
                                        Completed
                                    </option>

                                    <option
                                        value="On Delivery"
                                        style={{
                                            color:
                                                "black",
                                        }}
                                    >
                                        On
                                        Delivery
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
                            )}
                        </div>
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
                                    "School",
                                    "Package",
                                    "Total Meals",
                                    "Delivery Date",
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
                            {filteredData
                                .length >
                            0 ? (
                                filteredData.map(
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
                                                        "18px 20px",
                                                    color:
                                                        "white",
                                                }}
                                            >
                                                {
                                                    item.school
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
                                                    item.package
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
                                                    item.totalMeals
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
                                                    item.deliveryDate
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
                                                            item.status
                                                        ),
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
                                        {search
                                            ? `Tidak ada hasil untuk "${search}"`
                                            : showFilter
                                            ? "Tidak ada data sesuai filter"
                                            : "Belum ada data SPPG"}
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