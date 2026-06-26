// resources/js/components/NavbarOwner.jsx

import { Bell, Settings, ChevronDown, UserCircle } from "lucide-react";
import { useState } from "react";

/* ─── design tokens ─── */
const token = {
    navBg: "#0d1526",
    border: "rgba(255,255,255,0.06)",
    textPrimary: "#e2e8f0",
    textMuted: "#64748b",
    textSecondary: "#94a3b8",
    iconBg: "rgba(255,255,255,0.05)",
    iconBorder: "rgba(255,255,255,0.07)",
    iconHover: "rgba(255,255,255,0.09)",
    userBg: "rgba(255,255,255,0.04)",
    accentBlue: "#2563eb",
    accentBlueDark: "#1d4ed8",
    notifDot: "#ef4444",
};

/* ─── reusable icon button ─── */
function IconBtn({ children, badge = false, title }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            title={title}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: "relative",
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: hovered ? token.iconHover : token.iconBg,
                border: `1px solid ${token.iconBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: hovered ? token.textPrimary : token.textSecondary,
                cursor: "pointer",
                transition: "all 0.18s ease",
                flexShrink: 0,
            }}
        >
            {children}
            {badge && (
                <span
                    style={{
                        position: "absolute",
                        top: "7px",
                        right: "7px",
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: token.notifDot,
                        border: `1.5px solid ${token.navBg}`,
                    }}
                />
            )}
        </div>
    );
}

/* ─── component ─── */
export default function NavbarOwner() {
    const [userHovered, setUserHovered] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") ?? "{}");
    const initial = (user?.name?.charAt(0) ?? "O").toUpperCase();

    /* page title from pathname */
    const path = window.location.pathname;
    const segment = path.split("/").filter(Boolean).at(-1) ?? "dashboard";
    const pageTitle =
        segment.charAt(0).toUpperCase() + segment.slice(1);

    const s = {
        nav: {
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            background: token.navBg,
            borderBottom: `1px solid ${token.border}`,
            position: "sticky",
            top: 0,
            zIndex: 100,
            boxSizing: "border-box",
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        },
        left: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
        },
        pageTitle: {
            margin: 0,
            fontSize: "17px",
            fontWeight: "700",
            color: token.textPrimary,
            letterSpacing: "-0.3px",
        },
        pageSub: {
            margin: "2px 0 0",
            fontSize: "12px",
            color: token.textMuted,
            fontWeight: "400",
        },
        right: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
        },
        divider: {
            width: "1px",
            height: "22px",
            background: token.border,
            margin: "0 2px",
        },
        userChip: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "5px 10px 5px 6px",
            borderRadius: "10px",
            background: userHovered
                ? "rgba(255,255,255,0.07)"
                : token.userBg,
            border: `1px solid ${token.iconBorder}`,
            cursor: "pointer",
            transition: "all 0.18s ease",
        },
        userAvatar: {
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            background: `linear-gradient(135deg, ${token.accentBlue}, ${token.accentBlueDark})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "12px",
            fontWeight: "700",
            flexShrink: 0,
        },
        userName: {
            color: token.textPrimary,
            fontSize: "13px",
            fontWeight: "600",
            whiteSpace: "nowrap",
        },
        userRole: {
            color: token.textMuted,
            fontSize: "10px",
            textTransform: "capitalize",
            marginTop: "1px",
        },
        chevron: {
            color: token.textMuted,
            flexShrink: 0,
            transition: "transform 0.2s ease",
        },
    };

    return (
        <header style={s.nav}>
            {/* ── Left: page title ── */}
            <div style={s.left}>
                <h1 style={s.pageTitle}>{pageTitle}</h1>
                <p style={s.pageSub}>
                    Welcome back, {user?.name ?? "Owner"}
                </p>
            </div>

            {/* ── Right: actions ── */}
            <div style={s.right}>
                {/* Notification bell */}
                <IconBtn badge title="Notifications">
                    <Bell size={16} />
                </IconBtn>

                {/* Settings */}
                <IconBtn title="Settings">
                    <Settings size={16} />
                </IconBtn>

                {/* Divider */}
                <div style={s.divider} />

                {/* User chip */}
                <div
                    style={s.userChip}
                    onMouseEnter={() => setUserHovered(true)}
                    onMouseLeave={() => setUserHovered(false)}
                >
                    <div style={s.userAvatar}>{initial}</div>
                    <div>
                        <div style={s.userName}>{user?.name ?? "Owner"}</div>
                        <div style={s.userRole}>{user?.role ?? "owner"}</div>
                    </div>
                    <ChevronDown
                        size={13}
                        style={{
                            ...s.chevron,
                            transform: userHovered
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                        }}
                    />
                </div>
            </div>
        </header>
    );
}