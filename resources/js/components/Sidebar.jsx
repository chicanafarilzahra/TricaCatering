import {
    LayoutDashboard,
    ShoppingCart,
    UtensilsCrossed,
    Package,
    Users,
    Boxes,
    Truck,
    Factory,
    ClipboardList,
    FileBarChart2,
    LogOut,
} from "lucide-react";

import {
    NavLink,
    useLocation,
    useNavigate,
} from "react-router-dom";

import { useEffect, useRef } from "react";

export default function Sidebar() {
    const location = useLocation();

    const navigate = useNavigate();

    const sidebarRef = useRef(null);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    /* SAVE SCROLL POSITION */
    useEffect(() => {
        const savedScroll =
            sessionStorage.getItem(
                "sidebar-scroll"
            );

        if (
            sidebarRef.current &&
            savedScroll
        ) {
            sidebarRef.current.scrollTop =
                parseInt(savedScroll);
        }
    }, []);

    const handleScroll = () => {
        if (sidebarRef.current) {
            sessionStorage.setItem(
                "sidebar-scroll",
                sidebarRef.current.scrollTop
            );
        }
    };

    const menus = [
        {
            title: "MAIN MENU",
            items: [
                {
                    label: "Dashboard",
                    path: "/dashboard",
                    icon: (
                        <LayoutDashboard size={18} />
                    ),
                },

                {
                    label: "Orders",
                    path: "/orders",
                    icon: (
                        <ShoppingCart size={18} />
                    ),
                },
            ],
        },

        {
            title: "MANAGEMENT",
            items: [
                {
                    label: "Menus",
                    path: "/menus",
                    icon: (
                        <UtensilsCrossed size={18} />
                    ),
                },

                {
                    label: "Packages",
                    path: "/packages",
                    icon: (
                        <Package size={18} />
                    ),
                },

                {
                    label: "Productions",
                    path: "/productions",
                    icon: (
                        <Factory size={18} />
                    ),
                },

                {
                    label: "SPPG",
                    path: "/sppg",
                    icon: (
                        <ClipboardList size={18} />
                    ),
                },

                {
                    label: "Stocks",
                    path: "/stocks",
                    icon: (
                        <Boxes size={18} />
                    ),
                },

                {
                    label: "Couriers",
                    path: "/couriers",
                    icon: (
                        <Truck size={18} />
                    ),
                },

                {
                    label: "Deliveries",
                    path: "/deliveries",
                    icon: (
                        <Truck size={18} />
                    ),
                },

                {
                    label: "Customers",
                    path: "/customers",
                    icon: (
                        <Users size={18} />
                    ),
                },

                {
                    label: "Reports",
                    path: "/reports",
                    icon: (
                        <FileBarChart2 size={18} />
                    ),
                },
            ],
        },
    ];

    return (
        <div
            ref={sidebarRef}
            onScroll={handleScroll}
            style={{
                width: "270px",
                height: "100vh",
                position: "fixed",
                top: 0,
                left: 0,
                background:
                    "linear-gradient(180deg,#020617 0%,#071028 100%)",
                borderRight:
                    "1px solid rgba(255,255,255,0.06)",
                padding: "22px 16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflowY: "auto",
                overflowX: "hidden",
                boxSizing: "border-box",
                zIndex: 100,
            }}
        >
            {/* TOP */}
            <div>
                {/* LOGO */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "4px 8px",
                        marginBottom: "34px",
                    }}
                >
                    <div
                        style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "18px",
                            background:
                                "linear-gradient(135deg,#06b6d4,#3b82f6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: "800",
                            fontSize: "18px",
                            boxShadow:
                                "0 12px 30px rgba(6,182,212,0.35)",
                        }}
                    >
                        T
                    </div>

                    <div>
                        <div
                            style={{
                                color: "#fff",
                                fontWeight: "800",
                                fontSize: "20px",
                                letterSpacing:
                                    "-0.5px",
                            }}
                        >
                            TriCa Catering
                        </div>

                        <div
                            style={{
                                color: "#64748b",
                                fontSize: "12px",
                                marginTop: "4px",
                            }}
                        >
                            Admin Dashboard
                        </div>
                    </div>
                </div>

                {/* USER CARD */}
                <div
                    style={{
                        background:
                            "rgba(255,255,255,0.04)",
                        border:
                            "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "22px",
                        padding: "16px",
                        marginBottom: "32px",
                        backdropFilter:
                            "blur(14px)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                        }}
                    >
                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius:
                                    "16px",
                                background:
                                    "linear-gradient(135deg,#06b6d4,#3b82f6)",
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                color: "#fff",
                                fontWeight: "700",
                                fontSize: "16px",
                                boxShadow:
                                    "0 10px 24px rgba(6,182,212,0.30)",
                            }}
                        >
                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "A"}
                        </div>

                        <div>
                            <div
                                style={{
                                    color: "#fff",
                                    fontWeight:
                                        "600",
                                    fontSize:
                                        "15px",
                                }}
                            >
                                {user?.name ||
                                    "Admin"}
                            </div>

                            <div
                                style={{
                                    color:
                                        "#94a3b8",
                                    fontSize:
                                        "12px",
                                    marginTop:
                                        "4px",
                                    textTransform:
                                        "capitalize",
                                }}
                            >
                                {user?.role ||
                                    "admin"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* MENUS */}
                {menus.map(
                    (group, index) => (
                        <div
                            key={index}
                            style={{
                                marginBottom:
                                    "30px",
                            }}
                        >
                            {/* TITLE */}
                            <div
                                style={{
                                    color:
                                        "#475569",
                                    fontSize:
                                        "11px",
                                    fontWeight:
                                        "700",
                                    padding:
                                        "0 14px",
                                    marginBottom:
                                        "12px",
                                    letterSpacing:
                                        "1px",
                                }}
                            >
                                {group.title}
                            </div>

                            {/* ITEMS */}
                            <div
                                style={{
                                    display:
                                        "flex",
                                    flexDirection:
                                        "column",
                                    gap: "6px",
                                }}
                            >
                                {group.items.map(
                                    (
                                        item,
                                        i
                                    ) => {
                                        const active =
                                            location.pathname ===
                                            item.path;

                                        return (
                                            <NavLink
                                                key={
                                                    i
                                                }
                                                to={
                                                    item.path
                                                }
                                                style={{
                                                    textDecoration:
                                                        "none",
                                                }}
                                            >
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
                                                        background:
                                                            active
                                                                ? "linear-gradient(135deg,#06b6d4,#3b82f6)"
                                                                : "transparent",
                                                        color:
                                                            active
                                                                ? "#fff"
                                                                : "#94a3b8",
                                                        border:
                                                            active
                                                                ? "1px solid rgba(255,255,255,0.08)"
                                                                : "1px solid transparent",
                                                        fontWeight:
                                                            active
                                                                ? "600"
                                                                : "500",
                                                        fontSize:
                                                            "14px",
                                                        transition:
                                                            "all 0.2s ease",
                                                        boxShadow:
                                                            active
                                                                ? "0 10px 28px rgba(6,182,212,0.30)"
                                                                : "none",
                                                    }}
                                                >
                                                    {
                                                        item.icon
                                                    }

                                                    {
                                                        item.label
                                                    }
                                                </div>
                                            </NavLink>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* LOGOUT */}
            <button
                onClick={() => {
                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                    navigate(
                        "/login"
                    );
                }}
                style={{
                    height: "54px",
                    border:
                        "1px solid rgba(255,255,255,0.06)",
                    background:
                        "rgba(255,255,255,0.04)",
                    borderRadius: "16px",
                    color: "#e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "center",
                    gap: "12px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    backdropFilter:
                        "blur(10px)",
                    transition: "0.2s",
                    marginTop: "20px",
                }}
            >
                <LogOut size={18} />
                Logout
            </button>
        </div>
    );
}