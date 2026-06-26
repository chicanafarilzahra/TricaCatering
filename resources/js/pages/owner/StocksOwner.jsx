// resources/js/pages/owner/StocksOwner.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import {
    Boxes, AlertTriangle, TrendingDown,
    PackageCheck, Plus, Pencil, Trash2,
    LayoutDashboard, Check, X,
} from "lucide-react";
import OwnerLayout from "../../layouts/OwnerLayout";

/* ── font injection ─────────────────────────────────────────── */
if (typeof document !== "undefined" && !document.getElementById("inter-font")) {
    const l = document.createElement("link");
    l.id   = "inter-font";
    l.rel  = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(l);
}

/* ── tokens ─────────────────────────────────────────────────── */
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
    indigo: "linear-gradient(90deg,#6366f1,#818cf8)",
    amber:  "linear-gradient(90deg,#f59e0b,#fbbf24)",
    red:    "linear-gradient(90deg,#ef4444,#f87171)",
    green:  "linear-gradient(90deg,#10b981,#34d399)",
};

/* ── shared input style ─────────────────────────────────────── */
const inp = {
    width: "100%", height: "40px",
    borderRadius: "8px",
    border: `0.5px solid ${C.borderMd}`,
    background: C.card,
    padding: "0 12px",
    color: C.text,
    fontFamily: C.font,
    fontSize: "13.5px",
    outline: "none",
    boxSizing: "border-box",
};

/* ── helpers ─────────────────────────────────────────────────── */
function getStatus(qty, min) {
    const q = Number(qty);
    const m = Number(min || 5);
    if (q === 0)  return { label: "Habis",    color: "#ef4444", fill: "rgba(239,68,68,.12)",  border: "rgba(239,68,68,.30)"  };
    if (q <= m)   return { label: "Menipis",  color: "#f59e0b", fill: "rgba(245,158,11,.12)", border: "rgba(245,158,11,.30)" };
    return              { label: "Tersedia",  color: "#10b981", fill: "rgba(16,185,129,.12)", border: "rgba(16,185,129,.30)" };
}

/* ── StatCard ───────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, bar }) {
    return (
        <div style={{
            background: C.surface, border: `0.5px solid ${C.border}`,
            borderRadius: "12px", padding: "18px 20px",
            position: "relative", overflow: "hidden", fontFamily: C.font,
        }}>
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: "2px", background: bar,
            }} />
            <div style={{
                fontSize: "11px", fontWeight: 600, color: C.muted,
                textTransform: "uppercase", letterSpacing: ".7px", marginBottom: "10px",
            }}>{label}</div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div style={{
                    fontSize: "30px", fontWeight: 800, color: C.text,
                    letterSpacing: "-1.2px", lineHeight: 1,
                }}>{value ?? "—"}</div>
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

/* ── FieldLabel ─────────────────────────────────────────────── */
function FieldLabel({ children, mt = true }) {
    return (
        <div style={{
            fontSize: "11px", fontWeight: 600, color: C.muted,
            textTransform: "uppercase", letterSpacing: ".6px",
            marginBottom: "5px", marginTop: mt ? "13px" : 0,
        }}>{children}</div>
    );
}

