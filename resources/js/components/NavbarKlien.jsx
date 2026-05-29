// resources/js/components/NavbarKlien.jsx

import React, { useEffect, useState } from "react";
import {
    FaBell,
    FaTimes,
    FaClipboardList,
    FaTruck,
} from "react-icons/fa";

export default function NavbarKlien({
    title = "Beranda",
    subtitle = "Selamat datang kembali 👋",
}) {
    const [showNotif, setShowNotif] = useState(false);
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            icon: <FaClipboardList />,
            title: "Pesanan berhasil dibuat",
            desc: "Pesanan catering Anda sudah masuk sistem",
            time: "Baru saja",
        },
        {
            id: 2,
            icon: <FaTruck />,
            title: "Kurir sedang menuju lokasi",
            desc: "Pesanan Anda sedang dikirim",
            time: "5 menit lalu",
        },
    ]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const initials = user?.name
        ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
        : "K";

    return (
        <>
            <header
                style={{
                    width: "100%",
                    height: "82px",
                    background:
                        "linear-gradient(90deg,#1e3a8a 0%,#233f91 100%)",
                    borderBottom:
                        "1px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 24px",
                    boxSizing: "border-box",
                    position: "sticky",
                    top: 0,
                    zIndex: 20,
                    flexShrink: 0,
                }}
            >
                {/* LEFT */}
                <div>
                    <h1
                        style={{
                            margin: 0,
                            color: "#ffffff",
                            fontSize: "22px",
                            fontWeight: "800",
                            lineHeight: 1.1,
                        }}
                    >
                        {title}
                    </h1>

                    <p
                        style={{
                            margin: "5px 0 0",
                            color: "rgba(255,255,255,0.72)",
                            fontSize: "13px",
                        }}
                    >
                        {subtitle}
                    </p>
                </div>

                {/* RIGHT */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        position: "relative",
                    }}
                >
                    {/* NOTIFICATION */}
                    <button
                        onClick={() =>
                            setShowNotif(!showNotif)
                        }
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "14px",
                            border: "none",
                            background:
                                "rgba(255,255,255,0.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ffffff",
                            fontSize: "17px",
                            cursor: "pointer",
                            position: "relative",
                        }}
                    >
                        <FaBell />

                        {notifications.length > 0 && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "8px",
                                    right: "8px",
                                    width: "9px",
                                    height: "9px",
                                    borderRadius: "50%",
                                    background: "#ef4444",
                                }}
                            />
                        )}
                    </button>

                    {/* PROFILE */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            background:
                                "rgba(255,255,255,0.05)",
                            padding: "8px 12px",
                            borderRadius: "14px",
                        }}
                    >
                        <div
                            style={{
                                width: "38px",
                                height: "38px",
                                borderRadius: "50%",
                                background:
                                    "linear-gradient(135deg,#3b82f6,#2563eb)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontWeight: "700",
                                fontSize: "13px",
                                textTransform: "uppercase",
                                flexShrink: 0,
                            }}
                        >
                            {initials}
                        </div>

                        <div>
                            <div
                                style={{
                                    color: "#ffffff",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    lineHeight: 1,
                                }}
                            >
                                {user?.name || "Klien"}
                            </div>

                            <div
                                style={{
                                    marginTop: "4px",
                                    color: "#94a3b8",
                                    fontSize: "11px",
                                }}
                            >
                                Pelanggan Catering
                            </div>
                        </div>
                    </div>

                    {/* DROPDOWN NOTIF */}
                    {showNotif && (
                        <div
                            style={{
                                position: "absolute",
                                top: "58px",
                                right: 0,
                                width: "320px",
                                background: "#182338",
                                borderRadius: "20px",
                                border:
                                    "1px solid rgba(255,255,255,0.05)",
                                overflow: "hidden",
                                boxShadow:
                                    "0 15px 40px rgba(0,0,0,0.35)",
                                zIndex: 100,
                            }}
                        >
                            {/* HEADER */}
                            <div
                                style={{
                                    padding: "18px 18px",
                                    borderBottom:
                                        "1px solid rgba(255,255,255,0.05)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent:
                                        "space-between",
                                }}
                            >
                                <div
                                    style={{
                                        color: "#ffffff",
                                        fontSize: "16px",
                                        fontWeight: "700",
                                    }}
                                >
                                    Notifikasi
                                </div>

                                <button
                                    onClick={() =>
                                        setShowNotif(false)
                                    }
                                    style={{
                                        border: "none",
                                        background:
                                            "transparent",
                                        color: "#94a3b8",
                                        cursor: "pointer",
                                        fontSize: "15px",
                                    }}
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            {/* CONTENT */}
                            <div
                                style={{
                                    maxHeight: "320px",
                                    overflowY: "auto",
                                }}
                            >
                                {notifications.length ===
                                0 ? (
                                    <div
                                        style={{
                                            padding: "28px",
                                            textAlign:
                                                "center",
                                            color:
                                                "#94a3b8",
                                            fontSize:
                                                "13px",
                                        }}
                                    >
                                        Tidak ada notifikasi
                                    </div>
                                ) : (
                                    notifications.map(
                                        (item) => (
                                            <div
                                                key={
                                                    item.id
                                                }
                                                style={{
                                                    display:
                                                        "flex",
                                                    gap: "14px",
                                                    padding:
                                                        "16px 18px",
                                                    borderBottom:
                                                        "1px solid rgba(255,255,255,0.04)",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "42px",
                                                        height: "42px",
                                                        borderRadius:
                                                            "14px",
                                                        background:
                                                            "rgba(59,130,246,0.15)",
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                        color:
                                                            "#3b82f6",
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {
                                                        item.icon
                                                    }
                                                </div>

                                                <div
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            color:
                                                                "#ffffff",
                                                            fontSize:
                                                                "13px",
                                                            fontWeight:
                                                                "700",
                                                            marginBottom:
                                                                "4px",
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
                                                                "12px",
                                                            lineHeight:
                                                                1.5,
                                                        }}
                                                    >
                                                        {
                                                            item.desc
                                                        }
                                                    </div>

                                                    <div
                                                        style={{
                                                            marginTop:
                                                                "6px",
                                                            color:
                                                                "#64748b",
                                                            fontSize:
                                                                "11px",
                                                        }}
                                                    >
                                                        {
                                                            item.time
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
}