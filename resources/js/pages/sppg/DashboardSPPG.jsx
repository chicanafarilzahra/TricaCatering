import { useEffect, useState } from "react";
import axios from "axios";

import {
    School,
    Users,
    UtensilsCrossed,
    Truck,
    TrendingUp,
    Bell,
    Activity,
    Package,
    FileBarChart2,
    CalendarDays,
} from "lucide-react";

import SidebarSPPG from "../../components/SidebarSPPG";
import { useNavigate } from "react-router-dom";

export default function DashboardSPPG() {
    const [summary, setSummary] =
        useState(null);

    const activities =
        summary?.activities || [];

    const [loading, setLoading] =
        useState(true);

    const user = JSON.parse(
        localStorage.getItem("user")

    );
    const navigate = useNavigate();

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
    try {

        const token = localStorage.getItem("auth_token");

        const res = await axios.get(
            "/sppg/dashboard",
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );

        setSummary(res.data);

    } catch(err){
        console.log(err);
    } finally{
        setLoading(false);
    }
};

    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "radial-gradient(circle at top right,#1e40af22,#0b1120 40%), radial-gradient(circle at bottom left,#06b6d422,#0b1120 40%), #0b1120",
            }}
        >
            <SidebarSPPG />

            <div
                style={{
                    marginLeft: "290px",
                    padding: "35px",
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
                        marginBottom:
                            "28px",
                    }}
                >
                    <div>
                        <h1
                            style={{
                                color:
                                    "#fff",
                                margin: 0,
                                fontSize:
                                    "36px",
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
                                marginTop:
                                    "8px",
                            }}
                        >
                            Monitoring Program
                            Makan Bergizi Gratis
                        </p>
                    </div>

                    <div
                        style={{
                            background:
                                "rgba(17,24,39,.75)",
                            backdropFilter:
                                "blur(20px)",
                            color:
                                "#fff",
                            padding:
                                "14px 20px",
                            borderRadius:
                                "16px",
                            border:
                                "1px solid rgba(255,255,255,.05)",
                        }}
                    >
                        📅{" "}
                        {new Date().toLocaleDateString(
                            "id-ID"
                        )}
                    </div>
                </div>

                {loading ? (
                    <div
                        style={{
                            color:
                                "#fff",
                        }}
                    >
                        Loading...
                    </div>
                ) : (
                    <>

                    <div
    style={{
        display:
            "flex",

        justifyContent:
            "flex-end",

        gap:
            "14px",

        marginBottom:
            "24px",
    }}
>
    <div
        style={{
            width:
                "48px",

            height:
                "48px",

            borderRadius:
                "16px",

            background:
                "#182338",

            display:
                "flex",

            alignItems:
                "center",

            justifyContent:
                "center",

            color:
                "#fff",
        }}
    >
        <Bell size={20} />
    </div>

    <div
        style={{
            background:
                "#182338",

            borderRadius:
                "16px",

            padding:
                "0 18px",

            display:
                "flex",

            alignItems:
                "center",

            color:
                "#fff",
        }}
    >
        {user?.name}
    </div>
</div>
                        {/* HERO */}

                        <div
                            style={{
                                background:
                                    "linear-gradient(135deg,#2563eb,#06b6d4)",

                                borderRadius:
                                    "30px",

                                padding:
                                    "40px",

                                color:
                                    "#fff",

                                marginBottom:
                                    "28px",

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

                                    right:
                                        "-60px",

                                    top:
                                        "-60px",

                                    width:
                                        "240px",

                                    height:
                                        "240px",

                                    borderRadius:
                                        "50%",

                                    background:
                                        "rgba(255,255,255,.1)",
                                }}
                            />

                            <div
                                style={{
                                    fontSize:
                                        "14px",
                                    opacity:
                                        0.9,
                                }}
                            >
                                Selamat Datang
                            </div>

                            <h2
                                style={{
                                    fontSize:
                                        "36px",

                                    marginTop:
                                        "10px",

                                    marginBottom:
                                        "10px",

                                    fontWeight:
                                        "800",
                                }}
                            >
                                {
                                    user?.nama_sppg
                                }
                            </h2>

                            <div
                                style={{
                                    fontSize:
                                        "18px",
                                }}
                            >
                                {
                                    summary?.total_siswa
                                }{" "}
                                siswa akan
                                menerima
                                Program MBG
                                hari ini.
                            </div>
                        </div>

                        {/* STATISTICS */}

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(4,1fr)",
                                gap: "20px",
                                marginBottom: "30px",
                            }}
                        >
                            <StatCard
                                title="Sekolah"
                                value={
                                    summary?.total_sekolah
                                }
                                icon={
                                    <School />
                                }
                            />

                            <StatCard
                                title="Total Siswa"
                                value={
                                    summary?.total_siswa
                                }
                                icon={
                                    <Users />
                                }
                            />

                            <StatCard
                                title="Menu Aktif"
                                value={
                                    summary?.menu_hari_ini
                                }
                                icon={
                                    <UtensilsCrossed />
                                }
                            />

                            <StatCard
                                title="Distribusi"
                                value={
                                    summary?.distribusi_hari_ini
                                }
                                icon={
                                    <Truck />
                                }
                            />
                        </div>

                        {/* QUICK ACTION & ACTIVITY */}

