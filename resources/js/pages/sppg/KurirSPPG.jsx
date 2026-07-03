import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import SidebarSPPG from "../../components/SidebarSPPG";
import {
    Truck, Search, Phone, Mail, X, Trash2, Check,
    Clock, AlertTriangle, Users, UserCheck,
} from "lucide-react";

/* ── Font ─────────────────────────────────────────────────────── */
if (typeof document !== "undefined" && !document.getElementById("sppg-inter")) {
    const l = document.createElement("link");
    l.id = "sppg-inter"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";
    document.head.appendChild(l);
}

/* ── Design Tokens (sama seperti DistribusiSPPG) ────────────────── */
const T = {
    bg:       "#05080F",
    surface:  "#0A0F1C",
    elevated: "#0F1628",
    card:     "#111827",
    border:   "rgba(255,255,255,0.06)",
    borderMd: "rgba(255,255,255,0.10)",
    text:     "#F1F5F9",
    muted:    "#475569",
    sub:      "#94A3B8",
    accent:   "#3B82F6",
    teal:     "#0EA5E9",
    green:    "#10B981",
    amber:    "#F59E0B",
    red:      "#EF4444",
    violet:   "#8B5CF6",
    font:     "'Inter', system-ui, sans-serif",
};

const inp = {
    width: "100%", height: "42px", padding: "0 14px",
    background: T.elevated, border: `0.5px solid ${T.borderMd}`,
    borderRadius: "10px", color: T.text, fontSize: "13.5px",
    fontFamily: T.font, outline: "none", boxSizing: "border-box",
};

/* ── Status config ────────────────────────────────────────────── */
const STATUS = {
    approved: { label: "Aktif",                 color: T.green, bg: "rgba(16,185,129,.12)", border: "rgba(16,185,129,.25)" },
    pending:  { label: "Menunggu Persetujuan",   color: T.amber, bg: "rgba(245,158,11,.12)", border: "rgba(245,158,11,.25)" },
    rejected: { label: "Ditolak",                color: T.red,   bg: "rgba(239,68,68,.12)",  border: "rgba(239,68,68,.25)" },
};

function KpiCard({ label, value, icon: Icon, accent }) {
    return (
        <div style={{
            background: T.elevated, border: `0.5px solid ${T.border}`,
            borderRadius: "16px", padding: "20px 22px",
            position: "relative", overflow: "hidden", fontFamily: T.font,
        }}>
            <div style={{
                position: "absolute", top: 0, left: "20%", right: "20%", height: "1px",
                background: `linear-gradient(90deg, transparent, ${accent}60, transparent)`,
            }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "1px" }}>
                    {label}
                </span>
                <div style={{
                    width: "32px", height: "32px", borderRadius: "9px",
                    background: `${accent}18`, border: `0.5px solid ${accent}30`,
                    display: "flex", alignItems: "center", justifyContent: "center", color: accent,
                }}>
                    <Icon size={15} strokeWidth={1.8} />
                </div>
            </div>
            <div style={{ marginTop: "14px", fontSize: "30px", fontWeight: 800, color: T.text, letterSpacing: "-1px", lineHeight: 1 }}>
                {(value ?? 0).toLocaleString("id-ID")}
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const s = STATUS[status] || STATUS.pending;
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            fontSize: "11px", fontWeight: 700,
            padding: "3px 10px", borderRadius: "20px",
            background: s.bg, border: `0.5px solid ${s.border}`, color: s.color,
        }}>
            {status === "pending" && <Clock size={11} strokeWidth={2} />}
            {s.label}
        </span>
    );
}

