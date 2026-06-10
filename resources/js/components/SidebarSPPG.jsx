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
            path: "/sppg/menu-harian",
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
                width: 270,
                height: "100vh",
                position: "fixed",
                top: 0,
                left: 0,
                background: "#071028",
                borderRight: "1px solid rgba(255,255,255,.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 24,
                boxSizing: "border-box",
                zIndex: 999,
            }}
        >
            <div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        marginBottom: 40,
                    }}
                >
                    <div
                        style={{
                            width: 58,
                            height: 58,
                            borderRadius: 18,
                            background:
                                "linear-gradient(135deg,#06b6d4,#2563eb)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: 800,
                            fontSize: 24,
                        }}
                    >
                        S
                    </div>

                    <div>
                        <div
                            style={{
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: 18,
                            }}
                        >
                            {user?.nama_sppg || "SPPG"}
                        </div>

                        <div
                            style={{
                                color: "#94a3b8",
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
                        style={{ textDecoration: "none" }}
                    >
                        {({ isActive }) => (
                            <div
                                style={{
                                    height: 52,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                    padding: "0 16px",
                                    borderRadius: 16,
                                    marginBottom: 8,
                                    background: isActive
                                        ? "linear-gradient(135deg,#06b6d4,#2563eb)"
                                        : "transparent",
                                    color: isActive
                                        ? "#fff"
                                        : "#94a3b8",
                                    fontWeight: 600,
                                    transition: ".2s",
                                }}
                            >
                                {menu.icon}
                                <span>{menu.label}</span>
                            </div>
                        )}
                    </NavLink>
                ))}
            </div>

            <div>
                <div
                    style={{
                        background: "#0f172a",
                        border: "1px solid rgba(255,255,255,.05)",
                        padding: 16,
                        borderRadius: 18,
                        marginBottom: 14,
                    }}
                >
                    <div
                        style={{
                            color: "#fff",
                            fontWeight: 700,
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
                        height: 52,
                        border: "none",
                        borderRadius: 16,
                        background: "#ef4444",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                    }}
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
}