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
            label: "Distribusi",
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
            label: "Riwayat",
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
        <aside
            style={{
                width: "270px",
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 0,

                background:
                    "#071028",

                borderRight:
                    "1px solid rgba(255,255,255,.05)",

                display: "flex",
                flexDirection: "column",
                justifyContent:
                    "space-between",

                padding: "24px",

                boxSizing:
                    "border-box",

                zIndex: 999,
            }}
        >
            <div>
                {/* HEADER */}

                <div
                    style={{
                        display: "flex",
                        alignItems:
                            "center",

                        gap: "14px",

                        marginBottom:
                            "40px",
                    }}
                >
                    <div
                        style={{
                            width: "58px",
                            height: "58px",

                            borderRadius:
                                "18px",

                            background:
                                "linear-gradient(135deg,#06b6d4,#2563eb)",

                            display: "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",

                            color: "#fff",

                            fontSize:
                                "24px",

                            fontWeight:
                                "800",
                        }}
                    >
                        S
                    </div>

                    <div>
                        <div
                            style={{
                                color:
                                    "#fff",

                                fontSize:
                                    "18px",

                                fontWeight:
                                    "700",
                            }}
                        >
                            {user?.nama_sppg ||
                                "SPPG"}
                        </div>

                        <div
                            style={{
                                color:
                                    "#94a3b8",

                                fontSize:
                                    "13px",
                            }}
                        >
                            Program MBG
                        </div>
                    </div>
                </div>

                {/* MENU */}

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
                                    height:
                                        "52px",

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    gap: "14px",

                                    padding:
                                        "0 16px",

                                    borderRadius:
                                        "16px",

                                    marginBottom:
                                        "8px",

                                    background:
                                        isActive
                                            ? "linear-gradient(135deg,#06b6d4,#2563eb)"
                                            : "transparent",

                                    color:
                                        isActive
                                            ? "#fff"
                                            : "#94a3b8",

                                    fontWeight:
                                        "600",
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

            {/* USER */}

            <div>
                <div
                    style={{
                        background:
                            "#0f172a",

                        border:
                            "1px solid rgba(255,255,255,.05)",

                        padding:
                            "16px",

                        borderRadius:
                            "18px",

                        marginBottom:
                            "14px",
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
                        {user?.name}
                    </div>

                    <div
                        style={{
                            color:
                                "#94a3b8",

                            fontSize:
                                "13px",
                        }}
                    >
                        Operator SPPG
                    </div>
                </div>

                <button
                    onClick={logout}
                    style={{
                        width: "100%",
                        height: "52px",

                        border: "none",

                        borderRadius:
                            "16px",

                        background:
                            "#ef4444",

                        color: "#fff",

                        cursor:
                            "pointer",

                        fontWeight:
                            "700",
                    }}
                >
                    <LogOut
                        size={18}
                    />{" "}
                    Logout
                </button>
            </div>
        </aside>
    );
}