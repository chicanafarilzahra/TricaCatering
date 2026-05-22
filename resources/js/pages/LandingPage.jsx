// resources/js/pages/LandingPage.jsx

import React from "react";
import { Link } from "react-router-dom";

import {
    FaStore,
    FaTruck,
    FaUtensils,
    FaClipboardList,
    FaUsers,
    FaBoxes,
} from "react-icons/fa";

export default function LandingPage() {
    return (
        <div
            style={{
                width: "100%",
                minHeight: "100vh",
                background:
                    "linear-gradient(180deg,#071028,#0f172a,#111827)",
                overflowX: "hidden",
                color: "white",
            }}
        >
            {/* NAVBAR */}
            <div
                style={{
                    width: "100%",
                    padding: "22px 7%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxSizing: "border-box",
                    borderBottom:
                        "1px solid rgba(255,255,255,0.05)",
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    backdropFilter: "blur(14px)",
                    background:
                        "rgba(7,16,40,0.7)",
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontSize: "28px",
                        fontWeight: "800",
                    }}
                >
                    TriCa Catering
                </h2>

                <div
                    style={{
                        display: "flex",
                        gap: "14px",
                    }}
                >
                    <Link
                        to="/login"
                        style={{
                            padding:
                                "11px 24px",
                            borderRadius:
                                "12px",
                            background:
                                "rgba(255,255,255,0.08)",
                            color: "white",
                            textDecoration:
                                "none",
                            fontWeight:
                                "600",
                        }}
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        style={{
                            padding:
                                "11px 24px",
                            borderRadius:
                                "12px",
                            background:
                                "linear-gradient(135deg,#2563eb,#3b82f6)",
                            color: "white",
                            textDecoration:
                                "none",
                            fontWeight:
                                "700",
                            boxShadow:
                                "0 10px 30px rgba(37,99,235,0.35)",
                        }}
                    >
                        Register
                    </Link>
                </div>
            </div>

            {/* HERO */}
            <section
                style={{
                    width: "100%",
                    padding:
                        "120px 7% 100px",
                    boxSizing: "border-box",
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(320px,1fr))",
                    gap: "50px",
                    alignItems: "center",
                }}
            >
                {/* LEFT */}
                <div>
                    <div
                        style={{
                            display: "inline-block",
                            padding:
                                "10px 18px",
                            borderRadius:
                                "999px",
                            background:
                                "rgba(59,130,246,0.15)",
                            color: "#60a5fa",
                            fontSize: "14px",
                            fontWeight:
                                "700",
                            marginBottom:
                                "24px",
                        }}
                    >
                        Sistem Catering Modern
                    </div>

                    <h1
                        style={{
                            margin: 0,
                            fontSize: "62px",
                            lineHeight:
                                "1.1",
                            fontWeight:
                                "900",
                        }}
                    >
                        Kelola Bisnis
                        Catering Lebih
                        Mudah & Modern
                    </h1>

                    <p
                        style={{
                            marginTop:
                                "26px",
                            fontSize: "18px",
                            color:
                                "#94a3b8",
                            lineHeight:
                                "1.8",
                            maxWidth:
                                "650px",
                        }}
                    >
                        TriCa Catering
                        membantu owner,
                        kurir, operator
                        SPPG, dan customer
                        dalam mengelola
                        pesanan catering
                        secara cepat,
                        praktis, dan
                        terorganisir.
                    </p>

                    <div
                        style={{
                            display: "flex",
                            flexWrap:
                                "wrap",
                            gap: "18px",
                            marginTop:
                                "36px",
                        }}
                    >
                        <Link
                            to="/register"
                            style={{
                                padding:
                                    "16px 34px",
                                borderRadius:
                                    "14px",
                                background:
                                    "linear-gradient(135deg,#2563eb,#3b82f6)",
                                color: "white",
                                textDecoration:
                                    "none",
                                fontWeight:
                                    "700",
                                boxShadow:
                                    "0 14px 35px rgba(37,99,235,0.35)",
                            }}
                        >
                            Daftarkan
                            Catering Anda
                        </Link>

                        <Link
                            to="/login"
                            style={{
                                padding:
                                    "16px 34px",
                                borderRadius:
                                    "14px",
                                background:
                                    "rgba(255,255,255,0.08)",
                                color: "white",
                                textDecoration:
                                    "none",
                                fontWeight:
                                    "700",
                            }}
                        >
                            Pesan Catering
                        </Link>
                    </div>
                </div>

                {/* RIGHT */}
                <div
                    style={{
                        background:
                            "linear-gradient(145deg,#182338,#111827)",
                        borderRadius:
                            "32px",
                        padding: "40px",
                        border:
                            "1px solid rgba(255,255,255,0.06)",
                        boxShadow:
                            "0 20px 60px rgba(0,0,0,0.45)",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(2,1fr)",
                            gap: "18px",
                        }}
                    >
                        <StatCard
                            icon={
                                <FaUsers />
                            }
                            title="Customer"
                            value="500+"
                        />

                        <StatCard
                            icon={
                                <FaTruck />
                            }
                            title="Kurir"
                            value="120+"
                        />

                        <StatCard
                            icon={
                                <FaStore />
                            }
                            title="Owner"
                            value="80+"
                        />

                        <StatCard
                            icon={
                                <FaBoxes />
                            }
                            title="Pesanan"
                            value="1K+"
                        />
                    </div>
                </div>
            </section>

            {/* ABOUT */}
            <section
                style={{
                    padding:
                        "90px 7%",
                    boxSizing:
                        "border-box",
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        marginBottom:
                            "60px",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "44px",
                            marginBottom:
                                "18px",
                        }}
                    >
                        Apa Itu TriCa
                        Catering?
                    </h2>

                    <p
                        style={{
                            color:
                                "#94a3b8",
                            maxWidth:
                                "850px",
                            margin:
                                "0 auto",
                            lineHeight:
                                "1.9",
                            fontSize:
                                "17px",
                        }}
                    >
                        TriCa Catering
                        adalah platform
                        digital untuk
                        membantu proses
                        pemesanan,
                        produksi, dan
                        distribusi
                        catering agar
                        lebih cepat,
                        aman, dan mudah
                        dipantau.
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(280px,1fr))",
                        gap: "24px",
                    }}
                >
                    <FeatureCard
                        icon={
                            <FaUtensils />
                        }
                        title="Pemesanan Mudah"
                        desc="Customer dapat memesan catering dengan cepat dan praktis."
                    />

                    <FeatureCard
                        icon={
                            <FaClipboardList />
                        }
                        title="Monitoring Produksi"
                        desc="Pantau seluruh proses produksi catering secara real-time."
                    />

                    <FeatureCard
                        icon={
                            <FaTruck />
                        }
                        title="Pengiriman Cepat"
                        desc="Kurir dapat melihat jadwal dan rute pengiriman dengan mudah."
                    />
                </div>
            </section>

            {/* ROLE SECTION */}
            <section
                style={{
                    padding:
                        "20px 7% 100px",
                    boxSizing:
                        "border-box",
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        fontSize: "44px",
                        marginBottom:
                            "60px",
                    }}
                >
                    Bergabung Bersama
                    Kami
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(300px,1fr))",
                        gap: "26px",
                    }}
                >
                    <RoleCard
                        icon={
                            <FaStore />
                        }
                        title="Untuk Owner Catering"
                        desc="Kelola menu, pesanan, produksi, stok, dan laporan bisnis catering Anda dalam satu sistem."
                        button="Daftar Sebagai Owner"
                    />

                    <RoleCard
                        icon={
                            <FaTruck />
                        }
                        title="Untuk Kurir"
                        desc="Lihat jadwal pengiriman, rute harian, dan laporan pengantaran secara praktis."
                        button="Gabung Sebagai Kurir"
                    />

                    <RoleCard
                        icon={
                            <FaClipboardList />
                        }
                        title="Untuk Operator SPPG"
                        desc="Kelola distribusi dan monitoring data SPPG dengan sistem yang terintegrasi."
                        button="Daftar Operator SPPG"
                    />
                </div>
            </section>

            {/* FOOTER */}
            <footer
                style={{
                    padding:
                        "35px 7%",
                    borderTop:
                        "1px solid rgba(255,255,255,0.05)",
                    textAlign: "center",
                    color: "#94a3b8",
                    fontSize: "14px",
                }}
            >
                © 2026 TriCa Catering —
                Modern Catering
                Management System
            </footer>
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
                background:
                    "rgba(255,255,255,0.05)",
                borderRadius:
                    "20px",
                padding: "24px",
            }}
        >
            <div
                style={{
                    fontSize: "28px",
                    color: "#60a5fa",
                    marginBottom:
                        "16px",
                }}
            >
                {icon}
            </div>

            <div
                style={{
                    color: "#94a3b8",
                    marginBottom:
                        "8px",
                }}
            >
                {title}
            </div>

            <div
                style={{
                    fontSize: "30px",
                    fontWeight: "800",
                }}
            >
                {value}
            </div>
        </div>
    );
}

