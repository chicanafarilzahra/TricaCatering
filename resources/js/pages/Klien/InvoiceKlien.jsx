// resources/js/pages/Klien/InvoiceKlien.jsx

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import NavbarKlien from "../../components/NavbarKlien";
import {
    FileText, CheckCircle2, Clock3, XCircle, ArrowLeft, Download, Eye,
    Wallet, Building2, ChevronRight, History, AlertTriangle, Ban, RefreshCw,
    Loader2, Sparkles, Activity, ClipboardList, Smartphone, CreditCard,
    CalendarClock, ShieldCheck, CircleDollarSign, Upload, X, CheckCheck,
    Send, Info, CalendarDays, Repeat, Timer, Zap,
} from "lucide-react";

/* ─────────────────── DESIGN TOKENS ─────────────────── */

const STATUS_MAP = {
    unpaid:    { label: "Belum Dibayar",       color: "#fbbf24", accent: "#f59e0b", bg: "rgba(245,158,11,0.1)",   border: "rgba(245,158,11,0.2)",   icon: Clock3 },
    pending:   { label: "Menunggu Konfirmasi", color: "#a78bfa", accent: "#8b5cf6", bg: "rgba(139,92,246,0.1)",   border: "rgba(139,92,246,0.2)",   icon: Clock3 },
    paid:      { label: "Lunas",               color: "#34d399", accent: "#10b981", bg: "rgba(16,185,129,0.1)",   border: "rgba(16,185,129,0.2)",   icon: CheckCircle2 },
    selesai:   { label: "Lunas",               color: "#34d399", accent: "#10b981", bg: "rgba(16,185,129,0.1)",   border: "rgba(16,185,129,0.2)",   icon: CheckCircle2 },
    cancelled: { label: "Dibatalkan",          color: "#f87171", accent: "#ef4444", bg: "rgba(239,68,68,0.1)",    border: "rgba(239,68,68,0.2)",    icon: Ban },
    dp_paid:   { label: "DP Terbayar",         color: "#38bdf8", accent: "#0ea5e9", bg: "rgba(14,165,233,0.1)",   border: "rgba(14,165,233,0.2)",   icon: CheckCircle2 },
    failed:    { label: "Pembayaran Gagal",    color: "#f87171", accent: "#ef4444", bg: "rgba(239,68,68,0.1)",    border: "rgba(239,68,68,0.2)",    icon: XCircle },
};

const statusInfo = (s) =>
    STATUS_MAP[s] || { label: s, color: "#94a3b8", accent: "#64748b", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", icon: Clock3 };

// ✅ Status efektif: catering harian selalu dianggap "Lunas" di tampilan,
// terlepas dari status mentah yang dikirim backend (jaga-jaga kalau
// backend belum sempat set status invoice harian dengan benar).
const effectiveStatus = (inv) => (inv?.order?.type === "harian" ? "paid" : inv?.status);

const fmt = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

const hitungJatuhTempo = (orderDate) => {
    if (!orderDate) return null;
    const d = new Date(orderDate);
    d.setDate(d.getDate() - 3);
    return d;
};

const sisaHari = (dueDate) => {
    if (!dueDate) return null;
    const now  = new Date();
    const due  = new Date(dueDate);
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return diff;
};

/* Batas waktu pembayaran pelunasan: 5 menit */
const PAY_WINDOW_SECONDS = 5 * 60;

const fmtCountdown = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

/* ─────────────────── SHARED ATOMS ─────────────────── */

function Badge({ status, size = "sm" }) {
    const info = statusInfo(status);
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: size === "lg" ? "8px 16px" : "5px 12px",
            borderRadius: "8px",
            background: info.bg, color: info.color,
            border: `1px solid ${info.border}`,
            fontWeight: "700", fontSize: size === "lg" ? "14px" : "12px",
        }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: info.color, flexShrink: 0 }} />
            {info.label}
        </span>
    );
}

function CateringTypeBadge({ isHarian, size = "sm" }) {
    const Icon = isHarian ? Repeat : CalendarDays;
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: size === "lg" ? "7px 14px" : "5px 12px",
            borderRadius: "8px", fontWeight: "700",
            fontSize: size === "lg" ? "13px" : "11px",
            background: isHarian ? "rgba(59,130,246,0.1)" : "rgba(139,92,246,0.1)",
            color: isHarian ? "#60a5fa" : "#a78bfa",
            border: `1px solid ${isHarian ? "rgba(59,130,246,0.2)" : "rgba(139,92,246,0.2)"}`,
        }}>
            <Icon size={size === "lg" ? 14 : 12} />
            {isHarian ? "Catering Harian" : "Catering Insidentil"}
        </span>
    );
}

function Divider() {
    return <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", margin: "14px 0" }} />;
}

function RowFlex({ label, value, bold, color }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
            <span style={{ color: "#64748b", fontSize: "14px" }}>{label}</span>
            <span style={{ fontWeight: bold ? "700" : "500", color: color || "white", fontSize: bold ? "15px" : "14px" }}>{value}</span>
        </div>
    );
}

function PrimaryBtn({ children, onClick, disabled, loading, variant = "blue", style: s }) {
    const variants = {
        blue:  { background: "linear-gradient(90deg, #2563eb, #3b82f6)", color: "white" },
        green: { background: "linear-gradient(90deg, #059669, #10b981)", color: "white" },
        ghost: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" },
        amber: { background: "linear-gradient(90deg, #d97706, #fbbf24)", color: "white" },
        purple: { background: "linear-gradient(90deg, #7c3aed, #8b5cf6)", color: "white" },
    };
    return (
        <button onClick={disabled ? undefined : onClick} style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
            padding: "12px 22px", borderRadius: "12px", border: "none",
            fontWeight: "700", fontSize: "14px",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
            transition: "opacity 0.2s, transform 0.15s",
            fontFamily: "Inter, system-ui, sans-serif",
            ...variants[variant], ...s,
        }}>
            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : children}
        </button>
    );
}

function GCard({ children, style: s }) {
    return (
        <div style={{
            background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px",
            ...s,
        }}>
            {children}
        </div>
    );
}

const tdStyle = { padding: "16px 20px", color: "white" };

