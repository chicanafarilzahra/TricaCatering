// resources/js/pages/Kurir/JadwalPengiriman.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTruck, FaCheckCircle, FaClock, FaMoneyBillWave, FaBell } from "react-icons/fa";
import SidebarKurir from "../../components/SidebarKurir";

/* ── Design tokens ────────────────────────────────────────────
   Same system as Kurir/Home.jsx — deep navy base, cool slate
   surface, blue accent. Kept identical so both pages read as
   one product instead of two different builds.
─────────────────────────────────────────────────────────────── */
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

/* ── Biaya pengiriman: kolom asli di tabel `orders` adalah
   `courier_fee` (lihat App\Models\Order::$fillable). ── */
function getBiaya(o) {
    return o.courier_fee || 0;
}

function statusMeta(status) {
    switch (status) {
        case "delivered":
            return { label: "Selesai",       bg: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.25)",  color: "#4ADE80" };
        case "on_delivery":
            return { label: "Dikirim",       bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.28)", color: "#60A5FA" };
        case "dispatched":
            // FIX: "dispatched" artinya order sudah ditugaskan & siap diantar,
            // bukan "sedang disiapkan di dapur" (itu status "preparing").
            // Label lama ("Disiapkan") membingungkan — diganti jadi lebih akurat.
            return { label: "Siap Diantar",  bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.28)", color: "#C084FC" };
        default:
            return { label: "Menunggu",      bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", color: "#FCD34D" };
    }
}

/* ── StatCard (mirrors Home.jsx) ─────────────────────────────── */
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

/* ── Main ─────────────────────────────────────────────────── */
export default function JadwalPengiriman({ onLogout }) {
    const [orders, setOrders]     = useState([]);
    const [user,   setUser]       = useState(null);
    const [updatingId, setUpdatingId] = useState(null); // id order yang sedang diupdate (loading state tombol)

    const fetchOrders = () => {
        axios.get("/kurir/orders")
            .then((res) => setOrders(Array.isArray(res.data?.data) ? res.data.data : []))
            .catch((err) => {
                console.error(err);
                setOrders([]);
            });
    };

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));

        // Backend mengembalikan { data: [...] } (lihat KurirController::index()),
        // jadi ambil res.data.data — bukan res.data langsung.
        // Fallback ke [] kalau bentuk response berubah, supaya .filter()/.map()
        // di bawah tidak crash.
        fetchOrders();
    }, []);

    // FIX: transisi status manual dari tabel ini.
    // dispatched -> on_delivery ("Mulai Antar")
    // on_delivery -> delivered  ("Selesai Antar")
    // Catatan: untuk tracking GPS realtime selama perjalanan, gunakan
    // halaman "Rute Hari Ini" — tombol di sini hanya update status saja.
    const handleUpdateStatus = async (order, nextStatus) => {
        if (nextStatus === "delivered" && !window.confirm("Konfirmasi: pesanan sudah diterima klien?")) {
            return;
        }
        setUpdatingId(order.id);
        try {
            await axios.put(`/kurir/orders/${order.id}/update-status`, { status: nextStatus });
            setOrders((prev) =>
                prev.map((o) => (o.id === order.id ? { ...o, status: nextStatus } : o))
            );
        } catch (err) {
            alert(err.response?.data?.message ?? "Gagal memperbarui status.");
        } finally {
            setUpdatingId(null);
        }
    };

    const totalPengiriman = orders.length;
    const selesai         = orders.filter((o) => o.status === "delivered").length;
    const dikirim         = orders.filter((o) => o.status === "on_delivery").length;
    const menunggu        = orders.filter((o) => o.status === "pending").length;
    const totalBiaya      = orders.reduce((sum, o) => sum + getBiaya(o), 0);

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

                {/* ── NAVBAR ── */}
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
                            Kurir · Jadwal
                        </div>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: T.text }}>
                            Jadwal Pengiriman
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
                            {menunggu > 0 && (
                                <span style={{
                                    position: "absolute", top: "7px", right: "7px",
                                    width: "7px", height: "7px", borderRadius: "50%",
                                    background: T.amber, boxShadow: `0 0 6px ${T.amber}`,
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

                {/* ── CONTENT ── */}
                <div style={{
                    flex: 1, overflowY: "auto", overflowX: "hidden",
                    padding: "28px 28px 40px",
                    background: T.bg,
                }}>

                    {/* ── Hero strip ── */}
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
                                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#60A5FA", display: "inline-block" }} />
                                Hari ini
                            </div>
                            <div style={{ fontSize: "22px", fontWeight: 800, color: T.text, letterSpacing: "-.5px", lineHeight: 1.2 }}>
                                {dikirim > 0
                                    ? <>{dikirim} pengiriman <span style={{ color: "#60A5FA" }}>sedang berjalan</span></>
                                    : <>Pantau seluruh jadwal <span style={{ color: "#60A5FA" }}>pengiriman kurir</span></>
                                }
                            </div>
                            <div style={{ marginTop: "6px", fontSize: "13px", color: T.sub }}>
                                {totalPengiriman} total pesanan · {selesai} selesai · {menunggu} menunggu konfirmasi
                            </div>
                        </div>
                    </div>

                    {/* ── 4 Stat Cards ── */}
                    <div style={{ display: "flex", gap: "14px", marginBottom: "22px" }}>
                        <StatCard
                            title="Total Pengiriman"
                            value={totalPengiriman}
                            icon={<FaTruck />}
                            accentColor="#3B82F6"
                            bar="linear-gradient(90deg,#3B82F6,#6366F1)"
                        />
                        <StatCard
                            title="Sedang Dikirim"
                            value={dikirim}
                            icon={<FaClock />}
                            accentColor="#F59E0B"
                            bar="linear-gradient(90deg,#F59E0B,#FBBF24)"
                        />
                        <StatCard
                            title="Selesai"
                            value={selesai}
                            icon={<FaCheckCircle />}
                            accentColor="#22C55E"
                            bar="linear-gradient(90deg,#22C55E,#10B981)"
                        />
                        <StatCard
                            title="Total Biaya"
                            value={`Rp ${totalBiaya.toLocaleString("id-ID")}`}
                            icon={<FaMoneyBillWave />}
                            accentColor="#A855F7"
                            bar="linear-gradient(90deg,#A855F7,#6366F1)"
                        />
                    </div>

                    {/* ── Table ── */}
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
                                <div style={{ fontSize: "15px", fontWeight: 700, color: T.text }}>Delivery Schedule</div>
                                <div style={{ fontSize: "12px", color: T.muted, marginTop: "2px" }}>
                                    Seluruh jadwal pengiriman yang ditugaskan kepada Anda
                                </div>
                            </div>
                            <div style={{
                                padding: "5px 12px", borderRadius: "8px",
                                background: T.blueGlow,
                                border: "0.5px solid rgba(59,130,246,0.25)",
                                fontSize: "12px", fontWeight: 700, color: "#60A5FA",
                            }}>
                                {totalPengiriman} Pesanan
                            </div>
                        </div>

                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "760px" }}>
                                <thead>
                                    <tr>
                                        {["No", "Klien", "Pesanan", "Biaya", "Waktu", "Status", "Aksi"].map((h) => (
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
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} style={{
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
                                                Tidak ada jadwal pengiriman
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map((o, idx) => {
                                            const sm = statusMeta(o.status);
                                            const isActive = o.status === "on_delivery" || o.status === "dispatched";
                                            const isUpdating = updatingId === o.id;
                                            return (
                                                <tr
                                                    key={o.id}
                                                    style={{
                                                        borderBottom: `0.5px solid rgba(255,255,255,0.03)`,
                                                        transition: "background 0.15s",
                                                        position: "relative",
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                                >
                                                    <td style={{ padding: "14px 20px", color: T.muted, fontSize: "13px", position: "relative" }}>
                                                        {isActive && (
                                                            <div style={{
                                                                position: "absolute", left: 0, top: "20%", bottom: "20%",
                                                                width: "2px", borderRadius: "2px",
                                                                background: T.blue,
                                                                boxShadow: `0 0 8px ${T.blue}`,
                                                            }} />
                                                        )}
                                                        {idx + 1}
                                                    </td>
                                                    <td style={{ padding: "14px 20px" }}>
                                                        <div style={{ fontWeight: 600, color: T.text, fontSize: "13px" }}>
                                                            {o.client?.name || "—"}
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
                                                    <td style={{ padding: "14px 20px", fontSize: "13px", fontWeight: 700, color: "#34D399", whiteSpace: "nowrap" }}>
                                                        Rp {getBiaya(o).toLocaleString("id-ID")}
                                                    </td>
                                                    {/* FIX: kolom waktu sebelumnya baca o.delivery_time (field yang
                                                        tidak pernah diisi backend). Backend mengisi field "jam". */}
                                                    <td style={{ padding: "14px 20px", fontSize: "13px", color: T.sub, whiteSpace: "nowrap" }}>
                                                        {o.jam ? String(o.jam).substring(0, 5) : "—"}
                                                    </td>
                                                    <td style={{ padding: "14px 20px" }}>
                                                        <span style={{
                                                            display: "inline-flex", alignItems: "center",
                                                            padding: "4px 11px", borderRadius: "20px",
                                                            fontSize: "11px", fontWeight: 700,
                                                            background: sm.bg,
                                                            border: `0.5px solid ${sm.border}`,
                                                            color: sm.color,
                                                            textTransform: "uppercase", letterSpacing: ".4px",
                                                        }}>
                                                            {sm.label}
                                                        </span>
                                                    </td>
                                                    {/* FIX: tombol aksi sebelumnya hanya muncul untuk status "pending"
                                                        (yang tidak relevan di alur kurir). Sekarang menangani transisi
                                                        nyata: dispatched -> on_delivery -> delivered. */}
                                                    <td style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>
                                                        {o.status === "dispatched" && (
                                                            <button
                                                                disabled={isUpdating}
                                                                onClick={() => handleUpdateStatus(o, "on_delivery")}
                                                                style={{
                                                                    border: "0.5px solid rgba(59,130,246,0.35)",
                                                                    padding: "7px 14px",
                                                                    borderRadius: "8px",
                                                                    background: T.blueGlow,
                                                                    color: "#60A5FA",
                                                                    fontSize: "12px",
                                                                    fontWeight: 700,
                                                                    cursor: isUpdating ? "not-allowed" : "pointer",
                                                                    opacity: isUpdating ? 0.6 : 1,
                                                                    transition: "background 0.15s",
                                                                }}
                                                            >
                                                                {isUpdating ? "Memproses…" : "Mulai Antar"}
                                                            </button>
                                                        )}
                                                        {o.status === "on_delivery" && (
                                                            <button
                                                                disabled={isUpdating}
                                                                onClick={() => handleUpdateStatus(o, "delivered")}
                                                                style={{
                                                                    border: "0.5px solid rgba(34,197,94,0.35)",
                                                                    padding: "7px 14px",
                                                                    borderRadius: "8px",
                                                                    background: "rgba(34,197,94,0.12)",
                                                                    color: "#4ADE80",
                                                                    fontSize: "12px",
                                                                    fontWeight: 700,
                                                                    cursor: isUpdating ? "not-allowed" : "pointer",
                                                                    opacity: isUpdating ? 0.6 : 1,
                                                                    transition: "background 0.15s",
                                                                }}
                                                            >
                                                                {isUpdating ? "Memproses…" : "Selesai Antar"}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}