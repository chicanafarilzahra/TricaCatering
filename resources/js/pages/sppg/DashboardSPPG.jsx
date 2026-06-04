import {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import SidebarSPPG from "../../components/SidebarSPPG";

export default function DashboardSPPG() {
    const [summary, setSummary] =
        useState(null);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard =
        async () => {
            try {
                const res =
                    await axios.get(
                        "/api/sppg/dashboard"
                    );

                setSummary(
                    res.data
                );
            } catch (err) {
                console.log(err);
            }
        };

    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg,#071028,#0f172a)",
            }}
        >
            <SidebarSPPG />

            <div
                style={{
                    marginLeft:
                        "270px",
                    padding: "30px",
                }}
            >
                <h1
                    style={{
                        color: "#fff",
                        fontSize:
                            "32px",
                        fontWeight:
                            "800",
                    }}
                >
                    Dashboard SPPG
                </h1>

                <p
                    style={{
                        color:
                            "#94a3b8",
                    }}
                >
                    Monitoring
                    distribusi dan
                    program MBG
                </p>

                <div
                    style={{
                        display:
                            "grid",
                        gridTemplateColumns:
                            "repeat(4,1fr)",
                        gap: "20px",
                        marginTop:
                            "30px",
                    }}
                >
                    <Card
                        title="Sekolah"
                        value={
                            summary?.total_sekolah ||
                            0
                        }
                    />

                    <Card
                        title="Total Siswa"
                        value={
                            summary?.total_siswa ||
                            0
                        }
                    />

                    <Card
                        title="Distribusi Hari Ini"
                        value={
                            summary?.distribusi_hari_ini ||
                            0
                        }
                    />

                    <Card
                        title="Menu Aktif"
                        value={
                            summary?.menu_hari_ini ||
                            0
                        }
                    />
                </div>

                <div
                    style={{
                        marginTop:
                            "30px",
                        background:
                            "#182338",
                        padding:
                            "25px",
                        borderRadius:
                            "24px",
                    }}
                >
                    <h2
                        style={{
                            color:
                                "#fff",
                        }}
                    >
                        Distribusi Hari
                        Ini
                    </h2>

                    <table
                        style={{
                            width:
                                "100%",
                            color:
                                "#fff",
                            marginTop:
                                "20px",
                        }}
                    >
                        <thead>
                            <tr>
                                <th align="left">
                                    Sekolah
                                </th>

                                <th align="left">
                                    Siswa
                                </th>

                                <th align="left">
                                    Porsi
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {summary?.jadwal?.map(
                                (
                                    item
                                ) => (
                                    <tr
                                        key={
                                            item.id
                                        }
                                    >
                                        <td>
                                            {
                                                item.nama_sekolah
                                            }
                                        </td>

                                        <td>
                                            {
                                                item.jumlah_siswa
                                            }
                                        </td>

                                        <td>
                                            {
                                                item.jumlah_porsi
                                            }
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function Card({
    title,
    value,
}) {
    return (
        <div
            style={{
                background:
                    "linear-gradient(135deg,#06b6d4,#2563eb)",
                borderRadius:
                    "22px",
                padding:
                    "24px",
                color: "#fff",
            }}
        >
            <div>{title}</div>

            <div
                style={{
                    fontSize:
                        "36px",
                    fontWeight:
                        "800",
                    marginTop:
                        "10px",
                }}
            >
                {value}
            </div>
        </div>
    );
}