function DueDateBanner({ dueDate }) {
    if (!dueDate) return null;
    const sisa = sisaHari(dueDate);
    if (sisa === null) return null;

    if (sisa < 0) return (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "14px", padding: "16px 18px", display: "flex", alignItems: "center", gap: "12px" }}>
            <Ban size={18} color="#f87171" style={{ flexShrink: 0 }} />
            <div>
                <div style={{ color: "#f87171", fontWeight: "700", fontSize: "14px" }}>Jatuh Tempo Terlewat</div>
                <div style={{ color: "#64748b", fontSize: "13px", marginTop: "2px" }}>Pembayaran sudah melewati batas waktu {Math.abs(sisa)} hari. Segera hubungi admin.</div>
            </div>
        </div>
    );

    if (sisa <= 1) return (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "14px", padding: "16px 18px", display: "flex", alignItems: "center", gap: "12px" }}>
            <AlertTriangle size={18} color="#f87171" style={{ flexShrink: 0 }} />
            <div>
                <div style={{ color: "#f87171", fontWeight: "700", fontSize: "14px" }}>Jatuh Tempo Hari Ini!</div>
                <div style={{ color: "#64748b", fontSize: "13px", marginTop: "2px" }}>Segera lunasi sebelum pesanan dibatalkan.</div>
            </div>
        </div>
    );

    if (sisa <= 3) return (
        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "14px", padding: "16px 18px", display: "flex", alignItems: "center", gap: "12px" }}>
            <CalendarClock size={18} color="#fbbf24" style={{ flexShrink: 0 }} />
            <div>
                <div style={{ color: "#fbbf24", fontWeight: "700", fontSize: "14px" }}>Jatuh Tempo {sisa === 1 ? "Besok" : `${sisa} Hari Lagi`}</div>
                <div style={{ color: "#64748b", fontSize: "13px", marginTop: "2px" }}>
                    Batas pelunasan: {new Date(dueDate).toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ background: "rgba(14,165,233,0.06)", border: "1px solid rgba(14,165,233,0.18)", borderRadius: "14px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
            <CalendarClock size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
            <span style={{ color: "#64748b", fontSize: "13px" }}>
                Jatuh tempo pelunasan:{" "}
                <strong style={{ color: "#38bdf8" }}>{new Date(dueDate).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</strong>
                {" "}({sisa} hari lagi)
            </span>
        </div>
    );
}

/* Tombol pilih metode (Bank / E-Wallet) — gaya PesanMakan */
function PayMethodBtn({ icon, label, active, onClick }) {
    return (
        <button onClick={onClick} type="button" style={{
            flex: 1, height: "56px",
            background: active ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.02)",
            border: active ? "1.5px solid #3b82f6" : "1px solid rgba(255,255,255,0.07)",
            borderRadius: "14px", color: active ? "#60a5fa" : "#64748b",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "4px", cursor: "pointer", fontSize: "11px", fontWeight: "600",
            fontFamily: "Inter, system-ui, sans-serif", transition: "all .2s",
        }}>
            <span style={{ fontSize: "18px", display: "flex" }}>{icon}</span>
            {label}
        </button>
    );
}