/* ── EmptyState ─────────────────────────────────────────────── */
function EmptyState({ title, subtitle, icon: Icon }) {
    return (
        <div style={{
            padding: "48px 20px", display: "flex",
            flexDirection: "column", alignItems: "center", textAlign: "center",
            fontFamily: C.font,
        }}>
            <div style={{
                width: "60px", height: "60px", borderRadius: "16px",
                background: C.card, border: `0.5px solid ${C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: C.muted, marginBottom: "16px",
            }}>
                <Icon size={26} strokeWidth={1.4} />
            </div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: C.text, marginBottom: "6px" }}>{title}</div>
            <p style={{ fontSize: "13px", color: C.muted, lineHeight: "1.7", maxWidth: "360px" }}>{subtitle}</p>
        </div>
    );
}

/* ── StockModal ─────────────────────────────────────────────── */
function StockModal({ show, editId, form, setForm, onClose, onSubmit }) {
    if (!show) return null;
    return (
        <div style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.70)",
            display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 9999, padding: "20px",
        }}>
            <div style={{
                width: "100%", maxWidth: "400px",
                background: C.surface,
                border: `0.5px solid ${C.borderMd}`,
                borderRadius: "14px", padding: "24px",
                fontFamily: C.font,
            }}>
                {/* head */}
                <div style={{
                    display: "flex", alignItems: "flex-start",
                    justifyContent: "space-between", marginBottom: "20px",
                }}>
                    <div>
                        <div style={{ fontSize: "18px", fontWeight: 800, color: C.text, letterSpacing: "-.4px" }}>
                            {editId ? "Edit bahan baku" : "Tambah bahan baku"}
                        </div>
                        <div style={{ fontSize: "12.5px", color: C.muted, marginTop: "4px" }}>
                            Isi detail bahan di bawah ini
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        width: "30px", height: "30px", borderRadius: "7px",
                        background: C.card, border: `0.5px solid ${C.border}`,
                        color: C.muted, display: "flex", alignItems: "center",
                        justifyContent: "center", cursor: "pointer", flexShrink: 0,
                    }}>
                        <X size={14} strokeWidth={2} />
                    </button>
                </div>

                <form onSubmit={onSubmit}>
                    <FieldLabel mt={false}>Nama bahan</FieldLabel>
                    <input style={inp} type="text" placeholder="e.g. Beras Premium"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })} />

                    {/* 2-col: qty + unit */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <div>
                            <FieldLabel>Jumlah stok</FieldLabel>
                            <input style={inp} type="number" placeholder="e.g. 50"
                                value={form.qty}
                                onChange={e => setForm({ ...form, qty: e.target.value })} />
                        </div>
                        <div>
                            <FieldLabel>Satuan</FieldLabel>
                            <input style={inp} type="text" placeholder="kg / pcs / liter"
                                value={form.unit}
                                onChange={e => setForm({ ...form, unit: e.target.value })} />
                        </div>
                    </div>

                    <FieldLabel>Minimum stok</FieldLabel>
                    <input style={inp} type="number" placeholder="e.g. 10"
                        value={form.minimum_stock}
                        onChange={e => setForm({ ...form, minimum_stock: e.target.value })} />

                    <div style={{
                        display: "flex", justifyContent: "flex-end", gap: "8px",
                        marginTop: "22px", paddingTop: "16px",
                        borderTop: `0.5px solid ${C.border}`,
                    }}>
                        <button type="button" onClick={onClose} style={{
                            height: "36px", padding: "0 14px", borderRadius: "8px",
                            border: `0.5px solid ${C.borderMd}`, background: "transparent",
                            color: C.sub, fontFamily: C.font, fontSize: "13px",
                            fontWeight: 600, cursor: "pointer",
                        }}>Batal</button>
                        <button type="submit" style={{
                            height: "36px", padding: "0 18px", borderRadius: "8px",
                            border: "none", background: "#6366f1",
                            color: "#fff", fontFamily: C.font, fontSize: "13px",
                            fontWeight: 700, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: "5px",
                        }}>
                            <Check size={14} strokeWidth={2.5} />
                            {editId ? "Update" : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function StocksOwner() {
    const [stocks,     setStocks]     = useState([]);
    const [showModal,  setShowModal]  = useState(false);
    const [editId,     setEditId]     = useState(null);
    const [form,       setForm]       = useState({ name: "", qty: "", unit: "", minimum_stock: "" });

    /* fetch */
    const fetchStocks = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            const res   = await axios.get("/owner/stocks", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStocks(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchStocks(); }, []);

    /* submit */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("auth_token");
            const headers = { Authorization: `Bearer ${token}` };
            if (editId) {
                await axios.put(`/owner/stocks/${editId}`, form, { headers });
            } else {
                await axios.post("/owner/stocks", form, { headers });
            }
            setEditId(null);
            setShowModal(false);
            setForm({ name: "", qty: "", unit: "", minimum_stock: "" });
            fetchStocks();
        } catch (err) { console.error(JSON.stringify(err.response?.data, null, 2)); }
    };

    /* edit */
    const handleEdit = (item) => {
        setForm({ name: item.name, qty: item.qty, unit: item.unit, minimum_stock: item.minimum_stock });
        setEditId(item.id);
        setShowModal(true);
    };

    /* delete */
    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus bahan ini?")) return;
        try {
            const token = localStorage.getItem("auth_token");
            await axios.delete(`/owner/stocks/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchStocks();
        } catch (err) { console.error(err); }
    };

    const openCreate = () => {
        setEditId(null);
        setForm({ name: "", qty: "", unit: "", minimum_stock: "" });
        setShowModal(true);
    };

    /* derived counts */
    const totalCount   = stocks.length;
    const menipisCount = stocks.filter(i => Number(i.qty) > 0 && Number(i.qty) <= Number(i.minimum_stock || 5)).length;
    const habisCount   = stocks.filter(i => Number(i.qty) === 0).length;
    const tersediaCount= stocks.filter(i => Number(i.qty) > 0).length;

    const criticalItems = stocks.filter(i =>
        Number(i.qty) <= Number(i.minimum_stock || 5)
    );

    return (
        <OwnerLayout>
            <div style={{ fontFamily: C.font }}>

                {/* ── header ── */}
                <div style={{
                    display: "flex", alignItems: "flex-start",
                    justifyContent: "space-between", gap: "16px",
                    marginBottom: "28px", flexWrap: "wrap",
                }}>
                    <div>
                        <div style={{
                            display: "flex", alignItems: "center", gap: "6px",
                            fontSize: "11px", fontWeight: 600, color: C.muted,
                            textTransform: "uppercase", letterSpacing: ".8px",
                            marginBottom: "14px",
                        }}>
                            <LayoutDashboard size={13} strokeWidth={2} />
                            <span>Owner</span>
                            <span style={{ color: "#1E293B" }}>›</span>
                            <span>Stocks</span>
                        </div>
                        <h1 style={{
                            fontSize: "28px", fontWeight: 800, color: C.text,
                            letterSpacing: "-.8px", lineHeight: 1.1, margin: 0,
                        }}>Stock bahan baku</h1>
                        <p style={{ marginTop: "8px", fontSize: "13.5px", color: C.muted, lineHeight: "1.7" }}>
                            Kelola persediaan bahan baku untuk kebutuhan produksi catering.
                        </p>
                    </div>

                    <button onClick={openCreate} style={{
                        height: "42px", padding: "0 18px",
                        border: "0.5px solid rgba(99,102,241,.40)",
                        borderRadius: "10px",
                        background: "rgba(99,102,241,.15)",
                        color: "#a5b4fc", fontFamily: C.font,
                        fontWeight: 700, fontSize: "13px", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "7px",
                    }}>
                        <Plus size={16} strokeWidth={2.5} /> Tambah bahan
                    </button>
                </div>

                {/* ── stat cards — locked 4 col ── */}
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(4,1fr)",
                    gap: "12px", marginBottom: "22px",
                }}>
                    <StatCard label="Total bahan"  value={totalCount    || null} icon={Boxes}        bar={bars.indigo} />
                    <StatCard label="Stok menipis" value={menipisCount  || null} icon={AlertTriangle} bar={bars.amber}  />
                    <StatCard label="Habis"        value={habisCount    || null} icon={TrendingDown}  bar={bars.red}    />
                    <StatCard label="Tersedia"     value={tersediaCount || null} icon={PackageCheck}  bar={bars.green}  />
                </div>

                {/* ── inventory table ── */}
                <div style={{
                    background: C.surface, border: `0.5px solid ${C.border}`,
                    borderRadius: "14px", overflow: "hidden", marginBottom: "18px",
                }}>
                    <div style={{
                        padding: "18px 22px", borderBottom: `0.5px solid ${C.border}`,
                    }}>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: C.text }}>Inventory overview</div>
                        <div style={{ fontSize: "12px", color: C.muted, marginTop: "3px" }}>
                            Level stok dan ketersediaan bahan saat ini
                        </div>
                    </div>

                    {stocks.length === 0 ? (
                        <EmptyState
                            title="Belum ada data stok"
                            subtitle="Tambahkan bahan baku pertama kamu. Data akan muncul di sini setelah disimpan."
                            icon={Boxes}
                        />
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{
                                width: "100%", borderCollapse: "collapse",
                                fontSize: "13px", minWidth: "600px",
                            }}>
                                <thead>
                                    <tr>
                                        {["Nama bahan","Jumlah","Satuan","Minimum","Status","Aksi"].map(h => (
                                            <th key={h} style={{
                                                padding: "11px 16px", textAlign: "left",
                                                fontSize: "11px", fontWeight: 600,
                                                color: C.muted, textTransform: "uppercase",
                                                letterSpacing: ".6px",
                                                borderBottom: `0.5px solid ${C.border}`,
                                                whiteSpace: "nowrap",
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {stocks.map(item => {
                                        const st = getStatus(item.qty, item.minimum_stock);
                                        return (
                                            <tr key={item.id} style={{ borderBottom: `0.5px solid rgba(255,255,255,.04)` }}>
                                                <td style={{ padding: "12px 16px", fontWeight: 600, color: C.text }}>
                                                    {item.name}
                                                </td>
                                                <td style={{ padding: "12px 16px", fontWeight: 700, color: C.text }}>
                                                    {item.qty}
                                                </td>
                                                <td style={{ padding: "12px 16px", color: C.sub }}>
                                                    {item.unit}
                                                </td>
                                                <td style={{ padding: "12px 16px", color: C.sub }}>
                                                    {item.minimum_stock || 5}
                                                </td>
                                                <td style={{ padding: "12px 16px" }}>
                                                    <span style={{
                                                        display: "inline-flex", alignItems: "center",
                                                        fontSize: "11px", fontWeight: 600,
                                                        padding: "3px 10px", borderRadius: "20px",
                                                        background: st.fill,
                                                        border: `0.5px solid ${st.border}`,
                                                        color: st.color,
                                                    }}>{st.label}</span>
                                                </td>
                                                <td style={{ padding: "12px 16px" }}>
                                                    <div style={{ display: "flex", gap: "7px" }}>
                                                        <button onClick={() => handleEdit(item)} style={{
                                                            height: "30px", padding: "0 12px",
                                                            borderRadius: "7px",
                                                            border: "0.5px solid rgba(99,102,241,.30)",
                                                            background: "rgba(99,102,241,.12)",
                                                            color: "#a5b4fc", fontFamily: C.font,
                                                            fontSize: "11.5px", fontWeight: 600,
                                                            cursor: "pointer",
                                                            display: "flex", alignItems: "center", gap: "4px",
                                                        }}>
                                                            <Pencil size={11} strokeWidth={2} /> Edit
                                                        </button>
                                                        <button onClick={() => handleDelete(item.id)} style={{
                                                            height: "30px", padding: "0 12px",
                                                            borderRadius: "7px",
                                                            border: "0.5px solid rgba(239,68,68,.25)",
                                                            background: "rgba(239,68,68,.10)",
                                                            color: "#fca5a5", fontFamily: C.font,
                                                            fontSize: "11.5px", fontWeight: 600,
                                                            cursor: "pointer",
                                                            display: "flex", alignItems: "center", gap: "4px",
                                                        }}>
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
                    )}
                </div>

                {/* ── stock insights ── */}
                <div style={{
                    background: C.surface, border: `0.5px solid ${C.border}`,
                    borderRadius: "14px", overflow: "hidden",
                }}>
                    <div style={{
                        padding: "18px 22px", borderBottom: `0.5px solid ${C.border}`,
                    }}>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: C.text }}>Stock insights</div>
                        <div style={{ fontSize: "12px", color: C.muted, marginTop: "3px" }}>
                            Alert bahan yang mendekati atau melebihi batas minimum
                        </div>
                    </div>

                    {stocks.length === 0 ? (
                        <EmptyState
                            title="Belum ada insight"
                            subtitle="Alert stok akan muncul otomatis saat ada bahan yang menipis atau habis."
                            icon={AlertTriangle}
                        />
                    ) : criticalItems.length === 0 ? (
                        <EmptyState
                            title="Semua stok aman"
                            subtitle="Tidak ada bahan yang mendekati batas minimum saat ini."
                            icon={PackageCheck}
                        />
                    ) : (
                        <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: "10px" }}>
                            {criticalItems.map(item => {
                                const st = getStatus(item.qty, item.minimum_stock);
                                return (
                                    <div key={item.id} style={{
                                        display: "flex", alignItems: "center", gap: "12px",
                                        padding: "12px 14px", borderRadius: "9px",
                                        background: "rgba(239,68,68,.07)",
                                        border: "0.5px solid rgba(239,68,68,.20)",
                                    }}>
                                        <div style={{
                                            width: "32px", height: "32px", borderRadius: "8px",
                                            background: "rgba(239,68,68,.15)",
                                            display: "flex", alignItems: "center",
                                            justifyContent: "center", color: "#fca5a5", flexShrink: 0,
                                        }}>
                                            <AlertTriangle size={15} strokeWidth={2} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: "13px", fontWeight: 700, color: C.text }}>
                                                {item.name}
                                            </div>
                                            <div style={{ fontSize: "12px", color: C.sub, marginTop: "2px" }}>
                                                Tersisa {item.qty} {item.unit} · batas minimum {item.minimum_stock || 5} {item.unit}
                                            </div>
                                        </div>
                                        <span style={{
                                            fontSize: "11px", fontWeight: 700,
                                            padding: "3px 10px", borderRadius: "20px",
                                            background: st.fill,
                                            border: `0.5px solid ${st.border}`,
                                            color: st.color, whiteSpace: "nowrap", flexShrink: 0,
                                        }}>{st.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <StockModal
                show={showModal}
                editId={editId}
                form={form}
                setForm={setForm}
                onClose={() => { setShowModal(false); setEditId(null); }}
                onSubmit={handleSubmit}
            />
        </OwnerLayout>
    );
}