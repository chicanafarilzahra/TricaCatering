import { useEffect, useState } from "react";
import axios from "axios";
import SidebarSPPG from "../../components/SidebarSPPG";
import {
    Package, AlertTriangle, CheckCircle,
    XCircle, Search, Plus, X, Trash2, Pencil, ChevronRight,
} from "lucide-react";

/* ─── Design Tokens (sama dengan Dashboard & MenuHarian) ────────── */
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
    font:     "'Inter', system-ui, sans-serif",
};

if (typeof document !== "undefined" && !document.getElementById("sppg-inter")) {
    const l = document.createElement("link");
    l.id = "sppg-inter"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";
    document.head.appendChild(l);
}

/* ─── KPI Card (pola sama dengan Dashboard) ─────────────────────── */
function KpiCard({ label, value, icon: Icon, accent }) {
    return (
        <div style={{
            background: T.elevated,
            border: `0.5px solid ${T.border}`,
            borderRadius: "16px",
            padding: "20px 22px",
            position: "relative",
            overflow: "hidden",
            fontFamily: T.font,
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
                    width: "34px", height: "34px", borderRadius: "10px",
                    background: `${accent}18`, border: `0.5px solid ${accent}30`,
                    display: "flex", alignItems: "center", justifyContent: "center", color: accent,
                }}>
                    <Icon size={15} strokeWidth={1.8} />
                </div>
            </div>
            <div style={{ marginTop: "14px", fontSize: "28px", fontWeight: 800, color: T.text, letterSpacing: "-1px", lineHeight: 1 }}>
                {value ?? 0}
            </div>
        </div>
    );
}

/* ─── Section Header ─────────────────────────────────────────────── */
function SectionHeader({ label, action, onAction }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: T.text, letterSpacing: "-.2px" }}>{label}</span>
            {action && (
                <button onClick={onAction} style={{
                    fontSize: "11.5px", fontWeight: 600, color: T.accent,
                    background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "3px", padding: 0,
                }}>
                    {action} <ChevronRight size={12} strokeWidth={2.5} />
                </button>
            )}
        </div>
    );
}

/* ─── Status Badge ───────────────────────────────────────────────── */
function StatusBadge({ status }) {
    const map = {
        Aman:    { color: T.green, bg: `${T.green}15`, border: `${T.green}30` },
        Menipis: { color: T.amber, bg: `${T.amber}15`, border: `${T.amber}30` },
        Habis:   { color: T.red,   bg: `${T.red}15`,   border: `${T.red}30`   },
    };
    const s = map[status] || map.Aman;
    return (
        <span style={{
            fontSize: "11.5px", fontWeight: 700, color: s.color,
            background: s.bg, border: `0.5px solid ${s.border}`,
            padding: "3px 10px", borderRadius: "20px",
        }}>
            {status}
        </span>
    );
}

/* ─── Field ──────────────────────────────────────────────────────── */
function Field({ label, children }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: T.sub, letterSpacing: ".3px" }}>{label}</label>
            {children}
        </div>
    );
}

const inputSx = {
    background: "rgba(255,255,255,0.04)",
    border: `0.5px solid rgba(255,255,255,0.10)`,
    color: "#F1F5F9",
    borderRadius: "10px",
    padding: "9px 12px",
    fontSize: "13px",
    width: "100%",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Inter', system-ui, sans-serif",
};