/* Tombol pilih rekening spesifik — gaya PesanMakan */
function PayOptionBtn({ label, sub, active, onClick }) {
    return (
        <button onClick={onClick} type="button" style={{
            background: active ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.02)",
            border: active ? "1.5px solid #3b82f6" : "1px solid rgba(255,255,255,0.07)",
            borderRadius: "10px", color: active ? "#60a5fa" : "#64748b",
            padding: "10px 12px", cursor: "pointer", fontSize: "12px", textAlign: "left",
            transition: "all .2s", fontFamily: "Inter, system-ui, sans-serif", fontWeight: "600",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {active && <CheckCircle2 size={12} />}
                <span>{label}</span>
            </div>
            {sub && (
                <div style={{ fontSize: "10px", color: active ? "#93c5fd" : "#475569", marginTop: "3px", fontWeight: "500" }}>
                    {sub}
                </div>
            )}
        </button>
    );
}

/* ══════════════════════════════════════════════════════════
   ✅ FORM BAYAR PELUNASAN DP
══════════════════════════════════════════════════════════ */

function PelunasanPaymentForm({ invoice, onSuccess }) {
    const [open, setOpen]                       = useState(false);
    const [payMethod, setPayMethod]             = useState(null); // 'bank' | 'ewallet'
    const [channelSelected, setChannelSelected] = useState(null);
    const [tanggalBayar, setTanggalBayar]       = useState(() => new Date().toISOString().slice(0, 10));
    const [bukti, setBukti]                     = useState(null);
    const [buktiPreview, setBuktiPreview]       = useState(null);
    const [catatan, setCatatan]                 = useState("");
    const [loading, setLoading]                 = useState(false);
    const [channels, setChannels]               = useState({ banks: [], ewallets: [] });
    const [loadingChannels, setLoadingChannels] = useState(false);
    const [submitted, setSubmitted]             = useState(false);
    const [secondsLeft, setSecondsLeft]         = useState(PAY_WINDOW_SECONDS);
    const [expired, setExpired]                 = useState(false);
    const timerRef = useRef(null);

    const dpAmount    = invoice.dp_amount || 0;
    const totalAmount = invoice.total_amount || 0;
    const bayarAmount = totalAmount - dpAmount; // nominal dikunci

    const deliveryDate = invoice.order?.delivery_date || invoice.order?.order_date;
    const dueDate       = hitungJatuhTempo(deliveryDate);

    const fetchChannels = async () => {
        if (channels.banks.length > 0 || channels.ewallets.length > 0) return;
        setLoadingChannels(true);
        try {
            const res = await axios.get(`/klien/invoice/${invoice.id}/payment-channels`);
            setChannels(res.data);
        } catch {}
        finally { setLoadingChannels(false); }
    };

    const startTimer = () => {
        clearInterval(timerRef.current);
        setSecondsLeft(PAY_WINDOW_SECONDS);
        setExpired(false);
        timerRef.current = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => () => clearInterval(timerRef.current), []);

    const handleOpen = () => {
        setOpen(true);
        fetchChannels();
        startTimer();
    };

    const handleRestartTimer = () => {
        setPayMethod(null); setChannelSelected(null); setBukti(null); setBuktiPreview(null); setCatatan("");
        setTanggalBayar(new Date().toISOString().slice(0, 10));
        startTimer();
    };

    const handleBukti = (e) => {
        const file = e.target.files[0];
        if (file) { setBukti(file); setBuktiPreview(URL.createObjectURL(file)); }
    };

    const handleSubmit = async () => {
        if (!channelSelected || !bukti || expired) return;
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append("payment_channel_id", channelSelected.id);
            fd.append("payment_proof", bukti);
            fd.append("note", catatan);
            fd.append("type", "pelunasan");
            fd.append("amount", bayarAmount);
            fd.append("payment_date", tanggalBayar);
            await axios.post(`/klien/invoice/${invoice.id}/pay`, fd, { headers: { "Content-Type": "multipart/form-data" } });
            clearInterval(timerRef.current);
            setSubmitted(true);
            if (onSuccess) onSuccess();
        } catch (err) {
            alert(err?.response?.data?.message || "Gagal mengirim pembayaran. Coba lagi.");
        } finally { setLoading(false); }
    };

    const reset = () => {
        clearInterval(timerRef.current);
        setOpen(false); setPayMethod(null); setChannelSelected(null);
        setBukti(null); setBuktiPreview(null); setCatatan(""); setSubmitted(false); setExpired(false);
    };

    if (submitted) {
        return (
            <GCard style={{ padding: "32px", textAlign: "center" }}>
                <div style={{
                    width: "64px", height: "64px", borderRadius: "50%",
                    background: "rgba(16,185,129,0.1)", border: "2px solid rgba(16,185,129,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
                }}>
                    <CheckCheck size={32} color="#34d399" />
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: "800", letterSpacing: "-0.5px" }}>
                    Pelunasan Berhasil Dikirim!
                </h3>
                <p style={{ color: "#64748b", margin: "0 0 20px", fontSize: "14px", lineHeight: "1.7" }}>
                    Bukti transfer pelunasan Anda telah dikirim dan akan tampil di halaman Revenue Owner untuk diverifikasi.
                    Jika owner mengkonfirmasi, invoice ini otomatis berubah menjadi <strong style={{ color: "#34d399" }}>Lunas</strong>.
                    Jika ditolak, status pembayaran akan otomatis <strong style={{ color: "#f87171" }}>Gagal</strong>.
                </p>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "16px", marginBottom: "20px", textAlign: "left" }}>
                    <RowFlex label="Tipe" value="Pelunasan 50%" />
                    <RowFlex label="Jumlah" value={fmt(bayarAmount)} bold color="#34d399" />
                    <RowFlex label="Via" value={channelSelected?.provider_name || "—"} />
                </div>
                <button onClick={reset} style={{
                    padding: "10px 20px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)",
                    background: "transparent", color: "#94a3b8", cursor: "pointer",
                    fontFamily: "Inter, system-ui, sans-serif", fontSize: "13px", fontWeight: "600",
                }}>
                    Tutup
                </button>
            </GCard>
        );
    }

    if (!open) {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <PrimaryBtn variant="green" onClick={handleOpen} style={{ width: "100%", padding: "14px", fontSize: "15px" }}>
                    <Wallet size={16} />
                    Bayar Pelunasan DP (50%)
                </PrimaryBtn>
                <div style={{ textAlign: "center", color: "#475569", fontSize: "12px" }}>
                    Sisa yang harus dilunasi: <strong style={{ color: "#fbbf24" }}>{fmt(bayarAmount)}</strong>
                </div>
            </div>
        );
    }

    const inputStyle = {
        width: "100%", background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px",
        padding: "10px 12px", color: "white", fontSize: "13px",
        boxSizing: "border-box", fontFamily: "Inter, system-ui, sans-serif", outline: "none",
    };
    const labelStyle = { fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px", display: "block" };

    return (
        <GCard style={{ overflow: "hidden" }}>
            <div style={{
                padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "rgba(255,255,255,0.02)",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                        width: "36px", height: "36px", borderRadius: "10px",
                        background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399",
                    }}>
                        <Send size={16} />
                    </div>
                    <div>
                        <div style={{ fontWeight: "700", fontSize: "15px" }}>Pembayaran Pelunasan</div>
                        <div style={{ color: "#64748b", fontSize: "12px" }}>Silakan lakukan pembayaran sisa tagihan dan unggah bukti transfer untuk proses verifikasi</div>
                    </div>
                </div>
                <button onClick={reset} style={{
                    width: "30px", height: "30px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.07)",
                    background: "rgba(255,255,255,0.03)", color: "#64748b", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                    <X size={14} />
                </button>
            </div>

            <div style={{
                padding: "12px 22px",
                background: expired ? "rgba(239,68,68,0.08)" : secondsLeft <= 60 ? "rgba(245,158,11,0.08)" : "rgba(59,130,246,0.06)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: expired ? "#f87171" : secondsLeft <= 60 ? "#fbbf24" : "#60a5fa", fontSize: "13px", fontWeight: "700" }}>
                    <Timer size={15} />
                    {expired ? "Waktu pembayaran habis" : "Batas waktu pembayaran"}
                </div>
                <div style={{ fontFamily: "monospace", fontSize: "18px", fontWeight: "800", color: expired ? "#f87171" : secondsLeft <= 60 ? "#fbbf24" : "#60a5fa", letterSpacing: "1px" }}>
                    {fmtCountdown(secondsLeft)}
                </div>
            </div>

            {expired ? (
                <div style={{ padding: "32px 22px", textAlign: "center" }}>
                    <AlertTriangle size={28} color="#f87171" style={{ marginBottom: "12px" }} />
                    <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "6px" }}>Waktu pembayaran telah habis</div>
                    <p style={{ color: "#64748b", fontSize: "13px", lineHeight: "1.7", margin: "0 0 18px" }}>
                        Silakan ulangi proses pelunasan dari awal.
                    </p>
                    <PrimaryBtn variant="amber" onClick={handleRestartTimer}>
                        <RefreshCw size={14} /> Ulangi Pelunasan
                    </PrimaryBtn>
                </div>
            ) : (
            <div style={{ padding: "22px", maxHeight: "60vh", overflowY: "auto" }}>
                <div style={{
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "14px", padding: "16px 18px", marginBottom: "22px",
                    display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: "12px",
                }}>
                    <RowFlex label="Total Tagihan" value={fmt(totalAmount)} />
                    <RowFlex label="Uang Muka (DP)" value={fmt(dpAmount)} color="#34d399" />
                    <RowFlex label="Sisa Pembayaran" value={fmt(bayarAmount)} bold color="#fbbf24" />
                    <RowFlex label="Batas Pelunasan" value={dueDate ? dueDate.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "—"} />
                </div>

                <div style={{ marginBottom: "18px" }}>
                    <label style={labelStyle}>Metode Pembayaran</label>
                    {loadingChannels ? (
                        <div style={{ color: "#64748b", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Memuat rekening...
                        </div>
                    ) : (
                        <div style={{ display: "flex", gap: "10px" }}>
                            <PayMethodBtn
                                icon={<Building2 size={18} />}
                                label="Transfer Bank"
                                active={payMethod === "bank"}
                                onClick={() => { setPayMethod("bank"); setChannelSelected(null); }}
                            />
                            <PayMethodBtn
                                icon={<Smartphone size={18} />}
                                label="E-Wallet"
                                active={payMethod === "ewallet"}
                                onClick={() => { setPayMethod("ewallet"); setChannelSelected(null); }}
                            />
                        </div>
                    )}
                </div>

                {payMethod === "bank" && (
                    (channels.banks || []).length === 0 ? (
                        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "12px", padding: "14px", color: "#475569", fontSize: "12px", marginBottom: "18px" }}>
                            Catering ini belum menambahkan rekening bank.
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "8px", marginBottom: "18px" }}>
                            {channels.banks.map(acc => (
                                <PayOptionBtn
                                    key={acc.id}
                                    label={acc.provider_name}
                                    sub={`${acc.account_number} • a.n. ${acc.account_name}`}
                                    active={channelSelected?.id === acc.id}
                                    onClick={() => setChannelSelected(acc)}
                                />
                            ))}
                        </div>
                    )
                )}

                {payMethod === "ewallet" && (
                    (channels.ewallets || []).length === 0 ? (
                        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "12px", padding: "14px", color: "#475569", fontSize: "12px", marginBottom: "18px" }}>
                            Catering ini belum menambahkan e-wallet.
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "8px", marginBottom: "18px" }}>
                            {channels.ewallets.map(acc => (
                                <PayOptionBtn
                                    key={acc.id}
                                    label={acc.provider_name}
                                    sub={`${acc.account_number} • a.n. ${acc.account_name}`}
                                    active={channelSelected?.id === acc.id}
                                    onClick={() => setChannelSelected(acc)}
                                />
                            ))}
                        </div>
                    )
                )}

                {channelSelected && (
                    <div style={{
                        background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.18)",
                        borderRadius: "12px", padding: "14px 16px", marginBottom: "18px",
                        display: "flex", alignItems: "flex-start", gap: "10px",
                    }}>
                        <Info size={14} color="#34d399" style={{ marginTop: "1px", flexShrink: 0 }} />
                        <div style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.7" }}>
                            Transfer ke <strong style={{ color: "white" }}>{channelSelected.provider_name}</strong>{" "}
                            <strong style={{ color: "#60a5fa" }}>{channelSelected.account_number}</strong>{" "}
                            a.n. <strong style={{ color: "white" }}>{channelSelected.account_name}</strong>
                        </div>
                    </div>
                )}

                <div style={{ marginBottom: "18px" }}>
                    <label style={labelStyle}>Tanggal Pembayaran</label>
                    <input type="date" value={tanggalBayar} onChange={e => setTanggalBayar(e.target.value)} style={inputStyle} />
                </div>

                <div style={{ marginBottom: "18px" }}>
                    <label style={labelStyle}>Nominal Pelunasan</label>
                    <input type="text" value={fmt(bayarAmount)} readOnly disabled
                        style={{ ...inputStyle, opacity: 0.7, cursor: "not-allowed" }} />
                </div>

                <div style={{ marginBottom: "18px" }}>
                    <label style={labelStyle}>Upload Bukti Pembayaran</label>
                    <label style={{
                        display: "block",
                        border: `2px dashed ${buktiPreview ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.08)"}`,
                        borderRadius: "14px", padding: "20px", textAlign: "center",
                        cursor: "pointer",
                        background: buktiPreview ? "rgba(16,185,129,0.04)" : "rgba(255,255,255,0.01)",
                    }}>
                        <input type="file" accept="image/*,.pdf" onChange={handleBukti} style={{ display: "none" }} />
                        {buktiPreview ? (
                            <div>
                                <img src={buktiPreview} alt="bukti" style={{ maxHeight: "160px", maxWidth: "100%", borderRadius: "8px", objectFit: "contain" }} />
                                <div style={{ marginTop: "10px", color: "#34d399", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                                    <CheckCircle2 size={13} /> Bukti terpilih — klik untuk ganti
                                </div>
                            </div>
                        ) : (
                            <>
                                <Upload size={20} color="#475569" style={{ marginBottom: "8px" }} />
                                <div style={{ color: "#94a3b8", fontWeight: "600", fontSize: "13px" }}>Pilih File</div>
                                <div style={{ color: "#475569", fontSize: "11px", marginTop: "4px" }}>PNG, JPG, PDF — maks. 5MB</div>
                            </>
                        )}
                    </label>
                </div>

                <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Catatan (Opsional)</label>
                    <textarea value={catatan} onChange={e => setCatatan(e.target.value)}
                        placeholder="Contoh: Transfer dari BCA atas nama Budi Santoso..."
                        rows={2} style={{ ...inputStyle, resize: "none" }} />
                </div>

                <div style={{
                    display: "flex", alignItems: "flex-start", gap: "8px",
                    color: "#fbbf24", fontSize: "12px", marginBottom: "20px",
                    background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)",
                    borderRadius: "10px", padding: "10px 12px",
                }}>
                    <AlertTriangle size={14} style={{ marginTop: "1px", flexShrink: 0 }} />
                    Pastikan nominal pembayaran sesuai dengan sisa tagihan.
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <PrimaryBtn
                        variant="green"
                        onClick={handleSubmit}
                        disabled={!channelSelected || !bukti}
                        loading={loading}
                        style={{ flex: 1, padding: "13px" }}
                    >
                        <Send size={16} /> Kirim Pembayaran
                    </PrimaryBtn>
                    <PrimaryBtn variant="ghost" onClick={reset} style={{ padding: "13px 22px" }}>
                        Batal
                    </PrimaryBtn>
                </div>
            </div>
            )}
        </GCard>
    );
}