<div
    style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
        marginBottom: "30px",
    }}
>
    {/* QUICK ACTION */}

    <div
        style={{
            background:
                "rgba(17,24,39,.9)",
            backdropFilter:
                "blur(18px)",
            border:
                "1px solid rgba(255,255,255,.05)",
            borderRadius:
                "28px",
            padding: "24px",
        }}
    >
        <h2
            style={{
                color: "#fff",
                marginTop: 0,
                marginBottom: "22px",
            }}
        >
            Quick Action
        </h2>

        <div
            style={{
                display: "grid",
                gridTemplateColumns:
                    "repeat(2,1fr)",
                gap: "14px",
            }}
        >
            <ActionButton
                icon={<School size={20} />}
                title="Kelola Sekolah"
            />

            <ActionButton
                icon={
                    <UtensilsCrossed
                        size={20}
                    />
                }
                title="Kelola Menu"
            />

            <ActionButton
                icon={<Truck size={20} />}
                title="Distribusi"
            />

            <ActionButton
                icon={<Users size={20} />}
                title="Data Siswa"
            />

            <ActionButton
                icon={<School />}
                title="Sekolah"
                onClick={() =>
                    navigate("/sppg/sekolah")
                }
            />
        </div>
    </div>

    {/* ACTIVITY PANEL */}

    <div
        style={{
            background:
                "rgba(17,24,39,.9)",
            backdropFilter:
                "blur(18px)",
            border:
                "1px solid rgba(255,255,255,.05)",
            borderRadius:
                "28px",
            padding: "24px",
        }}
    >
        <h2
            style={{
                color: "#fff",
                marginTop: 0,
                marginBottom: "22px",
            }}
        >
            Aktivitas Terbaru
        </h2>

        <ActivityItem
            title="Distribusi Dijadwalkan"
            desc="Pengiriman makanan ke sekolah."
        />

        <ActivityItem
            title="Menu Baru Aktif"
            desc="Menu hari ini berhasil dipublikasikan."
        />

        <ActivityItem
            title="Data Siswa Diperbarui"
            desc="Jumlah siswa penerima diperbaharui."
        />
    </div>
