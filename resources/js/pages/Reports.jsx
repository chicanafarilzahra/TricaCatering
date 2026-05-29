// resources/js/pages/Reports.jsx

import {
    FileBarChart2,
    TrendingUp,
    Wallet,
    ShoppingCart,
    Download,
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

export default function Reports() {
    const reportListRef =
        useRef(null);

    const [search, setSearch] =
        useState("");

    const [filter, setFilter] =
        useState("All");

    // TANPA DATA DUMMY
    const reports = [];

    const filteredReports =
        useMemo(() => {
            return reports.filter(
                (report) => {
                    const matchSearch =
                        report.name
                            ?.toLowerCase()
                            .includes(
                                search.toLowerCase()
                            ) ||
                        report.createdBy
                            ?.toLowerCase()
                            .includes(
                                search.toLowerCase()
                            );

                    const matchFilter =
                        filter ===
                            "All" ||
                        report.status ===
                            filter;

                    return (
                        matchSearch &&
                        matchFilter
                    );
                }
            );
        }, [search, filter]);

    const handleExport =
        () => {
            if (
                filteredReports.length ===
                0
            ) {
                alert(
                    "Belum ada report untuk di export"
                );
                return;
            }

            const headers =
                [
                    "Report Name",
                    "Period",
                    "Created By",
                    "Created At",
                    "Status",
                ];

            const rows =
                filteredReports.map(
                    (report) => [
                        report.name,
                        report.period,
                        report.createdBy,
                        report.createdAt,
                        report.status,
                    ]
                );

            const csvContent =
                [
                    headers.join(","),
                    ...rows.map(
                        (row) =>
                            row.join(",")
                    ),
                ].join("\n");

            const blob =
                new Blob(
                    [csvContent],
                    {
                        type: "text/csv;charset=utf-8;",
                    }
                );

            const url =
                URL.createObjectURL(
                    blob
                );

            const link =
                document.createElement(
                    "a"
                );

            link.href = url;

            link.setAttribute(
                "download",
                "reports.csv"
            );

            document.body.appendChild(
                link
            );

            link.click();

            document.body.removeChild(
                link
            );
        };

    const stats = [
        {
            title: "Total Reports",
            value: reports.length,
            icon: (
                <FileBarChart2 size={22} />
            ),
            color: "#3b82f6",
            bg: "rgba(59,130,246,0.12)",
        },

        {
            title: "Revenue Reports",
            value:
                reports.filter(
                    (r) =>
                        r.type ===
                        "Revenue"
                ).length,
            icon: (
                <Wallet size={22} />
            ),
            color: "#10b981",
            bg: "rgba(16,185,129,0.12)",
        },

        {
            title: "Order Reports",
            value:
                reports.filter(
                    (r) =>
                        r.type ===
                        "Order"
                ).length,
            icon: (
                <ShoppingCart size={22} />
            ),
            color: "#f59e0b",
            bg: "rgba(245,158,11,0.12)",
        },

        {
            title: "Growth",
            value: "0%",
            icon: (
                <TrendingUp size={22} />
            ),
            color: "#8b5cf6",
            bg: "rgba(139,92,246,0.12)",
        },
    ];

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
                {/* GLOW */}
                <div
                    style={{
                        position:
                            "absolute",
                        top: "-120px",
                        right:
                            "-80px",
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
                            <FileBarChart2
                                size={15}
                            />
                            Business
                            Reports
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
                            Reports &
                            Analytics
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
                            Lihat
                            seluruh
                            laporan
                            bisnis,
                            operasional,
                            customer,
                            dan
                            aktivitas
                            catering
                            dalam satu
                            dashboard
                            modern.
                        </p>
                    </div>

                    {/* BUTTON */}
                    <button
                        onClick={() => {
                            reportListRef.current?.scrollIntoView(
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
                    gap: "22px",
                    marginBottom:
                        "30px",
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
                ref={reportListRef}
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
                            Report List
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
                            Financial,
                            operational,
                            and business
                            reports
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
                                placeholder="Search reports..."
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
                                filter
                            }
                            onChange={(
                                e
                            ) =>
                                setFilter(
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
                                value="Pending"
                                style={{
                                    color:
                                        "black",
                                }}
                            >
                                Pending
                            </option>
                        </select>

                        {/* EXPORT */}
                        <button
                            onClick={
                                handleExport
                            }
                            style={{
                                height:
                                    "50px",
                                padding:
                                    "0 20px",
                                border:
                                    "none",
                                borderRadius:
                                    "16px",
                                background:
                                    "linear-gradient(135deg,#2563eb,#3b82f6)",
                                color:
                                    "white",
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                gap: "10px",
                                fontWeight:
                                    "700",
                                cursor:
                                    "pointer",
                                boxShadow:
                                    "0 12px 30px rgba(37,99,235,0.25)",
                            }}
                        >
                            <Download
                                size={18}
                            />
                            Export
                        </button>
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
                                "950px",
                        }}
                    >
                        <thead>
                            <tr>
                                {[
                                    "Report Name",
                                    "Period",
                                    "Created By",
                                    "Created At",
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
                            {filteredReports.length >
                            0 ? (
                                filteredReports.map(
                                    (
                                        report,
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
                                                    report.name
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
                                                    report.period
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
                                                    report.createdBy
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
                                                    report.createdAt
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
                                                            report.status ===
                                                            "Completed"
                                                                ? "rgba(16,185,129,0.15)"
                                                                : "rgba(245,158,11,0.15)",
                                                        color:
                                                            report.status ===
                                                            "Completed"
                                                                ? "#10b981"
                                                                : "#f59e0b",
                                                    }}
                                                >
                                                    {
                                                        report.status
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
                                        Belum ada
                                        laporan
                                        tersedia
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