function DeleteModal({ name, onConfirm, onCancel, loading }) {
    return (
        <div style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10000, padding: "20px",
        }} onClick={onCancel}>
            <div style={{
                background: T.elevated, border: `0.5px solid ${T.borderMd}`,
                borderRadius: "18px", padding: "28px",
                maxWidth: "380px", width: "100%", fontFamily: T.font,
            }} onClick={(e) => e.stopPropagation()}>
                <div style={{
                    width: "46px", height: "46px", borderRadius: "13px",
                    background: "rgba(239,68,68,.12)", border: "0.5px solid rgba(239,68,68,.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: T.red, marginBottom: "16px",
                }}>
                    <AlertTriangle size={20} strokeWidth={1.8} />
                </div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: T.text, marginBottom: "8px" }}>Hapus Kurir</div>
                <p style={{ fontSize: "13px", color: T.sub, lineHeight: 1.7, margin: "0 0 20px" }}>
                    Akun <strong style={{ color: T.text }}>{name}</strong> akan dihapus permanen dari daftar kurir SPPG ini. Tindakan ini tidak dapat dibatalkan.
                </p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <button onClick={onCancel} style={{
                        height: "36px", padding: "0 16px", borderRadius: "9px",
                        border: `0.5px solid ${T.borderMd}`, background: "transparent",
                        color: T.sub, fontFamily: T.font, fontSize: "13px", fontWeight: 600, cursor: "pointer",
                    }}>Batal</button>
                    <button onClick={onConfirm} disabled={loading} style={{
                        height: "36px", padding: "0 18px", borderRadius: "9px",
                        border: "none", background: T.red,
                        color: "#fff", fontFamily: T.font, fontSize: "13px", fontWeight: 700,
                        cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
                    }}>{loading ? "Menghapus..." : "Ya, Hapus"}</button>
                </div>
            </div>
        </div>
    );
}