/* ══════════════════════════════════════════════════════════
   VIEW 1 — DAFTAR INVOICE
══════════════════════════════════════════════════════════ */

function ViewDaftar({ invoices, loading, onDetail, totalTagihan }) {
    const [tab, setTab] = useState("semua");

    const tabs = [
        { key: "semua",     label: "Semua" },
        { key: "dp_paid",   label: "Menunggu Pelunasan" },
        { key: "pending",   label: "Menunggu Konfirmasi" },
        { key: "paid",      label: "Lunas" },
        { key: "failed",    label: "Gagal" },
        { key: "cancelled", label: "Dibatalkan" },
    ];

    const count    = (k) => k === "semua" ? invoices.length : invoices.filter(i => effectiveStatus(i) === k).length;
    const filtered = tab === "semua" ? invoices : invoices.filter(i => effectiveStatus(i) === tab);

    const stats = [
        { label: "Total Tagihan", value: fmt(totalTagihan), icon: <ClipboardList size={20} />, color: "#34d399", accent: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
        { label: "Menunggu Pelunasan", value: `${invoices.filter(i => effectiveStatus(i) === "dp_paid").length} Invoice`, icon: <Clock3 size={20} />, color: "#fbbf24", accent: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
        { label: "Lunas", value: `${invoices.filter(i => ["paid","selesai"].includes(effectiveStatus(i))).length} Invoice`, icon: <CheckCircle2 size={20} />, color: "#34d399", accent: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
    ];

    return (
        <div>
            <div style={{
                position: "relative", borderRadius: "24px", padding: "40px",
                background: "linear-gradient(135deg, #0d1117 0%, #0f172a 60%, #131c2e 100%)",
                border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", marginBottom: "24px",
            }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: "-80px", right: "60px", width: "300px", height: "300px", borderRadius: "999px", background: "rgba(59,130,246,0.1)", filter: "blur(90px)", pointerEvents: "none" }} />
                <div style={{ position: "relative", zIndex: 2 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "999px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.22)", color: "#60a5fa", fontSize: "12px", fontWeight: "600", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "22px" }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: "#60a5fa", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
                        Invoice &amp; Pembayaran
                    </div>
                    <h1 style={{ margin: 0, fontSize: "clamp(28px, 3.5vw, 42px)", lineHeight: 1.15, color: "white", fontWeight: "800", letterSpacing: "-1.5px" }}>
                        Invoice Pembayaran
                        <br />
                        <span style={{ background: "linear-gradient(90deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Catering Anda 🧾
                        </span>
                    </h1>
                    <p style={{ margin: "16px 0 0", color: "#64748b", fontSize: "15px", lineHeight: "1.8", maxWidth: "520px" }}>
                        Semua riwayat tagihan, status pembayaran, dan rincian invoice tersedia dalam satu tampilan terpadu.
                    </p>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                {stats.map((item, i) => (
                    <div key={i} style={{
                        background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
                        border: `1px solid ${item.border}`, borderRadius: "20px", padding: "24px",
                        position: "relative", overflow: "hidden", transition: "transform 0.2s ease",
                    }}
                        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                    >
                        <div style={{ position: "absolute", top: 0, left: "24px", right: "24px", height: "2px", borderRadius: "0 0 4px 4px", background: `linear-gradient(90deg, ${item.accent}, transparent)` }} />
                        <div style={{ position: "relative", zIndex: 2 }}>
                            <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: item.bg, border: `1px solid ${item.border}`, color: item.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                                {item.icon}
                            </div>
                            <div style={{ color: "white", fontSize: "24px", fontWeight: "800", lineHeight: 1, letterSpacing: "-0.8px", marginBottom: "8px" }}>{item.value}</div>
                            <div style={{ color: "#475569", fontSize: "13px", fontWeight: "500" }}>{item.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <GCard>
                <div style={{ padding: "24px 28px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <h2 style={{ margin: "0 0 18px", color: "white", fontSize: "18px", fontWeight: "700", letterSpacing: "-0.3px" }}>Daftar Invoice</h2>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {tabs.map(t => {
                            const active = tab === t.key;
                            return (
                                <button key={t.key} onClick={() => setTab(t.key)} style={{
                                    display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "999px",
                                    border: `1px solid ${active ? "transparent" : "rgba(255,255,255,0.07)"}`,
                                    background: active ? "linear-gradient(90deg, #2563eb, #3b82f6)" : "transparent",
                                    color: active ? "white" : "#94a3b8", fontWeight: "600", fontSize: "13px", cursor: "pointer",
                                    fontFamily: "Inter, system-ui, sans-serif",
                                }}>
                                    {t.label}
                                    <span style={{ fontSize: "11px", padding: "2px 7px", borderRadius: "999px", background: active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)", color: active ? "white" : "#64748b" }}>
                                        {count(t.key)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div style={{ overflowX: "auto" }}>
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "60px 20px", color: "#475569" }}>
                            <Loader2 size={32} style={{ animation: "spin 1s linear infinite", marginBottom: "12px" }} />
                            <div style={{ fontSize: "14px" }}>Memuat data invoice...</div>
                        </div>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "780px" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                    {["Invoice ID", "Tanggal", "Jatuh Tempo", "Layanan", "Tipe", "Total", "DP / Sisa", "Status", "Aksi"].map(h => (
                                        <th key={h} style={{ padding: "14px 20px", textAlign: "left", color: "#475569", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length > 0 ? filtered.map((inv, idx) => {
                                    const isHarian   = inv.order?.type === "harian";
                                    const dueDate    = !isHarian ? hitungJatuhTempo(inv.order?.delivery_date || inv.order?.order_date) : null;
                                    const sisa       = dueDate ? sisaHari(dueDate) : null;
                                    const eStatus    = effectiveStatus(inv);
                                    const overdue    = sisa !== null && sisa < 0 && !["paid","selesai","cancelled","failed"].includes(eStatus);
                                    const nearDue    = sisa !== null && sisa <= 2 && sisa >= 0 && !["paid","selesai","cancelled","failed"].includes(eStatus);
                                    const dpAmount   = inv.dp_amount || 0;
                                    const totalAmt   = inv.total_amount || 0;
                                    const remaining  = totalAmt - dpAmount;

                                    return (
                                        <tr key={inv.id} style={{
                                            borderBottom: idx < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                                            transition: "background 0.15s",
                                            background: overdue ? "rgba(239,68,68,0.03)" : "transparent",
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.background = overdue ? "rgba(239,68,68,0.05)" : "rgba(255,255,255,0.02)"}
                                            onMouseLeave={e => e.currentTarget.style.background = overdue ? "rgba(239,68,68,0.03)" : "transparent"}
                                        >
                                            <td style={tdStyle}><span style={{ color: "#60a5fa", fontWeight: "700", fontSize: "13px" }}>{inv.invoice_number || `INV-${inv.id}`}</span></td>
                                            <td style={tdStyle}><div style={{ color: "white", fontSize: "13px" }}>{inv.created_at ? new Date(inv.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</div></td>
                                            <td style={tdStyle}>
                                                {isHarian ? (
                                                    <span style={{ color: "#34d399", fontSize: "12px", fontWeight: "600" }}>Lunas otomatis</span>
                                                ) : dueDate ? (
                                                    <div>
                                                        <div style={{ color: overdue ? "#f87171" : nearDue ? "#fbbf24" : "#94a3b8", fontSize: "13px", fontWeight: overdue || nearDue ? "700" : "400" }}>
                                                            {dueDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                                                        </div>
                                                        {!["paid","selesai","cancelled","failed"].includes(eStatus) && sisa !== null && (
                                                            <div style={{ fontSize: "11px", color: overdue ? "#f87171" : nearDue ? "#fbbf24" : "#475569", marginTop: "2px" }}>
                                                                {overdue ? `Lewat ${Math.abs(sisa)} hari` : sisa === 0 ? "Hari ini!" : `${sisa} hari lagi`}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : <span style={{ color: "#475569" }}>—</span>}
                                            </td>
                                            <td style={tdStyle}><div style={{ color: "white", fontSize: "14px" }}>{inv.order?.catering_package?.name || inv.order?.menu?.name || "Catering"}</div></td>
                                            <td style={tdStyle}><CateringTypeBadge isHarian={isHarian} /></td>
                                            <td style={tdStyle}><span style={{ color: "#34d399", fontWeight: "700", fontSize: "14px" }}>{fmt(totalAmt)}</span></td>
                                            <td style={tdStyle}>
                                                {isHarian ? <span style={{ color: "#34d399", fontSize: "12px" }}>Lunas otomatis</span> :
                                                    dpAmount > 0 ? (
                                                        <div>
                                                            <div style={{ fontSize: "12px", color: "#34d399" }}>DP: {fmt(dpAmount)}</div>
                                                            <div style={{ fontSize: "12px", color: remaining > 0 ? "#fbbf24" : "#34d399" }}>Sisa: {fmt(remaining)}</div>
                                                        </div>
                                                    ) : <span style={{ color: "#475569", fontSize: "12px" }}>—</span>}
                                            </td>
                                            <td style={tdStyle}><Badge status={eStatus} /></td>
                                            <td style={tdStyle}>
                                                <button onClick={() => onDetail(inv)} style={{
                                                    display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "10px",
                                                    border: "1px solid rgba(255,255,255,0.07)", background: "transparent", color: "#60a5fa",
                                                    fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif",
                                                }}
                                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(96,165,250,0.08)"}
                                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                                >
                                                    <Eye size={13} /> Lihat
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr><td colSpan={9} style={{ padding: "64px 20px", textAlign: "center" }}>
                                        <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                                            <FileText size={22} color="#334155" />
                                        </div>
                                        <div style={{ color: "white", fontWeight: "700", fontSize: "17px", marginBottom: "8px" }}>Belum ada invoice</div>
                                        <p style={{ color: "#475569", margin: 0, fontSize: "14px" }}>Invoice akan muncul otomatis setelah pesanan Anda disetujui owner.</p>
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {!loading && filtered.length > 0 && (
                    <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(255,255,255,0.05)", color: "#475569", fontSize: "13px" }}>
                        Menampilkan <strong style={{ color: "white" }}>{filtered.length}</strong> dari <strong style={{ color: "white" }}>{invoices.length}</strong> invoice
                    </div>
                )}
            </GCard>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   VIEW 2 — DETAIL INVOICE
══════════════════════════════════════════════════════════ */

function ViewDetail({ invoice, onBack, onRiwayat, onRefresh }) {
    const isHarian    = invoice.order?.type === "harian";
    const eStatus     = effectiveStatus(invoice);
    const sudahLunas  = ["paid", "selesai"].includes(eStatus);
    const isCancelled = eStatus === "cancelled";
    const isPelunasan = !isHarian && !sudahLunas && !isCancelled;
    const isPending   = eStatus === "pending";
    const isFailed    = eStatus === "failed";

    const dpAmount    = invoice.dp_amount || 0;
    const totalAmount = invoice.total_amount || 0;
    const remaining   = totalAmount - dpAmount;

    const deliveryDate = invoice.order?.delivery_date || invoice.order?.order_date;
    const dueDate       = !isHarian ? hitungJatuhTempo(deliveryDate) : null;

    const order        = invoice.order || {};
    const pkg           = order.catering_package;
    const menu           = order.menu;
    const portions       = order.portions || order.jumlah_porsi || order.quantity || 1;
    const itemName       = pkg?.name || menu?.name || invoice.items?.[0]?.description || "Layanan Catering";
    const itemUnitPrice  = pkg?.price ?? menu?.price ?? (invoice.items?.[0]?.unit_price) ?? (portions ? Math.round(totalAmount / portions) : totalAmount);
    const itemNote       = isHarian
        ? (order.duration_days ? `Catering harian selama ${order.duration_days} hari — lunas otomatis saat pesanan disetujui` : "Catering harian — lunas otomatis saat pesanan disetujui")
        : "DP 50% otomatis terbayar saat pesanan disetujui owner";

    const rincianItems = (invoice.items && invoice.items.length > 0)
        ? invoice.items
        : [{
            description: itemName,
            quantity: portions,
            unit_price: itemUnitPrice,
            total_price: totalAmount,
            note: itemNote,
        }];

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", color: "#64748b", fontSize: "14px" }}>
                <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "Inter, system-ui, sans-serif", fontSize: "14px" }}>
                    <ArrowLeft size={14} /> Invoice
                </button>
                <ChevronRight size={12} />
                <span style={{ color: "white" }}>Detail Invoice</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                    <div style={{ marginBottom: "8px" }}><CateringTypeBadge isHarian={isHarian} size="lg" /></div>
                    <h1 style={{ margin: "0 0 6px", fontSize: "clamp(24px, 3vw, 34px)", fontWeight: "800", letterSpacing: "-1px" }}>Detail Invoice</h1>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>{invoice.invoice_number || `INV-${invoice.id}`}</p>
                </div>
                <PrimaryBtn variant="ghost" onClick={() => window.open(`/klien/invoice/${invoice.id}/pdf`, "_blank")}>
                    <Download size={15} /> Unduh PDF
                </PrimaryBtn>
            </div>

            {!isHarian && isPelunasan && dueDate && (
                <div style={{ marginBottom: "20px" }}>
                    <DueDateBanner dueDate={dueDate} />
                </div>
            )}

            {isPending && (
                <div style={{ marginBottom: "20px", background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "14px", padding: "16px 18px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <Clock3 size={18} color="#a78bfa" style={{ flexShrink: 0 }} />
                    <div>
                        <div style={{ color: "#a78bfa", fontWeight: "700", fontSize: "14px" }}>Menunggu Konfirmasi Owner</div>
                        <div style={{ color: "#64748b", fontSize: "13px", marginTop: "2px" }}>Bukti pelunasan Anda sedang diverifikasi di halaman Revenue Owner. Jika disetujui, invoice otomatis Lunas.</div>
                    </div>
                </div>
            )}

            {isFailed && (
                <div style={{ marginBottom: "20px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "14px", padding: "16px 18px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <XCircle size={18} color="#f87171" style={{ flexShrink: 0 }} />
                    <div>
                        <div style={{ color: "#f87171", fontWeight: "700", fontSize: "14px" }}>Pembayaran Ditolak Owner</div>
                        <div style={{ color: "#64748b", fontSize: "13px", marginTop: "2px" }}>Bukti pelunasan tidak diterima. Silakan ulangi pembayaran pelunasan.</div>
                    </div>
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <GCard style={{ padding: "24px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            {[
                                { label: "Invoice ID",      value: invoice.invoice_number || `INV-${invoice.id}`, valueColor: "#60a5fa" },
                                { label: "Tanggal Dibuat",  value: invoice.created_at ? new Date(invoice.created_at).toLocaleDateString("id-ID") : "—" },
                                {
                                    label: "Jatuh Tempo Pelunasan",
                                    value: isHarian ? "Tidak ada (lunas otomatis)" : dueDate ? dueDate.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "—",
                                    valueColor: !isHarian && dueDate && sisaHari(dueDate) !== null && sisaHari(dueDate) <= 3 ? "#fbbf24" : undefined,
                                },
                                { label: "Tanggal Pengiriman", value: deliveryDate ? new Date(deliveryDate).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "—" },
                            ].map(({ label, value, valueColor }) => (
                                <div key={label}>
                                    <div style={{ color: "#64748b", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{label}</div>
                                    <div style={{ fontWeight: "700", color: valueColor || "white", fontSize: "15px" }}>{value}</div>
                                </div>
                            ))}
                            <div>
                                <div style={{ color: "#64748b", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Status</div>
                                <Badge status={eStatus} size="lg" />
                            </div>
                            <div>
                                <div style={{ color: "#64748b", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Tipe Catering</div>
                                <CateringTypeBadge isHarian={isHarian} />
                            </div>
                        </div>
                    </GCard>

                    <GCard style={{ padding: "24px" }}>
                        <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "18px", letterSpacing: "-0.2px" }}>Informasi Penagihan</div>
                        <div>
                            <div style={{ color: "#64748b", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Ditujukan Kepada</div>
                            <div style={{ fontWeight: "700", fontSize: "15px" }}>{invoice.client?.name || "—"}</div>
                            <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>{invoice.client?.address || ""}</div>
                        </div>
                    </GCard>

                    <GCard style={{ overflow: "hidden" }}>
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ fontWeight: "700", fontSize: "16px" }}>Rincian Item</div>
                            <CateringTypeBadge isHarian={isHarian} />
                        </div>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                        {["No", "Deskripsi", "Jumlah", "Harga Satuan", "Total"].map(h => (
                                            <th key={h} style={{ padding: "12px 20px", textAlign: "left", color: "#475569", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rincianItems.map((item, i) => (
                                        <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                            <td style={{ ...tdStyle, color: "#64748b" }}>{i + 1}</td>
                                            <td style={tdStyle}>
                                                <div>{item.description}</div>
                                                {item.note && <div style={{ color: "#64748b", fontSize: "12px", marginTop: "3px" }}>{item.note}</div>}
                                            </td>
                                            <td style={tdStyle}>{item.quantity || 1} {isHarian ? "porsi" : "paket"}</td>
                                            <td style={tdStyle}>{fmt(item.unit_price || item.price || 0)}</td>
                                            <td style={{ ...tdStyle, color: "#34d399", fontWeight: "700" }}>{fmt(item.total_price || item.total_amount || totalAmount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GCard>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <GCard style={{ padding: "24px" }}>
                        <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "16px" }}>Ringkasan Pembayaran</div>
                        <RowFlex label="Total" value={fmt(totalAmount)} bold />
                        {isHarian ? (
                            <>
                                <Divider />
                                <RowFlex label="Dibayar Lunas" value={fmt(totalAmount)} color="#34d399" bold />
                                <RowFlex label="Sisa Tagihan" value="Tidak ada" color="#34d399" />
                            </>
                        ) : (
                            <>
                                <RowFlex label="DP Terbayar (50%)" value={`- ${fmt(dpAmount)}`} color="#34d399" />
                                <Divider />
                                <RowFlex
                                    label={isPelunasan ? "Sisa Pelunasan (50%)" : "Sisa Tagihan"}
                                    value={fmt(remaining > 0 ? remaining : 0)}
                                    bold
                                    color={remaining > 0 ? "#fbbf24" : "#34d399"}
                                />
                            </>
                        )}
                    </GCard>

                    {!isHarian && isPelunasan && (
                        <PelunasanPaymentForm invoice={invoice} onSuccess={onRefresh} />
                    )}

                    {isHarian && (
                        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "14px", padding: "18px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#34d399", fontWeight: "700", fontSize: "14px", marginBottom: "10px" }}>
                                <Zap size={16} /> Lunas Otomatis
                            </div>
                            <div style={{ color: "#64748b", fontSize: "13px", lineHeight: "1.7" }}>Catering harian otomatis dinyatakan lunas begitu pesanan disetujui owner. Tidak ada tagihan tersisa.</div>
                        </div>
                    )}

                    {!isHarian && sudahLunas && (
                        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "14px", padding: "18px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#34d399", fontWeight: "700", fontSize: "14px", marginBottom: "10px" }}>
                                <CheckCircle2 size={16} /> Pembayaran Lunas
                            </div>
                            <div style={{ color: "#64748b", fontSize: "13px", lineHeight: "1.7" }}>Pelunasan telah dikonfirmasi owner. Invoice ini sudah lunas.</div>
                        </div>
                    )}

                    <PrimaryBtn variant="ghost" onClick={onRiwayat} style={{ width: "100%", padding: "12px" }}>
                        <History size={15} /> Riwayat Pembayaran
                    </PrimaryBtn>

                    {!isHarian && isPelunasan && dueDate && (
                        <div style={{ background: "rgba(245,158,11,0.08)", borderRadius: "14px", padding: "16px", border: "1px solid rgba(245,158,11,0.2)", color: "#fbbf24", fontSize: "13px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                            <AlertTriangle size={15} style={{ marginTop: "1px", flexShrink: 0 }} />
                            <span>Pelunasan paling lambat <strong>{dueDate.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</strong> (3 hari sebelum pengiriman).</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   VIEW 3 — RIWAYAT PEMBAYARAN
══════════════════════════════════════════════════════════ */

function ViewRiwayat({ invoice, onBack }) {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading]   = useState(true);

    const isHarian     = invoice.order?.type === "harian";
    const eStatus      = effectiveStatus(invoice);
    const dpAmount     = invoice.dp_amount || 0;
    const totalAmount  = invoice.total_amount || 0;
    const deliveryDate = invoice.order?.delivery_date || invoice.order?.order_date;
    const dueDate      = !isHarian ? hitungJatuhTempo(deliveryDate) : null;

    useEffect(() => {
        const doFetch = async () => {
            try {
                const res = await axios.get(`/klien/invoice/${invoice.id}/payments`);
                setPayments(res.data.data || []);
            } catch { setPayments([]); }
            finally { setLoading(false); }
        };
        doFetch();
    }, [invoice.id]);

    const timeline = isHarian
        ? [
            { label: "Pesanan Disetujui Owner", desc: "Owner menyetujui pesanan harian Anda.", time: invoice.created_at, done: true },
            { label: "Lunas Otomatis", desc: "Pembayaran otomatis dinyatakan lunas — tidak ada tagihan tersisa.", time: invoice.created_at, done: true },
          ]
        : [
            { label: "Pesanan Disetujui & DP Terbayar", desc: "Owner menyetujui pesanan dan DP 50% otomatis tercatat terbayar.", time: invoice.created_at, done: true },
            { label: "Jatuh Tempo Pelunasan", desc: dueDate ? `Batas pelunasan: ${dueDate.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}` : "3 hari sebelum pengiriman.", time: null, done: ["paid","selesai"].includes(eStatus), warning: dueDate && sisaHari(dueDate) !== null && sisaHari(dueDate) < 0 && !["paid","selesai"].includes(eStatus) },
            { label: "Pelunasan Dikirim", desc: "Klien mengirim sisa 50% dan upload bukti.", time: payments.find(p => p.type === "pelunasan")?.created_at, done: payments.some(p => p.type === "pelunasan") },
            { label: "Lunas",             desc: "Owner mengkonfirmasi pelunasan di halaman Revenue. Invoice selesai.", time: payments.find(p => p.type === "pelunasan" && p.status === "confirmed")?.updated_at, done: ["paid","selesai"].includes(eStatus) },
          ];

    const confirmedPelunasan = payments.filter(p => p.type === "pelunasan" && p.status === "confirmed").reduce((a, p) => a + parseFloat(p.amount || 0), 0);
    const sisaTagihan        = isHarian ? 0 : Math.max(0, totalAmount - dpAmount - confirmedPelunasan);

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", color: "#64748b", fontSize: "14px" }}>
                <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "Inter, system-ui, sans-serif", fontSize: "14px" }}>
                    <ArrowLeft size={14} /> Detail Invoice
                </button>
                <ChevronRight size={12} />
                <span style={{ color: "white" }}>Riwayat Pembayaran</span>
            </div>

            <h1 style={{ margin: "0 0 24px", fontSize: "clamp(24px, 3vw, 34px)", fontWeight: "800", letterSpacing: "-1px" }}>Riwayat Pembayaran</h1>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <GCard style={{ padding: "20px 24px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div style={{ fontWeight: "700", color: "#60a5fa", marginBottom: "4px" }}>{invoice.invoice_number || `INV-${invoice.id}`}</div>
                                <div style={{ color: "#64748b", fontSize: "13px" }}>
                                    Total: <strong style={{ color: "white" }}>{fmt(totalAmount)}</strong>
                                    {!isHarian && dueDate && (<span style={{ fontSize: "11px", color: "#64748b" }}>{" · "}Jatuh tempo: {dueDate.toLocaleDateString("id-ID")}</span>)}
                                </div>
                            </div>
                            <Badge status={eStatus} size="lg" />
                        </div>
                    </GCard>

                    <GCard style={{ padding: "28px" }}>
                        <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "24px", letterSpacing: "-0.2px" }}>Alur Pembayaran</div>
                        {loading ? (
                            <div style={{ textAlign: "center", padding: "30px", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Memuat...
                            </div>
                        ) : (
                            <div>
                                {timeline.map((item, i) => (
                                    <div key={i} style={{ display: "flex", gap: "16px" }}>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0, background: item.warning ? "rgba(239,68,68,0.1)" : item.done ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)", border: `2px solid ${item.warning ? "rgba(239,68,68,0.4)" : item.done ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: item.warning ? "#f87171" : item.done ? "#34d399" : "#475569" }}>
                                                {item.warning ? <AlertTriangle size={13} /> : item.done ? <CheckCircle2 size={14} /> : <Clock3 size={13} />}
                                            </div>
                                            {i < timeline.length - 1 && <div style={{ width: "2px", flex: 1, minHeight: "36px", background: item.done ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)", margin: "4px 0" }} />}
                                        </div>
                                        <div style={{ paddingBottom: i < timeline.length - 1 ? "24px" : 0 }}>
                                            <div style={{ fontWeight: "700", color: item.warning ? "#f87171" : item.done ? "white" : "#475569" }}>{item.label}</div>
                                            <div style={{ color: "#64748b", fontSize: "13px", marginTop: "3px" }}>{item.desc}</div>
                                            {item.time && <div style={{ color: "#475569", fontSize: "12px", marginTop: "4px" }}>{new Date(item.time).toLocaleDateString("id-ID")} · {new Date(item.time).toLocaleTimeString("id-ID")}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </GCard>

                    {!isHarian && payments.length > 0 && (
                        <GCard style={{ overflow: "hidden" }}>
                            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontWeight: "700", fontSize: "16px" }}>Detail Pembayaran</div>
                            {payments.map((p, i) => (
                                <div key={i} style={{ padding: "20px 24px", borderBottom: i < payments.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                        <div>
                                            <div style={{ fontWeight: "700" }}>{p.type === "pelunasan" ? "Pelunasan (50%)" : "Pembayaran"}</div>
                                            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{p.payment_channel?.provider_name || "—"}</div>
                                        </div>
                                        <Badge status={p.status === "confirmed" ? "paid" : p.status === "rejected" ? "failed" : "pending"} />
                                    </div>
                                    <RowFlex label="Jumlah" value={fmt(p.amount)} bold />
                                    <RowFlex label="Rekening/No." value={p.payment_channel?.account_number || "—"} />
                                    <RowFlex label="a.n." value={p.payment_channel?.account_name || "—"} />
                                    <RowFlex label="Tanggal Kirim" value={p.created_at ? new Date(p.created_at).toLocaleDateString("id-ID") : "—"} />
                                    {p.status === "confirmed" && <RowFlex label="Dikonfirmasi" value={p.updated_at ? new Date(p.updated_at).toLocaleDateString("id-ID") : "—"} color="#34d399" />}
                                    {p.status === "rejected" && <RowFlex label="Ditolak" value="Pembayaran tidak diterima owner" color="#f87171" />}
                                    {p.proof_url && (
                                        <div style={{ marginTop: "10px" }}>
                                            <a href={p.proof_url} target="_blank" rel="noreferrer" style={{ color: "#60a5fa", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", padding: "8px 14px", borderRadius: "10px", fontWeight: "600" }}>
                                                <Eye size={13} /> Lihat Bukti Transfer
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </GCard>
                    )}
                </div>

                <div>
                    <GCard style={{ padding: "24px", position: "sticky", top: "20px" }}>
                        <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "16px" }}>Ringkasan</div>
                        <RowFlex label="Total Invoice" value={fmt(totalAmount)} />
                        {isHarian ? (
                            <>
                                <RowFlex label="Dibayar Lunas" value={fmt(totalAmount)} color="#34d399" />
                                <Divider />
                                <RowFlex label="Sisa Tagihan" value="Tidak ada" bold color="#34d399" />
                            </>
                        ) : (
                            <>
                                <RowFlex label="DP Terbayar" value={fmt(dpAmount)} color="#34d399" />
                                <RowFlex label="Pelunasan" value={fmt(confirmedPelunasan)} color="#34d399" />
                                <Divider />
                                <RowFlex label="Sisa Tagihan" value={fmt(sisaTagihan)} bold color={sisaTagihan > 0 ? "#fbbf24" : "#34d399"} />
                            </>
                        )}
                        {!isHarian && dueDate && !["paid","selesai","cancelled","failed"].includes(eStatus) && (
                            <div style={{ marginTop: "14px" }}>
                                <DueDateBanner dueDate={dueDate} />
                            </div>
                        )}
                    </GCard>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   ROOT COMPONENT
══════════════════════════════════════════════════════════ */

export default function InvoiceKlien() {
    const [invoices, setInvoices]         = useState([]);
    const [totalTagihan, setTotalTagihan] = useState(0);
    const [loading, setLoading]           = useState(true);
    const [view, setView]                 = useState("daftar");
    const [activeInvoice, setActiveInvoice] = useState(null);

    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.background = "#020817";
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/klien/invoice");
            setInvoices(res.data.data || []);
            setTotalTagihan(res.data.total_tagihan || 0);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const refreshActiveInvoice = async () => {
        if (!activeInvoice) return;
        try {
            const res = await axios.get(`/klien/invoice/${activeInvoice.id}`);
            setActiveInvoice(res.data.data || res.data);
            loadInvoices();
        } catch (e) { loadInvoices(); }
    };

    const handleDetail  = (inv) => { setActiveInvoice(inv); setView("detail"); };
    const handleRiwayat = ()    => setView("riwayat");
    const goBack        = ()    => setView("daftar");
    const goDetail      = ()    => setView("detail");

    return (
        <div style={{ minHeight: "100vh", background: "#020817", color: "white" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                .inv-wrap * { font-family: 'Inter', system-ui, sans-serif; box-sizing: border-box; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
                textarea:focus, input:focus { outline: 1px solid rgba(59,130,246,0.5) !important; }
                @media (max-width: 860px) { .inv-two-col { grid-template-columns: 1fr !important; } }
            `}</style>

            <NavbarKlien />

            <div className="inv-wrap" style={{ padding: "30px", maxWidth: "1400px", margin: "0 auto" }}>
                {view === "daftar"  && <ViewDaftar invoices={invoices} loading={loading} totalTagihan={totalTagihan} onDetail={handleDetail} />}
                {view === "detail"  && activeInvoice && <ViewDetail invoice={activeInvoice} onBack={goBack} onRiwayat={handleRiwayat} onRefresh={refreshActiveInvoice} />}
                {view === "riwayat" && activeInvoice && <ViewRiwayat invoice={activeInvoice} onBack={goDetail} />}
            </div>
        </div>
    );
}