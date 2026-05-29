import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    FaUtensils,
    FaShoppingCart,
    FaFire,
} from "react-icons/fa";

import SidebarKlien from "../../components/SidebarKlien";
import NavbarKlien from "../../components/NavbarKlien";

export default function PesanMakan() {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("/api/klien/menu")
            .then((res) => {
                setMenus(res.data || []);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handlePesan = async (menuId) => {
        try {
            await axios.post("/api/klien/pesan", {
                menu_id: menuId,
            });

            alert("Pesanan berhasil dibuat");
        } catch (error) {
            console.error(error);
            alert("Gagal membuat pesanan");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                background: "#020b2d",
            }}
        >
            {/* SIDEBAR */}
            <SidebarKlien />

            {/* MAIN */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                }}
            >
                {/* NAVBAR */}
                <NavbarKlien title="Pesan Makanan" />

                {/* CONTENT */}
                <div
                    style={{
                        flex: 1,
                        padding: "32px",
                        overflowY: "auto",
                    }}
                >
                    {/* HEADER */}
                    <div style={{ marginBottom: "28px" }}>
                        <h1
                            style={{
                                color: "#ffffff",
                                fontSize: "58px",
                                fontWeight: "800",
                                marginBottom: "10px",
                                lineHeight: 1,
                            }}
                        >
                            Pilih Menu Catering
                        </h1>

                        <p
                            style={{
                                color: "#94a3b8",
                                fontSize: "18px",
                                margin: 0,
                            }}
                        >
                            Pilih menu makanan favorit Anda hari ini
                        </p>
                    </div>

                    {/* LOADING */}
                    {loading && (
                        <div
                            style={{
                                color: "#94a3b8",
                                fontSize: "16px",
                            }}
                        >
                            Memuat data menu...
                        </div>
                    )}

                    {/* EMPTY */}
                    {!loading && menus.length === 0 && (
                        <div
                            style={{
                                background: "#182338",
                                borderRadius: "28px",
                                padding: "50px",
                                textAlign: "center",
                                color: "#94a3b8",
                                border:
                                    "1px solid rgba(255,255,255,0.05)",
                            }}
                        >
                            Tidak ada menu tersedia
                        </div>
                    )}

                    {/* GRID */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fill,minmax(320px,1fr))",
                            gap: "26px",
                        }}
                    >
                        {menus.map((menu) => (
                            <div
                                key={menu.id}
                                style={{
                                    background: "#182338",
                                    borderRadius: "28px",
                                    overflow: "hidden",
                                    border:
                                        "1px solid rgba(255,255,255,0.05)",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {/* IMAGE */}
                                <div
                                    style={{
                                        height: "220px",
                                        position: "relative",
                                        overflow: "hidden",
                                        background:
                                            "linear-gradient(135deg,#17306a,#2563eb)",
                                    }}
                                >
                                    {menu.image ? (
                                        <img
                                            src={`/storage/${menu.image}`}
                                            alt={menu.name}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#fff",
                                                fontSize: "60px",
                                            }}
                                        >
                                            <FaUtensils />
                                        </div>
                                    )}

                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "16px",
                                            right: "16px",
                                            background:
                                                "rgba(255,255,255,0.12)",
                                            backdropFilter: "blur(12px)",
                                            padding: "10px 14px",
                                            borderRadius: "14px",
                                            color: "#fff",
                                            fontSize: "13px",
                                            fontWeight: "700",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <FaFire />
                                        Fresh Menu
                                    </div>
                                </div>

                                {/* BODY */}
                                <div
                                    style={{
                                        padding: "24px",
                                        display: "flex",
                                        flexDirection: "column",
                                        flex: 1,
                                    }}
                                >
                                    <h3
                                        style={{
                                            color: "#fff",
                                            fontSize: "24px",
                                            fontWeight: "700",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        {menu.name}
                                    </h3>

                                    <p
                                        style={{
                                            color: "#94a3b8",
                                            fontSize: "15px",
                                            lineHeight: 1.7,
                                            flex: 1,
                                        }}
                                    >
                                        {menu.description ||
                                            "Menu catering sehat dan lezat untuk kebutuhan harian Anda."}
                                    </p>

                                    {/* FOOTER */}
                                    <div
                                        style={{
                                            marginTop: "22px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div>
                                            <div
                                                style={{
                                                    color: "#94a3b8",
                                                    fontSize: "13px",
                                                    marginBottom: "4px",
                                                }}
                                            >
                                                Harga
                                            </div>

                                            <div
                                                style={{
                                                    color: "#fff",
                                                    fontSize: "28px",
                                                    fontWeight: "800",
                                                }}
                                            >
                                                Rp{" "}
                                                {Number(
                                                    menu.price || 0
                                                ).toLocaleString("id-ID")}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() =>
                                                handlePesan(menu.id)
                                            }
                                            style={{
                                                border: "none",
                                                cursor: "pointer",
                                                padding: "15px 20px",
                                                borderRadius: "18px",
                                                background:
                                                    "linear-gradient(90deg,#2563eb,#3b82f6)",
                                                color: "#fff",
                                                fontWeight: "700",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                fontSize: "15px",
                                            }}
                                        >
                                            <FaShoppingCart />
                                            Pesan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}