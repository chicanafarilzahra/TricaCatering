// resources/js/components/SidebarOwner.jsx

import {
    LayoutDashboard,
    ShoppingCart,
    DollarSign,
    LogOut,
    Boxes,
    Truck,
    ChevronRight,
    UtensilsCrossed,
} from "lucide-react";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

/* ─── design tokens ─── */
const token = {
    sidebar:          "#0d1526",
    border:           "rgba(255,255,255,0.06)",
    activeBg:         "#1a2d50",
    activeBorder:     "rgba(59,130,246,0.25)",
    activeColor:      "#93c5fd",
    mutedColor:       "#4b5f7a",
    hoverBg:          "rgba(255,255,255,0.04)",
    hoverColor:       "#94a3b8",
    groupTitle:       "#2d3f56",
    textPrimary:      "#e2e8f0",
    logoutBg:         "rgba(239,68,68,0.08)",
    logoutBorder:     "rgba(239,68,68,0.15)",
    logoutColor:      "#fca5a5",
    logoutHoverBg:    "rgba(239,68,68,0.18)",
    logoutHoverColor: "#ffffff",
    accentBlue:       "#2563eb",
    accentBlueDark:   "#1d4ed8",
    radius: {
        sm: "8px",
        md: "12px",
        lg: "14px",
    },
};

/* ─── menu config ─── */
const MENUS = [
    {
        title: "OVERVIEW",
        items: [
            { label: "Dashboard",  path: "/owner",            icon: <LayoutDashboard size={16} /> },
        ],
    },
    {
        title: "BISNIS",
        items: [
            { label: "Pesanan",    path: "/owner/orders",     icon: <ShoppingCart size={16} /> },
            { label: "Menu",       path: "/owner/menus",      icon: <UtensilsCrossed size={16} /> },
        ],
    },
    {
        title: "OPERASIONAL",
        items: [
            { label: "Stok",       path: "/owner/stocks",     icon: <Boxes size={16} /> },
            { label: "Kurir",      path: "/owner/couriers",   icon: <Truck size={16} /> },
            { label: "Pengiriman", path: "/owner/deliveries", icon: <Truck size={16} /> },
        ],
    },
    {
        title: "KEUANGAN",
        items: [
            { label: "Keuangan",   path: "/owner/revenue",    icon: <DollarSign size={16} /> },
        ],
    },
];

