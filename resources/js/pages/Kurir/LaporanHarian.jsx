// resources/js/pages/Kurir/LaporanHarian.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

import KurirLayout from "../../layouts/KurirLayout";

export default function LaporanHarian({
    onLogout,
}) {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios
            .get("/api/kurir/orders")
            .then((res) =>
                setOrders(res.data)
            )
            .catch((err) =>
                console.error(err)
            );
    }, []);

    const totalFee = orders.reduce(
        (acc, o) =>
            acc + (o.delivery_fee || 0),
        0
    );

    const terkirim = orders.filter(
        (o) => o.status === "delivered"
    ).length;

    return (
        <KurirLayout
            title="Laporan Harian"
            onLogout={onLogout}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "1400px",
                    margin: "0 auto",
                }}
            >
                {/* HEADER */}
                <div
                    style={{
                        marginBottom: "28px",
                    }}
                >
                    <h1
                        style={{
                            fontSize: "32px",
                            fontWeight: "800",
                            margin: 0,
                            color: "#ffffff",
                            letterSpacing:
                                "-0.5px",
                        }}
                    >
                        Laporan Harian
                    </h1>

                    <p
                        style={{
                            marginTop: "10px",
                            color: "#94a3b8",
                            fontSize: "15px",
                            lineHeight: 1.6,
                        }}
                    >
                        Rekap aktivitas
                        pengiriman kurir
                        hari ini
                    </p>
                </div>

                {/* STATS */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(240px,1fr))",
                        gap: "18px",
                        marginBottom: "28px",
                    }}
                >
                    <div style={cardStyle}>
                        <div
                            style={cardLabel}
                        >
                            Total Pesanan
                            Terkirim
                        </div>

                        <div
                            style={cardNumber}
                        >
                            {terkirim}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <div
                            style={cardLabel}
                        >
                            Total Biaya
                            Kurir
                        </div>

                        <div
                            style={cardNumber}
                        >
                            Rp{" "}
                            {totalFee.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* TABLE CARD */}
                <div
                    style={{
                        background:
                            "linear-gradient(180deg,#132544 0%,#101d35 100%)",
                        borderRadius:
                            "22px",
                        overflow: "hidden",
                        border:
                            "1px solid rgba(255,255,255,0.05)",
                        boxShadow:
                            "0 10px 35px rgba(0,0,0,0.28)",
                    }}
                >
                    {/* TABLE HEADER */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "1fr 2fr 1fr 1fr",
                            padding:
                                "18px 24px",
                            background:
                                "rgba(59,130,246,0.12)",
                            borderBottom:
                                "1px solid rgba(255,255,255,0.05)",
                            fontWeight:
                                "700",
                            color:
                                "#dbeafe",
                            fontSize:
                                "13px",
                            letterSpacing:
                                "0.4px",
                        }}
                    >
                        <div>Waktu</div>
                        <div>Klien</div>
                        <div>Status</div>
                        <div>Total</div>
                    </div>

                    {/* TABLE BODY */}
                    {orders.map(
                        (o, idx) => (
                            <div
                                key={o.id}
                                style={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        "1fr 2fr 1fr 1fr",
                                    padding:
                                        "18px 24px",
                                    alignItems:
                                        "center",
                                    borderBottom:
                                        idx !==
                                        orders.length -
                                            1
                                            ? "1px solid rgba(255,255,255,0.05)"
                                            : "none",
                                    transition:
                                        "0.25s",
                                }}
                            >
                                {/* WAKTU */}
                                <div
                                    style={{
                                        color:
                                            "#93c5fd",
                                        fontSize:
                                            "14px",
                                        fontWeight:
                                            "600",
                                    }}
                                >
                                    {
                                        o.delivery_time
                                    }
                                </div>

                                {/* CLIENT */}
                                <div>
                                    <div
                                        style={{
                                            color:
                                                "#ffffff",
                                            fontSize:
                                                "14px",
                                            fontWeight:
                                                "600",
                                            marginBottom:
                                                "4px",
                                        }}
                                    >
                                        {
                                            o.client
                                                ?.name
                                        }
                                    </div>

                                    <div
                                        style={{
                                            color:
                                                "#94a3b8",
                                            fontSize:
                                                "13px",
                                        }}
                                    >
                                        {
                                            o.quantity
                                        }{" "}
                                        porsi
                                    </div>
                                </div>

                                {/* STATUS */}
                                <div>
                                    <span
                                        style={{
                                            padding:
                                                "8px 14px",
                                            borderRadius:
                                                "999px",
                                            fontSize:
                                                "12px",
                                            fontWeight:
                                                "700",
                                            background:
                                                o.status ===
                                                "delivered"
                                                    ? "rgba(34,197,94,0.16)"
                                                    : "rgba(245,158,11,0.16)",
                                            color:
                                                o.status ===
                                                "delivered"
                                                    ? "#4ade80"
                                                    : "#fbbf24",
                                            border:
                                                o.status ===
                                                "delivered"
                                                    ? "1px solid rgba(34,197,94,0.25)"
                                                    : "1px solid rgba(245,158,11,0.25)",
                                        }}
                                    >
                                        {o.status ===
                                        "delivered"
                                            ? "Terkirim"
                                            : "Menunggu"}
                                    </span>
                                </div>

                                {/* TOTAL */}
                                <div
                                    style={{
                                        color:
                                            "#ffffff",
                                        fontWeight:
                                            "700",
                                        fontSize:
                                            "14px",
                                    }}
                                >
                                    Rp{" "}
                                    {(
                                        o.delivery_fee ||
                                        0
                                    ).toLocaleString()}
                                </div>
                            </div>
                        )
                    )}

                    {/* EMPTY */}
                    {orders.length ===
                        0 && (
                        <div
                            style={{
                                padding:
                                    "60px 20px",
                                textAlign:
                                    "center",
                                color:
                                    "#94a3b8",
                                fontSize:
                                    "15px",
                            }}
                        >
                            Tidak ada laporan
                            hari ini
                        </div>
                    )}
                </div>
            </div>
        </KurirLayout>
    );
}

const cardStyle = {
    background:
        "linear-gradient(135deg,#17306a 0%,#1d4ed8 100%)",
    borderRadius: "20px",
    padding: "24px",
    border:
        "1px solid rgba(255,255,255,0.05)",
    boxShadow:
        "0 10px 30px rgba(0,0,0,0.25)",
};

const cardLabel = {
    fontSize: "13px",
    color: "#cbd5e1",
    marginBottom: "12px",
    fontWeight: "600",
    letterSpacing: "0.4px",
};

const cardNumber = {
    fontSize: "30px",
    fontWeight: "800",
    color: "#ffffff",
};