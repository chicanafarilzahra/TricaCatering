import { useEffect, useState } from "react";
import axios from "axios";

import SidebarSPPG from "../../components/SidebarSPPG";

import {
    History,
    CheckCircle,
    XCircle,
    Package,
    Search,
} from "lucide-react";

export default function RiwayatSPPG() {
    const [summary, setSummary] = useState({});
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
    }, []);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await axios.get(
                "/sppg/riwayat"
            );

            setSummary(res.data.summary);
            setData(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    const filtered = data.filter(
        (item) =>
            item.sekolah?.nama
                ?.toLowerCase()
                .includes(
                    search.toLowerCase()
                )
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
                }}
            >
                <div
                    style={{
                        marginBottom: 25,
                    }}
                >
                    <h1
                        style={{
                            color: "#fff",
                            fontSize: 32,
                            margin: 0,
                        }}
                    >
                        📦 Riwayat Distribusi
                    </h1>

                    <p
                        style={{
                            color: "#94a3b8",
                        }}
                    >
                        Riwayat pengiriman MBG ke sekolah
                    </p>
                </div>

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
                        icon={<History />}
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
                        title="Berhasil"
                        value={
                            summary.berhasil
                        }
                        icon={<CheckCircle />}
                        color="#22c55e"
                    />

                    <StatCard
                        title="Gagal"
                        value={summary.gagal}
                        icon={<XCircle />}
                        color="#ef4444"
                    />
                </div>

                <div
                    style={{
                        background: "#111827",
                        padding: 18,
                        borderRadius: 20,
                        marginBottom: 20,
                    }}
                >
                    <div
                        style={{
                            position: "relative",
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
                            placeholder="Cari sekolah..."
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

                <div
                    style={{
                        background: "#111827",
                        borderRadius: 20,
                        overflow: "hidden",
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            color: "#fff",
                            borderCollapse:
                                "collapse",
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    background:
                                        "#1f2937",
                                }}
                            >
                                <th style={th}>
                                    Tanggal
                                </th>
                                <th style={th}>
                                    Sekolah
                                </th>
                                <th style={th}>
                                    Menu
                                </th>
                                <th style={th}>
                                    Porsi
                                </th>
                                <th style={th}>
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map(
                                (item) => (
                                    <tr
                                        key={
                                            item.id
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
                                                item
                                                    .sekolah
                                                    ?.nama
                                            }
                                        </td>

                                        <td
                                            style={
                                                td
                                            }
                                        >
                                            {
                                                item
                                                    .menu
                                                    ?.nama_menu
                                            }
                                        </td>

                                        <td
                                            style={
                                                td
                                            }
                                        >
                                            {
                                                item.jumlah_porsi
                                            }
                                        </td>

                                        <td
                                            style={
                                                td
                                            }
                                        >
                                            {item.status}
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
    color: "#cbd5e1",
};

const td = {
    padding: "18px 20px",
    borderTop:
        "1px solid rgba(255,255,255,.05)",
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
                color: "#fff",
            }}
        >
            <div
                style={{
                    width: 55,
                    height: 55,
                    borderRadius: 16,
                    background: `${color}20`,
                    color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "center",
                    marginBottom: 16,
                }}
            >
                {icon}
            </div>

            <h2>{value || 0}</h2>
            <span>{title}</span>
        </div>
    );
}