function FeatureCard({
    icon,
    title,
    desc,
}) {
    return (
        <div
            style={{
                background: "#182338",
                padding: "34px",
                borderRadius: "24px",
                border:
                    "1px solid rgba(255,255,255,0.05)",
            }}
        >
            <div
                style={{
                    width: "70px",
                    height: "70px",
                    borderRadius:
                        "18px",
                    background:
                        "rgba(59,130,246,0.15)",
                    display: "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "center",
                    fontSize: "28px",
                    color: "#60a5fa",
                    marginBottom:
                        "22px",
                }}
            >
                {icon}
            </div>

            <h3
                style={{
                    marginBottom:
                        "14px",
                    fontSize: "24px",
                }}
            >
                {title}
            </h3>

            <p
                style={{
                    color: "#94a3b8",
                    lineHeight:
                        "1.8",
                }}
            >
                {desc}
            </p>
        </div>
    );
}

function RoleCard({
    icon,
    title,
    desc,
    button,
}) {
    return (
        <div
            style={{
                background:
                    "linear-gradient(145deg,#182338,#111827)",
                borderRadius:
                    "28px",
                padding: "38px",
                border:
                    "1px solid rgba(255,255,255,0.06)",
                boxShadow:
                    "0 18px 50px rgba(0,0,0,0.35)",
            }}
        >
            <div
                style={{
                    width: "74px",
                    height: "74px",
                    borderRadius:
                        "22px",
                    background:
                        "rgba(59,130,246,0.15)",
                    display: "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "center",
                    fontSize: "30px",
                    color: "#60a5fa",
                    marginBottom:
                        "24px",
                }}
            >
                {icon}
            </div>

            <h3
                style={{
                    fontSize: "28px",
                    marginBottom:
                        "16px",
                }}
            >
                {title}
            </h3>

            <p
                style={{
                    color: "#94a3b8",
                    lineHeight:
                        "1.9",
                    marginBottom:
                        "30px",
                }}
            >
                {desc}
            </p>

            <Link
                to="/register"
                style={{
                    display:
                        "inline-block",
                    padding:
                        "14px 26px",
                    borderRadius:
                        "14px",
                    background:
                        "linear-gradient(135deg,#2563eb,#3b82f6)",
                    color: "white",
                    textDecoration:
                        "none",
                    fontWeight:
                        "700",
                }}
            >
                {button}
            </Link>
        </div>
    );
}