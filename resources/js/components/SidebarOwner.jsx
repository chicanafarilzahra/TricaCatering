// resources/js/components/SidebarOwner.jsx

import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    FileBarChart2,
    DollarSign,
    LogOut,
    Factory,
    Boxes,
    Truck,
    ChevronRight,
    UtensilsCrossed,
} from "lucide-react";

import {
    NavLink,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    useEffect,
    useRef,
} from "react";

export default function SidebarOwner() {
    const location = useLocation();

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const sidebarRef = useRef(null);

    /* =========================
       RESTORE SCROLL POSITION
    ========================= */
    useEffect(() => {
        const savedScroll =
            sessionStorage.getItem(
                "sidebar-owner-scroll"
            );

        // kalau baru login / pertama buka
        // sidebar tetap di atas
        if (
            location.pathname === "/owner" &&
            sidebarRef.current
        ) {
            sidebarRef.current.scrollTop = 0;

            sessionStorage.removeItem(
                "sidebar-owner-scroll"
            );

            return;
        }

        // restore scroll kalau pindah menu
        if (
            sidebarRef.current &&
            savedScroll
        ) {
            sidebarRef.current.scrollTop =
                parseInt(savedScroll, 10);
        }
    }, [location.pathname]);

    /* =========================
       SAVE SCROLL POSITION
    ========================= */
    const handleScroll = () => {
        if (sidebarRef.current) {
            sessionStorage.setItem(
                "sidebar-owner-scroll",
                sidebarRef.current.scrollTop
            );
        }
    };

    /* =========================
       HANDLE MENU CLICK
    ========================= */
    const handleMenuClick = () => {
        if (sidebarRef.current) {
            sessionStorage.setItem(
                "sidebar-owner-scroll",
                sidebarRef.current.scrollTop
            );
        }
    };

    /* =========================
       LOGOUT
    ========================= */
    const handleLogout = () => {
        localStorage.removeItem("token");

        localStorage.removeItem("user");

        sessionStorage.removeItem(
            "sidebar-owner-scroll"
        );

        // logout langsung ke landing page
        navigate("/");
    };

    /* =========================
       MENU OWNER
    ========================= */
    const menus = [
        {
            title: "OVERVIEW",
            items: [
                {
                    label: "Dashboard",
                    path: "/owner",
                    icon: (
                        <LayoutDashboard size={18} />
                    ),
                },
            ],
        },

        {
            title: "BUSINESS",
            items: [
                {
                    label: "Orders",
                    path: "/owner/orders",
                    icon: (
                        <ShoppingCart size={18} />
                    ),
                },

                {
                    label: "Customers",
                    path: "/owner/customers",
                    icon: (
                        <Users size={18} />
                    ),
                },

                {
                    label: "Menus",
                    path: "/owner/menus",
                    icon: (
                        <UtensilsCrossed size={18} />
                    ),
                },

                {
                    label: "Packages",
                    path: "/owner/packages",
                    icon: (
                        <Package size={18} />
                    ),
                },
            ],
        },

        {
            title: "OPERATIONS",
            items: [
                {
                    label: "Productions",
                    path: "/owner/productions",
                    icon: (
                        <Factory size={18} />
                    ),
                },

                {
                    label: "Stocks",
                    path: "/owner/stocks",
                    icon: (
                        <Boxes size={18} />
                    ),
                },

                {
                    label: "Couriers",
                    path: "/owner/couriers",
                    icon: (
                        <Truck size={18} />
                    ),
                },

                {
                    label: "Deliveries",
                    path: "/owner/deliveries",
                    icon: (
                        <Truck size={18} />
                    ),
                },
            ],
        },

        {
            title: "FINANCIAL",
            items: [
                {
                    label: "Revenue",
                    path: "/owner/revenue",
                    icon: (
                        <DollarSign size={18} />
                    ),
                },

                {
                    label: "Reports",
                    path: "/owner/reports",
                    icon: (
                        <FileBarChart2 size={18} />
                    ),
                },
            ],
        },
    ];

    const isActive = (path) =>
        location.pathname === path;

    return (
        <aside
            ref={sidebarRef}
            onScroll={handleScroll}
            style={{
                width: "285px",
                height: "100vh",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 999,
                overflowY: "auto",
                overflowX: "hidden",
                boxSizing: "border-box",
                padding: "24px 18px",

                display: "flex",
                flexDirection: "column",
                justifyContent:
                    "space-between",

                background:
                    "linear-gradient(180deg,#020617 0%,#0f172a 55%,#111827 100%)",

                borderRight:
                    "1px solid rgba(148,163,184,0.08)",

                boxShadow:
                    "12px 0 40px rgba(0,0,0,0.45)",

                scrollbarWidth: "none",
                msOverflowStyle: "none",
            }}
        >
            {/* TOP */}
            <div>
                {/* LOGO */}
                <div
                    style={{
                        marginBottom: "28px",
                        padding: "4px 6px",
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
                                width: "54px",
                                height: "54px",
                                borderRadius: "18px",

                                background:
                                    "linear-gradient(135deg,#2563eb,#1d4ed8)",

                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "center",

                                color: "white",
                                fontSize: "20px",
                                fontWeight: "800",

                                boxShadow:
                                    "0 14px 35px rgba(37,99,235,0.35)",
                            }}
                        >
                            T
                        </div>

                        <div>
                            <div
                                style={{
                                    color: "white",
                                    fontSize: "21px",
                                    fontWeight: "800",
                                    letterSpacing:
                                        "-0.4px",
                                }}
                            >
                                TriCa Catering
                            </div>

                            <div
                                style={{
                                    marginTop: "4px",
                                    fontSize: "11px",
                                    fontWeight: "700",
                                    color: "#64748b",
                                    letterSpacing:
                                        "1.2px",
                                    textTransform:
                                        "uppercase",
                                }}
                            >
                                Owner Dashboard
                            </div>
                        </div>
                    </div>
                </div>

                {/* USER CARD */}
                <div
                    style={{
                        background:
                            "rgba(15,23,42,0.75)",

                        border:
                            "1px solid rgba(148,163,184,0.08)",

                        borderRadius: "22px",

                        padding: "18px",

                        marginBottom: "30px",

                        backdropFilter:
                            "blur(12px)",
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
                                borderRadius: "16px",

                                background:
                                    "linear-gradient(135deg,#2563eb,#1e40af)",

                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "center",

                                color: "white",
                                fontSize: "18px",
                                fontWeight: "700",

                                boxShadow:
                                    "0 10px 25px rgba(37,99,235,0.28)",
                            }}
                        >
                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "O"}
                        </div>

                        <div
                            style={{
                                minWidth: 0,
                            }}
                        >
                            <div
                                style={{
                                    color: "white",
                                    fontWeight: "700",
                                    fontSize: "15px",

                                    whiteSpace:
                                        "nowrap",

                                    overflow:
                                        "hidden",

                                    textOverflow:
                                        "ellipsis",
                                }}
                            >
                                {user?.name ||
                                    "Owner"}
                            </div>

                            <div
                                style={{
                                    marginTop: "4px",
                                    color: "#94a3b8",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    textTransform:
                                        "capitalize",
                                }}
                            >
                                {user?.role ||
                                    "owner"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* MENU */}
                {menus.map(
                    (group, groupIndex) => (
                        <div
                            key={groupIndex}
                            style={{
                                marginBottom:
                                    "26px",
                            }}
                        >
                            <div
                                style={{
                                    padding:
                                        "0 14px",

                                    marginBottom:
                                        "10px",

                                    fontSize:
                                        "11px",

                                    fontWeight:
                                        "700",

                                    color:
                                        "#475569",

                                    letterSpacing:
                                        "1.4px",

                                    textTransform:
                                        "uppercase",
                                }}
                            >
                                {group.title}
                            </div>

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
                                        index
                                    ) => {
                                        const active =
                                            isActive(
                                                item.path
                                            );

                                        return (
                                            <NavLink
                                                key={
                                                    index
                                                }
                                                to={
                                                    item.path
                                                }
                                                onClick={
                                                    handleMenuClick
                                                }
                                                style={{
                                                    textDecoration:
                                                        "none",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        height:
                                                            "50px",

                                                        display:
                                                            "flex",

                                                        alignItems:
                                                            "center",

                                                        gap: "12px",

                                                        padding:
                                                            "0 16px",

                                                        borderRadius:
                                                            "16px",

                                                        background:
                                                            active
                                                                ? "linear-gradient(135deg,#2563eb,#1d4ed8)"
                                                                : "transparent",

                                                        color:
                                                            active
                                                                ? "white"
                                                                : "#94a3b8",

                                                        fontWeight:
                                                            active
                                                                ? "700"
                                                                : "500",

                                                        fontSize:
                                                            "14px",

                                                        border:
                                                            active
                                                                ? "1px solid rgba(255,255,255,0.08)"
                                                                : "1px solid transparent",

                                                        boxShadow:
                                                            active
                                                                ? "0 12px 28px rgba(37,99,235,0.25)"
                                                                : "none",

                                                        transition:
                                                            "all 0.25s ease",
                                                    }}
                                                >
                                                    {
                                                        item.icon
                                                    }

                                                    <span
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        {
                                                            item.label
                                                        }
                                                    </span>

                                                    {active && (
                                                        <ChevronRight
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    )}
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
                onClick={handleLogout}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                        "translateY(-2px)";

                    e.currentTarget.style.boxShadow =
                        "0 14px 30px rgba(239,68,68,0.28)";

                    e.currentTarget.style.background =
                        "linear-gradient(135deg,#ef4444,#dc2626)";

                    e.currentTarget.style.color =
                        "#fff";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                        "translateY(0px)";

                    e.currentTarget.style.boxShadow =
                        "none";

                    e.currentTarget.style.background =
                        "rgba(239,68,68,0.10)";

                    e.currentTarget.style.color =
                        "#fca5a5";
                }}
                style={{
                    height: "56px",

                    border:
                        "1px solid rgba(239,68,68,0.20)",

                    borderRadius: "18px",

                    background:
                        "rgba(239,68,68,0.10)",

                    color: "#fca5a5",

                    display: "flex",

                    alignItems: "center",

                    justifyContent:
                        "center",

                    gap: "12px",

                    cursor: "pointer",

                    fontSize: "14px",

                    fontWeight: "700",

                    backdropFilter:
                        "blur(12px)",

                    transition:
                        "all 0.25s ease",

                    marginTop: "20px",

                    width: "100%",

                    letterSpacing: "0.3px",
                }}
            >
                <div
                    style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "12px",

                        background:
                            "rgba(255,255,255,0.10)",

                        display: "flex",

                        alignItems: "center",

                        justifyContent:
                            "center",
                    }}
                >
                    <LogOut size={20} />
                </div>

                Logout
            </button>
        </aside>
    );
}