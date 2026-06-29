// resources/js/pages/owner/OrdersOwner.jsx
// approve → auto kurangi stok; jika stok kurang tampilkan toast error detail
// process → ubah status ke preparing
// dispatch → kurir ditugaskan OTOMATIS oleh backend (round-robin)

import {
    ShoppingCart, Clock, CheckCircle2, XCircle,
    ChefHat, Truck, Bell, X, MapPin, ArrowUpRight,
    AlertTriangle, LayoutDashboard,
} from "lucide-react";
import OwnerLayout from "../../layouts/OwnerLayout";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

/* ── Design tokens ─────────────────────────────────────────── */
const C = {
    bg:      "#080C14",
    surface: "#0F1623",
    card:    "#141E30",
    border:  "rgba(255,255,255,0.07)",
    borderMd:"rgba(255,255,255,0.10)",
    text:    "#F8FAFC",
    muted:   "#64748B",
    sub:     "#94A3B8",
    font:    "'Inter', system-ui, -apple-system, sans-serif",
};

const bars = {
    blue:   "linear-gradient(90deg,#3b82f6,#60a5fa)",
    amber:  "linear-gradient(90deg,#f59e0b,#fbbf24)",
    green:  "linear-gradient(90deg,#10b981,#34d399)",
    red:    "linear-gradient(90deg,#ef4444,#f87171)",
};

// ─── Status constants (SESUAI ENUM DATABASE) ──────────────────
// pending -> confirmed -> preparing -> dispatched -> on_delivery -> delivered
// (atau -> cancelled dari pending)
const STATUS = {
    PENDING:     "pending",
    CONFIRMED:   "confirmed",
    PREPARING:   "preparing",
    DISPATCHED:  "dispatched",
    ON_DELIVERY: "on_delivery",
    DELIVERED:   "delivered",
    CANCELLED:   "cancelled",
};

function statusColor(s) {
    switch (s?.toLowerCase()) {
        case STATUS.CONFIRMED:   return "#22c55e";
        case STATUS.PREPARING:   return "#3b82f6";
        case STATUS.DISPATCHED:  return "#a855f7";
        case STATUS.ON_DELIVERY: return "#06b6d4";
        case STATUS.DELIVERED:   return "#10b981";
        case STATUS.CANCELLED:   return "#ef4444";
        default:                 return "#f59e0b";
    }
}

function statusLabel(s) {
    switch (s?.toLowerCase()) {
        case STATUS.PENDING:     return "Menunggu";
        case STATUS.CONFIRMED:   return "Disetujui";
        case STATUS.PREPARING:   return "Diproses";
        case STATUS.DISPATCHED:  return "Dikirim";
        case STATUS.ON_DELIVERY: return "Dalam Perjalanan";
        case STATUS.DELIVERED:   return "Selesai";
        case STATUS.CANCELLED:   return "Ditolak";
        default:                 return s || "-";
    }
}

