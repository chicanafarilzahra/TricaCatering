// resources/js/pages/Kurir/LaporanHarian.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTruck, FaCheckCircle, FaMoneyBillWave, FaClock, FaBell, FaCamera } from "react-icons/fa";
import SidebarKurir from "../../components/SidebarKurir";

/* ── Design tokens — same system as Home.jsx / JadwalPengiriman.jsx ── */
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
    red:      "#EF4444",
    font:     "'Inter', system-ui, -apple-system, sans-serif",
};

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

/* ── Form field (modal) ──────────────────────────────────────── */
const labelStyle = {
    display: "block", marginBottom: "7px",
    color: T.sub, fontSize: "12px", fontWeight: 600,
    textTransform: "uppercase", letterSpacing: ".4px",
};
const inputStyle = {
    width: "100%", height: "44px", borderRadius: "10px",
    border: `0.5px solid ${T.borderMd}`,
    background: T.bg, color: T.text,
    padding: "0 14px", outline: "none",
    fontSize: "13px", fontFamily: T.font,
    boxSizing: "border-box",
};

const FormField = ({ label, name, type = "text", value, onChange }) => (
    <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>{label}</label>
        <input type={type} name={name} value={value} onChange={onChange} style={inputStyle} />
    </div>
);

/* ── Hide native scrollbar, scoped to this modal only ───────── */
const hideScrollbarStyle = `
  .laporan-modal-scroll::-webkit-scrollbar { display: none; }
`;