</div>

                        {/* CONTENT */}

                        <div
                            style={{
                                display:
                                    "grid",

                                gridTemplateColumns:
                                    "1.6fr 1fr",

                                gap: "24px",
                            }}
                        >
                            {/* SEKOLAH */}

                            <div
                                style={{
                                    background:
                                        "rgba(17,24,39,.75)",

                                    backdropFilter:
                                        "blur(20px)",

                                    borderRadius:
                                        "28px",

                                    padding:
                                        "24px",

                                    border:
                                        "1px solid rgba(255,255,255,.05)",
                                }}
                            >
                                <h2
                                    style={{
                                        color:
                                            "#fff",

                                        marginBottom:
                                            "24px",
                                    }}
                                >
                                    Sekolah Penerima
                                </h2>

                                <div
                                    style={{
                                        display:
                                            "grid",
                                        gap: "16px",
                                    }}
                                >
                                    {summary?.jadwal?.map(
                                        (
                                            item
                                        ) => (
                                            <div
                                                key={
                                                    item.id
                                                }
                                                style={{
                                                    background:
                                                        "#182338",

                                                    borderRadius:
                                                        "18px",

                                                    padding:
                                                        "18px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        color:
                                                            "#fff",

                                                        fontWeight:
                                                            "700",
                                                    }}
                                                >
                                                    {
                                                        item.nama_sekolah
                                                    }
                                                </div>

                                                <div
                                                    style={{
                                                        color:
                                                            "#94a3b8",

                                                        marginTop:
                                                            "6px",
                                                    }}
                                                >
                                                    {
                                                        item.jumlah_siswa
                                                    }{" "}
                                                    siswa
                                                </div>

                                                <div
                                                    style={{
                                                        marginTop:
                                                            "10px",

                                                        color:
                                                            "#38bdf8",
                                                    }}
                                                >
                                                    {
                                                        item.jumlah_porsi
                                                    }{" "}
                                                    porsi
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* SIDE */}

                            <div>
                                <div
                                    style={{
                                        background:
                                            "rgba(17,24,39,.75)",

                                        backdropFilter:
                                            "blur(20px)",

                                        borderRadius:
                                            "24px",

                                        padding:
                                            "24px",

                                        marginBottom:
                                            "20px",

                                        border:
                                            "1px solid rgba(255,255,255,.05)",
                                    }}
                                >
                                    <h2
                                        style={{
                                            color:
                                                "#fff",
                                            marginBottom:
                                                "20px",
                                        }}
                                    >
                                        Ringkasan
                                    </h2>

                                    <div
    style={{
        background:
            "rgba(17,24,39,.75)",

        backdropFilter:
            "blur(20px)",

        borderRadius:
            "24px",

        padding:
            "24px",

        marginTop:
            "20px",

        border:
            "1px solid rgba(255,255,255,.05)",
    }}
>
    <h2
        style={{
            color:
                "#fff",

            marginBottom:
                "20px",
        }}
    >
        Aktivitas Terbaru
    </h2>

    {activities.length > 0 ? (
    activities.map(
        (item, index) => (
            <ActivityItem
                key={index}
                icon={
                    <Truck
                        size={16}
                    />
                }
                title={
                    item.title
                }
                time={
                    item.time
                }
            />
        )
    )
) : (
    <div
        style={{
            color:
                "#94a3b8",
        }}
    >
        Belum ada aktivitas
    </div>
)}
</div>

                                    <SummaryItem
                                        title="Sekolah"
                                        value={
                                            summary?.total_sekolah
                                        }
                                    />

                                    <SummaryItem
                                        title="Siswa"
                                        value={
                                            summary?.total_siswa
                                        }
                                    />

                                    <SummaryItem
                                        title="Menu"
                                        value={
                                            summary?.menu_hari_ini
                                        }
                                    />
                                </div>

                                <div
                                    style={{
                                        background:
                                            "#182338",

                                        borderRadius:
                                            "24px",

                                        padding:
                                            "24px",
                                    }}
                                >
                                    <TrendingUp
                                        color="#22c55e"
                                    />

                                    <h3
                                        style={{
                                            color:
                                                "#fff",
                                            marginTop:
                                                "15px",
                                        }}
                                    >
                                        Distribusi
                                        Lancar
                                    </h3>

                                    <p
                                        style={{
                                            color:
                                                "#94a3b8",
                                        }}
                                    >
                                        Semua
                                        sekolah
                                        terjadwal
                                        menerima
                                        distribusi
                                        hari ini.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    icon,
}) {
    return (
        <div
            style={{
                background:
                    "rgba(17,24,39,.75)",
                backdropFilter:
                    "blur(20px)",
                borderRadius:
                    "24px",
                padding:
                    "24px",
                border:
                    "1px solid rgba(255,255,255,.05)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                }}
            >
                <span
                    style={{
                        color:
                            "#94a3b8",
                    }}
                >
                    {title}
                </span>

                <div
                    style={{
                        color:
                            "#38bdf8",
                    }}
                >
                    {icon}
                </div>
            </div>

            <h2
                style={{
                    color: "#fff",
                    fontSize: "40px",
                    marginTop: "16px",
                }}
            >
                {value || 0}
            </h2>
        </div>
    );
}

function QuickButton({
    title,
    icon,
}) {
    return (
        <button
            style={{
                background:
                    "#182338",

                border:
                    "1px solid rgba(255,255,255,.05)",

                borderRadius:
                    "20px",

                padding:
                    "20px",

                color:
                    "#fff",

                cursor:
                    "pointer",

                transition:
                    ".3s",

                display:
                    "flex",

                flexDirection:
                    "column",

                alignItems:
                    "center",

                justifyContent:
                    "center",

                gap:
                    "12px",

                height:
                    "120px",
            }}
        >
            <div
                style={{
                    width:
                        "52px",

                    height:
                        "52px",

                    borderRadius:
                        "14px",

                    background:
                        "linear-gradient(135deg,#06b6d4,#2563eb)",

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    color:
                        "#fff",
                }}
            >
                {icon}
            </div>

            <span
                style={{
                    fontWeight:
                        "600",
                }}
            >
                {title}
            </span>
        </button>
    );
}

function SummaryItem({
    title,
    value,
}) {
    return (
        <div
            style={{
                display:
                    "flex",
                justifyContent:
                    "space-between",
                color:
                    "#fff",
                marginBottom:
                    "16px",
            }}
        >
            <span>{title}</span>
            <strong>
                {value || 0}
            </strong>
        </div>
    );
}

function ActionButton({
    icon,
    title,
    onClick,
}) {
    return (
        <button
        onClick={onClick}
            style={{
                height: "90px",
                border: "none",
                borderRadius: "20px",
                background:
                    "#182338",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                flexDirection:
                    "column",
                justifyContent:
                    "center",
                alignItems:
                    "center",
                gap: "10px",
                fontWeight: "600",
            }}
        >
            {icon}
            {title}
        </button>
    );
}

function ActivityItem({
    icon,
    title,
    time,
    desc,
}) {
    return (
        <div
            style={{
                display: "flex",
                gap: "12px",
                padding: "14px 0",
                borderBottom:
                    "1px solid rgba(255,255,255,.05)",
            }}
        >
            <div
                style={{
                    color: "#38bdf8",
                    marginTop: "3px",
                }}
            >
                {icon || <Activity size={16} />}
            </div>

            <div style={{ flex: 1 }}>
                <div
                    style={{
                        color: "#fff",
                        fontWeight: 600,
                    }}
                >
                    {title}
                </div>

                {desc && (
                    <div
                        style={{
                            color: "#94a3b8",
                            fontSize: 14,
                            marginTop: 4,
                        }}
                    >
                        {desc}
                    </div>
                )}

                {time && (
                    <div
                        style={{
                            color: "#64748b",
                            fontSize: 12,
                            marginTop: 4,
                        }}
                    >
                        {time}
                    </div>
                )}
            </div>
        </div>
    );
}