// resources/js/pages/Klien/InvoiceKlien.jsx

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import NavbarKlien from "../../components/NavbarKlien";
import {
    FileText,
    CheckCircle2,
    Clock3,
    XCircle,
    ArrowLeft,
    Download,
    Eye,
    Wallet,
    Building2,
    ChevronRight,
    History,
    AlertTriangle,
    Ban,
    RefreshCw,
    Loader2,
    Sparkles,
    Activity,
    ClipboardList,
} from "lucide-react";

/* ─────────────────── DESIGN TOKENS ─────────────────── */

const STATUS_MAP = {
    unpaid:    { label: "Belum Dibayar",       color: "#fbbf24", accent: "#f59e0b", bg: "rgba(245,158,11,0.1)",   border: "rgba(245,158,11,0.2)",   icon: Clock3 },
    pending:   { label: "Menunggu Konfirmasi", color: "#a78bfa", accent: "#8b5cf6", bg: "rgba(139,92,246,0.1)",   border: "rgba(139,92,246,0.2)",   icon: Clock3 },
    paid:      { label: "Lunas",               color: "#34d399", accent: "#10b981", bg: "rgba(16,185,129,0.1)",   border: "rgba(16,185,129,0.2)",   icon: CheckCircle2 },
    selesai:   { label: "Lunas",               color: "#34d399", accent: "#10b981", bg: "rgba(16,185,129,0.1)",   border: "rgba(16,185,129,0.2)",   icon: CheckCircle2 },
    cancelled: { label: "Dibatalkan",          color: "#f87171", accent: "#ef4444", bg: "rgba(239,68,68,0.1)",    border: "rgba(239,68,68,0.2)",    icon: Ban },
    dp_paid:   { label: "DP Terbayar",         color: "#38bdf8", accent: "#0ea5e9", bg: "rgba(14,165,233,0.1)",   border: "rgba(14,165,233,0.2)",   icon: CheckCircle2 },
};