/* ── Main ─────────────────────────────────────────────────── */
export default function LaporanHarian({ onLogout }) {
    const [orders, setOrders]     = useState([]);
    const [user, setUser]         = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        customer: "",
        pesanan: "",
        quantity: "",
        waktu: "",
        diterima: true,
        alasan: "",
        foto: null,
    });

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
        fetchLaporan();
    }, []);

    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = hideScrollbarStyle;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const fetchLaporan = async () => {
        try {
            const res = await axios.get("/kurir/laporan_harian");
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const totalOrder = orders.length;
    const terkirim    = orders.filter((o) => o.diterima).length;
    const pending      = orders.filter((o) => !o.diterima).length;
    const totalFee     = orders.reduce((acc, o) => acc + (o.delivery_fee || 0), 0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (file) setFormData((prev) => ({ ...prev, foto: file }));
    };

    const handleSubmit = async () => {
        try {
            const fd = new FormData();
            fd.append("customer", formData.customer);
            fd.append("pesanan", formData.pesanan);
            fd.append("quantity", formData.quantity);
            fd.append("waktu", formData.waktu);
            fd.append("diterima", formData.diterima ? 1 : 0);
            fd.append("alasan", formData.alasan);
            if (formData.foto) fd.append("photo", formData.foto);

            await axios.post("/kurir/laporan_harian", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setShowForm(false);
            setFormData({
                customer: "",
                pesanan: "",
                quantity: "",
                waktu: "",
                diterima: true,
                alasan: "",
                foto: null,
            });

            fetchLaporan();
        } catch (err) {
            console.error(err);
            alert(
                err.response?.data?.message ||
                JSON.stringify(err.response?.data) ||
                "Gagal menyimpan laporan"
            );
        }
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
                            Kurir · Laporan
                        </div>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: T.text }}>
                            Laporan Harian
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
                            {pending > 0 && (
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
                                Rekap hari ini
                            </div>
                            <div style={{ fontSize: "22px", fontWeight: 800, color: T.text, letterSpacing: "-.5px", lineHeight: 1.2 }}>
                                {pending > 0
                                    ? <>{pending} laporan <span style={{ color: "#60A5FA" }}>menunggu konfirmasi</span></>
                                    : <>Semua laporan <span style={{ color: T.green }}>terkonfirmasi</span> 🎉</>
                                }
                            </div>
                            <div style={{ marginTop: "6px", fontSize: "13px", color: T.sub }}>
                                Rekap aktivitas pengiriman kurir hari ini
                            </div>
                        </div>
                    </div>

                    {/* ── Stat Cards ── */}
                    <div style={{ display: "flex", gap: "14px", marginBottom: "22px" }}>
                        <StatCard
                            title="Total Pengiriman"
                            value={totalOrder}
                            icon={<FaTruck />}
                            accentColor="#3B82F6"
                            bar="linear-gradient(90deg,#3B82F6,#6366F1)"
                        />
                        <StatCard
                            title="Terkirim"
                            value={terkirim}
                            icon={<FaCheckCircle />}
                            accentColor="#22C55E"
                            bar="linear-gradient(90deg,#22C55E,#10B981)"
                        />
                        <StatCard
                            title="Menunggu"
                            value={pending}
                            icon={<FaClock />}
                            accentColor="#F59E0B"
                            bar="linear-gradient(90deg,#F59E0B,#FBBF24)"
                        />
                        <StatCard
                            title="Total Biaya"
                            value={`Rp ${totalFee.toLocaleString("id-ID")}`}
                            icon={<FaMoneyBillWave />}
                            accentColor="#A855F7"
                            bar="linear-gradient(90deg,#A855F7,#6366F1)"
                        />
                    </div>

                    {/* ── Section header + CTA ── */}
                    <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        marginBottom: "16px", flexWrap: "wrap", gap: "14px",
                    }}>
                        <div>
                            <div style={{ fontSize: "16px", fontWeight: 700, color: T.text }}>Laporan Kurir</div>
                            <div style={{ marginTop: "4px", color: T.sub, fontSize: "13px" }}>
                                Upload bukti pengiriman dan status penerimaan customer
                            </div>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            style={{
                                border: "none", height: "42px", padding: "0 20px",
                                borderRadius: "10px",
                                background: "linear-gradient(135deg,#3B82F6,#6366F1)",
                                color: "#fff", fontSize: "13px", fontWeight: 700,
                                cursor: "pointer", boxShadow: "0 10px 24px rgba(59,130,246,0.25)",
                                display: "flex", alignItems: "center", gap: "8px",
                            }}
                        >
                            + Tambah Laporan
                        </button>
                    </div>

                    {/* ── Modal ── */}
                    {showForm && (
                        <div style={{
                            position: "fixed", inset: 0,
                            background: "rgba(2,6,16,0.65)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            zIndex: 9999, padding: "20px",
                        }}>
                            <div
                                className="laporan-modal-scroll"
                                style={{
                                    width: "100%", maxWidth: "520px", maxHeight: "90vh",
                                    overflowY: "auto",
                                    scrollbarWidth: "none", msOverflowStyle: "none",
                                    background: T.surface,
                                    border: `0.5px solid ${T.border}`,
                                    borderRadius: "20px",
                                    padding: "26px",
                                    boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
                                }}
                            >
                                <div style={{ fontSize: "20px", fontWeight: 800, color: T.text, marginBottom: "18px" }}>
                                    Tambah Laporan
                                </div>

                                <FormField label="Nama Customer" name="customer" value={formData.customer} onChange={handleChange} />
                                <FormField label="Pesanan" name="pesanan" value={formData.pesanan} onChange={handleChange} />
                                <FormField label="Jumlah Porsi" name="quantity" type="number" value={formData.quantity} onChange={handleChange} />
                                <FormField label="Waktu Pengiriman" name="waktu" type="time" value={formData.waktu} onChange={handleChange} />

                                <div style={{ marginBottom: "14px" }}>
                                    <label style={labelStyle}>Foto Bukti</label>
                                    <label style={{
                                        display: "flex", alignItems: "center", gap: "10px",
                                        height: "44px", borderRadius: "10px",
                                        border: `0.5px dashed ${T.borderMd}`,
                                        background: T.bg, color: formData.foto ? T.text : T.muted,
                                        padding: "0 14px", fontSize: "13px", cursor: "pointer",
                                    }}>
                                        <FaCamera style={{ color: T.blue, flexShrink: 0 }} />
                                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {formData.foto ? formData.foto.name : "Pilih foto bukti pengiriman"}
                                        </span>
                                        <input type="file" onChange={handlePhoto} style={{ display: "none" }} />
                                    </label>
                                </div>

                                <div style={{ marginBottom: "14px" }}>
                                    <label style={labelStyle}>Status Penerimaan</label>
                                    <select
                                        value={formData.diterima}
                                        onChange={(e) => setFormData({ ...formData, diterima: e.target.value === "true" })}
                                        style={{ ...inputStyle, cursor: "pointer" }}
                                    >
                                        <option value={true}>Diterima</option>
                                        <option value={false}>Tidak Diterima</option>
                                    </select>
                                </div>

                                {!formData.diterima && (
                                    <div style={{ marginBottom: "18px" }}>
                                        <label style={labelStyle}>Alasan Tidak Diterima</label>
                                        <textarea
                                            name="alasan" value={formData.alasan} onChange={handleChange} rows={4}
                                            style={{ ...inputStyle, resize: "none", height: "100px", padding: "12px 14px" }}
                                        />
                                    </div>
                                )}

                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
                                    <button
                                        onClick={() => setShowForm(false)}
                                        style={{
                                            height: "42px", padding: "0 18px", borderRadius: "10px",
                                            border: `0.5px solid ${T.borderMd}`,
                                            background: "transparent", color: T.text,
                                            fontSize: "13px", fontWeight: 600, cursor: "pointer",
                                        }}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        style={{
                                            height: "42px", padding: "0 20px", borderRadius: "10px",
                                            border: "none",
                                            background: "linear-gradient(135deg,#3B82F6,#6366F1)",
                                            color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                                            boxShadow: "0 10px 24px rgba(59,130,246,0.25)",
                                        }}
                                    >
                                        Simpan Laporan
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

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
                                <div style={{ fontSize: "15px", fontWeight: 700, color: T.text }}>Riwayat Laporan</div>
                                <div style={{ fontSize: "12px", color: T.muted, marginTop: "2px" }}>
                                    Bukti pengiriman dan status penerimaan customer
                                </div>
                            </div>
                            <div style={{
                                padding: "5px 12px", borderRadius: "8px",
                                background: T.blueGlow,
                                border: "0.5px solid rgba(59,130,246,0.25)",
                                fontSize: "12px", fontWeight: 700, color: "#60A5FA",
                            }}>
                                {totalOrder} Laporan
                            </div>
                        </div>

                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "820px" }}>
                                <thead>
                                    <tr>
                                        {["Foto", "Customer", "Pesanan", "Waktu", "Status", "Penerimaan", "Alasan"].map((h) => (
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
                                                Belum ada laporan hari ini
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map((o) => (
                                            <tr
                                                key={o.id}
                                                style={{ borderBottom: `0.5px solid rgba(255,255,255,0.03)`, transition: "background 0.15s" }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                            >
                                                <td style={{ padding: "12px 20px" }}>
                                                    <div style={{
                                                        width: "56px", height: "56px", borderRadius: "12px",
                                                        overflow: "hidden", flexShrink: 0,
                                                        border: `0.5px solid ${T.borderMd}`,
                                                        background: T.card,
                                                    }}>
                                                        <img
                                                            src={o.photo ? `/storage/${o.photo}` : "https://via.placeholder.com/56x56.png?text=—"}
                                                            alt="bukti pengiriman"
                                                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                                        />
                                                    </div>
                                                </td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    <div style={{ fontWeight: 600, color: T.text, fontSize: "13px" }}>
                                                        {o.customer || "—"}
                                                    </div>
                                                </td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    <div style={{ fontSize: "13px", color: T.text, fontWeight: 500 }}>
                                                        {o.pesanan || "—"}
                                                    </div>
                                                </td>
                                                <td style={{ padding: "14px 20px", fontSize: "13px", color: T.sub, whiteSpace: "nowrap" }}>
                                                    {o.waktu || "—"}
                                                </td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    <span style={{
                                                        display: "inline-flex", alignItems: "center",
                                                        padding: "4px 11px", borderRadius: "20px",
                                                        fontSize: "11px", fontWeight: 700,
                                                        background: o.diterima ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.12)",
                                                        border: `0.5px solid ${o.diterima ? "rgba(34,197,94,0.25)" : "rgba(245,158,11,0.25)"}`,
                                                        color: o.diterima ? "#4ADE80" : "#FCD34D",
                                                        textTransform: "uppercase", letterSpacing: ".4px",
                                                    }}>
                                                        {o.diterima ? "Terkirim" : "Pending"}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    <span style={{
                                                        display: "inline-flex", alignItems: "center",
                                                        padding: "4px 11px", borderRadius: "20px",
                                                        fontSize: "11px", fontWeight: 700,
                                                        background: o.diterima ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                                                        border: `0.5px solid ${o.diterima ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
                                                        color: o.diterima ? "#4ADE80" : "#F87171",
                                                        textTransform: "uppercase", letterSpacing: ".4px",
                                                    }}>
                                                        {o.diterima ? "Diterima" : "Ditolak"}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "14px 20px", fontSize: "13px", color: T.sub, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {o.alasan || "—"}
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
        </div>
    );
}