/* ─── component ─── */
export default function SidebarOwner() {
    const location   = useLocation();
    const navigate   = useNavigate();
    const sidebarRef = useRef(null);

    const user    = JSON.parse(localStorage.getItem("user") || "{}");
    const initial = (user?.name?.charAt(0) ?? "O").toUpperCase();

    /* scroll restore */
    useEffect(() => {
        const saved = sessionStorage.getItem("sidebar-owner-scroll");
        if (location.pathname === "/owner" && sidebarRef.current) {
            sidebarRef.current.scrollTop = 0;
            sessionStorage.removeItem("sidebar-owner-scroll");
            return;
        }
        if (sidebarRef.current && saved) {
            sidebarRef.current.scrollTop = parseInt(saved, 10);
        }
    }, [location.pathname]);

    const handleScroll = () => {
        if (sidebarRef.current) {
            sessionStorage.setItem("sidebar-owner-scroll", sidebarRef.current.scrollTop);
        }
    };

    const handleMenuClick = () => {
        if (sidebarRef.current) {
            sessionStorage.setItem("sidebar-owner-scroll", sidebarRef.current.scrollTop);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("sidebar-owner-scroll");
        navigate("/");
    };

    const isActive = (path) => location.pathname === path;

    /* ─── styles ─── */
    const s = {
        sidebar: {
            width:           "260px",
            minWidth:        "260px",
            height:          "100vh",
            position:        "fixed",
            top:             0,
            left:            0,
            zIndex:          999,
            overflowY:       "auto",
            overflowX:       "hidden",
            boxSizing:       "border-box",
            padding:         "20px 14px 24px",
            display:         "flex",
            flexDirection:   "column",
            background:      token.sidebar,
            borderRight:     `1px solid ${token.border}`,
            scrollbarWidth:  "none",
            msOverflowStyle: "none",
            fontFamily:      "'Inter', system-ui, -apple-system, sans-serif",
        },
        logoRow: {
            display:      "flex",
            alignItems:   "center",
            gap:          "12px",
            padding:      "4px 6px",
            marginBottom: "20px",
        },
        logoIcon: {
            width:          "40px",
            height:         "40px",
            borderRadius:   token.radius.md,
            background:     `linear-gradient(135deg, ${token.accentBlue}, ${token.accentBlueDark})`,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            color:          "white",
            fontSize:       "17px",
            fontWeight:     "700",
            flexShrink:     0,
        },
        logoName: {
            color:         "white",
            fontSize:      "15px",
            fontWeight:    "700",
            letterSpacing: "-0.3px",
        },
        logoSub: {
            fontSize:      "10px",
            fontWeight:    "600",
            color:         token.groupTitle,
            letterSpacing: "1.1px",
            textTransform: "uppercase",
            marginTop:     "3px",
        },
        userCard: {
            background:   "rgba(255,255,255,0.04)",
            border:       "1px solid rgba(255,255,255,0.07)",
            borderRadius: token.radius.lg,
            padding:      "12px 14px",
            marginBottom: "22px",
            display:      "flex",
            alignItems:   "center",
            gap:          "12px",
        },
        userAvatar: {
            width:          "36px",
            height:         "36px",
            borderRadius:   "10px",
            background:     `linear-gradient(135deg, ${token.accentBlue}, ${token.accentBlueDark})`,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            color:          "white",
            fontSize:       "14px",
            fontWeight:     "700",
            flexShrink:     0,
        },
        userName: {
            color:        token.textPrimary,
            fontSize:     "13px",
            fontWeight:   "600",
            whiteSpace:   "nowrap",
            overflow:     "hidden",
            textOverflow: "ellipsis",
        },
        userRole: {
            fontSize:      "11px",
            color:         token.mutedColor,
            textTransform: "capitalize",
            marginTop:     "2px",
        },
        group: {
            marginBottom: "20px",
        },
        groupTitle: {
            fontSize:      "10px",
            fontWeight:    "700",
            color:         token.groupTitle,
            letterSpacing: "1.3px",
            textTransform: "uppercase",
            padding:       "0 10px",
            marginBottom:  "6px",
        },
        navItems: {
            display:       "flex",
            flexDirection: "column",
            gap:           "2px",
        },
        bottomSection: {
            marginTop:  "auto",
            paddingTop: "16px",
            borderTop:  `1px solid ${token.border}`,
        },
        logoutBtn: {
            width:         "100%",
            height:        "42px",
            display:       "flex",
            alignItems:    "center",
            gap:           "10px",
            padding:       "0 14px",
            borderRadius:  token.radius.lg,
            background:    token.logoutBg,
            border:        `1px solid ${token.logoutBorder}`,
            color:         token.logoutColor,
            fontSize:      "13px",
            fontWeight:    "600",
            cursor:        "pointer",
            transition:    "all 0.2s ease",
            letterSpacing: "0.1px",
            fontFamily:    "'Inter', system-ui, -apple-system, sans-serif",
        },
    };

    const navItemStyle = (active) => ({
        display:        "flex",
        alignItems:     "center",
        gap:            "10px",
        padding:        "0 12px",
        height:         "40px",
        borderRadius:   token.radius.md,
        fontSize:       "13px",
        fontWeight:     active ? "600" : "500",
        color:          active ? token.activeColor : token.mutedColor,
        background:     active ? token.activeBg : "transparent",
        border:         `1px solid ${active ? token.activeBorder : "transparent"}`,
        textDecoration: "none",
        transition:     "all 0.18s ease",
        cursor:         "pointer",
        boxSizing:      "border-box",
    });

    return (
        <aside ref={sidebarRef} onScroll={handleScroll} style={s.sidebar}>

            {/* ── Logo ── */}
            <div style={s.logoRow}>
                <div style={s.logoIcon}>T</div>
                <div>
                    <div style={s.logoName}>TriCa Catering</div>
                    <div style={s.logoSub}>Owner Panel</div>
                </div>
            </div>

            {/* ── User card ── */}
            <div style={s.userCard}>
                <div style={s.userAvatar}>{initial}</div>
                <div style={{ minWidth: 0 }}>
                    <div style={s.userName}>{user?.name ?? "Owner"}</div>
                    <div style={s.userRole}>{user?.role ?? "owner"}</div>
                </div>
            </div>

            {/* ── Menu groups ── */}
            {MENUS.map((group, gi) => (
                <div key={gi} style={s.group}>
                    <div style={s.groupTitle}>{group.title}</div>
                    <div style={s.navItems}>
                        {group.items.map((item, ii) => {
                            const active = isActive(item.path);
                            return (
                                <NavLink
                                    key={ii}
                                    to={item.path}
                                    onClick={handleMenuClick}
                                    style={navItemStyle(active)}
                                    onMouseEnter={(e) => {
                                        if (!active) {
                                            e.currentTarget.style.background = token.hoverBg;
                                            e.currentTarget.style.color      = token.hoverColor;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!active) {
                                            e.currentTarget.style.background = "transparent";
                                            e.currentTarget.style.color      = token.mutedColor;
                                        }
                                    }}
                                >
                                    <span style={{ display: "flex", alignItems: "center", flexShrink: 0, opacity: active ? 1 : 0.7 }}>
                                        {item.icon}
                                    </span>
                                    <span style={{ flex: 1, letterSpacing: "0.1px" }}>
                                        {item.label}
                                    </span>
                                    {active && (
                                        <ChevronRight size={14} style={{ opacity: 0.6, flexShrink: 0 }} />
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* ── Logout ── */}
            <div style={s.bottomSection}>
                <button
                    onClick={handleLogout}
                    style={s.logoutBtn}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background  = token.logoutHoverBg;
                        e.currentTarget.style.color       = token.logoutHoverColor;
                        e.currentTarget.style.borderColor = "rgba(239,68,68,0.35)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background  = token.logoutBg;
                        e.currentTarget.style.color       = token.logoutColor;
                        e.currentTarget.style.borderColor = token.logoutBorder;
                    }}
                >
                    <LogOut size={15} style={{ flexShrink: 0, opacity: 0.85 }} />
                    Logout
                </button>
            </div>
        </aside>
    );
}