/* ── Toast ── */
function Toast({ toasts, onDismiss }) {
    return (
        <div style={{
            position: "fixed", top: 20, right: 20, zIndex: 9999,
            display: "flex", flexDirection: "column", gap: "8px",
            fontFamily: C.font,
        }}>
            {toasts.map((t) => (
                <div key={t.id} style={{
                    background: C.card,
                    border: `1px solid ${t.color || "rgba(99,102,241,0.35)"}`,
                    borderRadius: "12px", padding: "14px 16px",
                    minWidth: "300px", maxWidth: "380px",
                    display: "flex", alignItems: "flex-start", gap: "12px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    animation: "toastIn 0.3s ease",
                }}>
                    <div style={{ color: t.color || "#818cf8", marginTop: "2px", flexShrink: 0 }}>
                        {t.isError ? <AlertTriangle size={16} /> : <Bell size={16} />}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: C.text, marginBottom: "3px" }}>
                            {t.title}
                        </div>
                        <div style={{ fontSize: "12px", color: C.sub, lineHeight: 1.5 }}>
                            {t.message}
                        </div>
                        {t.detail && (
                            <div style={{
                                marginTop: "6px", padding: "6px 8px", borderRadius: "6px",
                                background: "rgba(239,68,68,0.10)",
                                border: "0.5px solid rgba(239,68,68,0.25)",
                                fontSize: "11.5px", color: "#fca5a5",
                            }}>
                                {t.detail}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => onDismiss(t.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 0, marginTop: "2px", flexShrink: 0 }}
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}
            <style>{`@keyframes toastIn { from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }`}</style>
        </div>
    );
}

/* ── TrackingModal ── */
function TrackingModal({ order, onClose }) {
    if (!order) return null;
    const s = order.status?.toLowerCase();
    const steps = [
        { key: STATUS.CONFIRMED,   icon: <CheckCircle2 size={14} />, label: "Pesanan Disetujui", desc: "Owner telah menyetujui pesanan." },
        { key: STATUS.PREPARING,   icon: <ChefHat size={14} />,      label: "Diproses di Dapur", desc: order.kurir ? `Disiapkan. Kurir: ${order.kurir.name}.` : "Sedang disiapkan." },
        { key: STATUS.DISPATCHED,  icon: <Truck size={14} />,        label: "Pesanan Dikirim",   desc: order.estimasi_menit ? `Estimasi tiba: ${order.estimasi_menit} menit.` : "Dalam perjalanan." },
        { key: STATUS.ON_DELIVERY, icon: <MapPin size={14} />,       label: "Dalam Perjalanan",  desc: "Kurir sedang menuju lokasi." },
        { key: STATUS.DELIVERED,   icon: <CheckCircle2 size={14} />, label: "Pesanan Selesai",   desc: "Pesanan telah diterima." },
    ];
    const flowOrder  = [STATUS.CONFIRMED, STATUS.PREPARING, STATUS.DISPATCHED, STATUS.ON_DELIVERY, STATUS.DELIVERED];
    const currentIdx = flowOrder.indexOf(s);

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(4px)", zIndex: 1000,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: C.font,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: C.surface, border: `0.5px solid ${C.borderMd}`,
                    borderRadius: "14px", padding: "28px",
                    minWidth: "360px", maxWidth: "440px", width: "100%",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
                }}
            >
                <div style={{ marginBottom: "24px" }}>
                    <div style={{ fontSize: "10px", color: "#60a5fa", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
                        Live Tracking
                    </div>
                    <div style={{ fontSize: "17px", fontWeight: 800, color: C.text, letterSpacing: "-.4px" }}>
                        #{order.id} — {order.customer_name}
                    </div>
                    <div style={{ fontSize: "12px", color: C.muted, marginTop: "3px" }}>
                        {order.menu?.name} × {order.quantity}
                    </div>
                </div>

                <div style={{ position: "relative", paddingLeft: "28px" }}>
                    <div style={{ position: "absolute", left: "7px", top: "10px", bottom: "10px", width: "1px", background: C.border }} />
                    {steps.map((step, i) => {
                        const done   = i <= currentIdx;
                        const active = i === currentIdx;
                        return (
                            <div key={step.key} style={{ position: "relative", marginBottom: i < steps.length - 1 ? "22px" : 0 }}>
                                <div style={{
                                    position: "absolute", left: "-28px", top: "2px",
                                    width: "16px", height: "16px", borderRadius: "50%",
                                    background: done ? (active ? "#3b82f6" : "#16a34a") : "rgba(255,255,255,0.04)",
                                    border: `1.5px solid ${done ? (active ? "#60a5fa" : "#4ade80") : "rgba(255,255,255,0.08)"}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: done ? "white" : "#1e293b",
                                    boxShadow: active ? "0 0 12px rgba(59,130,246,0.5)" : "none",
                                }}>
                                    {step.icon}
                                </div>
                                <div style={{ fontSize: "13px", fontWeight: 700, color: done ? C.text : "#1e293b", marginBottom: "3px" }}>
                                    {step.label}
                                </div>
                                <div style={{ fontSize: "12px", color: done ? C.sub : "#1e293b", lineHeight: 1.5 }}>
                                    {step.desc}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {s === STATUS.CANCELLED && (
                    <div style={{
                        marginTop: "20px", padding: "12px 14px",
                        background: "rgba(239,68,68,0.08)", border: "0.5px solid rgba(239,68,68,0.18)",
                        borderRadius: "8px", color: "#fca5a5", fontSize: "13px",
                    }}>
                        Pesanan ini telah ditolak.
                    </div>
                )}

                {(s === STATUS.DISPATCHED || s === STATUS.ON_DELIVERY) && (
                    <div style={{
                        marginTop: "16px", padding: "12px 14px",
                        background: "rgba(168,85,247,0.08)", border: "0.5px solid rgba(168,85,247,0.2)",
                        borderRadius: "8px", color: "#d8b4fe", fontSize: "13px", fontWeight: 600,
                        display: "flex", flexDirection: "column", gap: "4px",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Truck size={14} /> Estimasi: {order.estimasi_menit ?? "—"} menit
                        </div>
                        {order.kurir && (
                            <div style={{ fontSize: "12px", color: "#c4b5fd" }}>
                                Kurir: {order.kurir.name}{order.kurir.phone ? ` · ${order.kurir.phone}` : ""}
                            </div>
                        )}
                    </div>
                )}

                <button
                    onClick={onClose}
                    style={{
                        marginTop: "22px", width: "100%", padding: "10px 0",
                        background: "rgba(255,255,255,0.03)", border: `0.5px solid ${C.borderMd}`,
                        borderRadius: "8px", color: C.sub, cursor: "pointer",
                        fontSize: "13px", fontWeight: 600, fontFamily: C.font,
                    }}
                >
                    Tutup
                </button>
            </div>
        </div>
    );
}

/* ── StatCard ── */
function StatCard({ label, value, icon: Icon, bar }) {
    return (
        <div style={{
            background: C.surface, border: `0.5px solid ${C.border}`,
            borderRadius: "12px", padding: "18px 20px",
            position: "relative", overflow: "hidden", fontFamily: C.font,
        }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: bar }} />
            <div style={{ fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: ".7px", marginBottom: "10px" }}>
                {label}
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div style={{ fontSize: "30px", fontWeight: 800, color: C.text, letterSpacing: "-1.2px", lineHeight: 1 }}>
                    {value ?? "—"}
                </div>
                <div style={{
                    width: "38px", height: "38px", borderRadius: "9px",
                    background: C.card, border: `0.5px solid ${C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: C.muted, flexShrink: 0,
                }}>
                    <Icon size={18} strokeWidth={1.7} />
                </div>
            </div>
        </div>
    );
}

/* ── ActionBtn ── */
function ActionBtn({ label, icon, onClick, color, disabled, loading }) {
    const active = !disabled && !loading;
    const styles = {
        green:  { bg: "rgba(16,185,129,.12)",  border: "rgba(16,185,129,.30)",  text: "#34d399" },
        red:    { bg: "rgba(239,68,68,.12)",   border: "rgba(239,68,68,.25)",   text: "#fca5a5" },
        blue:   { bg: "rgba(99,102,241,.12)",  border: "rgba(99,102,241,.30)",  text: "#a5b4fc" },
        purple: { bg: "rgba(168,85,247,.12)",  border: "rgba(168,85,247,.28)",  text: "#d8b4fe" },
    };
    const s = styles[color] || styles.blue;
    return (
        <button
            onClick={onClick}
            disabled={!active}
            style={{
                height: "28px", padding: "0 11px", borderRadius: "7px",
                border: `0.5px solid ${active ? s.border : C.border}`,
                background: active ? s.bg : "rgba(255,255,255,0.02)",
                color: active ? s.text : C.muted,
                cursor: active ? "pointer" : "not-allowed",
                fontWeight: 600, fontSize: "11.5px", fontFamily: C.font,
                whiteSpace: "nowrap", opacity: loading ? 0.6 : 1,
                transition: "all 0.15s",
                display: "inline-flex", alignItems: "center", gap: "5px",
            }}
        >
            {loading ? "···" : <>{icon}{label}</>}
        </button>
    );
}

/* ── EmptyState ── */
function EmptyState() {
    return (
        <div style={{ padding: "48px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", fontFamily: C.font }}>
            <div style={{
                width: "60px", height: "60px", borderRadius: "16px",
                background: C.card, border: `0.5px solid ${C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: C.muted, marginBottom: "16px",
            }}>
                <ShoppingCart size={26} strokeWidth={1.4} />
            </div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: C.text, marginBottom: "6px" }}>Belum Ada Pesanan</div>
            <p style={{ fontSize: "13px", color: C.muted, lineHeight: "1.7", maxWidth: "360px", margin: 0 }}>
                Pesanan masuk akan tampil di sini secara otomatis.
            </p>
        </div>
    );
}

/* ════════════════════════════════════════
   MAIN
════════════════════════════════════════ */
export default function OrdersOwner() {
    const [orders,        setOrders]        = useState([]);
    const [loadingIds,    setLoadingIds]    = useState({});
    const [toasts,        setToasts]        = useState([]);
    const [trackingOrder, setTrackingOrder] = useState(null);

    const getOrders = useCallback(async () => {
        try {
            const res = await axios.get("/owner/orders");
            setOrders(res.data.data ?? []);
        } catch (err) { console.error(err); }
    }, []);

    useEffect(() => {
        getOrders();
        const interval = setInterval(getOrders, 15_000);
        return () => clearInterval(interval);
    }, [getOrders]);

    const pushToast = useCallback((title, message, color, detail = null, isError = false) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, title, message, color, detail, isError }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), isError ? 8000 : 5000);
    }, []);

    const dismissToast = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
    const setLoading   = (id, val) => setLoadingIds((prev) => ({ ...prev, [id]: val }));

    // ── APPROVE — pending → confirmed ──
    const approveOrder = async (id) => {
        setLoading(id, "approve");
        try {
            await axios.put(`/owner/orders/${id}/approve`);
            pushToast("Pesanan Disetujui", `Order #${id} disetujui. Stok bahan telah dikurangi.`, "#22c55e");
            getOrders();
        } catch (err) {
            const data = err?.response?.data;
            if (err?.response?.status === 422 && data?.stock) {
                pushToast("Stok Tidak Cukup", `Tidak bisa menyetujui Order #${id}.`, "#ef4444", data.message, true);
            } else {
                pushToast("Gagal", data?.message || "Tidak bisa menyetujui pesanan.", "#ef4444", null, true);
            }
        } finally {
            setLoading(id, null);
        }
    };

    // ── REJECT — pending → cancelled ──
    const rejectOrder = async (id) => {
        setLoading(id, "reject");
        try {
            await axios.put(`/owner/orders/${id}/reject`);
            pushToast("Pesanan Ditolak", `Order #${id} telah ditolak.`, "#ef4444");
            getOrders();
        } catch (err) {
            pushToast("Gagal", err?.response?.data?.message || "Tidak bisa menolak pesanan.", "#ef4444");
        } finally {
            setLoading(id, null);
        }
    };

    // ── PROCESS — confirmed → preparing (langsung, tanpa pilih kurir) ──
    const processOrder = async (id) => {
        setLoading(id, "process");
        try {
            await axios.put(`/owner/orders/${id}/process`);
            pushToast("Sedang Diproses", `Order #${id} kini diproses di dapur.`, "#3b82f6");
            getOrders();
        } catch (err) {
            pushToast("Gagal", err?.response?.data?.message || "Tidak bisa memproses pesanan.", "#ef4444");
        } finally {
            setLoading(id, null);
        }
    };

    // ── DISPATCH — preparing → dispatched (kurir otomatis round-robin) ──
    const sendOrder = async (order) => {
        setLoading(order.id, "send");
        try {
            const res = await axios.put(`/owner/orders/${order.id}/dispatch`);
            const kurirName = res.data?.data?.kurir;
            pushToast(
                "Pesanan Dikirim",
                kurirName
                    ? `Order #${order.id} dalam perjalanan. Kurir: ${kurirName}.`
                    : `Order #${order.id} dalam perjalanan.`,
                "#a855f7"
            );
            getOrders();
        } catch (err) {
            pushToast("Gagal", err?.response?.data?.message || "Tidak bisa mengirim pesanan.", "#ef4444", null, true);
        } finally {
            setLoading(order.id, null);
        }
    };

    // ── Metrics ──
    const totalOrders    = orders.length;
    const pendingOrders  = orders.filter((o) => o.status?.toLowerCase() === STATUS.PENDING).length;
    const activeOrders   = orders.filter((o) =>
        [STATUS.CONFIRMED, STATUS.PREPARING, STATUS.DISPATCHED, STATUS.ON_DELIVERY, STATUS.DELIVERED]
            .includes(o.status?.toLowerCase())
    ).length;
    const rejectedOrders = orders.filter((o) => o.status?.toLowerCase() === STATUS.CANCELLED).length;

    return (
        <OwnerLayout>
            <style>{`
                * { font-family: ${C.font}; }
                .order-row:hover td { background: rgba(255,255,255,0.015); }
                .order-row td { transition: background 0.15s; }
            `}</style>

            <Toast toasts={toasts} onDismiss={dismissToast} />
            {trackingOrder && <TrackingModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />}

            <div style={{ fontFamily: C.font }}>

                {/* ── Header ── */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "28px", flexWrap: "wrap" }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: ".8px", marginBottom: "14px" }}>
                            <LayoutDashboard size={13} strokeWidth={2} />
                            <span>Owner</span>
                            <span style={{ color: "#1E293B" }}>›</span>
                            <span>Pesanan</span>
                        </div>
                        <h1 style={{ fontSize: "28px", fontWeight: 800, color: C.text, letterSpacing: "-.8px", lineHeight: 1.1, margin: 0 }}>
                            Pesanan masuk
                        </h1>
                        <p style={{ marginTop: "8px", fontSize: "13.5px", color: C.muted, lineHeight: "1.7" }}>
                            Kelola dan pantau semua pesanan. Saat disetujui, stok bahan akan otomatis berkurang.
                        </p>
                    </div>
                </div>

                {/* ── Stat Cards ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "22px" }}>
                    <StatCard label="Total Pesanan"  value={totalOrders    || null} icon={ShoppingCart} bar={bars.blue}  />
                    <StatCard label="Menunggu"        value={pendingOrders  || null} icon={Clock}         bar={bars.amber} />
                    <StatCard label="Aktif / Selesai" value={activeOrders   || null} icon={CheckCircle2}  bar={bars.green} />
                    <StatCard label="Ditolak"         value={rejectedOrders || null} icon={XCircle}       bar={bars.red}   />
                </div>

                {/* ── Table ── */}
                <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: "14px", overflow: "hidden" }}>
                    <div style={{ padding: "18px 22px", borderBottom: `0.5px solid ${C.border}` }}>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: C.text }}>Daftar pesanan</div>
                        <div style={{ fontSize: "12px", color: C.muted, marginTop: "3px" }}>
                            Setujui, proses, atau tolak pesanan dari pelanggan
                        </div>
                    </div>

                    {orders.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "1020px" }}>
                                <thead>
                                    <tr>
                                        {["ID", "Pelanggan", "Telepon", "Alamat", "Menu", "Qty", "Total", "Kurir", "Status", "Tracking", "Aksi"].map((h) => (
                                            <th key={h} style={{
                                                padding: "11px 16px",
                                                textAlign: ["Qty", "Total", "Status", "Tracking", "Aksi"].includes(h) ? "center" : "left",
                                                fontSize: "11px", fontWeight: 600, color: C.muted,
                                                textTransform: "uppercase", letterSpacing: ".6px",
                                                borderBottom: `0.5px solid ${C.border}`,
                                                whiteSpace: "nowrap",
                                            }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => {
                                        const s            = order.status?.toLowerCase();
                                        const isPending    = s === STATUS.PENDING;
                                        const isConfirmed  = s === STATUS.CONFIRMED;
                                        const isPreparing  = s === STATUS.PREPARING;
                                        const isDispatched = s === STATUS.DISPATCHED;
                                        const isOnDelivery = s === STATUS.ON_DELIVERY;
                                        const isDelivered  = s === STATUS.DELIVERED;
                                        const isCancelled  = s === STATUS.CANCELLED;
                                        const busy         = loadingIds[order.id];
                                        const color        = statusColor(s);

                                        // Logika tombol: 1 aksi aktif per status
                                        // pending    → Setuju + Tolak
                                        // confirmed  → Proses (langsung, tanpa pilih kurir manual)
                                        // preparing  → Kirim (kurir di-assign otomatis oleh sistem)
                                        // dispatched / on_delivery / delivered → info saja
                                        // cancelled  → —
                                        const showApprove = isPending;
                                        const showReject  = isPending;
                                        const showProcess = isConfirmed;
                                        const showSend    = isPreparing;
                                        const showInfo    = isDispatched || isOnDelivery || isDelivered;

                                        return (
                                            <tr key={order.id} className="order-row" style={{ borderBottom: `0.5px solid rgba(255,255,255,.04)` }}>
                                                <td style={{ padding: "12px 16px", fontSize: "12px", color: C.muted }}>#{order.id}</td>
                                                <td style={{ padding: "12px 16px", fontWeight: 600, color: C.text }}>{order.customer_name}</td>
                                                <td style={{ padding: "12px 16px", color: C.sub }}>{order.phone}</td>
                                                <td style={{ padding: "12px 16px", color: C.sub, maxWidth: "140px" }}>
                                                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.address}</div>
                                                </td>
                                                <td style={{ padding: "12px 16px", color: C.sub }}>{order.menu?.name}</td>
                                                <td style={{ padding: "12px 16px", textAlign: "center", color: C.sub }}>{order.quantity}</td>
                                                <td style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700, color: "#34d399", whiteSpace: "nowrap" }}>
                                                    Rp {Number(order.total_price || 0).toLocaleString("id-ID")}
                                                </td>
                                                <td style={{ padding: "12px 16px", fontSize: "12px", color: order.kurir ? C.sub : C.muted }}>
                                                    {order.kurir ? order.kurir.name : "—"}
                                                </td>

                                                {/* Status badge */}
                                                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                                                    <span style={{
                                                        display: "inline-flex", alignItems: "center",
                                                        fontSize: "11px", fontWeight: 600,
                                                        padding: "3px 10px", borderRadius: "20px",
                                                        background: color + "18",
                                                        border: `0.5px solid ${color}30`,
                                                        color,
                                                        textTransform: "uppercase", letterSpacing: ".4px",
                                                    }}>
                                                        {statusLabel(s)}
                                                    </span>
                                                </td>

                                                {/* Tracking */}
                                                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                                                    {!isPending && !isCancelled ? (
                                                        <button
                                                            onClick={() => setTrackingOrder(order)}
                                                            style={{
                                                                display: "inline-flex", alignItems: "center", gap: "4px",
                                                                height: "28px", padding: "0 11px", borderRadius: "7px",
                                                                border: "0.5px solid rgba(99,102,241,.30)",
                                                                background: "rgba(99,102,241,.12)",
                                                                color: "#a5b4fc", cursor: "pointer",
                                                                fontSize: "11.5px", fontWeight: 600, fontFamily: C.font,
                                                                transition: "background 0.15s",
                                                            }}
                                                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.20)")}
                                                            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.12)")}
                                                        >
                                                            Lihat <ArrowUpRight size={11} />
                                                        </button>
                                                    ) : (
                                                        <span style={{ color: C.muted, fontSize: "12px" }}>—</span>
                                                    )}
                                                </td>

                                                {/* Aksi */}
                                                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                                                    <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
                                                        {showApprove && (
                                                            <ActionBtn
                                                                label="Setuju"
                                                                icon={<CheckCircle2 size={12} />}
                                                                color="green"
                                                                onClick={() => approveOrder(order.id)}
                                                                loading={busy === "approve"}
                                                            />
                                                        )}
                                                        {showReject && (
                                                            <ActionBtn
                                                                label="Tolak"
                                                                icon={<XCircle size={12} />}
                                                                color="red"
                                                                onClick={() => rejectOrder(order.id)}
                                                                loading={busy === "reject"}
                                                            />
                                                        )}
                                                        {showProcess && (
                                                            <ActionBtn
                                                                label="Proses"
                                                                icon={<ChefHat size={12} />}
                                                                color="blue"
                                                                onClick={() => processOrder(order.id)}
                                                                loading={busy === "process"}
                                                            />
                                                        )}
                                                        {showSend && (
                                                            <ActionBtn
                                                                label="Kirim"
                                                                icon={<Truck size={12} />}
                                                                color="purple"
                                                                onClick={() => sendOrder(order)}
                                                                loading={busy === "send"}
                                                            />
                                                        )}
                                                        {showInfo && (
                                                            <span style={{
                                                                fontSize: "12px", fontStyle: "italic",
                                                                color: isDelivered ? "#10b981" : "#06b6d4",
                                                                display: "inline-flex", alignItems: "center", gap: "5px",
                                                            }}>
                                                                {isDelivered ? <CheckCircle2 size={13} /> : <Truck size={13} />}
                                                                {isDelivered ? "Selesai" : "Dalam Pengiriman"}
                                                            </span>
                                                        )}
                                                        {isCancelled && (
                                                            <span style={{ color: C.muted, fontSize: "12px" }}>—</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </OwnerLayout>
    );
}