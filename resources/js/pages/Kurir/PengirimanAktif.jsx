// resources/js/pages/Kurir/PengirimanAktif.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTruck, FaMoneyBillWave, FaBell, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import SidebarKurir from "../../components/SidebarKurir";

const T = {
    bg:       "#060D1F",
    surface:  "#0C1529",
    card:     "#101D35",
    border:   "rgba(255,255,255,0.06)",
    borderMd: "rgba(255,255,255,0.10)",
    text:     "#F0F4FF",
    sub:      "#8B9FC0",
    muted:    "#3D5070",
    blue:     "#3B82F6",
    blueGlow: "rgba(59,130,246,0.15)",
    green:    "#22C55E",
    amber:    "#F59E0B",
    font:     "'Inter', system-ui, -apple-system, sans-serif",
};

function StatCard({ title, value, icon, accentColor, bar }) {
    return (
        <div style={{
            background: T.card,
            border: `0.5px solid ${T.border}`,
            borderRadius: "14px",
            padding: "20px 22px",
            position: "relative",
            overflow: "hidden",
            flex: 1,
            minWidth: 0,
            fontFamily: T.font,
        }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: bar }} />
            <div style={{
                position: "absolute", top: "-30px", right: "-30px",
                width: "90px", height: "90px", borderRadius: "50%",
                background: accentColor + "18", filter: "blur(24px)",
                pointerEvents: "none",
            }} />
            <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: accentColor + "18",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: accentColor, fontSize: "16px", marginBottom: "16px",
                }}>
                    {icon}
                </div>
                <div style={{
                    fontSize: "11px", fontWeight: 600, color: T.muted,
                    textTransform: "uppercase", letterSpacing: ".7px", marginBottom: "6px",
                }}>
                    {title}
                </div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: T.text, letterSpacing: "-1px", lineHeight: 1 }}>
                    {value}
                </div>
            </div>
        </div>
    );
}

