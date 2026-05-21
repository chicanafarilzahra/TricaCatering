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
} from "react-router-dom";

import {
    useEffect,
    useRef,
} from "react";

export default function Sidebar() {

    const location =
        useLocation();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const sidebarRef =
        useRef(null);

    /* =========================
       RESTORE SCROLL
    ========================= */

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

    /* =========================
       SAVE SCROLL
    ========================= */

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
            title: "MAIN",
            items: [

                {
                    label: "Dashboard",
                    path: "/",
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

                overflowY: "auto",

                background:
                    `
                    linear-gradient(
                        180deg,
                        #0f172a 0%,
                        #111827 100%
                    )
                    `,

                borderRight:
                    "1px solid rgba(255,255,255,0.06)",

                padding:
                    "20px 16px",

                display: "flex",

                flexDirection:
                    "column",

                justifyContent:
                    "space-between",

                zIndex: 999,

                boxSizing:
                    "border-box",

                scrollbarWidth:
                    "none",

                msOverflowStyle:
                    "none",
            }}
        >

            {/* =========================
               TOP
            ========================= */}

            <div>

                {/* LOGO */}

                <div
                    style={{
                        padding:
                            "10px 12px",

                        marginBottom:
                            "30px",
                    }}
                >

                    <div
                        style={{
                            display:
                                "flex",

                            alignItems:
                                "center",

                            gap: "14px",
                        }}
                    >

                        <div
                            style={{

                                width: "44px",
                                height: "44px",

                                borderRadius:
                                    "16px",

                                background:
                                    "linear-gradient(135deg,#6366f1,#8b5cf6)",

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                color:
                                    "white",

                                fontWeight:
                                    "800",

                                fontSize:
                                    "16px",

                                boxShadow:
                                    "0 10px 30px rgba(99,102,241,0.35)",
                            }}
                        >
                            T
                        </div>

                        <div>

                            <div
                                style={{

                                    color:
                                        "white",

                                    fontWeight:
                                        "700",

                                    fontSize:
                                        "20px",

                                    letterSpacing:
                                        "-0.5px",
                                }}
                            >
                                TriCa Catering
                            </div>

                            <div
                                style={{

                                    color:
                                        "#64748b",

                                    fontSize:
                                        "12px",

                                    marginTop:
                                        "4px",
                                }}
                            >
                                Admin Dashboard
                            </div>

                        </div>

                    </div>

                </div>

                {/* USER */}

                <div
                    style={{

                        background:
                            "rgba(255,255,255,0.04)",

                        border:
                            "1px solid rgba(255,255,255,0.05)",

                        borderRadius:
                            "22px",

                        padding:
                            "16px",

                        marginBottom:
                            "28px",

                        backdropFilter:
                            "blur(14px)",
                    }}
                >

                    <div
                        style={{

                            display:
                                "flex",

                            alignItems:
                                "center",

                            gap: "14px",
                        }}
                    >

                        <div
                            style={{

                                width: "46px",
                                height: "46px",

                                borderRadius:
                                    "16px",

                                background:
                                    "linear-gradient(135deg,#6366f1,#8b5cf6)",

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                color:
                                    "white",

                                fontWeight:
                                    "700",

                                fontSize:
                                    "15px",
                            }}
                        >
                            {
                                user?.name
                                    ?.charAt(0)
                                    ?.toUpperCase()
                            }
                        </div>

                        <div>

                            <div
                                style={{

                                    color:
                                        "white",

                                    fontWeight:
                                        "600",

                                    fontSize:
                                        "15px",
                                }}
                            >
                                {user?.name}
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
                                {user?.role}
                            </div>

                        </div>

                    </div>

                </div>

                {/* MENUS */}

                {menus.map(
                    (
                        group,
                        index
                    ) => (

                        <div
                            key={index}
                            style={{
                                marginBottom:
                                    "28px",
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
                                                key={i}
                                                to={item.path}
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

                                                        gap: "14px",

                                                        padding:
                                                            "0 16px",

                                                        borderRadius:
                                                            "16px",

                                                        background:
                                                            active
                                                                ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                                                                : "transparent",

                                                        color:
                                                            active
                                                                ? "white"
                                                                : "#94a3b8",

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
                                                                ? "0 10px 30px rgba(99,102,241,0.30)"
                                                                : "none",
                                                    }}
                                                >

                                                    {item.icon}

                                                    {item.label}

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

            {/* =========================
               LOGOUT
            ========================= */}

            <button
                onClick={() => {

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                    window.location.href =
                        "/#/login";
                }}
                style={{

                    height: "52px",

                    border:
                        "1px solid rgba(255,255,255,0.06)",

                    background:
                        "rgba(255,255,255,0.04)",

                    borderRadius:
                        "16px",

                    color:
                        "#e2e8f0",

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    gap: "12px",

                    cursor:
                        "pointer",

                    fontSize:
                        "14px",

                    fontWeight:
                        "600",

                    backdropFilter:
                        "blur(10px)",
                }}
            >

                <LogOut size={18} />

                Logout

            </button>

        </div>
    );
}