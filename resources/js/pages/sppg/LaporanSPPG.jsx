import { useEffect, useState } from "react";
import axios from "axios";

import SidebarSPPG from "../../components/SidebarSPPG";

import {
    FileBarChart2,
    Package,
    School,
    Building2,
    Search,
} from "lucide-react";

export default function LaporanSPPG() {
    const [summary, setSummary] = useState({});
    const [laporan, setLaporan] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.documentElement.style.margin = "0";
        document.documentElement.style.padding = "0";
    }, []);

    useEffect(() => {
        loadLaporan();
    }, []);

    const loadLaporan = async () => {
        try {
            const res = await axios.get(
                "/sppg/laporan"
            );

            setSummary(res.data.summary);
            setLaporan(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    const filtered = laporan.filter((item) =>
        item.tanggal
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <>
            <SidebarSPPG />

            <div
                style={{
                    marginLeft: 270,
                    minHeight: "100vh",
                    width: "calc(100% - 270px)",
                    background:
                        "linear-gradient(135deg,#081120,#0f172a)",
                    padding: 30,
                    boxSizing: "border-box",
                    overflow: "hidden",
                }}
            >
                {/* HEADER */}

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        marginBottom: 25,
                    }}
                >
                    <div>
                        <h1
                            style={{
                                color: "#fff",
                                margin: 0,
                                fontSize: 32,
                            }}
                        >
                            📑 Laporan SPPG
                        </h1>

                        <p
                            style={{
                                color: "#94a3b8",
                            }}
                        >
                            Rekap distribusi MBG
                            untuk pelaporan dinas
                        </p>
                    </div>
                </div>

                {/* CARD */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(4,1fr)",
                        gap: 20,
                        marginBottom: 25,
                    }}
                >
                    <StatCard
                        title="Total Distribusi"
                        value={
                            summary.total_distribusi
                        }
                        icon={
                            <FileBarChart2 />
                        }
                        color="#3b82f6"
                    />

                    <StatCard
                        title="Total Porsi"
                        value={
                            summary.total_porsi
                        }
                        icon={<Package />}
                        color="#06b6d4"
                    />

                    <StatCard
                        title="Total Sekolah"
                        value={
                            summary.total_sekolah
                        }
                        icon={<School />}
                        color="#22c55e"
                    />

                    <StatCard
                        title="Total SPPG"
                        value={
                            summary.total_sppg
                        }
                        icon={
                            <Building2 />
                        }
                        color="#f59e0b"
                    />
                </div>

                {/* SEARCH */}

                <div
                    style={{
                        background:
                            "#111827",
                        padding: 18,
                        borderRadius: 20,
                        marginBottom: 20,
                    }}
                >
                    <div
                        style={{
                            position:
                                "relative",
                        }}
                    >
                        <Search
                            size={18}
                            style={{
                                position:
                                    "absolute",
                                top: 14,
                                left: 14,
                                color:
                                    "#94a3b8",
                            }}
                        />

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Cari tanggal laporan..."
                            style={{
                                width: "100%",
                                boxSizing:
                                    "border-box",
                                padding:
                                    "14px 14px 14px 45px",
                                border: "none",
                                borderRadius: 12,
                                background:
                                    "#1f2937",
                                color: "#fff",
                            }}
                        />
                    </div>
                </div>

                {/* TABLE */}

                <div
                    style={{
                        background:
                            "#111827",
                        borderRadius: 20,
                        overflow:
                            "hidden",
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse:
                                "collapse",
                            color: "#fff",
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    background:
                                        "#1f2937",
                                }}
                            >
                                <th
                                    style={
                                        th
                                    }
                                >
                                    Tanggal
                                </th>

                                <th
                                    style={
                                        th
                                    }
                                >
                                    Total Distribusi
                                </th>

                                <th
                                    style={
                                        th
                                    }
                                >
                                    Total Porsi
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.length ===
                                0 && (
                                <tr>
                                    <td
                                        colSpan="3"
                                        style={{
                                            textAlign:
                                                "center",
                                            padding:
                                                "50px",
                                            color:
                                                "#94a3b8",
                                        }}
                                    >
                                        Belum ada
                                        laporan
                                    </td>
                                </tr>
                            )}

                            {filtered.map(
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
                                            style={
                                                td
                                            }
                                        >
                                            {
                                                item.tanggal
                                            }
                                        </td>

                                        <td
                                            style={
                                                td
                                            }
                                        >
                                            {
                                                item.total_distribusi
                                            }
                                        </td>

                                        <td
                                            style={
                                                td
                                            }
                                        >
                                            {
                                                item.total_porsi
                                            }{" "}
                                            Porsi
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

const th = {
    padding: "18px 20px",
    textAlign: "left",
    fontWeight: "700",
    color: "#cbd5e1",
    fontSize: "14px",
};

const td = {
    padding: "18px 20px",
    borderTop:
        "1px solid rgba(255,255,255,.05)",
    color: "#e2e8f0",
};

function StatCard({
    title,
    value,
    icon,
    color,
}) {
    return (
        <div
            style={{
                background:
                    "linear-gradient(145deg,#111827,#1e293b)",
                borderRadius: 24,
                padding: 24,
                border:
                    "1px solid rgba(255,255,255,.05)",
                boxShadow:
                    "0 10px 25px rgba(0,0,0,.25)",
                color: "#fff",
            }}
        >
            <div
                style={{
                    width: 55,
                    height: 55,
                    borderRadius: 16,
                    background: `${color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "center",
                    color,
                    marginBottom: 16,
                }}
            >
                {icon}
            </div>

            <h2
                style={{
                    fontSize: 32,
                    fontWeight: 800,
                    marginBottom: 6,
                }}
            >
                {value || 0}
            </h2>

            <span
                style={{
                    color: "#94a3b8",
                }}
            >
                {title}
            </span>
        </div>
    );
}