/* ── Main ─────────────────────────────────────────────────────── */
export default function KurirSPPG() {
    const [kurirList, setKurirList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("semua");
    const [actioningId, setActioningId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const fetchKurir = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get("/sppg/kurir");
            setKurirList(res.data?.data || []);
        } catch (err) {
            console.error(err);
            setError("Gagal memuat data kurir. Coba muat ulang halaman.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchKurir(); }, []);

    const stats = useMemo(() => {
        const total = kurirList.length;
        const approved = kurirList.filter((k) => k.status === "approved").length;
        const pending = kurirList.filter((k) => k.status === "pending").length;
        return { total, approved, pending };
    }, [kurirList]);

    const filtered = useMemo(() => {
        return kurirList.filter((k) => {
            const q = search.toLowerCase();
            const matchSearch =
                k.name?.toLowerCase().includes(q) ||
                k.phone?.toLowerCase().includes(q) ||
                k.email?.toLowerCase().includes(q);
            const matchStatus = statusFilter === "semua" ? true : k.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [kurirList, search, statusFilter]);

    const handleApprove = async (id) => {
        setActioningId(id);
        setError("");
        try {
            await axios.put(`/sppg/kurir/${id}/approve`);
            setKurirList((prev) => prev.map((k) => (k.id === id ? { ...k, status: "approved" } : k)));
        } catch (err) {
            console.error(err);
            setError("Gagal menyetujui kurir. Silakan coba lagi.");
        } finally {
            setActioningId(null);
        }
    };

    const handleReject = async (id) => {
        setActioningId(id);
        setError("");
        try {
            await axios.put(`/sppg/kurir/${id}/reject`);
            setKurirList((prev) => prev.map((k) => (k.id === id ? { ...k, status: "rejected" } : k)));
        } catch (err) {
            console.error(err);
            setError("Gagal menolak kurir. Silakan coba lagi.");
        } finally {
            setActioningId(null);
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        const id = confirmDelete.id;
        setActioningId(id);
        setError("");
        try {
            await axios.delete(`/sppg/kurir/${id}`);
            setKurirList((prev) => prev.filter((k) => k.id !== id));
            setConfirmDelete(null);
        } catch (err) {
            console.error(err);
            setError("Gagal menghapus kurir. Silakan coba lagi.");
        } finally {
            setActioningId(null);
        }
    };

    const filterChips = [
        { key: "semua", label: "Semua" },
        { key: "approved", label: "Aktif" },
        { key: "pending", label: "Menunggu" },
        { key: "rejected", label: "Ditolak" },
    ];

    return (
        <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
            <style>{`
                html,body{margin:0;padding:0;background:${T.bg}}
                *{box-sizing:border-box}
                ::-webkit-scrollbar{width:4px}
                ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}
                tbody tr:hover td{background:rgba(255,255,255,0.015)!important;transition:background .15s}

                .kurir-chip {
                    height: 34px; padding: 0 15px;
                    border-radius: 999px;
                    border: 0.5px solid ${T.borderMd};
                    background: ${T.card};
                    font-family: ${T.font};
                    font-size: 12px; font-weight: 700;
                    color: ${T.sub};
                    cursor: pointer;
                    transition: all 0.15s ease;
                }
                .kurir-chip:hover { background: rgba(255,255,255,0.04); color: ${T.text}; }
                .kurir-chip.active {
                    background: ${T.accent}18;
                    border-color: ${T.accent}40;
                    color: #93C5FD;
                }

                .kurir-icon-btn {
                    height: 32px; padding: 0 12px;
                    border-radius: 8px;
                    display: flex; align-items: center; gap: 5px;
                    font-family: ${T.font}; font-size: 11.5px; font-weight: 600;
                    cursor: pointer; transition: all 0.15s ease;
                    border: 0.5px solid ${T.border};
                    background: ${T.card};
                    color: ${T.sub};
                }
                .kurir-icon-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .kurir-icon-btn.success { border-color: rgba(16,185,129,.25); background: rgba(16,185,129,.10); color: #6ee7b7; }
                .kurir-icon-btn.success:hover:not(:disabled) { background: rgba(16,185,129,.18); }
                .kurir-icon-btn.danger { border-color: rgba(239,68,68,.20); background: rgba(239,68,68,.08); color: #FCA5A5; }
                .kurir-icon-btn.danger:hover:not(:disabled) { background: rgba(239,68,68,.16); }
            `}</style>

            <SidebarSPPG />

            <div style={{ marginLeft: "260px", padding: "32px 36px" }}>

                {/* ── Page Header ── */}
                <div style={{ marginBottom: "28px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "8px" }}>
                        SPPG › Kurir
                    </div>
                    <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 800, color: T.text, letterSpacing: "-.6px" }}>
                        Kurir SPPG
                    </h1>
                    <p style={{ margin: "6px 0 0", fontSize: "13px", color: T.muted }}>
                        Kurir yang mendaftar dan memilih SPPG ini sebagai tempat kerja
                    </p>
                </div>

                {/* ── KPI Cards ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "24px" }}>
                    <KpiCard label="Total Kurir"                 value={stats.total}    icon={Users}      accent={T.accent} />
                    <KpiCard label="Kurir Aktif"                 value={stats.approved} icon={UserCheck}  accent={T.green}  />
                    <KpiCard label="Menunggu Persetujuan"        value={stats.pending}  icon={Clock}      accent={T.amber}  />
                </div>

                {/* ── Error banner ── */}
                {error && (
                    <div style={{
                        background: "rgba(239,68,68,.10)", border: "0.5px solid rgba(239,68,68,.25)",
                        color: "#FCA5A5", borderRadius: "12px", padding: "12px 16px",
                        fontSize: "13px", marginBottom: "18px", fontFamily: T.font,
                        display: "flex", alignItems: "center", gap: "8px",
                    }}>
                        <AlertTriangle size={15} strokeWidth={1.8} />
                        {error}
                    </div>
                )}

                {/* ── Table Card ── */}
                <div style={{ background: T.elevated, border: `0.5px solid ${T.border}`, borderRadius: "18px", overflow: "hidden" }}>
                    {/* toolbar */}
                    <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "18px 22px", borderBottom: `0.5px solid ${T.border}`, flexWrap: "wrap", gap: "12px",
                    }}>
                        <div>
                            <div style={{ fontSize: "15px", fontWeight: 700, color: T.text }}>Data Kurir</div>
                            <div style={{ fontSize: "12px", color: T.muted, marginTop: "3px" }}>Daftar kurir terdaftar di SPPG ini</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                            <div style={{
                                display: "flex", alignItems: "center", gap: "8px",
                                background: T.card, border: `0.5px solid ${T.border}`,
                                borderRadius: "10px", padding: "0 14px", height: "38px",
                            }}>
                                <Search size={14} strokeWidth={2} color={T.muted} />
                                <input
                                    value={search} onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari nama, telepon, atau email..."
                                    style={{ background: "none", border: "none", outline: "none", color: T.text, fontSize: "13px", fontFamily: T.font, width: "220px" }}
                                />
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                {filterChips.map((s) => (
                                    <button
                                        key={s.key}
                                        className={`kurir-chip${statusFilter === s.key ? " active" : ""}`}
                                        onClick={() => setStatusFilter(s.key)}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                            <span style={{
                                fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px",
                                background: `${T.accent}18`, border: `0.5px solid ${T.accent}30`, color: "#93C5FD",
                            }}>{filtered.length} data</span>
                        </div>
                    </div>

                    {/* table */}
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "820px" }}>
                            <thead>
                                <tr>
                                    {["Kurir", "Kontak", "Terdaftar", "Status", "Aksi"].map((h) => (
                                        <th key={h} style={{
                                            padding: "11px 18px",
                                            textAlign: h === "Aksi" ? "center" : "left",
                                            fontSize: "10.5px", fontWeight: 600, color: T.muted,
                                            textTransform: "uppercase", letterSpacing: ".7px",
                                            borderBottom: `0.5px solid ${T.border}`,
                                            background: T.card, whiteSpace: "nowrap",
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: "48px", textAlign: "center", color: T.muted, fontSize: "13px" }}>
                                            Memuat data kurir...
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: "48px", textAlign: "center", color: T.muted, fontSize: "13px" }}>
                                            {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada kurir yang cocok dengan pencarian."}
                                        </td>
                                    </tr>
                                ) : filtered.map((k) => {
                                    const isActing = actioningId === k.id;
                                    return (
                                        <tr key={k.id} style={{ borderBottom: `0.5px solid rgba(255,255,255,.04)` }}>
                                            <td style={{ padding: "14px 18px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                    <div style={{
                                                        width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                                                        background: `linear-gradient(135deg, ${T.accent}, ${T.teal})`,
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        color: "#fff", fontWeight: 700, fontSize: "13px",
                                                    }}>
                                                        {k.name?.charAt(0)?.toUpperCase() || "K"}
                                                    </div>
                                                    <span style={{ fontWeight: 600, color: T.text }}>{k.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: "14px 18px" }}>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12.5px", color: T.sub }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                        <Phone size={12} strokeWidth={1.8} color={T.muted} />
                                                        {k.phone || "—"}
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                        <Mail size={12} strokeWidth={1.8} color={T.muted} />
                                                        {k.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: "14px 18px", color: T.sub, whiteSpace: "nowrap" }}>
                                                {k.created_at
                                                    ? new Date(k.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                                                    : "—"}
                                            </td>
                                            <td style={{ padding: "14px 18px" }}>
                                                <StatusBadge status={k.status} />
                                            </td>
                                            <td style={{ padding: "14px 18px" }}>
                                                <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
                                                    {k.status === "pending" && (
                                                        <>
                                                            <button
                                                                className="kurir-icon-btn success"
                                                                onClick={() => handleApprove(k.id)}
                                                                disabled={isActing}
                                                                title="Setujui"
                                                            >
                                                                <Check size={11} strokeWidth={2.5} /> Setujui
                                                            </button>
                                                            <button
                                                                className="kurir-icon-btn danger"
                                                                onClick={() => handleReject(k.id)}
                                                                disabled={isActing}
                                                                title="Tolak"
                                                            >
                                                                <X size={11} strokeWidth={2.5} /> Tolak
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        className="kurir-icon-btn danger"
                                                        onClick={() => setConfirmDelete(k)}
                                                        disabled={isActing}
                                                        title="Hapus dari daftar"
                                                    >
                                                        <Trash2 size={11} strokeWidth={2} /> Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Delete Modal ── */}
            {confirmDelete && (
                <DeleteModal
                    name={confirmDelete.name}
                    loading={actioningId === confirmDelete.id}
                    onCancel={() => setConfirmDelete(null)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}