const statusInfo = (s) =>
    STATUS_MAP[s] || { label: s, color: "#94a3b8", accent: "#64748b", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", icon: Clock3 };

const fmt = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

/* ─────────────────── SHARED ATOMS ─────────────────── */

function Badge({ status, size = "sm" }) {
    const info = statusInfo(status);
    const Icon = info.icon;
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

function Divider() {
    return <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", margin: "14px 0" }} />;
}

function RowFlex({ label, value, bold, color }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
            <span style={{ color: "#64748b", fontSize: "14px" }}>{label}</span>
            <span style={{
                fontWeight: bold ? "700" : "500",
                color: color || "white",
                fontSize: bold ? "15px" : "14px",
            }}>{value}</span>
        </div>
    );
}

function PrimaryBtn({ children, onClick, disabled, loading, variant = "blue", style: s }) {
    const variants = {
        blue:  { background: "linear-gradient(90deg, #2563eb, #3b82f6)", color: "white" },
        green: { background: "linear-gradient(90deg, #059669, #10b981)", color: "white" },
        ghost: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" },
    };
    return (
        <button
            onClick={disabled ? undefined : onClick}
            style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
                padding: "12px 22px", borderRadius: "12px", border: "none",
                fontWeight: "700", fontSize: "14px",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1,
                transition: "opacity 0.2s, transform 0.15s",
                fontFamily: "Inter, system-ui, sans-serif",
                ...variants[variant], ...s,
            }}
        >
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

/* ══════════════════════════════════════════════════════════
   VIEW 1 — DAFTAR INVOICE
══════════════════════════════════════════════════════════ */

function ViewDaftar({ invoices, loading, onDetail, totalTagihan }) {
    const [tab, setTab] = useState("semua");

    const tabs = [
        { key: "semua",     label: "Semua" },
        { key: "unpaid",    label: "Belum Dibayar" },
        { key: "dp_paid",   label: "Menunggu Pelunasan" },
        { key: "pending",   label: "Menunggu Konfirmasi" },
        { key: "paid",      label: "Lunas" },
        { key: "cancelled", label: "Dibatalkan" },
    ];

    const count = (k) => k === "semua" ? invoices.length : invoices.filter(i => i.status === k).length;
    const filtered = tab === "semua" ? invoices : invoices.filter(i => i.status === tab);

    const stats = [
        {
            label: "Total Tagihan", value: fmt(totalTagihan),
            icon: <ClipboardList size={20} />,
            color: "#34d399", accent: "#10b981",
            bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)",
        },
        {
            label: "Belum Dibayar", value: `${invoices.filter(i => i.status === "unpaid").length} Invoice`,
            icon: <Clock3 size={20} />,
            color: "#fbbf24", accent: "#f59e0b",
            bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)",
        },
        {
            label: "Lunas", value: `${invoices.filter(i => ["paid","selesai"].includes(i.status)).length} Invoice`,
            icon: <CheckCircle2 size={20} />,
            color: "#34d399", accent: "#10b981",
            bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)",
        },
    ];

    return (
        <div>
            {/* ── HERO ── */}
            <div style={{
                position: "relative", borderRadius: "24px", padding: "40px",
                background: "linear-gradient(135deg, #0d1117 0%, #0f172a 60%, #131c2e 100%)",
                border: "1px solid rgba(255,255,255,0.07)",
                overflow: "hidden", marginBottom: "24px",
            }}>
                <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
                    backgroundSize: "28px 28px", pointerEvents: "none",
                }} />
                <div style={{
                    position: "absolute", top: "-80px", right: "60px",
                    width: "300px", height: "300px", borderRadius: "999px",
                    background: "rgba(59,130,246,0.1)", filter: "blur(90px)", pointerEvents: "none",
                }} />
                <div style={{
                    position: "absolute", bottom: "-60px", right: "-40px",
                    width: "200px", height: "200px", borderRadius: "999px",
                    background: "rgba(139,92,246,0.1)", filter: "blur(70px)", pointerEvents: "none",
                }} />
                <div style={{ position: "relative", zIndex: 2 }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: "8px",
                        padding: "6px 14px", borderRadius: "999px",
                        background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.22)",
                        color: "#60a5fa", fontSize: "12px", fontWeight: "600",
                        letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "22px",
                    }}>
                        <span style={{
                            width: "6px", height: "6px", borderRadius: "999px",
                            background: "#60a5fa", display: "inline-block",
                            animation: "pulse 2s ease-in-out infinite",
                        }} />
                        Invoice &amp; Pembayaran
                    </div>
                    <h1 style={{
                        margin: 0, fontSize: "clamp(28px, 3.5vw, 42px)", lineHeight: 1.15,
                        color: "white", fontWeight: "800", letterSpacing: "-1.5px",
                    }}>
                        Invoice Pembayaran
                        <br />
                        <span style={{
                            background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        }}>
                            Catering Anda 🧾
                        </span>
                    </h1>
                    <p style={{
                        margin: "16px 0 0", color: "#64748b",
                        fontSize: "15px", lineHeight: "1.8", maxWidth: "520px",
                    }}>
                        Semua riwayat tagihan, status pembayaran, dan rincian invoice
                        tersedia dalam satu tampilan terpadu.
                    </p>
                </div>
            </div>

            {/* ── STAT CARDS ── */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px", marginBottom: "24px",
            }}>
                {stats.map((item, i) => (
                    <div key={i} style={{
                        background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
                        border: `1px solid ${item.border}`,
                        borderRadius: "20px", padding: "24px",
                        position: "relative", overflow: "hidden",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.35)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                        <div style={{
                            position: "absolute", top: 0, left: "24px", right: "24px",
                            height: "2px", borderRadius: "0 0 4px 4px",
                            background: `linear-gradient(90deg, ${item.accent}, transparent)`,
                        }} />
                        <div style={{
                            position: "absolute", top: "-40px", right: "-40px",
                            width: "110px", height: "110px", borderRadius: "999px",
                            background: item.bg, filter: "blur(30px)", pointerEvents: "none",
                        }} />
                        <div style={{ position: "relative", zIndex: 2 }}>
                            <div style={{
                                width: "44px", height: "44px", borderRadius: "14px",
                                background: item.bg, border: `1px solid ${item.border}`,
                                color: item.color,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginBottom: "20px",
                            }}>
                                {item.icon}
                            </div>
                            <div style={{ color: "white", fontSize: "24px", fontWeight: "800", lineHeight: 1, letterSpacing: "-0.8px", marginBottom: "8px" }}>
                                {item.value}
                            </div>
                            <div style={{ color: "#475569", fontSize: "13px", fontWeight: "500" }}>
                                {item.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── TABLE CARD ── */}
            <GCard>
                <div style={{ padding: "24px 28px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <h2 style={{ margin: "0 0 18px", color: "white", fontSize: "18px", fontWeight: "700", letterSpacing: "-0.3px" }}>
                        Daftar Invoice
                    </h2>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {tabs.map(t => {
                            const active = tab === t.key;
                            return (
                                <button key={t.key} onClick={() => setTab(t.key)} style={{
                                    display: "inline-flex", alignItems: "center", gap: "6px",
                                    padding: "8px 16px", borderRadius: "999px",
                                    border: `1px solid ${active ? "transparent" : "rgba(255,255,255,0.07)"}`,
                                    background: active ? "linear-gradient(90deg, #2563eb, #3b82f6)" : "transparent",
                                    color: active ? "white" : "#94a3b8",
                                    fontWeight: "600", fontSize: "13px", cursor: "pointer",
                                    fontFamily: "Inter, system-ui, sans-serif",
                                }}>
                                    {t.label}
                                    <span style={{
                                        fontSize: "11px", padding: "2px 7px", borderRadius: "999px",
                                        background: active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)",
                                        color: active ? "white" : "#64748b",
                                    }}>
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
                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                    {["Invoice ID", "Tanggal", "Jatuh Tempo", "Layanan", "Tipe", "Total", "Status", "Aksi"].map(h => (
                                        <th key={h} style={{
                                            padding: "14px 20px", textAlign: "left",
                                            color: "#475569", fontSize: "11px", fontWeight: "700",
                                            textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap",
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length > 0 ? filtered.map((inv, idx) => (
                                    <tr key={inv.id} style={{
                                        borderBottom: idx < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                                        transition: "background 0.15s",
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        <td style={tdStyle}>
                                            <span style={{ color: "#60a5fa", fontWeight: "700", fontSize: "13px" }}>
                                                {inv.invoice_number || `INV-${inv.id}`}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ color: "white", fontSize: "13px" }}>
                                                {inv.created_at ? new Date(inv.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ color: "#94a3b8", fontSize: "13px" }}>
                                                {inv.due_date ? new Date(inv.due_date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ color: "white", fontSize: "14px" }}>
                                                {inv.order?.catering_package?.name || inv.order?.menu?.name || "Catering"}
                                            </div>
                                        </td>
                                        {/* ── KOLOM TIPE (harian / insidentil) ── */}
                                        <td style={tdStyle}>
                                            <span style={{
                                                display: "inline-flex", alignItems: "center",
                                                padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700",
                                                background: inv.order?.type === "harian"
                                                    ? "rgba(59,130,246,0.1)" : "rgba(139,92,246,0.1)",
                                                color: inv.order?.type === "harian" ? "#60a5fa" : "#a78bfa",
                                                border: `1px solid ${inv.order?.type === "harian" ? "rgba(59,130,246,0.2)" : "rgba(139,92,246,0.2)"}`,
                                                textTransform: "capitalize",
                                            }}>
                                                {inv.order?.type || "—"}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{ color: "#34d399", fontWeight: "700", fontSize: "14px" }}>{fmt(inv.total_amount)}</span>
                                        </td>
                                        <td style={tdStyle}><Badge status={inv.status} /></td>
                                        <td style={tdStyle}>
                                            <button
                                                onClick={() => onDetail(inv)}
                                                style={{
                                                    display: "inline-flex", alignItems: "center", gap: "6px",
                                                    padding: "8px 16px", borderRadius: "10px",
                                                    border: "1px solid rgba(255,255,255,0.07)",
                                                    background: "transparent", color: "#60a5fa",
                                                    fontSize: "13px", fontWeight: "600", cursor: "pointer",
                                                    fontFamily: "Inter, system-ui, sans-serif",
                                                    transition: "background 0.15s",
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = "rgba(96,165,250,0.08)"}
                                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                            >
                                                <Eye size={13} /> Lihat
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} style={{ padding: "64px 20px", textAlign: "center" }}>
                                            <div style={{
                                                width: "56px", height: "56px", borderRadius: "16px",
                                                background: "rgba(255,255,255,0.04)",
                                                border: "1px solid rgba(255,255,255,0.07)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                margin: "0 auto 20px",
                                            }}>
                                                <FileText size={22} color="#334155" />
                                            </div>
                                            <div style={{ color: "white", fontWeight: "700", fontSize: "17px", marginBottom: "8px" }}>
                                                Belum ada invoice
                                            </div>
                                            <p style={{ color: "#475569", margin: 0, fontSize: "14px" }}>
                                                Invoice akan muncul setelah pesanan Anda diproses.
                                            </p>
                                        </td>
                                    </tr>
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

function ViewDetail({ invoice, onBack, onBayar, onRiwayat }) {
    // ── Deteksi tipe order ──
    const isHarian    = invoice.order?.type === "harian";
    const isPelunasan = invoice.status === "dp_paid";
    const isUnpaid    = invoice.status === "unpaid";

    // Harian = sudah lunas saat pesan, tidak perlu bayar lagi lewat invoice
    const canPay = !isHarian && (isUnpaid || isPelunasan);

    const dpAmount    = invoice.dp_amount || 0;
    const totalAmount = invoice.total_amount || 0;
    const remaining   = totalAmount - dpAmount;

    return (
        <div>
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", color: "#64748b", fontSize: "14px" }}>
                <button onClick={onBack} style={{
                    background: "none", border: "none", color: "#64748b",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
                    fontFamily: "Inter, system-ui, sans-serif", fontSize: "14px",
                }}>
                    <ArrowLeft size={14} /> Invoice
                </button>
                <ChevronRight size={12} />
                <span style={{ color: "white" }}>Detail Invoice</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                    <h1 style={{ margin: "0 0 6px", fontSize: "clamp(24px, 3vw, 34px)", fontWeight: "800", letterSpacing: "-1px" }}>
                        Detail Invoice
                    </h1>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                        {invoice.invoice_number || `INV-${invoice.id}`}
                    </p>
                </div>
                <PrimaryBtn variant="ghost" onClick={() => window.open(`/klien/invoice/${invoice.id}/pdf`, "_blank")}>
                    <Download size={15} /> Unduh PDF
                </PrimaryBtn>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px" }}>
                {/* LEFT */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Info invoice */}
                    <GCard style={{ padding: "24px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            {[
                                { label: "Invoice ID", value: invoice.invoice_number || `INV-${invoice.id}`, valueColor: "#60a5fa" },
                                { label: "Tanggal Dibuat", value: invoice.created_at ? new Date(invoice.created_at).toLocaleDateString("id-ID") : "—" },
                                { label: "Jatuh Tempo", value: invoice.due_date ? new Date(invoice.due_date).toLocaleDateString("id-ID") : "—" },
                            ].map(({ label, value, valueColor }) => (
                                <div key={label}>
                                    <div style={{ color: "#64748b", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{label}</div>
                                    <div style={{ fontWeight: "700", color: valueColor || "white", fontSize: "15px" }}>{value}</div>
                                </div>
                            ))}
                            <div>
                                <div style={{ color: "#64748b", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Status</div>
                                <Badge status={invoice.status} size="lg" />
                            </div>
                        </div>
                        <Divider />
                        {/* Tipe catering */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div style={{ color: "#64748b", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Tipe Catering</div>
                                <span style={{
                                    display: "inline-flex", alignItems: "center",
                                    padding: "5px 12px", borderRadius: "7px", fontSize: "13px", fontWeight: "700",
                                    background: isHarian ? "rgba(59,130,246,0.1)" : "rgba(139,92,246,0.1)",
                                    color: isHarian ? "#60a5fa" : "#a78bfa",
                                    border: `1px solid ${isHarian ? "rgba(59,130,246,0.2)" : "rgba(139,92,246,0.2)"}`,
                                    textTransform: "capitalize",
                                }}>
                                    {invoice.order?.type || "—"}
                                </span>
                            </div>
                            <div>
                                <div style={{ color: "#64748b", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Referensi</div>
                                <div style={{ fontWeight: "600", color: "white" }}>{invoice.order?.event_name || invoice.description || "—"}</div>
                            </div>
                        </div>
                    </GCard>

                    {/* Info penagihan */}
                    <GCard style={{ padding: "24px" }}>
                        <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "18px", letterSpacing: "-0.2px" }}>Informasi Penagihan</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <div>
                                <div style={{ color: "#64748b", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Ditujukan Kepada</div>
                                <div style={{ fontWeight: "700", fontSize: "15px" }}>{invoice.client?.name || "—"}</div>
                                <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>{invoice.client?.address || ""}</div>
                            </div>
                            <div>
                                <div style={{ color: "#64748b", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Kontak</div>
                                <div style={{ fontSize: "13px", color: "#94a3b8" }}>{invoice.client?.email || "—"}</div>
                                <div style={{ fontSize: "13px", color: "#94a3b8" }}>{invoice.client?.phone || ""}</div>
                            </div>
                        </div>
                    </GCard>

                    {/* Rincian item */}
                    <GCard style={{ overflow: "hidden" }}>
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontWeight: "700", fontSize: "16px" }}>Rincian Item</div>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                        {["No", "Deskripsi", "Jumlah", "Harga Satuan", "Pajak", "Total"].map(h => (
                                            <th key={h} style={{ padding: "12px 20px", textAlign: "left", color: "#475569", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(invoice.items || [invoice]).map((item, i) => (
                                        <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                            <td style={{ ...tdStyle, color: "#64748b" }}>{i + 1}</td>
                                            <td style={tdStyle}>{item.description || item.menu?.name || "Layanan Catering"}</td>
                                            <td style={tdStyle}>{item.quantity || 1}</td>
                                            <td style={tdStyle}>{fmt(item.unit_price || item.price || 0)}</td>
                                            <td style={{ ...tdStyle, color: "#94a3b8" }}>{item.tax_percent || 11}%</td>
                                            <td style={{ ...tdStyle, color: "#34d399", fontWeight: "700" }}>{fmt(item.total_price || item.total_amount || 0)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GCard>
                </div>

                {/* RIGHT sidebar */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <GCard style={{ padding: "24px" }}>
                        <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "16px" }}>Ringkasan Pembayaran</div>
                        <RowFlex label="Subtotal" value={fmt(invoice.subtotal || totalAmount / 1.11)} />
                        <RowFlex label="Pajak (11%)" value={fmt(invoice.tax_amount || totalAmount - totalAmount / 1.11)} />
                        <Divider />
                        <RowFlex label="Total" value={fmt(totalAmount)} bold />
                        {/* Harian: tampilkan lunas, Insidentil: tampilkan DP & sisa */}
                        {isHarian ? (
                            <>
                                <Divider />
                                <RowFlex label="Dibayar Lunas" value={fmt(invoice.order?.amount_paid || totalAmount)} color="#34d399" bold />
                                <RowFlex label="Sisa Tagihan" value={fmt(0)} color="#34d399" />
                            </>
                        ) : dpAmount > 0 ? (
                            <>
                                <RowFlex label="DP Terbayar" value={`- ${fmt(dpAmount)}`} color="#34d399" />
                                <Divider />
                                <RowFlex label="Sisa Pembayaran" value={fmt(remaining)} bold color={remaining > 0 ? "#fbbf24" : "#34d399"} />
                            </>
                        ) : null}
                    </GCard>

                    {/* ── HARIAN: info lunas + bukti bayar ── */}
                    {isHarian && (
                        <div style={{
                            background: "rgba(16,185,129,0.08)",
                            border: "1px solid rgba(16,185,129,0.2)",
                            borderRadius: "14px", padding: "18px",
                        }}>
                            <div style={{
                                display: "flex", alignItems: "center", gap: "8px",
                                color: "#34d399", fontWeight: "700", fontSize: "14px", marginBottom: "10px",
                            }}>
                                <CheckCircle2 size={16} /> Pembayaran Lunas
                            </div>
                            <div style={{ color: "#64748b", fontSize: "13px", lineHeight: "1.7", marginBottom: "14px" }}>
                                Catering harian telah dibayar lunas saat pemesanan. Tidak ada tagihan tambahan.
                            </div>
                            {invoice.order?.payment_proof && (
                                <a
                                    href={`/storage/${invoice.order.payment_proof}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: "6px",
                                        color: "#60a5fa", fontSize: "13px", fontWeight: "600",
                                        textDecoration: "none",
                                        background: "rgba(59,130,246,0.08)",
                                        border: "1px solid rgba(59,130,246,0.2)",
                                        padding: "8px 14px", borderRadius: "10px",
                                    }}
                                >
                                    <Eye size={13} /> Lihat Bukti Pembayaran
                                </a>
                            )}
                        </div>
                    )}

                    {/* ── INSIDENTIL: tombol bayar & warning ── */}
                    {canPay && (
                        <PrimaryBtn variant="green" onClick={() => onBayar(invoice)} style={{ width: "100%", padding: "14px", fontSize: "15px" }}>
                            <Wallet size={16} />
                            {isPelunasan ? "Lunasi Sekarang" : "Bayar Sekarang"}
                        </PrimaryBtn>
                    )}

                    <PrimaryBtn variant="ghost" onClick={onRiwayat} style={{ width: "100%", padding: "12px" }}>
                        <History size={15} /> Riwayat Pembayaran
                    </PrimaryBtn>

                    {canPay && (
                        <div style={{
                            background: "rgba(245,158,11,0.08)", borderRadius: "14px",
                            padding: "16px", border: "1px solid rgba(245,158,11,0.2)",
                            color: "#fbbf24", fontSize: "13px",
                            display: "flex", alignItems: "flex-start", gap: "10px",
                        }}>
                            <AlertTriangle size={15} style={{ marginTop: "1px", flexShrink: 0 }} />
                            <span>Lakukan pembayaran sebelum jatuh tempo untuk menghindari pembatalan order.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   VIEW 3 — PROSES PEMBAYARAN (hanya untuk insidentil)
══════════════════════════════════════════════════════════ */

function ViewPembayaran({ invoice, onBack, onSuccess }) {
    const [metode, setMetode]               = useState(null);
    const [bankSelected, setBankSelected]   = useState(null);
    const [bukti, setBukti]                 = useState(null);
    const [buktiPreview, setBuktiPreview]   = useState(null);
    const [loading, setLoading]             = useState(false);
    const [paymentChannels, setPaymentChannels] = useState({ banks: [], ewallets: [] });
    const [loadingChannels, setLoadingChannels] = useState(true);
    const [catatan, setCatatan]             = useState("");

    const isPelunasan  = invoice.status === "dp_paid";
    const dpAmount     = invoice.dp_amount || 0;
    const totalAmount  = invoice.total_amount || 0;
    const bayarAmount  = isPelunasan ? totalAmount - dpAmount : (invoice.is_dp ? totalAmount * 0.5 : totalAmount);

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const res = await axios.get(`/klien/invoice/${invoice.id}/payment-channels`);
                setPaymentChannels(res.data);
            } catch {}
            finally { setLoadingChannels(false); }
        };
        fetchChannels();
    }, [invoice.id]);

    const handleBukti = (e) => {
        const file = e.target.files[0];
        if (file) { setBukti(file); setBuktiPreview(URL.createObjectURL(file)); }
    };

    const handleSubmit = async () => {
        if (!bankSelected || !bukti) return;
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append("payment_channel_id", bankSelected.id);
            fd.append("payment_proof", bukti);
            fd.append("note", catatan);
            fd.append("type", isPelunasan ? "pelunasan" : (invoice.is_dp ? "dp" : "full"));
            await axios.post(`/klien/invoice/${invoice.id}/pay`, fd, { headers: { "Content-Type": "multipart/form-data" } });
            onSuccess(invoice);
        } catch (err) {
            alert(err?.response?.data?.message || "Gagal mengirim pembayaran");
        } finally { setLoading(false); }
    };

    const channels = metode === "bank" ? (paymentChannels.banks || []) : metode === "ewallet" ? (paymentChannels.ewallets || []) : [];

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", color: "#64748b", fontSize: "14px" }}>
                <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "Inter, system-ui, sans-serif", fontSize: "14px" }}>
                    <ArrowLeft size={14} /> Detail Invoice
                </button>
                <ChevronRight size={12} />
                <span style={{ color: "white" }}>Pembayaran</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px" }}>
                {/* LEFT */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <GCard style={{ padding: "28px" }}>
                        <h2 style={{ margin: "0 0 24px", fontSize: "20px", fontWeight: "800", letterSpacing: "-0.4px" }}>
                            {isPelunasan ? "Pelunasan Invoice" : "Pembayaran Invoice"} &mdash;{" "}
                            <span style={{ color: "#60a5fa" }}>{invoice.invoice_number || `INV-${invoice.id}`}</span>
                        </h2>

                        <div style={{ fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b", marginBottom: "14px" }}>
                            Pilih Metode Pembayaran
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                            {[
                                { key: "bank",    label: "Transfer Bank", desc: "Transfer ke rekening yang tersedia", Icon: Building2 },
                                { key: "ewallet", label: "E-Wallet",      desc: "OVO, GoPay, Dana, ShopeePay",      Icon: Wallet },
                            ].map(m => {
                                const active = metode === m.key;
                                return (
                                    <div key={m.key} onClick={() => { setMetode(m.key); setBankSelected(null); }}
                                        style={{
                                            border: `1px solid ${active ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.07)"}`,
                                            borderRadius: "16px", padding: "18px",
                                            cursor: "pointer",
                                            background: active ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.02)",
                                            display: "flex", alignItems: "center", gap: "14px",
                                            transition: "all 0.2s",
                                        }}>
                                        <div style={{
                                            width: "44px", height: "44px", borderRadius: "12px", flexShrink: 0,
                                            background: active ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.05)",
                                            border: `1px solid ${active ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.07)"}`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            color: active ? "#60a5fa" : "#64748b",
                                        }}>
                                            <m.Icon size={20} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: "700", color: "white" }}>{m.label}</div>
                                            <div style={{ color: "#64748b", fontSize: "13px", marginTop: "2px" }}>{m.desc}</div>
                                        </div>
                                        <div style={{
                                            width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                                            border: `2px solid ${active ? "#3b82f6" : "#334155"}`,
                                            background: active ? "#3b82f6" : "transparent",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            {active && <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "white" }} />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Channels */}
                        {metode && (
                            <div>
                                <div style={{ fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b", marginBottom: "14px" }}>
                                    {metode === "bank" ? "Pilih Rekening Bank" : "Pilih E-Wallet"}
                                </div>
                                {loadingChannels ? (
                                    <div style={{ color: "#64748b", textAlign: "center", padding: "24px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                        <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Memuat...
                                    </div>
                                ) : channels.length === 0 ? (
                                    <div style={{ color: "#64748b", padding: "24px", textAlign: "center", fontSize: "14px" }}>
                                        Belum ada {metode === "bank" ? "rekening bank" : "e-wallet"} yang tersedia.
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        {channels.map(ch => {
                                            const active = bankSelected?.id === ch.id;
                                            return (
                                                <div key={ch.id} onClick={() => setBankSelected(ch)} style={{
                                                    border: `1px solid ${active ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.07)"}`,
                                                    borderRadius: "16px", padding: "18px", cursor: "pointer",
                                                    background: active ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
                                                    display: "flex", alignItems: "center", gap: "14px",
                                                    transition: "all 0.15s",
                                                }}>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: "700", color: "white", fontSize: "15px" }}>{ch.bank_name || ch.wallet_name}</div>
                                                        <div style={{ color: "#60a5fa", fontWeight: "700", fontSize: "18px", marginTop: "4px" }}>{ch.account_number}</div>
                                                        <div style={{ color: "#64748b", fontSize: "13px", marginTop: "2px" }}>a.n. {ch.account_name}</div>
                                                    </div>
                                                    {active && <CheckCircle2 size={22} color="#34d399" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </GCard>

                    {/* Upload bukti */}
                    {bankSelected && (
                        <GCard style={{ padding: "28px" }}>
                            <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "16px", letterSpacing: "-0.2px" }}>Upload Bukti Pembayaran</div>
                            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "18px", lineHeight: "1.7" }}>
                                Transfer sejumlah <strong style={{ color: "#fbbf24" }}>{fmt(bayarAmount)}</strong> ke rekening di atas, lalu upload bukti transfer.
                            </p>
                            <label style={{
                                display: "block",
                                border: `2px dashed ${buktiPreview ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.08)"}`,
                                borderRadius: "16px", padding: "28px", textAlign: "center",
                                cursor: "pointer",
                                background: buktiPreview ? "rgba(16,185,129,0.04)" : "rgba(255,255,255,0.02)",
                                transition: "all 0.2s",
                            }}>
                                <input type="file" accept="image/*,.pdf" onChange={handleBukti} style={{ display: "none" }} />
                                {buktiPreview ? (
                                    <img src={buktiPreview} alt="bukti" style={{ maxHeight: "200px", maxWidth: "100%", borderRadius: "10px", objectFit: "contain" }} />
                                ) : (
                                    <>
                                        <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                                            <Download size={20} color="#475569" />
                                        </div>
                                        <div style={{ color: "#94a3b8", fontWeight: "600" }}>Klik untuk upload atau drag & drop</div>
                                        <div style={{ color: "#475569", fontSize: "13px", marginTop: "6px" }}>PNG, JPG, PDF (maks. 5MB)</div>
                                    </>
                                )}
                            </label>

                            <div style={{ marginTop: "18px" }}>
                                <div style={{ fontWeight: "600", marginBottom: "10px", fontSize: "13px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                    Catatan (opsional)
                                </div>
                                <textarea
                                    value={catatan}
                                    onChange={e => setCatatan(e.target.value)}
                                    placeholder="Mis: Transfer dari BCA 1234..."
                                    rows={3}
                                    style={{
                                        width: "100%",
                                        background: "rgba(255,255,255,0.03)",
                                        border: "1px solid rgba(255,255,255,0.07)",
                                        borderRadius: "12px", padding: "12px 14px",
                                        color: "white", fontSize: "14px",
                                        resize: "vertical", boxSizing: "border-box",
                                        fontFamily: "Inter, system-ui, sans-serif",
                                        outline: "none",
                                    }}
                                />
                            </div>
                        </GCard>
                    )}
                </div>

                {/* RIGHT — sticky summary */}
                <div>
                    <GCard style={{ padding: "24px", position: "sticky", top: "20px" }}>
                        <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "16px" }}>Ringkasan Pembayaran</div>
                        <div style={{ color: "#64748b", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Invoice</div>
                        <div style={{ fontWeight: "700", color: "#60a5fa", marginBottom: "18px" }}>{invoice.invoice_number || `INV-${invoice.id}`}</div>
                        <div style={{ color: "#64748b", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Total yang Harus Dibayar</div>
                        <div style={{ fontWeight: "800", fontSize: "28px", color: "#fbbf24", marginBottom: "20px", letterSpacing: "-1px" }}>{fmt(bayarAmount)}</div>
                        <Divider />
                        <RowFlex label="Subtotal" value={fmt(invoice.subtotal || totalAmount / 1.11)} />
                        <RowFlex label="Pajak (11%)" value={fmt(invoice.tax_amount || totalAmount - totalAmount / 1.11)} />
                        {dpAmount > 0 && <RowFlex label="DP Terbayar" value={`- ${fmt(dpAmount)}`} color="#34d399" />}
                        <Divider />
                        <RowFlex label={isPelunasan ? "Sisa Bayar" : (invoice.is_dp ? "DP (50%)" : "Total")} value={fmt(bayarAmount)} bold color="#fbbf24" />

                        <div style={{ marginTop: "20px" }}>
                            <PrimaryBtn
                                variant="green"
                                onClick={handleSubmit}
                                disabled={!bankSelected || !bukti}
                                loading={loading}
                                style={{ width: "100%", padding: "14px", fontSize: "15px" }}
                            >
                                Lanjutkan Pembayaran
                            </PrimaryBtn>
                        </div>
                    </GCard>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   VIEW 4 — KONFIRMASI
══════════════════════════════════════════════════════════ */

function ViewKonfirmasi({ invoice, onLihatInvoice, onBack }) {
    return (
        <div style={{ maxWidth: "520px", margin: "0 auto", paddingTop: "40px" }}>
            <GCard style={{ padding: "48px 40px", textAlign: "center" }}>
                <div style={{
                    position: "relative",
                    width: "90px", height: "90px", borderRadius: "50%",
                    background: "rgba(16,185,129,0.1)",
                    border: "2px solid rgba(16,185,129,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 28px",
                }}>
                    <div style={{
                        position: "absolute", inset: "-10px", borderRadius: "50%",
                        background: "rgba(16,185,129,0.06)", filter: "blur(12px)",
                        pointerEvents: "none",
                    }} />
                    <CheckCircle2 size={44} color="#34d399" />
                </div>

                <h2 style={{ margin: "0 0 12px", fontSize: "26px", fontWeight: "800", letterSpacing: "-0.8px" }}>Pembayaran Berhasil!</h2>
                <p style={{ color: "#64748b", margin: "0 0 32px", lineHeight: "1.7", fontSize: "15px" }}>
                    Bukti pembayaran Anda telah berhasil dikirim. Kami akan segera memverifikasi pembayaran Anda.
                </p>

                <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "16px", padding: "20px",
                    textAlign: "left", marginBottom: "28px",
                }}>
                    <RowFlex label="Invoice" value={invoice.invoice_number || `INV-${invoice.id}`} />
                    <RowFlex label="Tanggal Pembayaran" value={new Date().toLocaleDateString("id-ID") + ", " + new Date().toLocaleTimeString("id-ID")} />
                    <Divider />
                    <RowFlex
                        label="Total Dibayar"
                        value={fmt(invoice.dp_amount > 0 ? invoice.total_amount - invoice.dp_amount : invoice.total_amount)}
                        bold color="#34d399"
                    />
                </div>

                <p style={{ color: "#475569", fontSize: "13px", marginBottom: "28px", lineHeight: "1.6" }}>
                    Status invoice akan berubah setelah pembayaran dikonfirmasi oleh tim kami.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <PrimaryBtn variant="blue" onClick={onLihatInvoice} style={{ width: "100%", padding: "14px", fontSize: "15px" }}>
                        Lihat Invoice
                    </PrimaryBtn>
                    <PrimaryBtn variant="ghost" onClick={onBack} style={{ width: "100%", padding: "12px" }}>
                        Kembali ke Daftar Invoice
                    </PrimaryBtn>
                </div>
            </GCard>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   VIEW 5 — RIWAYAT PEMBAYARAN
══════════════════════════════════════════════════════════ */

function ViewRiwayat({ invoice, onBack }) {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading]   = useState(true);

    const isHarian = invoice.order?.type === "harian";

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
            { label: "Invoice Dibuat",      desc: "Invoice telah dibuat dan dikirim ke Anda.",         time: invoice.created_at, done: true },
            { label: "Pembayaran Lunas",    desc: "Dibayar lunas saat pemesanan.",                      time: invoice.order?.order_date, done: true },
            { label: "Menunggu Konfirmasi", desc: "Pembayaran sedang dikonfirmasi oleh tim.",           time: null, done: ["paid","selesai"].includes(invoice.status) },
            { label: "Selesai",             desc: "Invoice dinyatakan lunas dan pesanan berjalan.",     time: null, done: ["paid","selesai"].includes(invoice.status) },
          ]
        : [
            { label: "Invoice Dibuat",        desc: "Invoice telah dibuat dan dikirim ke Anda.",           time: invoice.created_at, done: true },
            { label: "DP Diterima",           desc: "DP 50% diterima, menunggu verifikasi.",              time: payments.find(p => p.type === "dp")?.created_at || invoice.order?.order_date, done: invoice.dp_amount > 0 },
            { label: "Menunggu Pelunasan",    desc: "Silakan lunasi sisa 50% sebelum jatuh tempo.",       time: null, done: ["dp_paid","paid","selesai"].includes(invoice.status) },
            { label: "Pelunasan Diterima",    desc: "Pembayaran penuh dikonfirmasi.",                     time: payments.find(p => p.type === "pelunasan" && p.status === "confirmed")?.updated_at, done: ["paid","selesai"].includes(invoice.status) },
          ];

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", color: "#64748b", fontSize: "14px" }}>
                <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "Inter, system-ui, sans-serif", fontSize: "14px" }}>
                    <ArrowLeft size={14} /> Invoice
                </button>
                <ChevronRight size={12} />
                <span style={{ color: "white" }}>Riwayat Pembayaran</span>
            </div>

            <h1 style={{ margin: "0 0 24px", fontSize: "clamp(24px, 3vw, 34px)", fontWeight: "800", letterSpacing: "-1px" }}>Riwayat Pembayaran</h1>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px" }}>
                {/* LEFT */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Summary pill */}
                    <GCard style={{ padding: "20px 24px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div style={{ fontWeight: "700", color: "#60a5fa", marginBottom: "4px" }}>{invoice.invoice_number || `INV-${invoice.id}`}</div>
                                <div style={{ color: "#64748b", fontSize: "13px" }}>
                                    Total: <strong style={{ color: "white" }}>{fmt(invoice.total_amount)}</strong>
                                    {" · "}
                                    <span style={{
                                        fontSize: "11px", fontWeight: "700",
                                        color: isHarian ? "#60a5fa" : "#a78bfa",
                                        textTransform: "capitalize",
                                    }}>
                                        {invoice.order?.type || ""}
                                    </span>
                                </div>
                            </div>
                            <Badge status={invoice.status} size="lg" />
                        </div>
                    </GCard>

                    {/* Timeline */}
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
                                            <div style={{
                                                width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                                                background: item.done ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)",
                                                border: `2px solid ${item.done ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)"}`,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                color: item.done ? "#34d399" : "#475569",
                                            }}>
                                                {item.done ? <CheckCircle2 size={14} /> : <Clock3 size={13} />}
                                            </div>
                                            {i < timeline.length - 1 && (
                                                <div style={{
                                                    width: "2px", flex: 1, minHeight: "36px",
                                                    background: item.done ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)",
                                                    margin: "4px 0",
                                                }} />
                                            )}
                                        </div>
                                        <div style={{ paddingBottom: i < timeline.length - 1 ? "24px" : 0 }}>
                                            <div style={{ fontWeight: "700", color: item.done ? "white" : "#475569" }}>{item.label}</div>
                                            <div style={{ color: "#64748b", fontSize: "13px", marginTop: "3px" }}>{item.desc}</div>
                                            {item.time && (
                                                <div style={{ color: "#475569", fontSize: "12px", marginTop: "4px" }}>
                                                    {new Date(item.time).toLocaleDateString("id-ID")} · {new Date(item.time).toLocaleTimeString("id-ID")}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </GCard>

                    {/* ── Detail pembayaran harian: dari order ── */}
                    {isHarian && invoice.order?.payment_proof && (
                        <GCard style={{ overflow: "hidden" }}>
                            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontWeight: "700", fontSize: "16px" }}>
                                Detail Pembayaran
                            </div>
                            <div style={{ padding: "20px 24px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                                    <div style={{ fontWeight: "700", fontSize: "15px" }}>Pembayaran Lunas</div>
                                    <Badge status="paid" />
                                </div>
                                <RowFlex label="Jumlah" value={fmt(invoice.order?.amount_paid || invoice.total_amount)} bold />
                                <RowFlex label="Metode" value={invoice.order?.payment_method === "bank" ? "Transfer Bank" : "E-Wallet"} />
                                <RowFlex label="Provider" value={invoice.order?.payment_provider || "—"} />
                                <RowFlex label="No. Rekening / Akun" value={invoice.order?.payment_account_number || "—"} />
                                <RowFlex label="Tanggal" value={invoice.order?.order_date ? new Date(invoice.order.order_date).toLocaleDateString("id-ID") : "—"} />
                                <div style={{ marginTop: "12px" }}>
                                    <a
                                        href={`/storage/${invoice.order.payment_proof}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            display: "inline-flex", alignItems: "center", gap: "6px",
                                            color: "#60a5fa", fontSize: "13px", fontWeight: "600",
                                            textDecoration: "none",
                                            background: "rgba(59,130,246,0.08)",
                                            border: "1px solid rgba(59,130,246,0.2)",
                                            padding: "8px 14px", borderRadius: "10px",
                                        }}
                                    >
                                        <Eye size={13} /> Lihat Bukti Transfer
                                    </a>
                                </div>
                            </div>
                        </GCard>
                    )}

                    {/* ── Detail pembayaran insidentil: dari tabel payments ── */}
                    {!isHarian && payments.length > 0 && (
                        <GCard style={{ overflow: "hidden" }}>
                            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontWeight: "700", fontSize: "16px" }}>
                                Detail Pembayaran
                            </div>
                            {payments.map((p, i) => (
                                <div key={i} style={{ padding: "20px 24px", borderBottom: i < payments.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                        <div style={{ fontWeight: "700" }}>
                                            {p.type === "dp" ? "Uang Muka (DP 50%)" : p.type === "pelunasan" ? "Pelunasan (50%)" : "Pembayaran Penuh"}
                                        </div>
                                        <Badge status={p.status === "confirmed" ? "paid" : "pending"} />
                                    </div>
                                    <RowFlex label="Jumlah"       value={fmt(p.amount)} bold />
                                    <RowFlex label="Metode"       value={p.payment_channel?.bank_name || p.payment_channel?.wallet_name || "—"} />
                                    <RowFlex label="Rekening/No." value={p.payment_channel?.account_number || "—"} />
                                    <RowFlex label="Tanggal"      value={p.created_at ? new Date(p.created_at).toLocaleDateString("id-ID") : "—"} />
                                    {p.proof_url && (
                                        <div style={{ marginTop: "10px" }}>
                                            <a href={p.proof_url} target="_blank" rel="noreferrer"
                                                style={{
                                                    color: "#60a5fa", fontSize: "13px",
                                                    display: "inline-flex", alignItems: "center", gap: "6px",
                                                    textDecoration: "none",
                                                    background: "rgba(59,130,246,0.08)",
                                                    border: "1px solid rgba(59,130,246,0.2)",
                                                    padding: "8px 14px", borderRadius: "10px",
                                                    fontWeight: "600",
                                                }}>
                                                <Eye size={13} /> Lihat Bukti Transfer
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </GCard>
                    )}
                </div>

                {/* RIGHT */}
                <div>
                    <GCard style={{ padding: "24px", position: "sticky", top: "20px" }}>
                        <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "16px" }}>Ringkasan</div>
                        <RowFlex label="Total Invoice" value={fmt(invoice.total_amount)} />
                        {isHarian ? (
                            <>
                                <RowFlex label="Dibayar Lunas" value={fmt(invoice.order?.amount_paid || invoice.total_amount)} color="#34d399" />
                                <Divider />
                                <RowFlex label="Sisa Tagihan" value={fmt(0)} bold color="#34d399" />
                            </>
                        ) : (
                            <>
                                <RowFlex label="DP Terbayar"  value={fmt(invoice.dp_amount || 0)} color="#34d399" />
                                <RowFlex label="Pelunasan"    value={fmt(payments.filter(p => p.type === "pelunasan" && p.status === "confirmed").reduce((a, p) => a + parseFloat(p.amount || 0), 0))} color="#34d399" />
                                <Divider />
                                <RowFlex
                                    label="Sisa Tagihan"
                                    value={fmt(Math.max(0, invoice.total_amount - (invoice.dp_amount || 0) - payments.filter(p => p.type !== "dp" && p.status === "confirmed").reduce((a, p) => a + parseFloat(p.amount || 0), 0)))}
                                    bold color="#fbbf24"
                                />
                            </>
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

    const handleDetail  = (inv) => { setActiveInvoice(inv); setView("detail"); };
    const handleBayar   = (inv) => { setActiveInvoice(inv); setView("bayar"); };
    const handleSuccess = (inv) => { setActiveInvoice(inv); setView("konfirmasi"); loadInvoices(); };
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
                {view === "daftar"     && <ViewDaftar invoices={invoices} loading={loading} totalTagihan={totalTagihan} onDetail={handleDetail} />}
                {view === "detail"     && activeInvoice && <ViewDetail invoice={activeInvoice} onBack={goBack} onBayar={handleBayar} onRiwayat={handleRiwayat} />}
                {view === "bayar"      && activeInvoice && <ViewPembayaran invoice={activeInvoice} onBack={goDetail} onSuccess={handleSuccess} />}
                {view === "konfirmasi" && activeInvoice && <ViewKonfirmasi invoice={activeInvoice} onLihatInvoice={goDetail} onBack={goBack} />}
                {view === "riwayat"   && activeInvoice && <ViewRiwayat invoice={activeInvoice} onBack={goDetail} />}
            </div>
        </div>
    );
}