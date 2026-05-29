// resources/js/pages/Klien/Home.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

import SidebarKlien from "../../components/SidebarKlien";
import NavbarKlien from "../../components/NavbarKlien";

import {
    FaClipboardList,
    FaClock,
    FaTruck,
    FaCheckCircle,
} from "react-icons/fa";

export default function HomeKlien() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        axios
            .get("/api/klien/pesanan")
            .then((res) => {
                setOrders(res.data || []);
            })
            .catch((err) => {
                console.error(err);
            });

        return () => {
            document.body.style.overflow = "auto";
            document.documentElement.style.overflow = "auto";
        };
    }, []);

    const activeOrders = orders.filter((o) =>
        ["pending", "confirmed", "on_delivery"].includes(o.status)
    );

    const latestOrder = orders[0];

    const estimasi = latestOrder?.delivery_time || "-";

    const subscriptionLeft =
        user?.subscription_days || 0;

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                overflow: "hidden",
                background: "#071028",
            }}
        >
            {/* SIDEBAR */}
            <SidebarKlien />

            {/* MAIN */}
            <div
                style={{
                    flex: 1,
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    background: "#071028",
                }}
            >
                {/* NAVBAR */}
                <NavbarKlien title="Dashboard Klien" />

                {/* CONTENT */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        padding: "32px",
                        boxSizing: "border-box",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                    className="hide-scrollbar"
                >
                    {/* HERO */}
                    <div
                        style={{
                            background:
                                "linear-gradient(135deg,#17306a 0%,#1f3f8b 100%)",
                            borderRadius: "30px",
                            padding: "38px",
                            marginBottom: "30px",
                            border:
                                "1px solid rgba(255,255,255,0.05)",
                            color: "#fff",
                        }}
                    >
                        <h1
                            style={{
                                margin: 0,
                                fontSize: "54px",
                                fontWeight: "800",
                                lineHeight: 1.2,
                            }}
                        >
                            Selamat Datang,{" "}
                            {user?.name || "Klien"} 👋
                        </h1>

                        <p
                            style={{
                                marginTop: "16px",
                                color: "rgba(255,255,255,0.75)",
                                fontSize: "18px",
                                maxWidth: "760px",
                                lineHeight: 1.7,
                            }}
                        >
                            Kelola pesanan catering harian
                            Anda dengan mudah. Pantau status
                            pengiriman, invoice, dan histori
                            pesanan langsung dari dashboard
                            ini.
                        </p>
                    </div>

                    {/* STAT CARD */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit,minmax(260px,1fr))",
                            gap: "24px",
                            marginBottom: "32px",
                        }}
                    >
                        <StatCard
                            icon={<FaClipboardList />}
                            title="Pesanan Aktif"
                            value={activeOrders.length}
                        />

                        <StatCard
                            icon={<FaClock />}
                            title="Estimasi Tiba"
                            value={estimasi}
                        />

                        <StatCard
                            icon={<FaTruck />}
                            title="Sisa Langganan"
                            value={subscriptionLeft}
                        />
                    </div>

                    {/* STATUS PESANAN */}
                    <div
                        style={{
                            background: "#182338",
                            borderRadius: "28px",
                            overflow: "hidden",
                            border:
                                "1px solid rgba(255,255,255,0.05)",
                            marginBottom: "20px",
                        }}
                    >
                        <div
                            style={{
                                padding: "26px 30px",
                                borderBottom:
                                    "1px solid rgba(255,255,255,0.05)",
                                fontSize: "28px",
                                fontWeight: "700",
                                color: "#fff",
                            }}
                        >
                            🚚 Status Pesanan Hari Ini
                        </div>

                        <div
                            style={{
                                padding:
                                    "10px 30px 28px",
                            }}
                        >
                            <TimelineItem
                                active
                                title="Pesanan diterima"
                                subtitle="Pesanan berhasil masuk sistem"
                            />

                            <TimelineItem
                                active={
                                    latestOrder?.status !==
                                    "pending"
                                }
                                title="Pesanan diproses dapur"
                                subtitle="Makanan sedang disiapkan"
                            />

                            <TimelineItem
                                progress={
                                    latestOrder?.status ===
                                    "on_delivery"
                                }
                                title="Dalam perjalanan"
                                subtitle={`Estimasi tiba ${estimasi}`}
                            />

                            <TimelineItem
                                title="Pesanan diterima"
                                subtitle="Menunggu kurir tiba"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* HIDE SCROLLBAR */}
            <style>
                {`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                `}
            </style>
        </div>
    );
}

/* ========================= */

function StatCard({
    icon,
    title,
    value,
}) {
    return (
        <div
            style={{
                background: "#182338",
                borderRadius: "26px",
                padding: "30px",
                border:
                    "1px solid rgba(255,255,255,0.05)",
                color: "#fff",
            }}
        >
            <div
                style={{
                    width: "74px",
                    height: "74px",
                    borderRadius: "22px",
                    background:
                        "rgba(59,130,246,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#3b82f6",
                    fontSize: "30px",
                    marginBottom: "22px",
                }}
            >
                {icon}
            </div>

            <div
                style={{
                    fontSize: "16px",
                    color: "#94a3b8",
                    marginBottom: "12px",
                }}
            >
                {title}
            </div>

            <div
                style={{
                    fontSize: "44px",
                    fontWeight: "800",
                    color: "#fff",
                }}
            >
                {value}
            </div>
        </div>
    );
}

function TimelineItem({
    title,
    subtitle,
    active,
    progress,
}) {
    return (
        <div
            style={{
                display: "flex",
                gap: "20px",
                padding: "24px 0",
                borderBottom:
                    "1px solid rgba(255,255,255,0.05)",
            }}
        >
            <div
                style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: active
                        ? "linear-gradient(135deg,#2563eb,#3b82f6)"
                        : progress
                        ? "rgba(59,130,246,0.15)"
                        : "rgba(255,255,255,0.08)",
                    border: progress
                        ? "2px solid #3b82f6"
                        : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "#fff",
                    fontSize: "20px",
                }}
            >
                {active ? (
                    <FaCheckCircle />
                ) : (
                    <FaTruck />
                )}
            </div>

            <div style={{ flex: 1 }}>
                <div
                    style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        marginBottom: "6px",
                        color: "#fff",
                    }}
                >
                    {title}
                </div>

                <div
                    style={{
                        fontSize: "15px",
                        color: "#94a3b8",
                    }}
                >
                    {subtitle}
                </div>

                {progress && (
                    <div
                        style={{
                            width: "100%",
                            height: "8px",
                            background:
                                "rgba(255,255,255,0.08)",
                            borderRadius: "999px",
                            overflow: "hidden",
                            marginTop: "18px",
                        }}
                    >
                        <div
                            style={{
                                width: "70%",
                                height: "100%",
                                background:
                                    "linear-gradient(90deg,#2563eb,#3b82f6)",
                                borderRadius: "999px",
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}