/* ─── Main Component ─────────────────────────────────────────────── */
export default function StockSPPG() {
    const [summary,   setSummary]   = useState({});
    const [stocks,    setStocks]    = useState([]);
    const [search,    setSearch]    = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ name: "", qty: "", unit: "", minimum_stock: "" });

    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        loadStocks();
    }, []);

    const loadStocks = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            const res = await axios.get("/sppg/stocks", { headers: { Authorization: `Bearer ${token}` } });
            setSummary(res.data.summary);
            setStocks(res.data.stocks);
        } catch (err) { console.log(err); }
    };

    const saveStock = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            if (editingId) {
                await axios.put(`/sppg/stocks/${editingId}`, form, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await axios.post("/sppg/stocks", form, { headers: { Authorization: `Bearer ${token}` } });
            }
            closeModal();
            loadStocks();
        } catch (err) {
            console.log(err);
            alert(editingId ? "Gagal memperbarui stok" : "Gagal menambah stok");
        }
    };

    const openEditModal = (item) => {
        setEditingId(item.id);
        setForm({
            name: item.name ?? "",
            qty: item.qty ?? "",
            unit: item.unit ?? "",
            minimum_stock: item.minimum_stock ?? "",
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setForm({ name: "", qty: "", unit: "", minimum_stock: "" });
    };

    const deleteStock = async (id) => {
        if (!confirm("Yakin hapus stok ini?")) return;
        try {
            const token = localStorage.getItem("auth_token");
            await axios.delete(`/sppg/stocks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            loadStocks();
        } catch (err) { console.log(err); }
    };

    const filtered = stocks.filter(i => i.name?.toLowerCase().includes(search.toLowerCase()));

    const getStatus = (item) => {
        if (item.qty <= 0) return "Habis";
        if (item.qty <= item.minimum_stock) return "Menipis";
        return "Aman";
    };

    const getBarInfo = (status) => {
        if (status === "Habis")   return { pct: 6,   color: T.red };
        if (status === "Menipis") return { pct: 50,  color: T.amber };
        return { pct: 100, color: T.green };
    };

    return (
        <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
            <style>{`
                html,body{margin:0;padding:0;overflow-x:hidden;background:${T.bg}}
                *{box-sizing:border-box}
                ::-webkit-scrollbar{width:4px}
                ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}
                ::placeholder{color:${T.muted}!important;opacity:.6}
                select option{background:#1e293b;color:#f1f5f9}
                tr:hover td{background:rgba(255,255,255,0.018)}
            `}</style>

            <SidebarSPPG />

            <div style={{ marginLeft: "260px", padding: "32px 36px", maxWidth: "1400px" }}>

                {/* ── Top Bar ── */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                    <div>
                        <div style={{ fontSize: "11px", fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "8px" }}>
                            Monitoring MBG
                        </div>
                        <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 800, color: T.text, letterSpacing: "-.6px" }}>
                            Manajemen Bahan
                        </h1>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        style={{
                            background: T.accent, color: "#fff", border: "none",
                            padding: "9px 18px", borderRadius: "10px",
                            fontSize: "13px", fontWeight: 600, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: "6px", fontFamily: T.font,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
                        onMouseLeave={e => e.currentTarget.style.background = T.accent}
                    >
                        <Plus size={15} strokeWidth={2.5} /> Tambah Bahan
                    </button>
                </div>

                {/* ── KPI Grid ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "22px" }}>
                    <KpiCard label="Total Bahan" value={summary.total_bahan}    icon={Package}       accent={T.accent} />
                    <KpiCard label="Stok Aman"   value={summary.stok_aman}      icon={CheckCircle}   accent={T.green}  />
                    <KpiCard label="Menipis"      value={summary.stok_menipis}   icon={AlertTriangle} accent={T.amber}  />
                    <KpiCard label="Habis"        value={summary.stok_habis}     icon={XCircle}       accent={T.red}    />
                </div>

                {/* ── Table Card ── */}
                <div style={{
                    background: T.elevated, border: `0.5px solid ${T.border}`,
                    borderRadius: "18px", overflow: "hidden",
                }}>
                    {/* Search bar */}
                    <div style={{ padding: "18px 22px", borderBottom: `0.5px solid ${T.border}` }}>
                        <SectionHeader label="Daftar Bahan Dapur" />
                        <div style={{ position: "relative" }}>
                            <Search size={15} color={T.muted} style={{ position: "absolute", top: "50%", left: "13px", transform: "translateY(-50%)" }} />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari bahan..."
                                style={{
                                    ...inputSx,
                                    paddingLeft: "38px",
                                    background: T.card,
                                    border: `0.5px solid ${T.border}`,
                                }}
                                onFocus={e => e.target.style.borderColor = `${T.accent}60`}
                                onBlur={e => e.target.style.borderColor = T.border}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <table style={{ width: "100%", borderCollapse: "collapse", color: T.text }}>
                        <thead>
                            <tr style={{ background: "rgba(255,255,255,0.025)" }}>
                                {["Nama Bahan", "Stok Tersedia", "Stok Minimum", "Status", "Aksi"].map(h => (
                                    <th key={h} style={{
                                        padding: "13px 20px", textAlign: "left",
                                        fontSize: "11px", fontWeight: 700,
                                        color: T.muted, textTransform: "uppercase",
                                        letterSpacing: "1px",
                                        borderBottom: `0.5px solid ${T.border}`,
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: "48px", textAlign: "center", color: T.muted, fontSize: "13px" }}>
                                        {search ? `Tidak ada bahan dengan kata "${search}"` : "Belum ada data bahan"}
                                    </td>
                                </tr>
                            ) : filtered.map(item => {
                                const status = getStatus(item);
                                const { pct, color: barColor } = getBarInfo(status);
                                return (
                                    <tr key={item.id} style={{ transition: "background .15s" }}>
                                        <td style={{ padding: "15px 20px", borderBottom: `0.5px solid ${T.border}`, fontSize: "13.5px", fontWeight: 600, color: T.text }}>
                                            {item.name}
                                        </td>
                                        <td style={{ padding: "15px 20px", borderBottom: `0.5px solid ${T.border}`, fontSize: "13px", color: T.sub }}>
                                            {item.qty} <span style={{ color: T.muted, fontSize: "11px" }}>{item.unit}</span>
                                        </td>
                                        <td style={{ padding: "15px 20px", borderBottom: `0.5px solid ${T.border}`, fontSize: "13px", color: T.sub }}>
                                            {item.minimum_stock} <span style={{ color: T.muted, fontSize: "11px" }}>{item.unit}</span>
                                        </td>
                                        <td style={{ padding: "15px 20px", borderBottom: `0.5px solid ${T.border}` }}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "7px", width: "160px" }}>
                                                <div style={{ height: "3px", borderRadius: "99px", background: T.border, overflow: "hidden" }}>
                                                    <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: "99px", transition: "width .4s ease" }} />
                                                </div>
                                                <StatusBadge status={status} />
                                            </div>
                                        </td>
                                        <td style={{ padding: "15px 20px", borderBottom: `0.5px solid ${T.border}` }}>
                                            <div style={{ display: "flex", gap: "6px" }}>
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    style={{
                                                        background: `${T.accent}15`, border: `0.5px solid ${T.accent}30`,
                                                        color: T.accent, padding: "7px 10px", borderRadius: "8px",
                                                        cursor: "pointer", display: "flex", alignItems: "center",
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = `${T.accent}25`; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = `${T.accent}15`; }}
                                                >
                                                    <Pencil size={14} strokeWidth={2} />
                                                </button>
                                                <button
                                                    onClick={() => deleteStock(item.id)}
                                                    style={{
                                                        background: `${T.red}15`, border: `0.5px solid ${T.red}30`,
                                                        color: T.red, padding: "7px 10px", borderRadius: "8px",
                                                        cursor: "pointer", display: "flex", alignItems: "center",
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = `${T.red}25`; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = `${T.red}15`; }}
                                                >
                                                    <Trash2 size={14} strokeWidth={2} />
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

            {/* ── MODAL ── */}
            {showModal && (
                <div style={{
                    position: "fixed", inset: 0,
                    background: "rgba(5,8,15,0.85)", backdropFilter: "blur(6px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 9999,
                }}>
                    <div style={{
                        width: "100%", maxWidth: "480px",
                        background: T.elevated,
                        border: `0.5px solid ${T.borderMd}`,
                        borderRadius: "20px",
                        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
                        overflow: "hidden",
                        fontFamily: T.font,
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: "20px 24px",
                            borderBottom: `0.5px solid ${T.border}`,
                            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                        }}>
                            <div>
                                <div style={{ fontSize: "16px", fontWeight: 700, color: T.text, letterSpacing: "-.3px" }}>
                                    {editingId ? "Edit Bahan Dapur" : "Tambah Bahan Dapur"}
                                </div>
                                <div style={{ fontSize: "12px", color: T.muted, marginTop: "3px" }}>
                                    {editingId ? "Perbarui data bahan yang sudah tercatat" : "Tambah bahan baru untuk kebutuhan produksi"}
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                style={{
                                    background: "rgba(255,255,255,0.06)", border: `0.5px solid ${T.border}`,
                                    color: T.sub, width: "30px", height: "30px", borderRadius: "8px",
                                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                }}
                            >
                                <X size={14} strokeWidth={2} />
                            </button>
                        </div>

                        {/* Body */}
                        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                            <Field label="Nama Bahan">
                                <input
                                    type="text" placeholder="Contoh: Beras Premium"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    style={inputSx}
                                    onFocus={e => e.target.style.borderColor = `${T.accent}80`}
                                    onBlur={e => e.target.style.borderColor = T.borderMd}
                                />
                            </Field>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                <Field label="Jumlah Tersedia">
                                    <input
                                        type="number" placeholder="0"
                                        value={form.qty}
                                        onChange={e => setForm({ ...form, qty: e.target.value })}
                                        style={inputSx}
                                        onFocus={e => e.target.style.borderColor = `${T.accent}80`}
                                        onBlur={e => e.target.style.borderColor = T.borderMd}
                                    />
                                </Field>
                                <Field label="Satuan">
                                    <select
                                        value={form.unit}
                                        onChange={e => setForm({ ...form, unit: e.target.value })}
                                        style={{ ...inputSx, cursor: "pointer" }}
                                        onFocus={e => e.target.style.borderColor = `${T.accent}80`}
                                        onBlur={e => e.target.style.borderColor = T.borderMd}
                                    >
                                        <option value="">Pilih satuan</option>
                                        <option value="Kg">Kilogram (Kg)</option>
                                        <option value="Gram">Gram</option>
                                        <option value="Liter">Liter</option>
                                        <option value="Ml">Mililiter</option>
                                        <option value="Pcs">Pcs</option>
                                        <option value="Pack">Pack</option>
                                        <option value="Box">Box</option>
                                    </select>
                                </Field>
                            </div>
                            <Field label="Stok Minimum">
                                <input
                                    type="number" placeholder="Batas minimum stok"
                                    value={form.minimum_stock}
                                    onChange={e => setForm({ ...form, minimum_stock: e.target.value })}
                                    style={inputSx}
                                    onFocus={e => e.target.style.borderColor = `${T.accent}80`}
                                    onBlur={e => e.target.style.borderColor = T.borderMd}
                                />
                            </Field>

                            {/* Alert hint */}
                            <div style={{
                                background: `${T.amber}08`, border: `0.5px solid ${T.amber}30`,
                                padding: "12px 14px", borderRadius: "12px",
                                fontSize: "12.5px", color: T.amber, lineHeight: 1.6,
                                display: "flex", gap: "8px", alignItems: "flex-start",
                            }}>
                                <AlertTriangle size={14} strokeWidth={2} style={{ flexShrink: 0, marginTop: "1px" }} />
                                Sistem akan mengirim peringatan ketika stok berada di bawah batas minimum.
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{
                            padding: "14px 24px",
                            borderTop: `0.5px solid ${T.border}`,
                            display: "flex", justifyContent: "flex-end", gap: "8px",
                        }}>
                            <button
                                onClick={closeModal}
                                style={{
                                    background: "rgba(255,255,255,0.05)", border: `0.5px solid ${T.border}`,
                                    color: T.sub, padding: "8px 16px", borderRadius: "9px",
                                    fontSize: "13px", cursor: "pointer", fontFamily: T.font,
                                }}
                            >
                                Batal
                            </button>
                            <button
                                onClick={saveStock}
                                style={{
                                    background: T.accent, border: "none",
                                    color: "#fff", padding: "8px 20px", borderRadius: "9px",
                                    fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: T.font,
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
                                onMouseLeave={e => e.currentTarget.style.background = T.accent}
                            >
                                {editingId ? "Simpan Perubahan" : "Tambahkan ke Persediaan"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}