export default function PengirimanAktif({ onLogout }) {
    const [orders,  setOrders]  = useState([]);
    const [user,    setUser]    = useState(null);
    const [loading, setLoading] = useState({}); // { [orderId]: 'depart' | 'done' | null }
    const navigate = useNavigate();

    const fetchOrders = () => {
        axios.get("/kurir/orders")
            .then((res) => setOrders(res.data.data))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
        fetchOrders();
    }, []);

    // Tampilkan order dispatched (belum berangkat) DAN on_delivery (sedang jalan)
    const activeOrders = orders.filter((o) =>
        o.status === "dispatched" || o.status === "on_delivery"
    );
    const totalBiaya = activeOrders.reduce((sum, o) => sum + (o.courier_fee || 0), 0);

    // Kurir klik "Menuju Lokasi" — dispatched → on_delivery
    const handleMenujuLokasi = async (order) => {
        setLoading((prev) => ({ ...prev, [order.id]: "depart" }));
        try {
            await axios.put(`/kurir/orders/${order.id}/mulai-antar`);
            fetchOrders(); // refresh agar badge status berubah
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Gagal memulai pengiriman.");
        } finally {
            setLoading((prev) => ({ ...prev, [order.id]: null }));
        }
    };

    // Kurir klik "Selesai" — on_delivery → delivered, lalu redirect laporan harian
    const handleSelesai = async (order) => {
        if (!window.confirm(`Tandai pengiriman ke ${order.customer_name} sebagai selesai?`)) return;
        setLoading((prev) => ({ ...prev, [order.id]: "done" }));
        try {
            await axios.put(`/kurir/orders/${order.id}/update-status`, {
                status: "delivered",
            });
            // Langsung ke halaman laporan harian yang sudah ada
            navigate("/kurir/laporan");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Gagal menyelesaikan pengiriman.");
            setLoading((prev) => ({ ...prev, [order.id]: null }));
        }
    };

    // Render tombol aksi berdasarkan status order
    const renderAksi = (o) => {
        const isLoadingDepart = loading[o.id] === "depart";
        const isLoadingDone   = loading[o.id] === "done";

        if (o.status === "dispatched") {
            return (
                <button
                    onClick={() => handleMenujuLokasi(o)}
                    disabled={isLoadingDepart}
                    style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        padding: "7px 14px", borderRadius: "8px",
                        background: isLoadingDepart
                            ? T.muted
                            : "linear-gradient(135deg,#3B82F6,#6366F1)",
                        border: "none",
                        color: "#fff", fontSize: "12px", fontWeight: 700,
                        cursor: isLoadingDepart ? "not-allowed" : "pointer",
                        whiteSpace: "nowrap",
                        opacity: isLoadingDepart ? 0.7 : 1,
                        transition: "opacity 0.15s",
                        fontFamily: T.font,
                    }}
                >
                    <FaMapMarkerAlt style={{ fontSize: "11px" }} />
                    {isLoadingDepart ? "Memulai..." : "Menuju Lokasi"}
                </button>
            );
        }

        if (o.status === "on_delivery") {
            return (
                <button
                    onClick={() => handleSelesai(o)}
                    disabled={isLoadingDone}
                    style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        padding: "7px 14px", borderRadius: "8px",
                        background: isLoadingDone
                            ? T.muted
                            : "linear-gradient(135deg,#22C55E,#10B981)",
                        border: "none",
                        color: "#fff", fontSize: "12px", fontWeight: 700,
                        cursor: isLoadingDone ? "not-allowed" : "pointer",
                        whiteSpace: "nowrap",
                        opacity: isLoadingDone ? 0.7 : 1,
                        transition: "opacity 0.15s",
                        fontFamily: T.font,
                    }}
                >
                    <FaCheckCircle style={{ fontSize: "11px" }} />
                    {isLoadingDone ? "Menyimpan..." : "Selesai"}
                </button>
            );
        }

        return null;
    };

    // Badge status per row
    const renderStatusBadge = (status) => {
        if (status === "dispatched") {
            return (
                <span style={{
                    display: "inline-flex", alignItems: "center",
                    padding: "4px 11px", borderRadius: "20px",
                    fontSize: "11px", fontWeight: 700,
                    background: "rgba(245,158,11,0.12)",
                    border: "0.5px solid rgba(245,158,11,0.28)",
                    color: "#FCD34D",
                    textTransform: "uppercase", letterSpacing: ".4px",
                }}>
                    Siap Antar
                </span>
            );
        }
        return (
            <span style={{
                display: "inline-flex", alignItems: "center", gap: "5px",
                padding: "4px 11px", borderRadius: "20px",
                fontSize: "11px", fontWeight: 700,
                background: "rgba(59,130,246,0.12)",
                border: "0.5px solid rgba(59,130,246,0.28)",
                color: "#60A5FA",
                textTransform: "uppercase", letterSpacing: ".4px",
            }}>
                <span style={{
                    width: "5px", height: "5px", borderRadius: "50%",
                    background: "#60A5FA", display: "inline-block",
                    animation: "pulseDot 1.6s ease-in-out infinite",
                }} />
                Sedang Dikirim
            </span>
        );
    };

    return (
        <div style={{
            position: "fixed", inset: 0,
            display: "flex", overflow: "hidden",
            background: T.bg, fontFamily: T.font,
        }}>
            {/* SIDEBAR */}
            <div style={{ width: "260px", height: "100%", flexShrink: 0 }}>
                <SidebarKurir onLogout={onLogout} />
            </div>

            {/* MAIN */}
            <div style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

                {/* NAVBAR */}
                <div style={{
                    height: "64px", flexShrink: 0,
                    background: T.surface,
                    borderBottom: `0.5px solid ${T.border}`,
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 28px",
                    boxShadow: "0 1px 0 rgba(255,255,255,0.03)",
                }}>
                    <div>
                        <div style={{ fontSize: "11px", fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: ".8px", marginBottom: "2px" }}>
                            Kurir · Aktif
                        </div>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: T.text }}>
                            Pengiriman Aktif
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                            width: "38px", height: "38px", borderRadius: "10px",
                            background: T.card, border: `0.5px solid ${T.borderMd}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", color: T.sub, fontSize: "16px",
                            position: "relative",
                        }}>
                            <FaBell />
                            {activeOrders.length > 0 && (
                                <span style={{
                                    position: "absolute", top: "7px", right: "7px",
                                    width: "7px", height: "7px", borderRadius: "50%",
                                    background: T.blue, boxShadow: `0 0 6px ${T.blue}`,
                                }} />
                            )}
                        </div>
                        <div style={{
                            width: "38px", height: "38px", borderRadius: "10px",
                            background: "linear-gradient(135deg,#3B82F6,#6366F1)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "14px", fontWeight: 700, color: "#fff",
                        }}>
                            {user?.name?.charAt(0)?.toUpperCase() || "K"}
                        </div>
                    </div>
                </div>

                {/* CONTENT */}
                <div style={{
                    flex: 1, overflowY: "auto", overflowX: "hidden",
                    padding: "28px 28px 40px",
                    background: T.bg,
                }}>

                    {/* Hero strip */}
                    <div style={{
                        position: "relative",
                        borderRadius: "16px",
                        padding: "24px 28px",
                        background: T.surface,
                        border: `0.5px solid ${T.border}`,
                        marginBottom: "20px",
                        overflow: "hidden",
                    }}>
                        <div style={{
                            position: "absolute", top: "-40px", right: "40px",
                            width: "200px", height: "200px", borderRadius: "50%",
                            background: "rgba(59,130,246,0.08)", filter: "blur(60px)",
                            pointerEvents: "none",
                        }} />
                        <div style={{ position: "relative", zIndex: 1 }}>
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: "6px",
                                padding: "4px 12px", borderRadius: "999px",
                                background: T.blueGlow,
                                border: "0.5px solid rgba(59,130,246,0.25)",
                                color: "#60A5FA", fontSize: "11px", fontWeight: 700,
                                letterSpacing: ".5px", textTransform: "uppercase",
                                marginBottom: "10px",
                            }}>
                                <span style={{
                                    width: "5px", height: "5px", borderRadius: "50%",
                                    background: "#60A5FA", display: "inline-block",
                                    animation: activeOrders.length > 0 ? "pulseDot 1.6s ease-in-out infinite" : "none",
                                }} />
                                Live
                            </div>
                            <div style={{ fontSize: "22px", fontWeight: 800, color: T.text, letterSpacing: "-.5px", lineHeight: 1.2 }}>
                                {activeOrders.length > 0
                                    ? <>{activeOrders.length} pengiriman <span style={{ color: "#60A5FA" }}>sedang berjalan</span></>
                                    : <>Tidak ada pengiriman yang <span style={{ color: "#60A5FA" }}>sedang berjalan</span></>
                                }
                            </div>
                            <div style={{ marginTop: "6px", fontSize: "13px", color: T.sub }}>
                                Pantau seluruh pengiriman yang sedang berlangsung hari ini
                            </div>
                        </div>
                    </div>

                    {/* Stat Cards */}
                    <div style={{ display: "flex", gap: "14px", marginBottom: "22px" }}>
                        <StatCard
                            title="Pengiriman Aktif"
                            value={activeOrders.length}
                            icon={<FaTruck />}
                            accentColor="#3B82F6"
                            bar="linear-gradient(90deg,#3B82F6,#6366F1)"
                        />
                        <StatCard
                            title="Total Biaya"
                            value={`Rp ${totalBiaya.toLocaleString("id-ID")}`}
                            icon={<FaMoneyBillWave />}
                            accentColor="#A855F7"
                            bar="linear-gradient(90deg,#A855F7,#6366F1)"
                        />
                    </div>

                    {/* Table */}
                    <div style={{
                        background: T.surface,
                        border: `0.5px solid ${T.border}`,
                        borderRadius: "16px",
                        overflow: "hidden",
                    }}>
                        <div style={{
                            padding: "18px 24px",
                            borderBottom: `0.5px solid ${T.border}`,
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                        }}>
                            <div>
                                <div style={{ fontSize: "15px", fontWeight: 700, color: T.text }}>Daftar Pengiriman Aktif</div>
                                <div style={{ fontSize: "12px", color: T.muted, marginTop: "2px" }}>
                                    Pesanan yang siap diantar dan sedang dalam perjalanan
                                </div>
                            </div>
                            <div style={{
                                padding: "5px 12px", borderRadius: "8px",
                                background: T.blueGlow,
                                border: "0.5px solid rgba(59,130,246,0.25)",
                                fontSize: "12px", fontWeight: 700, color: "#60A5FA",
                            }}>
                                {activeOrders.length} Aktif
                            </div>
                        </div>

                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "820px" }}>
                                <thead>
                                    <tr>
                                        {["No", "Klien", "Pesanan", "Alamat", "Waktu", "Status", "Biaya", "Aksi"].map((h) => (
                                            <th key={h} style={{
                                                padding: "11px 20px",
                                                textAlign: "left",
                                                fontSize: "11px", fontWeight: 600,
                                                color: T.muted,
                                                textTransform: "uppercase", letterSpacing: ".6px",
                                                borderBottom: `0.5px solid ${T.border}`,
                                                whiteSpace: "nowrap",
                                            }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} style={{
                                                padding: "56px 20px",
                                                textAlign: "center",
                                                color: T.muted, fontSize: "13px",
                                            }}>
                                                <div style={{
                                                    width: "48px", height: "48px", borderRadius: "14px",
                                                    background: T.card, border: `0.5px solid ${T.border}`,
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    color: T.muted, fontSize: "20px",
                                                    margin: "0 auto 12px",
                                                }}>
                                                    <FaTruck />
                                                </div>
                                                Tidak ada pengiriman aktif
                                            </td>
                                        </tr>
                                    ) : (
                                        activeOrders.map((o, idx) => (
                                            <tr
                                                key={o.id}
                                                style={{
                                                    borderBottom: `0.5px solid rgba(255,255,255,0.03)`,
                                                    transition: "background 0.15s",
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                            >
                                                <td style={{ padding: "14px 20px", color: T.muted, fontSize: "13px", position: "relative" }}>
                                                    <div style={{
                                                        position: "absolute", left: 0, top: "20%", bottom: "20%",
                                                        width: "2px", borderRadius: "2px",
                                                        background: o.status === "on_delivery" ? T.blue : T.amber,
                                                        boxShadow: `0 0 8px ${o.status === "on_delivery" ? T.blue : T.amber}`,
                                                    }} />
                                                    {idx + 1}
                                                </td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    <div style={{ fontWeight: 600, color: T.text, fontSize: "13px" }}>
                                                        {o.customer_name || "—"}
                                                    </div>
                                                </td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    <div style={{ fontSize: "13px", color: T.text, fontWeight: 500 }}>
                                                        {o.menu?.name || "—"}
                                                    </div>
                                                    <div style={{ fontSize: "11px", color: T.muted, marginTop: "2px" }}>
                                                        {o.quantity} porsi
                                                    </div>
                                                </td>
                                                <td style={{
                                                    padding: "14px 20px", fontSize: "13px", color: T.sub,
                                                    maxWidth: "200px", overflow: "hidden",
                                                    textOverflow: "ellipsis", whiteSpace: "nowrap",
                                                }}>
                                                    {o.address || "—"}
                                                </td>
                                                <td style={{ padding: "14px 20px", fontSize: "13px", color: T.sub, whiteSpace: "nowrap" }}>
                                                    {o.jam ? String(o.jam).substring(0, 5) : "—"}
                                                </td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    {renderStatusBadge(o.status)}
                                                </td>
                                                <td style={{ padding: "14px 20px", fontSize: "13px", fontWeight: 700, color: "#34D399", whiteSpace: "nowrap" }}>
                                                    Rp {(o.courier_fee || 0).toLocaleString("id-ID")}
                                                </td>
                                                <td style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>
                                                    {renderAksi(o)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulseDot { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
            `}</style>
        </div>
    );
}