// resources/js/pages/Kurir/LaporanHarian.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import {
    FaTruck, FaCheckCircle, FaMoneyBillWave, FaClock, FaBell, FaCamera,
    FaSchool, FaUtensils, FaTimes, FaExclamationCircle, FaBoxOpen,
} from "react-icons/fa";
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
    purple:   "#A855F7",
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

/* ── Form field primitives ───────────────────────────────────── */
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
const readonlyInputStyle = {
    ...inputStyle,
    color: T.sub,
    background: T.card,
    cursor: "not-allowed",
};

const FormField = ({ label, name, type = "text", value, onChange, readOnly = false }) => (
    <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            style={readOnly ? readonlyInputStyle : inputStyle}
        />
    </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
    <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>{label}</label>
        <select name={name} value={value} onChange={onChange} style={{ ...inputStyle, cursor: "pointer" }}>
            {options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>
    </div>
);

/* ── Status pill ─────────────────────────────────────────────── */
const Pill = ({ label, tone }) => {
    const tones = {
        green:  { bg: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.25)",  color: "#4ADE80" },
        red:    { bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.25)",  color: "#F87171" },
        amber:  { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", color: "#FCD34D" },
    };
    const c = tones[tone] || tones.amber;
    return (
        <span style={{
            display: "inline-flex", alignItems: "center",
            padding: "4px 11px", borderRadius: "20px",
            fontSize: "11px", fontWeight: 700,
            background: c.bg, border: `0.5px solid ${c.border}`, color: c.color,
            textTransform: "uppercase", letterSpacing: ".4px", whiteSpace: "nowrap",
        }}>
            {label}
        </span>
    );
};

/* ── Hide native scrollbar, scoped to this modal only ───────── */
const hideScrollbarStyle = `
  .laporan-modal-scroll::-webkit-scrollbar { display: none; }
`;

const emptyCateringForm = {
    jam_tiba: "",
    diterima: true,
    alasan: "",
    photo: null,
};

const emptySppgForm = {
    jam_tiba: "",
    status_distribusi: "Berhasil",
    nama_penerima: "",
    status_penerimaan: "Diterima",
    kondisi_makanan: "Baik",
    catatan: "",
    photo: null,
};

/* ── Main ─────────────────────────────────────────────────────── */
export default function LaporanHarian({ onLogout }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const [user, setUser]   = useState(null);
    const [mode, setMode]   = useState(null); // "catering" | "sppg"

    const [history, setHistory]           = useState([]);
    const [belumLaporan, setBelumLaporan]  = useState([]);

    const [showPicker, setShowPicker] = useState(false);
    const [showForm, setShowForm]     = useState(false);
    const [activeItem, setActiveItem] = useState(null); // prefill / readonly data
    const [formData, setFormData]     = useState(emptyCateringForm);
    const [saving, setSaving]         = useState(false);

    /* Tentukan mode kurir dari data user tersimpan */
    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            const u = JSON.parse(stored);
            setUser(u);
            setMode(u.sppg_id ? "sppg" : "catering");
        }
    }, []);

    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = hideScrollbarStyle;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    useEffect(() => {
        if (!mode) return;
        fetchHistory();
        fetchBelumLaporan();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    /* Auto-buka form kalau datang dari redirect tombol "Selesai" (?order_id= / ?distribusi_id=) */
    useEffect(() => {
        if (!mode) return;
        const orderId = searchParams.get("order_id");
        const distribusiId = searchParams.get("distribusi_id");
        if (mode === "catering" && orderId) openFormFor(orderId);
        if (mode === "sppg" && distribusiId) openFormFor(distribusiId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, searchParams]);

    const fetchHistory = async () => {
        try {
            const url = mode === "sppg" ? "/kurir/distribusi_laporan" : "/kurir/laporan_harian";
            const res = await axios.get(url);
            setHistory(res.data.data || res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchBelumLaporan = async () => {
        try {
            const url = mode === "sppg" ? "/kurir/distribusi-tanpa-laporan" : "/kurir/orders-tanpa-laporan";
            const res = await axios.get(url);
            setBelumLaporan(res.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const clearQueryParam = () => {
        if (searchParams.get("order_id") || searchParams.get("distribusi_id")) {
            setSearchParams({});
        }
    };

    const openFormFor = async (id) => {
        try {
            const url = mode === "sppg" ? `/kurir/distribusi/${id}` : `/kurir/orders/${id}/detail-laporan`;
            const res = await axios.get(url);
            setActiveItem(res.data);
            setFormData(mode === "sppg" ? emptySppgForm : emptyCateringForm);
            setShowPicker(false);
            setShowForm(true);
        } catch (err) {
            console.error(err);
            alert("Gagal memuat data. Item ini mungkin sudah dilaporkan atau tidak ditemukan.");
            clearQueryParam();
        }
    };

    const closeForm = () => {
        setShowForm(false);
        setActiveItem(null);
        clearQueryParam();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (file) setFormData((prev) => ({ ...prev, photo: file }));
    };

    const handleSubmit = async () => {
        if (!activeItem) return;
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append("jam_tiba", formData.jam_tiba);
            if (formData.photo) fd.append("photo", formData.photo);

            let url;
            if (mode === "sppg") {
                fd.append("status_distribusi", formData.status_distribusi);
                fd.append("nama_penerima", formData.nama_penerima);
                fd.append("status_penerimaan", formData.status_penerimaan);
                fd.append("kondisi_makanan", formData.kondisi_makanan);
                fd.append("catatan", formData.catatan);
                url = `/kurir/distribusi/${activeItem.id}/laporan`;
            } else {
                fd.append("order_id", activeItem.id);
                fd.append("customer", activeItem.customer);
                fd.append("pesanan", activeItem.pesanan);
                fd.append("quantity", activeItem.quantity);
                fd.append("waktu", activeItem.jam);
                fd.append("diterima", formData.diterima ? 1 : 0);
                fd.append("alasan", formData.alasan);
                url = "/kurir/laporan_harian";
            }

            await axios.post(url, fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            closeForm();
            fetchHistory();
            fetchBelumLaporan();
        } catch (err) {
            console.error(err);
            alert(
                err.response?.data?.message ||
                JSON.stringify(err.response?.data) ||
                "Gagal menyimpan laporan"
            );
        } finally {
            setSaving(false);
        }
    };

    if (!mode) return null;

    /* ── Derive stats per mode ── */
    const totalItem = history.length;
    const berhasil = mode === "sppg"
        ? history.filter((h) => h.status_distribusi === "Berhasil").length
        : history.filter((h) => h.diterima).length;
    const gagalOrPending = mode === "sppg"
        ? history.filter((h) => h.status_distribusi === "Gagal").length
        : history.filter((h) => !h.diterima).length;
    const totalPorsiOrFee = mode === "sppg"
        ? history.reduce((acc, h) => acc + (h.jumlah_porsi || 0), 0)
        : history.reduce((acc, h) => acc + (h.delivery_fee || 0), 0);

    const heroTitle = mode === "sppg"
        ? (gagalOrPending > 0
            ? <>{gagalOrPending} distribusi <span style={{ color: T.red }}>perlu ditinjau</span></>
            : <>Semua distribusi <span style={{ color: T.green }}>berhasil</span> 🎉</>)
        : (gagalOrPending > 0
            ? <>{gagalOrPending} laporan <span style={{ color: "#60A5FA" }}>menunggu konfirmasi</span></>
            : <>Semua laporan <span style={{ color: T.green }}>terkonfirmasi</span> 🎉</>);

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
                            {mode === "sppg" ? "Laporan Distribusi" : "Laporan Harian"}
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
                            {(belumLaporan.length > 0) && (
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
                                {heroTitle}
                            </div>
                            <div style={{ marginTop: "6px", fontSize: "13px", color: T.sub }}>
                                {mode === "sppg"
                                    ? "Rekap aktivitas distribusi makanan ke sekolah hari ini"
                                    : "Rekap aktivitas pengiriman kurir hari ini"}
                            </div>
                        </div>
                    </div>

                    {/* ── Stat Cards ── */}
                    <div style={{ display: "flex", gap: "14px", marginBottom: "22px", flexWrap: "wrap" }}>
                        <StatCard
                            title={mode === "sppg" ? "Total Distribusi" : "Total Pengiriman"}
                            value={totalItem}
                            icon={<FaTruck />}
                            accentColor="#3B82F6"
                            bar="linear-gradient(90deg,#3B82F6,#6366F1)"
                        />
                        <StatCard
                            title="Berhasil"
                            value={berhasil}
                            icon={<FaCheckCircle />}
                            accentColor="#22C55E"
                            bar="linear-gradient(90deg,#22C55E,#10B981)"
                        />
                        <StatCard
                            title={mode === "sppg" ? "Gagal" : "Menunggu"}
                            value={gagalOrPending}
                            icon={mode === "sppg" ? <FaExclamationCircle /> : <FaClock />}
                            accentColor={mode === "sppg" ? "#EF4444" : "#F59E0B"}
                            bar={mode === "sppg" ? "linear-gradient(90deg,#EF4444,#F87171)" : "linear-gradient(90deg,#F59E0B,#FBBF24)"}
                        />
                        <StatCard
                            title={mode === "sppg" ? "Total Porsi" : "Total Biaya"}
                            value={mode === "sppg" ? totalPorsiOrFee : `Rp ${totalPorsiOrFee.toLocaleString("id-ID")}`}
                            icon={mode === "sppg" ? <FaUtensils /> : <FaMoneyBillWave />}
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
                            <div style={{ fontSize: "16px", fontWeight: 700, color: T.text }}>
                                {mode === "sppg" ? "Laporan Distribusi" : "Laporan Kurir"}
                            </div>
                            <div style={{ marginTop: "4px", color: T.sub, fontSize: "13px" }}>
                                {mode === "sppg"
                                    ? "Upload bukti serah terima dan kondisi makanan di sekolah"
                                    : "Upload bukti pengiriman dan status penerimaan customer"}
                            </div>
                        </div>
                        <button
                            onClick={() => setShowPicker(true)}
                            disabled={belumLaporan.length === 0}
                            style={{
                                border: "none", height: "42px", padding: "0 20px",
                                borderRadius: "10px",
                                background: belumLaporan.length === 0
                                    ? T.card
                                    : "linear-gradient(135deg,#3B82F6,#6366F1)",
                                color: belumLaporan.length === 0 ? T.muted : "#fff",
                                fontSize: "13px", fontWeight: 700,
                                cursor: belumLaporan.length === 0 ? "not-allowed" : "pointer",
                                boxShadow: belumLaporan.length === 0 ? "none" : "0 10px 24px rgba(59,130,246,0.25)",
                                display: "flex", alignItems: "center", gap: "8px",
                            }}
                        >
                            + Tambah Laporan
                        </button>
                    </div>

                    {/* ── Picker modal (pilih item yang belum dilaporkan) ── */}
                    {showPicker && (
                        <div style={{
                            position: "fixed", inset: 0,
                            background: "rgba(2,6,16,0.65)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            zIndex: 9999, padding: "20px",
                        }}>
                            <div style={{
                                width: "100%", maxWidth: "480px", maxHeight: "80vh",
                                overflowY: "auto",
                                background: T.surface,
                                border: `0.5px solid ${T.border}`,
                                borderRadius: "20px",
                                padding: "22px",
                                boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
                            }} className="laporan-modal-scroll">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                    <div style={{ fontSize: "18px", fontWeight: 800, color: T.text }}>
                                        Pilih {mode === "sppg" ? "Distribusi" : "Pengiriman"}
                                    </div>
                                    <button
                                        onClick={() => setShowPicker(false)}
                                        style={{
                                            width: "32px", height: "32px", borderRadius: "8px",
                                            border: "none", background: T.card, color: T.sub,
                                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                        }}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>

                                {belumLaporan.length === 0 ? (
                                    <div style={{ padding: "24px 0", textAlign: "center", color: T.muted, fontSize: "13px" }}>
                                        Semua sudah dilaporkan.
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        {belumLaporan.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => openFormFor(item.id)}
                                                style={{
                                                    textAlign: "left",
                                                    padding: "14px 16px",
                                                    borderRadius: "12px",
                                                    border: `0.5px solid ${T.borderMd}`,
                                                    background: T.card,
                                                    cursor: "pointer",
                                                    display: "flex", alignItems: "center", gap: "12px",
                                                }}
                                            >
                                                <div style={{
                                                    width: "36px", height: "36px", borderRadius: "10px",
                                                    background: T.blueGlow, color: "#60A5FA",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    flexShrink: 0, fontSize: "14px",
                                                }}>
                                                    {mode === "sppg" ? <FaSchool /> : <FaTruck />}
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ fontWeight: 700, color: T.text, fontSize: "13px" }}>
                                                        {mode === "sppg"
                                                            ? (item.sekolah?.nama_sekolah || `Distribusi #${item.id}`)
                                                            : (item.client?.name || `Order #${item.id}`)}
                                                    </div>
                                                    <div style={{ fontSize: "12px", color: T.sub, marginTop: "2px" }}>
                                                        {mode === "sppg"
                                                            ? (item.menu?.name || "—")
                                                            : (item.menu?.name || "—")}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Form modal ── */}
                    {showForm && activeItem && (
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
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
                                    <div>
                                        <div style={{ fontSize: "20px", fontWeight: 800, color: T.text }}>
                                            {mode === "sppg" ? "Laporan Distribusi" : "Laporan Pengiriman"}
                                        </div>
                                        <div style={{ marginTop: "4px", fontSize: "12px", color: T.sub }}>
                                            {mode === "sppg"
                                                ? (activeItem.nama_sekolah || "—")
                                                : (activeItem.customer || "—")}
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeForm}
                                        style={{
                                            width: "32px", height: "32px", borderRadius: "8px",
                                            border: "none", background: T.card, color: T.sub,
                                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>

                                {mode === "sppg" ? (
                                    <>
                                        <FormField label="Nama Sekolah" name="nama_sekolah" value={activeItem.nama_sekolah || "—"} readOnly />
                                        <FormField label="Menu" name="menu" value={activeItem.menu || "—"} readOnly />
                                        <FormField label="Jumlah Porsi" name="jumlah_porsi" value={activeItem.jumlah_porsi ?? "—"} readOnly />
                                        <FormField label="Jam Berangkat" name="jam_berangkat" value={activeItem.jam_berangkat || "—"} readOnly />
                                        <FormField label="Jam Tiba" name="jam_tiba" type="time" value={formData.jam_tiba} onChange={handleChange} />

                                        <SelectField
                                            label="Status Distribusi"
                                            name="status_distribusi"
                                            value={formData.status_distribusi}
                                            onChange={handleChange}
                                            options={[
                                                { value: "Berhasil", label: "Berhasil" },
                                                { value: "Gagal", label: "Gagal" },
                                            ]}
                                        />
                                        <FormField label="Nama Penerima" name="nama_penerima" value={formData.nama_penerima} onChange={handleChange} />
                                        <SelectField
                                            label="Status Penerimaan"
                                            name="status_penerimaan"
                                            value={formData.status_penerimaan}
                                            onChange={handleChange}
                                            options={[
                                                { value: "Diterima", label: "Diterima" },
                                                { value: "Ditolak", label: "Ditolak" },
                                            ]}
                                        />
                                        <SelectField
                                            label="Kondisi Makanan"
                                            name="kondisi_makanan"
                                            value={formData.kondisi_makanan}
                                            onChange={handleChange}
                                            options={[
                                                { value: "Baik", label: "Baik" },
                                                { value: "Sebagian", label: "Sebagian" },
                                                { value: "Rusak", label: "Rusak" },
                                            ]}
                                        />

                                        <div style={{ marginBottom: "14px" }}>
                                            <label style={labelStyle}>Foto Bukti</label>
                                            <label style={{
                                                display: "flex", alignItems: "center", gap: "10px",
                                                height: "44px", borderRadius: "10px",
                                                border: `0.5px dashed ${T.borderMd}`,
                                                background: T.bg, color: formData.photo ? T.text : T.muted,
                                                padding: "0 14px", fontSize: "13px", cursor: "pointer",
                                            }}>
                                                <FaCamera style={{ color: T.blue, flexShrink: 0 }} />
                                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {formData.photo ? formData.photo.name : "Pilih foto bukti serah terima"}
                                                </span>
                                                <input type="file" onChange={handlePhoto} style={{ display: "none" }} />
                                            </label>
                                        </div>

                                        <div style={{ marginBottom: "18px" }}>
                                            <label style={labelStyle}>Catatan Kurir</label>
                                            <textarea
                                                name="catatan" value={formData.catatan} onChange={handleChange} rows={4}
                                                placeholder="Opsional — catatan tambahan soal distribusi ini"
                                                style={{ ...inputStyle, resize: "none", height: "100px", padding: "12px 14px" }}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <FormField label="Nama Customer" name="customer" value={activeItem.customer || "—"} readOnly />
                                        <FormField label="Pesanan" name="pesanan" value={activeItem.pesanan || "—"} readOnly />
                                        <FormField label="Jumlah Porsi" name="quantity" value={activeItem.quantity ?? "—"} readOnly />
                                        <FormField label="Jam Kirim" name="jam" value={activeItem.jam || "—"} readOnly />
                                        <FormField label="Jam Tiba" name="jam_tiba" type="time" value={formData.jam_tiba} onChange={handleChange} />

                                        <div style={{ marginBottom: "14px" }}>
                                            <label style={labelStyle}>Foto Bukti</label>
                                            <label style={{
                                                display: "flex", alignItems: "center", gap: "10px",
                                                height: "44px", borderRadius: "10px",
                                                border: `0.5px dashed ${T.borderMd}`,
                                                background: T.bg, color: formData.photo ? T.text : T.muted,
                                                padding: "0 14px", fontSize: "13px", cursor: "pointer",
                                            }}>
                                                <FaCamera style={{ color: T.blue, flexShrink: 0 }} />
                                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {formData.photo ? formData.photo.name : "Pilih foto bukti pengiriman"}
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

                                        <div style={{ marginBottom: "18px" }}>
                                            <label style={labelStyle}>Catatan Kurir</label>
                                            <textarea
                                                name="alasan" value={formData.alasan} onChange={handleChange} rows={4}
                                                placeholder={formData.diterima ? "Opsional — catatan tambahan soal pengiriman ini" : "Jelaskan alasan tidak diterima"}
                                                style={{ ...inputStyle, resize: "none", height: "100px", padding: "12px 14px" }}
                                            />
                                        </div>
                                    </>
                                )}

                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
                                    <button
                                        onClick={closeForm}
                                        disabled={saving}
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
                                        disabled={saving || !formData.jam_tiba}
                                        style={{
                                            height: "42px", padding: "0 20px", borderRadius: "10px",
                                            border: "none",
                                            background: (saving || !formData.jam_tiba)
                                                ? T.muted
                                                : "linear-gradient(135deg,#3B82F6,#6366F1)",
                                            color: "#fff", fontSize: "13px", fontWeight: 700,
                                            cursor: (saving || !formData.jam_tiba) ? "not-allowed" : "pointer",
                                            boxShadow: (saving || !formData.jam_tiba) ? "none" : "0 10px 24px rgba(59,130,246,0.25)",
                                        }}
                                    >
                                        {saving ? "Menyimpan..." : "Simpan Laporan"}
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
                                    {mode === "sppg"
                                        ? "Bukti serah terima dan kondisi makanan di sekolah"
                                        : "Bukti pengiriman dan status penerimaan customer"}
                                </div>
                            </div>
                            <div style={{
                                padding: "5px 12px", borderRadius: "8px",
                                background: T.blueGlow,
                                border: "0.5px solid rgba(59,130,246,0.25)",
                                fontSize: "12px", fontWeight: 700, color: "#60A5FA",
                            }}>
                                {totalItem} Laporan
                            </div>
                        </div>

                        <div style={{ overflowX: "auto" }}>
                            {mode === "sppg" ? (
                                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "960px" }}>
                                    <thead>
                                        <tr>
                                            {["Foto", "Sekolah", "Menu", "Jam Berangkat", "Jam Tiba", "Status", "Penerima", "Kondisi", "Catatan"].map((h) => (
                                                <th key={h} style={{
                                                    padding: "11px 20px", textAlign: "left",
                                                    fontSize: "11px", fontWeight: 600, color: T.muted,
                                                    textTransform: "uppercase", letterSpacing: ".6px",
                                                    borderBottom: `0.5px solid ${T.border}`, whiteSpace: "nowrap",
                                                }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} style={{ padding: "56px 20px", textAlign: "center", color: T.muted, fontSize: "13px" }}>
                                                    <EmptyState />
                                                </td>
                                            </tr>
                                        ) : (
                                            history.map((r) => (
                                                <tr key={r.id} style={rowStyle} onMouseEnter={rowHover} onMouseLeave={rowLeave}>
                                                    <td style={{ padding: "12px 20px" }}><PhotoThumb photo={r.photo} /></td>
                                                    <td style={{ padding: "14px 20px", fontWeight: 600, color: T.text, fontSize: "13px" }}>{r.nama_sekolah || "—"}</td>
                                                    <td style={{ padding: "14px 20px", fontSize: "13px", color: T.text }}>{r.menu || "—"}</td>
                                                    <td style={{ padding: "14px 20px", fontSize: "13px", color: T.sub, whiteSpace: "nowrap" }}>{r.jam_berangkat || "—"}</td>
                                                    <td style={{ padding: "14px 20px", fontSize: "13px", color: T.sub, whiteSpace: "nowrap" }}>{r.jam_tiba || "—"}</td>
                                                    <td style={{ padding: "14px 20px" }}>
                                                        <Pill label={r.status_distribusi} tone={r.status_distribusi === "Berhasil" ? "green" : "red"} />
                                                    </td>
                                                    <td style={{ padding: "14px 20px", fontSize: "13px", color: T.text }}>{r.nama_penerima || "—"}</td>
                                                    <td style={{ padding: "14px 20px" }}>
                                                        <Pill
                                                            label={r.kondisi_makanan}
                                                            tone={r.kondisi_makanan === "Baik" ? "green" : r.kondisi_makanan === "Sebagian" ? "amber" : "red"}
                                                        />
                                                    </td>
                                                    <td style={ellipsisCell}>{r.catatan || "—"}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
                                    <thead>
                                        <tr>
                                            {["Foto", "Customer", "Pesanan", "Jam Kirim", "Jam Tiba", "Penerimaan", "Catatan"].map((h) => (
                                                <th key={h} style={{
                                                    padding: "11px 20px", textAlign: "left",
                                                    fontSize: "11px", fontWeight: 600, color: T.muted,
                                                    textTransform: "uppercase", letterSpacing: ".6px",
                                                    borderBottom: `0.5px solid ${T.border}`, whiteSpace: "nowrap",
                                                }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} style={{ padding: "56px 20px", textAlign: "center", color: T.muted, fontSize: "13px" }}>
                                                    <EmptyState />
                                                </td>
                                            </tr>
                                        ) : (
                                            history.map((o) => (
                                                <tr key={o.id} style={rowStyle} onMouseEnter={rowHover} onMouseLeave={rowLeave}>
                                                    <td style={{ padding: "12px 20px" }}><PhotoThumb photo={o.photo} /></td>
                                                    <td style={{ padding: "14px 20px", fontWeight: 600, color: T.text, fontSize: "13px" }}>{o.customer || "—"}</td>
                                                    <td style={{ padding: "14px 20px", fontSize: "13px", color: T.text, fontWeight: 500 }}>{o.pesanan || "—"}</td>
                                                    <td style={{ padding: "14px 20px", fontSize: "13px", color: T.sub, whiteSpace: "nowrap" }}>{o.waktu || "—"}</td>
                                                    <td style={{ padding: "14px 20px", fontSize: "13px", color: T.sub, whiteSpace: "nowrap" }}>{o.jam_tiba || "—"}</td>
                                                    <td style={{ padding: "14px 20px" }}>
                                                        <Pill label={o.diterima ? "Diterima" : "Ditolak"} tone={o.diterima ? "green" : "red"} />
                                                    </td>
                                                    <td style={ellipsisCell}>{o.alasan || "—"}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

/* ── small shared bits ───────────────────────────────────────── */
const rowStyle = { borderBottom: "0.5px solid rgba(255,255,255,0.03)", transition: "background 0.15s" };
const rowHover = (e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; };
const rowLeave = (e) => { e.currentTarget.style.background = "transparent"; };
const ellipsisCell = {
    padding: "14px 20px", fontSize: "13px", color: T.sub,
    maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
};

function PhotoThumb({ photo }) {
    return (
        <div style={{
            width: "56px", height: "56px", borderRadius: "12px",
            overflow: "hidden", flexShrink: 0,
            border: `0.5px solid ${T.borderMd}`,
            background: T.card,
        }}>
            <img
                src={photo ? `/storage/${photo}` : "https://via.placeholder.com/56x56.png?text=—"}
                alt="bukti"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
        </div>
    );
}

function EmptyState() {
    return (
        <>
            <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: T.card, border: `0.5px solid ${T.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: T.muted, fontSize: "20px",
                margin: "0 auto 12px",
            }}>
                <FaBoxOpen />
            </div>
            Belum ada laporan hari ini
        </>
    );
}