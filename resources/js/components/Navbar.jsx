import {
    Bell,
    ChevronDown,
    CheckCheck,
} from "lucide-react";

import { useEffect, useState } from "react";

export default function Navbar() {
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [openNotif, setOpenNotif] =
        useState(false);

    const [notifications, setNotifications] =
        useState([]);

    useEffect(() => {
        const data =
            JSON.parse(
                localStorage.getItem(
                    "notifications"
                )
            ) || [];

        setNotifications(data);
    }, []);

    const unread =
        notifications.filter(
            (item) => !item.read
        ).length;

    const markAllAsRead = () => {
        const updated =
            notifications.map(
                (item) => ({
                    ...item,
                    read: true,
                })
            );

        localStorage.setItem(
            "notifications",
            JSON.stringify(updated)
        );

        setNotifications(updated);
    };

    return (
        <div
            style={{
                height: "82px",
                background:
                    "rgba(7,16,40,0.75)",
                borderBottom:
                    "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent:
                    "space-between",
                padding: "0 32px",
                backdropFilter:
                    "blur(14px)",
                position: "sticky",
                top: 0,
                zIndex: 20,
            }}
        >
            {/* LEFT */}
            <div>
                <h1
                    style={{
                        color: "white",
                        fontSize: "24px",
                        fontWeight: "800",
                        margin: 0,
                    }}
                >
                    Admin Panel
                </h1>

                <p
                    style={{
                        color: "#94a3b8",
                        fontSize: "13px",
                        marginTop: "4px",
                    }}
                >
                    Manage your catering
                    system
                </p>
            </div>

            {/* RIGHT */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "18px",
                    position:
                        "relative",
                }}
            >
                {/* NOTIFICATION */}
                <button
                    onClick={() =>
                        setOpenNotif(
                            !openNotif
                        )
                    }
                    style={{
                        width: "48px",
                        height: "48px",
                        borderRadius:
                            "16px",
                        border:
                            "1px solid rgba(255,255,255,0.06)",
                        background:
                            "rgba(255,255,255,0.04)",
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        position:
                            "relative",
                        cursor: "pointer",
                        color: "white",
                    }}
                >
                    <Bell size={20} />

                    {unread > 0 && (
                        <div
                            style={{
                                position:
                                    "absolute",
                                top: "10px",
                                right:
                                    "10px",
                                width:
                                    "10px",
                                height:
                                    "10px",
                                borderRadius:
                                    "999px",
                                background:
                                    "#ef4444",
                                border:
                                    "2px solid #071028",
                            }}
                        />
                    )}
                </button>

                {/* DROPDOWN */}
                {openNotif && (
                    <div
                        style={{
                            position:
                                "absolute",
                            top: "64px",
                            right:
                                "78px",
                            width:
                                "360px",
                            background:
                                "#0f172a",
                            border:
                                "1px solid rgba(255,255,255,0.06)",
                            borderRadius:
                                "24px",
                            overflow:
                                "hidden",
                            boxShadow:
                                "0 20px 60px rgba(0,0,0,0.45)",
                            zIndex: 99,
                        }}
                    >
                        {/* HEADER */}
                        <div
                            style={{
                                padding:
                                    "18px 20px",
                                borderBottom:
                                    "1px solid rgba(255,255,255,0.06)",
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "space-between",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        color:
                                            "white",
                                        fontWeight:
                                            "700",
                                        fontSize:
                                            "15px",
                                    }}
                                >
                                    Notifications
                                </div>

                                <div
                                    style={{
                                        color:
                                            "#94a3b8",
                                        fontSize:
                                            "12px",
                                        marginTop:
                                            "4px",
                                    }}
                                >
                                    {unread} unread
                                    notifications
                                </div>
                            </div>

                            <button
                                onClick={
                                    markAllAsRead
                                }
                                style={{
                                    border:
                                        "none",
                                    background:
                                        "transparent",
                                    color:
                                        "#60a5fa",
                                    cursor:
                                        "pointer",
                                }}
                            >
                                <CheckCheck
                                    size={18}
                                />
                            </button>
                        </div>

                        {/* BODY */}
                        <div
                            style={{
                                maxHeight:
                                    "380px",
                                overflowY:
                                    "auto",
                            }}
                        >
                            {notifications.length ===
                            0 ? (
                                <div
                                    style={{
                                        padding:
                                            "60px 20px",
                                        textAlign:
                                            "center",
                                        color:
                                            "#64748b",
                                        fontSize:
                                            "14px",
                                    }}
                                >
                                    No notifications
                                </div>
                            ) : (
                                notifications.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            style={{
                                                padding:
                                                    "18px 20px",
                                                borderBottom:
                                                    "1px solid rgba(255,255,255,0.04)",
                                                background:
                                                    item.read
                                                        ? "transparent"
                                                        : "rgba(59,130,246,0.08)",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    color:
                                                        "white",
                                                    fontSize:
                                                        "14px",
                                                    fontWeight:
                                                        "600",
                                                    marginBottom:
                                                        "6px",
                                                }}
                                            >
                                                {
                                                    item.title
                                                }
                                            </div>

                                            <div
                                                style={{
                                                    color:
                                                        "#94a3b8",
                                                    fontSize:
                                                        "13px",
                                                    lineHeight:
                                                        "22px",
                                                }}
                                            >
                                                {
                                                    item.message
                                                }
                                            </div>
                                        </div>
                                    )
                                )
                            )}
                        </div>
                    </div>
                )}

                {/* USER */}
                <div
                    style={{
                        height: "52px",
                        padding:
                            "0 14px",
                        borderRadius:
                            "18px",
                        background:
                            "rgba(255,255,255,0.04)",
                        border:
                            "1px solid rgba(255,255,255,0.06)",
                        display: "flex",
                        alignItems:
                            "center",
                        gap: "12px",
                        cursor: "pointer",
                    }}
                >
                    {/* AVATAR */}
                    <div
                        style={{
                            width: "42px",
                            height: "42px",
                            borderRadius:
                                "14px",
                            background:
                                "linear-gradient(135deg,#06b6d4,#3b82f6)",
                            display: "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            fontWeight:
                                "700",
                            color: "white",
                            boxShadow:
                                "0 10px 30px rgba(6,182,212,0.35)",
                            fontSize:
                                "15px",
                        }}
                    >
                        {user?.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "A"}
                    </div>

                    {/* INFO */}
                    <div>
                        <div
                            style={{
                                color:
                                    "white",
                                fontSize:
                                    "14px",
                                fontWeight:
                                    "700",
                                lineHeight:
                                    1,
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
                                    "6px",
                                textTransform:
                                    "capitalize",
                            }}
                        >
                            {user?.role ||
                                "admin"}
                        </div>
                    </div>

                    <ChevronDown
                        size={18}
                        color="#94a3b8"
                    />
                </div>
            </div>
        </div>
    );
}