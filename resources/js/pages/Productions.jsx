// TANPA DATA DUMMY
// tinggal tambahkan API/backend nanti

import {
    Factory,
    PackageCheck,
    Clock3,
    BadgeCheck,
    Search,
    Filter,
    Eye,
} from "lucide-react";

import {
    useMemo,
    useRef,
    useState,
} from "react";

import AdminLayout from "../layouts/AdminLayout";

export default function Productions() {
    const tableRef = useRef(null);

    const [search, setSearch] =
        useState("");

    const [filterOpen, setFilterOpen] =
        useState(false);

    const [selectedFilter, setSelectedFilter] =
        useState("All Productions");

    // DATA DARI API / BACKEND
    const productions = [];

    // FILTER DATA
    const filteredProductions =
        useMemo(() => {
            return productions.filter(
                (item) => {
                    const matchSearch =
                        item.code
                            ?.toLowerCase()
                            .includes(
                                search.toLowerCase()
                            ) ||
                        item.package
                            ?.toLowerCase()
                            .includes(
                                search.toLowerCase()
                            ) ||
                        item.status
                            ?.toLowerCase()
                            .includes(
                                search.toLowerCase()
                            );

                    const matchFilter =
                        selectedFilter ===
                            "All Productions" ||
                        item.status ===
                            selectedFilter;

                    return (
                        matchSearch &&
                        matchFilter
                    );
                }
            );
        }, [
            productions,
            search,
            selectedFilter,
        ]);

    // STATS
    const stats = [
        {
            title: "Total Productions",
            value: productions.length,
            icon: <Factory size={22} />,
            color: "#3b82f6",
            bg: "rgba(59,130,246,0.12)",
        },

        {
            title: "In Progress",
            value:
                productions.filter(
                    (item) =>
                        item.status ===
                        "In Progress"
                ).length,
            icon: <Clock3 size={22} />,
            color: "#f59e0b",
            bg: "rgba(245,158,11,0.12)",
        },

        {
            title: "Completed",
            value:
                productions.filter(
                    (item) =>
                        item.status ===
                        "Completed"
                ).length,
            icon: (
                <BadgeCheck size={22} />
            ),
            color: "#10b981",
            bg: "rgba(16,185,129,0.12)",
        },

        {
            title:
                "Packages Produced",
            value: productions.reduce(
                (acc, item) =>
                    acc +
                    (item.quantity || 0),
                0
            ),
            icon: (
                <PackageCheck
                    size={22}
                />
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

            case "In Progress":
                return {
                    background:
                        "rgba(245,158,11,0.15)",
                    color: "#fbbf24",
                };

            case "Pending":
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
                            <Factory
                                size={15}
                            />
                            Production
                            Activity
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
                            Production
                            Overview
                        </h1>
                    </div>

                    <button
                        onClick={() => {
                            tableRef.current?.scrollIntoView(
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
                            display:
                                "flex",
                            alignItems:
                                "center",
                            gap: "10px",
                            cursor:
                                "pointer",
                        }}
                    >
                        <Eye
                            size={18}
                        />
                        View Details
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
                    )
                )}
            </div>

            {/* TABLE */}
            <div
                ref={tableRef}
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
                            Production
                            List
                        </h2>
                    </div>

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
                                placeholder="Search productions..."
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
                                size={18}
                            />
                            {
                                selectedFilter
                            }
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
                                }}
                            >
                                {[
                                    "All Productions",
                                    "In Progress",
                                    "Completed",
                                    "Pending",
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
                                                setSelectedFilter(
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
                                                    selectedFilter ===
                                                    item
                                                        ? "rgba(59,130,246,0.18)"
                                                        : "transparent",
                                                color:
                                                    "#e2e8f0",
                                                textAlign:
                                                    "left",
                                                padding:
                                                    "0 14px",
                                                cursor:
                                                    "pointer",
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
                                    "Production Code",
                                    "Package",
                                    "Quantity",
                                    "Production Date",
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
                            {filteredProductions.length >
                            0 ? (
                                filteredProductions.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <tr
                                            key={
                                                index
                                            }
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
                                                    item.code
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
                                                    item.package
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
                                                    item.date
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
                                            : "Belum ada data produksi"}
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