import {
    LayoutDashboard,
    School,
    CalendarDays,
    UtensilsCrossed,
    Package,
    History,
    FileBarChart2,
    LogOut,
} from "lucide-react";

import {
    NavLink,
    useNavigate,
} from "react-router-dom";

export default function SidebarSPPG() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const menus = [
        {
            label: "Dashboard",
            path: "/sppg/dashboard",
            icon: <LayoutDashboard size={18} />,
        },
        {
            label: "Sekolah Binaan",
            path: "/sppg/sekolah",
            icon: <School size={18} />,
        },
        {
            label: "Jadwal Distribusi",
            path: "/sppg/distribusi",
            icon: <CalendarDays size={18} />,
        },
        {
            label: "Menu & Gizi",
            path: "/sppg/menu",
            icon: <UtensilsCrossed size={18} />,
        },
        {
            label: "Stok Bahan",
            path: "/sppg/stok",
            icon: <Package size={18} />,
        },
        {
            label: "Riwayat Distribusi",
            path: "/sppg/riwayat",
            icon: <History size={18} />,
        },
        {
            label: "Laporan",
            path: "/sppg/laporan",
            icon: <FileBarChart2 size={18} />,
        },
    ];

    return (
        <div
            style={{
                width: "270px",
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                background:
                    "linear-gradient(180deg,#020617,#071028)",
                borderRight:
                    "1px solid rgba(255,255,255,0.05)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent:
                    "space-between",
            }}
        >
            <div>
                <div
                    style={{
                        display: "flex",
                        gap: "14px",
                        alignItems: "center",
                        marginBottom: "40px",
                    }}
                >
                    <div
                        style={{
                            width: "55px",
                            height: "55px",
                            borderRadius: "18px",
                            background:
                                "linear-gradient(135deg,#06b6d4,#2563eb)",
                        }}
                    />

                    <div>
                        <div
                            style={{
                                color: "#fff",
                                fontWeight: 800,
                                fontSize: 20,
                            }}
                        >
                            {user?.nama_sppg ||
                                "SPPG"}
                        </div>

                        <div
                            style={{
                                color: "#64748b",
                                fontSize: 13,
                            }}
                        >
                            Program MBG
                        </div>
                    </div>
                </div>

                {menus.map((menu) => (
                    <NavLink
                        key={menu.path}
                        to={menu.path}
                        style={{
                            textDecoration:
                                "none",
                        }}
                    >
                        {({
                            isActive,
                        }) => (
                            <div
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: "14px",
                                    height:
                                        "52px",
                                    padding:
                                        "0 16px",
                                    borderRadius:
                                        "16px",
                                    marginBottom:
                                        "8px",
                                    color:
                                        isActive
                                            ? "#fff"
                                            : "#94a3b8",
                                    background:
                                        isActive
                                            ? "linear-gradient(135deg,#06b6d4,#2563eb)"
                                            : "transparent",
                                }}
                            >
                                {
                                    menu.icon
                                }

                                {
                                    menu.label
                                }
                            </div>
                        )}
                    </NavLink>
                ))}
            </div>

            <div>
                <div
                    style={{
                        background:
                            "rgba(255,255,255,0.04)",
                        borderRadius:
                            "18px",
                        padding: "14px",
                        marginBottom:
                            "14px",
                    }}
                >
                    <div
                        style={{
                            color: "#fff",
                            fontWeight: 600,
                        }}
                    >
                        {user?.name}
                    </div>

                    <div
                        style={{
                            color: "#94a3b8",
                            fontSize: 13,
                        }}
                    >
                        Operator SPPG
                    </div>
                </div>

                <button
                    onClick={logout}
                    style={{
                        width: "100%",
                        height: "50px",
                        border: "none",
                        borderRadius:
                            "16px",
                        background:
                            "#ef4444",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: 700,
                    }}
                >
                    <LogOut
                        size={18}
                    />{" "}
                    Logout
                </button>
            </div>
        </div>
    );
}