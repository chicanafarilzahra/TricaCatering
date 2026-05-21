// resources/js/pages/Kurir/PengirimanAktif.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

import KurirLayout from "../../layouts/KurirLayout";

export default function PengirimanAktif({
    onLogout,
}) {
    const [orders, setOrders] =
        useState([]);

    useEffect(() => {
        axios
            .get("/api/kurir/orders")
            .then((res) =>
                setOrders(
                    res.data.filter(
                        (o) =>
                            o.status ===
                            "on_delivery"
                    )
                )
            )
            .catch((err) =>
                console.error(err)
            );
    }, []);

    return (
        <KurirLayout
            title="Pengiriman Aktif"
            onLogout={onLogout}
        >
            {/* HEADER */}
            <div
                style={{
                    marginBottom: "28px",
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        fontSize: "30px",
                        fontWeight: "700",
                        color: "#ffffff",
                    }}
                >
                    Pengiriman Aktif
                </h1>

                <p
                    style={{
                        marginTop: "10px",
                        color: "#94a3b8",
                        fontSize: "15px",
                    }}
                >
                    Daftar pengiriman yang
                    sedang berjalan hari
                    ini
                </p>
            </div>

            {/* EMPTY */}
            {orders.length === 0 ? (
                <div
                    style={{
                        background:
                            "#132544",
                        padding: "30px",
                        borderRadius:
                            "18px",
                        color: "#cbd5e1",
                        fontSize: "15px",
                        boxShadow:
                            "0 10px 25px rgba(0,0,0,0.25)",
                        border:
                            "1px solid rgba(255,255,255,0.05)",
                    }}
                >
                    Pengiriman pagi
                    sudah selesai semua.
                    Pengiriman siang
                    dimulai pukul 12:00.
                </div>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection:
                            "column",
                        gap: "18px",
                    }}
                >
                    {orders.map(
                        (o, idx) => (
                            <div
                                key={
                                    o.id
                                }
                                style={{
                                    background:
                                        "#132544",
                                    borderRadius:
                                        "18px",
                                    padding:
                                        "22px",
                                    display:
                                        "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "center",
                                    boxShadow:
                                        "0 10px 25px rgba(0,0,0,0.25)",
                                    border:
                                        "1px solid rgba(255,255,255,0.05)",
                                    flexWrap:
                                        "wrap",
                                    gap: "15px",
                                }}
                            >
                                {/* LEFT */}
                                <div>
                                    <div
                                        style={{
                                            fontSize:
                                                "18px",
                                            fontWeight:
                                                "700",
                                            color:
                                                "#ffffff",
                                            marginBottom:
                                                "6px",
                                        }}
                                    >
                                        {idx +
                                            1}
                                        .{" "}
                                        {
                                            o
                                                .menu
                                                ?.name
                                        }
                                    </div>

                                    <div
                                        style={{
                                            color:
                                                "#94a3b8",
                                            fontSize:
                                                "14px",
                                        }}
                                    >
                                        {
                                            o.quantity
                                        }{" "}
                                        porsi
                                    </div>
                                </div>

                                {/* CENTER */}
                                <div
                                    style={{
                                        flex: 1,
                                        minWidth:
                                            "250px",
                                        color:
                                            "#e2e8f0",
                                        fontSize:
                                            "14px",
                                    }}
                                >
                                    {
                                        o
                                            .client
                                            ?.name
                                    }{" "}
                                    —{" "}
                                    {
                                        o.delivery_address
                                    }
                                </div>

                                {/* STATUS */}
                                <div>
                                    <span
                                        style={{
                                            background:
                                                "#f59e0b",
                                            color:
                                                "#fff",
                                            padding:
                                                "8px 16px",
                                            borderRadius:
                                                "999px",
                                            fontSize:
                                                "13px",
                                            fontWeight:
                                                "600",
                                        }}
                                    >
                                        Sedang
                                        Dikirim
                                    </span>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
        </KurirLayout>
    );
}