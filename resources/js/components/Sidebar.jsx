// resources/js/components/Sidebar.jsx

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
    ChevronRight,
} from "lucide-react";

import {
    useRef,
    useLayoutEffect,
} from "react";

import {
    NavLink,
    useLocation,
    useNavigate,
} from "react-router-dom";

const SCROLL_KEY = "sidebar_scroll_pos";

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    const user = JSON.parse(localStorage.getItem("user"));

    /* =========================
       PRESERVE SCROLL POSITION
       (Sidebar remounts on every page navigation
        since each page wraps itself in AdminLayout,
        so we restore the saved scroll position
        before the browser paints to avoid the
        "jump back to top" effect)
    ========================= */
    useLayoutEffect(() => {
        const saved = sessionStorage.getItem(SCROLL_KEY);
        if (saved && scrollRef.current) {
            scrollRef.current.scrollTop = parseInt(saved, 10) || 0;
        }
    }, []);

    const handleSidebarScroll = (e) => {
        sessionStorage.setItem(SCROLL_KEY, e.currentTarget.scrollTop);
    };

    /* =========================
       LOGOUT
    ========================= */
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem(SCROLL_KEY);
        navigate("/");
    };

    const menus = [
        {
            title: "MAIN MENU",
            items: [
                { label: "Dashboard",     path: "/dashboard",           icon: <LayoutDashboard size={17} /> },
                { label: "Orders",        path: "/orders",              icon: <ShoppingCart size={17} /> },
            ],
        },
        {
            title: "OPERASIONAL",
            items: [
                { label: "Produk Catering", path: "/menus",       icon: <UtensilsCrossed size={17} /> },
                { label: "Inventori",       path: "/stocks",      icon: <Boxes size={17} /> },
                { label: "Produksi",        path: "/productions", icon: <Factory size={17} /> },
                { label: "Pengiriman",      path: "/deliveries",  icon: <Truck size={17} /> },
            ],
        },
        {
            title: "MANAJEMEN",
            items: [
                { label: "SPPG",          path: "/admin/sppg",          icon: <ClipboardList size={17} /> },
                { label: "Validasi User", path: "/admin-validasi-user", icon: <Users size={17} /> },
            ],
        },
        {
            title: "LAPORAN",
            items: [
                { label: "Reports", path: "/reports", icon: <FileBarChart2 size={17} /> },
            ],
        },
    ];

    return (
        <>
            <style>{`
                .sidebar-root * { box-sizing: border-box; font-family: 'Inter', system-ui, sans-serif; }

                .nav-item {
                    height: 44px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 0 14px;
                    border-radius: 12px;
                    font-size: 13.5px;
                    font-weight: 500;
                    color: #64748b;
                    border: 1px solid transparent;
                    text-decoration: none;
                    transition: color 0.15s ease, background 0.15s ease;
                    cursor: pointer;
                    position: relative;
                }
                .nav-item:hover {
                    color: #cbd5e1;
                    background: rgba(255,255,255,0.04);
                }
                .nav-item.active {
                    color: white;
                    background: rgba(255,255,255,0.07);
                    border-color: rgba(255,255,255,0.08);
                    font-weight: 600;
                }
                .nav-item.active::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 10px; bottom: 10px;
                    width: 3px;
                    border-radius: 0 3px 3px 0;
                    background: linear-gradient(180deg, #06b6d4, #3b82f6);
                }
                .nav-icon-wrap {
                    width: 32px; height: 32px;
                    border-radius: 9px;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                    transition: background 0.15s ease;
                }
                .nav-item.active .nav-icon-wrap {
                    background: linear-gradient(135deg, #06b6d4, #3b82f6);
                    box-shadow: 0 6px 16px rgba(6,182,212,0.28);
                    color: white;
                }

                .logout-btn {
                    width: 100%;
                    height: 48px;
                    border: 1px solid rgba(239,68,68,0.18);
                    border-radius: 14px;
                    background: rgba(239,68,68,0.07);
                    color: #f87171;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    cursor: pointer;
                    font-size: 13.5px; font-weight: 600;
                    transition: all 0.2s ease;
                    font-family: 'Inter', system-ui, sans-serif;
                }
                .logout-btn:hover {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                    border-color: transparent;
                    box-shadow: 0 10px 28px rgba(239,68,68,0.28);
                    transform: translateY(-1px);
                }

                .sidebar-scroll::-webkit-scrollbar { width: 0px; }
            `}</style>

            <div className="sidebar-root" style={{
                width: "260px",
                height: "100vh",
                position: "fixed",
                top: 0, left: 0,
                background: "#080f1e",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                flexDirection: "column",
                zIndex: 100,
            }}>
                {/* ── TOP: Logo + User ── */}
                <div style={{ padding: "24px 18px 20px", flexShrink: 0 }}>
                    {/* Logo */}
                    <div style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "0 4px", marginBottom: "24px",
                    }}>
                        <div style={{
                            width: "40px", height: "40px", borderRadius: "14px",
                            background: "linear-gradient(135deg,#06b6d4,#3b82f6)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontWeight: "800", fontSize: "17px",
                            boxShadow: "0 8px 20px rgba(6,182,212,0.30)",
                            flexShrink: 0,
                        }}>
                            T
                        </div>
                        <div>
                            <div style={{
                                color: "#fff", fontWeight: "700",
                                fontSize: "15px", letterSpacing: "-0.3px",
                            }}>
                                TriCa Catering
                            </div>
                            <div style={{ color: "#334155", fontSize: "11.5px", marginTop: "2px" }}>
                                Admin Dashboard
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "20px" }} />

                    {/* User card */}
                    <div style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "12px 14px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "14px",
                    }}>
                        <div style={{
                            width: "38px", height: "38px", borderRadius: "12px",
                            background: "linear-gradient(135deg,#06b6d4,#3b82f6)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontWeight: "700", fontSize: "15px",
                            flexShrink: 0,
                            boxShadow: "0 6px 16px rgba(6,182,212,0.25)",
                        }}>
                            {user?.name?.charAt(0)?.toUpperCase() || "A"}
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{
                                color: "#e2e8f0", fontWeight: "600", fontSize: "13.5px",
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                            }}>
                                {user?.name || "Admin"}
                            </div>
                            <div style={{
                                color: "#334155", fontSize: "11.5px", marginTop: "2px",
                                textTransform: "capitalize",
                            }}>
                                {user?.role || "admin"}
                            </div>
                        </div>
                        <div style={{
                            marginLeft: "auto",
                            width: "7px", height: "7px", borderRadius: "999px",
                            background: "#22c55e",
                            boxShadow: "0 0 0 2px rgba(34,197,94,0.2)",
                            flexShrink: 0,
                        }} />
                    </div>
                </div>

                {/* ── MENUS ── */}
                <div
                    ref={scrollRef}
                    className="sidebar-scroll"
                    onScroll={handleSidebarScroll}
                    style={{
                        flex: 1, overflowY: "auto", overflowX: "hidden",
                        padding: "0 12px",
                    }}
                >
                    {menus.map((group, index) => (
                        <div key={index} style={{ marginBottom: "24px" }}>
                            <div style={{
                                color: "#1e293b",
                                fontSize: "10.5px", fontWeight: "700",
                                letterSpacing: "0.1em",
                                padding: "0 6px", marginBottom: "8px",
                            }}>
                                {group.title}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                {group.items.map((item, i) => {
                                    const active = location.pathname === item.path;
                                    return (
                                        <NavLink
                                            key={i}
                                            to={item.path}
                                            style={{ textDecoration: "none" }}
                                        >
                                            <div className={`nav-item${active ? " active" : ""}`}>
                                                <div className="nav-icon-wrap">
                                                    {item.icon}
                                                </div>
                                                <span style={{ flex: 1 }}>{item.label}</span>
                                                {active && (
                                                    <ChevronRight size={14} style={{ opacity: 0.5 }} />
                                                )}
                                            </div>
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── LOGOUT ── */}
                <div style={{ padding: "16px 18px 24px", flexShrink: 0 }}>
                    <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "16px" }} />
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}