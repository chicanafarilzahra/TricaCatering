// resources/js/pages/owner/MenusOwner.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import {
    UtensilsCrossed, CheckCircle2, XCircle, Layers3,
    LayoutDashboard, Plus, Pencil, Trash2,
    Check, X, FlaskConical, Minus, Image,
} from "lucide-react";
import OwnerLayout from "../../layouts/OwnerLayout";

/* ── font ───────────────────────────────────────────────────── */
if (typeof document !== "undefined" && !document.getElementById("inter-font")) {
    const l = document.createElement("link");
    l.id = "inter-font"; l.rel = "stylesheet";
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
    violet: "linear-gradient(90deg,#8b5cf6,#a78bfa)",
    green:  "linear-gradient(90deg,#10b981,#34d399)",
    red:    "linear-gradient(90deg,#ef4444,#f87171)",
};

/* ── shared input ────────────────────────────────────────────── */
const inp = {
    width: "100%", height: "40px", borderRadius: "8px",
    border: `0.5px solid ${C.borderMd}`, background: C.card,
    padding: "0 12px", color: C.text, fontFamily: C.font,
    fontSize: "13.5px", outline: "none", boxSizing: "border-box",
};

const selectStyle = {
    ...inp,
    appearance: "none", WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
    paddingRight: "32px",
};

// FIX 1: emptyForm didefinisikan di sini (module level), bukan di dalam komponen
const emptyForm = {
    name: "", description: "", category: "", price: "",
    min_pax: "", status: "active", image: null, imageFile: null,
};

/* ── helpers ─────────────────────────────────────────────────── */
function fmt(num) {
    if (!num && num !== 0) return "—";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
}

/* ── StatCard ────────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, bar }) {
    return (
        <div style={{
            background: C.surface, border: `0.5px solid ${C.border}`,
            borderRadius: "12px", padding: "18px 20px",
            position: "relative", overflow: "hidden", fontFamily: C.font,
        }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: bar }} />
            <div style={{ fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: ".7px", marginBottom: "10px" }}>{label}</div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div style={{ fontSize: "30px", fontWeight: 800, color: C.text, letterSpacing: "-1.2px", lineHeight: 1 }}>{value ?? "—"}</div>
                <div style={{ width: "38px", height: "38px", borderRadius: "9px", background: C.card, border: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, flexShrink: 0 }}>
                    <Icon size={18} strokeWidth={1.7} />
                </div>
            </div>
        </div>
    );
}

/* ── FieldLabel ──────────────────────────────────────────────── */
function FieldLabel({ children, mt = true }) {
    return (
        <div style={{ fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: ".6px", marginBottom: "5px", marginTop: mt ? "13px" : 0 }}>
            {children}
        </div>
    );
}

/* ── EmptyState ──────────────────────────────────────────────── */
function EmptyState({ title, subtitle, icon: Icon }) {
    return (
        <div style={{ padding: "48px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", fontFamily: C.font }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "16px", background: C.card, border: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, marginBottom: "16px" }}>
                <Icon size={26} strokeWidth={1.4} />
            </div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: C.text, marginBottom: "6px" }}>{title}</div>
            <p style={{ fontSize: "13px", color: C.muted, lineHeight: "1.7", maxWidth: "360px", margin: 0 }}>{subtitle}</p>
        </div>
    );
}

/* ── StatusBadge ─────────────────────────────────────────────── */
function StatusBadge({ status }) {
    const map = {
        active:   { label: "Aktif",    color: "#10b981", fill: "rgba(16,185,129,.12)", border: "rgba(16,185,129,.30)" },
        inactive: { label: "Nonaktif", color: "#64748b", fill: "rgba(100,116,139,.12)", border: "rgba(100,116,139,.30)" },
    };
    const s = map[status] || map.inactive;
    return (
        <span style={{ display: "inline-flex", alignItems: "center", fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", background: s.fill, border: `0.5px solid ${s.border}`, color: s.color }}>
            {s.label}
        </span>
    );
}

/* ── IngredientsPanel ────────────────────────────────────────── */
function IngredientsPanel({ ingredients, setIngredients, stocks }) {
    const addRow = () =>
        setIngredients([...ingredients, { stock_id: "", qty_per_portion: "" }]);

    const removeRow = (i) =>
        setIngredients(ingredients.filter((_, idx) => idx !== i));

    const updateRow = (i, field, val) => {
        const next = [...ingredients];
        next[i] = { ...next[i], [field]: val };
        if (field === "stock_id") {
            const found = stocks.find(s => String(s.id) === String(val));
            next[i].unit = found?.unit || "";
        }
        setIngredients(next);
    };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: ".6px" }}>
                    Bahan per porsi
                </div>
                <button type="button" onClick={addRow} style={{
                    height: "26px", padding: "0 10px", borderRadius: "6px",
                    border: "0.5px solid rgba(99,102,241,.35)",
                    background: "rgba(99,102,241,.12)",
                    color: "#a5b4fc", fontFamily: C.font,
                    fontSize: "11px", fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "4px",
                }}>
                    <Plus size={11} strokeWidth={2.5} /> Tambah bahan
                </button>
            </div>

            {ingredients.length === 0 ? (
                <div style={{
                    padding: "14px", borderRadius: "8px",
                    background: "rgba(255,255,255,0.02)",
                    border: `0.5px solid ${C.border}`,
                    fontSize: "12px", color: C.muted, textAlign: "center",
                }}>
                    Belum ada bahan. Klik "+ Tambah bahan" untuk menambahkan.
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {ingredients.map((row, i) => {
                        const found = stocks.find(s => String(s.id) === String(row.stock_id));
                        return (
                            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 90px 50px 28px", gap: "6px", alignItems: "center" }}>
                                <select
                                    style={selectStyle}
                                    value={row.stock_id}
                                    onChange={e => updateRow(i, "stock_id", e.target.value)}
                                >
                                    <option value="">— pilih bahan —</option>
                                    {stocks.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>

                                <input
                                    style={{ ...inp, textAlign: "right" }}
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    step="0.001"
                                    value={row.qty_per_portion}
                                    onChange={e => updateRow(i, "qty_per_portion", e.target.value)}
                                />

                                <div style={{
                                    height: "40px", borderRadius: "8px",
                                    border: `0.5px solid ${C.border}`,
                                    background: "rgba(255,255,255,0.03)",
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "12px", color: C.muted, fontFamily: C.font,
                                }}>
                                    {found?.unit || "—"}
                                </div>

                                <button type="button" onClick={() => removeRow(i)} style={{
                                    width: "28px", height: "28px", borderRadius: "6px",
                                    border: "0.5px solid rgba(239,68,68,.25)",
                                    background: "rgba(239,68,68,.08)",
                                    color: "#fca5a5", cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <Minus size={12} strokeWidth={2.5} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ── MenuModal ───────────────────────────────────────────────── */
function MenuModal({ show, editId, form, setForm, ingredients, setIngredients, stocks, onClose, onSubmit }) {
    if (!show) return null;

    const previewUrl = form.imageFile
        ? URL.createObjectURL(form.imageFile)
        : form.image
            ? `/storage/${form.image}`
            : null;

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
            <div style={{
                width: "100%", maxWidth: "520px", background: C.surface,
                border: `0.5px solid ${C.borderMd}`, borderRadius: "14px",
                padding: "24px", fontFamily: C.font,
                maxHeight: "90vh", overflowY: "auto",
            }}>
                {/* head */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
                    <div>
                        <div style={{ fontSize: "18px", fontWeight: 800, color: C.text, letterSpacing: "-.4px" }}>
                            {editId ? "Edit menu" : "Tambah menu"}
                        </div>
                        <div style={{ fontSize: "12.5px", color: C.muted, marginTop: "4px" }}>
                            Isi detail menu dan bahan baku per porsi
                        </div>
                    </div>
                    <button onClick={onClose} style={{ width: "30px", height: "30px", borderRadius: "7px", background: C.card, border: `0.5px solid ${C.border}`, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                        <X size={14} strokeWidth={2} />
                    </button>
                </div>

                <form onSubmit={onSubmit}>
                    {/* ── Informasi Menu ── */}
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#818cf8", textTransform: "uppercase", letterSpacing: ".8px", marginBottom: "12px", paddingBottom: "8px", borderBottom: `0.5px solid ${C.border}` }}>
                        Informasi menu
                    </div>

                    <FieldLabel mt={false}>Nama menu</FieldLabel>
                    <input style={inp} type="text" placeholder="e.g. Nasi Box Ayam Bakar"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })} />

                    <FieldLabel>Deskripsi</FieldLabel>
                    <textarea style={{ ...inp, height: "68px", padding: "10px 12px", resize: "vertical", lineHeight: "1.6" }}
                        placeholder="Deskripsi singkat menu..."
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <div>
                            <FieldLabel>Kategori</FieldLabel>
                            <input style={inp} type="text" placeholder="e.g. Nasi Box"
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })} />
                        </div>
                        <div>
                            <FieldLabel>Harga (Rp)</FieldLabel>
                            <input style={inp} type="number" placeholder="e.g. 35000"
                                value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })} />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <div>
                            <FieldLabel>Min. porsi</FieldLabel>
                            <input style={inp} type="number" placeholder="e.g. 10"
                                value={form.min_pax}
                                onChange={e => setForm({ ...form, min_pax: e.target.value })} />
                        </div>
                        <div>
                            <FieldLabel>Status</FieldLabel>
                            <select style={selectStyle} value={form.status}
                                onChange={e => setForm({ ...form, status: e.target.value })}>
                                <option value="active">Aktif</option>
                                <option value="inactive">Nonaktif</option>
                            </select>
                        </div>
                    </div>

                    {/* ── Foto Menu ── */}
                    <FieldLabel>Foto menu</FieldLabel>
                    {previewUrl && (
                        <div style={{ position: "relative", marginBottom: "8px" }}>
                            <img
                                src={previewUrl}
                                alt="preview"
                                style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px", border: `0.5px solid ${C.border}` }}
                            />
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, image: null, imageFile: null })}
                                style={{ position: "absolute", top: "6px", right: "6px", width: "22px", height: "22px", borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                                <X size={11} />
                            </button>
                        </div>
                    )}
                    <label style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        height: "40px", borderRadius: "8px",
                        border: `0.5px dashed ${C.borderMd}`,
                        background: C.card, padding: "0 12px",
                        cursor: "pointer", fontSize: "13px", color: C.muted,
                    }}>
                        <Image size={14} strokeWidth={1.8} />
                        <span>{form.imageFile ? form.imageFile.name : "Pilih foto (jpg, png, webp, maks 2MB)"}</span>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            style={{ display: "none" }}
                            onChange={e => {
                                const file = e.target.files[0] || null;
                                setForm({ ...form, imageFile: file });
                            }}
                        />
                    </label>

                    {/* ── Resep / Bahan ── */}
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#34d399", textTransform: "uppercase", letterSpacing: ".8px", margin: "20px 0 12px", paddingBottom: "8px", borderBottom: `0.5px solid ${C.border}` }}>
                        Resep (bahan per porsi)
                    </div>

                    <IngredientsPanel
                        ingredients={ingredients}
                        setIngredients={setIngredients}
                        stocks={stocks}
                    />

                    {/* ── actions ── */}
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "22px", paddingTop: "16px", borderTop: `0.5px solid ${C.border}` }}>
                        <button type="button" onClick={onClose} style={{ height: "36px", padding: "0 14px", borderRadius: "8px", border: `0.5px solid ${C.borderMd}`, background: "transparent", color: C.sub, fontFamily: C.font, fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                            Batal
                        </button>
                        <button type="submit" style={{ height: "36px", padding: "0 18px", borderRadius: "8px", border: "none", background: "#6366f1", color: "#fff", fontFamily: C.font, fontSize: "13px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                            <Check size={14} strokeWidth={2.5} />
                            {editId ? "Update" : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Page ────────────────────────────────────────────────────── */
export default function MenusOwner() {
    // FIX 2: semua useState hanya ada di sini, tidak ada duplikat di luar komponen
    const [menus,       setMenus]       = useState([]);
    const [stocks,      setStocks]      = useState([]);
    const [showModal,   setShowModal]   = useState(false);
    const [editId,      setEditId]      = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [form,        setForm]        = useState(emptyForm);

    const token   = () => localStorage.getItem("auth_token");
    const headers = () => ({ Authorization: `Bearer ${token()}` });

    // FIX 3: hanya satu definisi fetchMenus (yang benar, di dalam komponen)
    const fetchMenus = async () => {
        try {
            const res = await axios.get("/owner/menus", { headers: headers() });
            setMenus(res.data);
        } catch (err) {
            console.error("fetchMenus error:", err.response?.data || err);
        }
    };

    const fetchStocks = async () => {
        try {
            const res = await axios.get("/owner/stocks", { headers: headers() });
            setStocks(res.data);
        } catch (err) {
            console.error("fetchStocks error:", err.response?.data || err);
        }
    };

    useEffect(() => {
        fetchMenus();
        fetchStocks();
    }, []);

    /* ── submit ── */
    // FIX 4: try/catch lengkap dengan alert error yang informatif
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const validIngredients = ingredients.filter(i => i.stock_id && i.qty_per_portion);

            const fd = new FormData();
            fd.append("name",        form.name);
            fd.append("description", form.description);
            fd.append("category",    form.category);
            fd.append("price",       form.price);
            fd.append("min_pax",     form.min_pax);
            fd.append("status",      form.status);
            fd.append("ingredients", JSON.stringify(validIngredients));
            if (form.imageFile) fd.append("image", form.imageFile);

            const cfg = { headers: { ...headers(), "Content-Type": "multipart/form-data" } };

            if (editId) {
                fd.append("_method", "PUT");
                await axios.post(`/owner/menus/${editId}`, fd, cfg);
            } else {
                await axios.post("/owner/menus", fd, cfg);
            }

            closeModal();
            fetchMenus();
        } catch (err) {
            console.error("handleSubmit error:", err.response?.data || err);
            const msg = err.response?.data?.message
                || JSON.stringify(err.response?.data)
                || "Terjadi kesalahan. Coba lagi.";
            alert(msg);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditId(null);
        setIngredients([]);
        setForm(emptyForm);
    };

    /* ── edit ── */
    const handleEdit = async (item) => {
        setForm({
            name:        item.name,
            description: item.description || "",
            category:    item.category    || "",
            price:       item.price       || "",
            min_pax:     item.min_pax     || "",
            status:      item.status      || "active",
            image:       item.image       || null,
            imageFile:   null,
        });
        setEditId(item.id);

        try {
            const res = await axios.get(`/owner/menus/${item.id}/ingredients`, { headers: headers() });
            setIngredients(res.data.map(i => ({
                stock_id:        String(i.stock_id),
                qty_per_portion: i.qty_per_portion,
                unit:            i.stock?.unit || "",
            })));
        } catch {
            setIngredients([]);
        }

        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus menu ini?")) return;
        try {
            await axios.delete(`/owner/menus/${id}`, { headers: headers() });
            fetchMenus();
        } catch (err) {
            console.error("handleDelete error:", err.response?.data || err);
        }
    };

    const openCreate = () => {
        setEditId(null);
        setIngredients([]);
        setForm(emptyForm);
        setShowModal(true);
    };

    /* derived */
    const totalCount    = menus.length;
    const catCount      = [...new Set(menus.map(m => m.category).filter(Boolean))].length;
    const activeCount   = menus.filter(m => m.status === "active").length;
    const inactiveCount = menus.filter(m => m.status === "inactive").length;

    return (
        <OwnerLayout>
            <div style={{ fontFamily: C.font }}>

                {/* header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "28px", flexWrap: "wrap" }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: ".8px", marginBottom: "14px" }}>
                            <LayoutDashboard size={13} strokeWidth={2} />
                            <span>Owner</span>
                            <span style={{ color: "#1E293B" }}>›</span>
                            <span>Menu</span>
                        </div>
                        <h1 style={{ fontSize: "28px", fontWeight: 800, color: C.text, letterSpacing: "-.8px", lineHeight: 1.1, margin: 0 }}>Menu catering</h1>
                        <p style={{ marginTop: "8px", fontSize: "13.5px", color: C.muted, lineHeight: "1.7" }}>
                            Kelola menu, harga, dan resep bahan baku per porsi.
                        </p>
                    </div>
                    <button onClick={openCreate} style={{ height: "42px", padding: "0 18px", border: "0.5px solid rgba(99,102,241,.40)", borderRadius: "10px", background: "rgba(99,102,241,.15)", color: "#a5b4fc", fontFamily: C.font, fontWeight: 700, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "7px" }}>
                        <Plus size={16} strokeWidth={2.5} /> Tambah menu
                    </button>
                </div>

                {/* stat cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "22px" }}>
                    <StatCard label="Total menu"  value={totalCount    || null} icon={UtensilsCrossed} bar={bars.indigo} />
                    <StatCard label="Kategori"    value={catCount      || null} icon={Layers3}         bar={bars.violet} />
                    <StatCard label="Aktif"       value={activeCount   || null} icon={CheckCircle2}    bar={bars.green}  />
                    <StatCard label="Nonaktif"    value={inactiveCount || null} icon={XCircle}         bar={bars.red}    />
                </div>

                {/* table */}
                <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: "14px", overflow: "hidden" }}>
                    <div style={{ padding: "18px 22px", borderBottom: `0.5px solid ${C.border}` }}>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: C.text }}>Menu catalog</div>
                        <div style={{ fontSize: "12px", color: C.muted, marginTop: "3px" }}>
                            Daftar menu, harga, dan jumlah bahan terpeta
                        </div>
                    </div>

                    {menus.length === 0 ? (
                        <EmptyState
                            title="Belum ada menu"
                            subtitle="Tambahkan menu pertama. Setiap menu bisa diisi resep bahan baku per porsi."
                            icon={UtensilsCrossed}
                        />
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "780px" }}>
                                <thead>
                                    <tr>
                                        {["Foto", "Nama menu", "Kategori", "Harga", "Min. porsi", "Bahan", "Status", "Aksi"].map(h => (
                                            <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: ".6px", borderBottom: `0.5px solid ${C.border}`, whiteSpace: "nowrap" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {menus.map(item => (
                                        <tr key={item.id} style={{ borderBottom: `0.5px solid rgba(255,255,255,.04)` }}>
                                            {/* foto */}
                                            <td style={{ padding: "10px 16px" }}>
                                                {item.image ? (
                                                    <img
                                                        src={`/storage/${item.image}`}
                                                        alt={item.name}
                                                        style={{ width: "44px", height: "44px", objectFit: "cover", borderRadius: "8px", border: `0.5px solid ${C.border}` }}
                                                    />
                                                ) : (
                                                    <div style={{ width: "44px", height: "44px", borderRadius: "8px", background: C.card, border: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
                                                        <Image size={16} strokeWidth={1.5} />
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: "12px 16px" }}>
                                                <div style={{ fontWeight: 600, color: C.text }}>{item.name}</div>
                                                {item.description && <div style={{ fontSize: "11.5px", color: C.muted, marginTop: "2px" }}>{item.description}</div>}
                                            </td>
                                            <td style={{ padding: "12px 16px" }}>
                                                {item.category ? (
                                                    <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 9px", borderRadius: "20px", background: "rgba(99,102,241,.12)", border: "0.5px solid rgba(99,102,241,.25)", color: "#a5b4fc" }}>{item.category}</span>
                                                ) : <span style={{ color: C.muted }}>—</span>}
                                            </td>
                                            <td style={{ padding: "12px 16px", fontWeight: 700, color: C.text, whiteSpace: "nowrap" }}>
                                                {fmt(item.price)}
                                            </td>
                                            <td style={{ padding: "12px 16px", color: C.sub }}>
                                                {item.min_pax ? `${item.min_pax} porsi` : "—"}
                                            </td>
                                            <td style={{ padding: "12px 16px" }}>
                                                {item.ingredients_count > 0 ? (
                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600, padding: "3px 9px", borderRadius: "20px", background: "rgba(16,185,129,.10)", border: "0.5px solid rgba(16,185,129,.25)", color: "#34d399" }}>
                                                        <FlaskConical size={10} strokeWidth={2} />
                                                        {item.ingredients_count} bahan
                                                    </span>
                                                ) : (
                                                    <span style={{ fontSize: "11px", color: C.muted }}>Belum ada resep</span>
                                                )}
                                            </td>
                                            <td style={{ padding: "12px 16px" }}>
                                                <StatusBadge status={item.status} />
                                            </td>
                                            <td style={{ padding: "12px 16px" }}>
                                                <div style={{ display: "flex", gap: "7px" }}>
                                                    <button onClick={() => handleEdit(item)} style={{ height: "30px", padding: "0 12px", borderRadius: "7px", border: "0.5px solid rgba(99,102,241,.30)", background: "rgba(99,102,241,.12)", color: "#a5b4fc", fontFamily: C.font, fontSize: "11.5px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                                                        <Pencil size={11} strokeWidth={2} /> Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(item.id)} style={{ height: "30px", padding: "0 12px", borderRadius: "7px", border: "0.5px solid rgba(239,68,68,.25)", background: "rgba(239,68,68,.10)", color: "#fca5a5", fontFamily: C.font, fontSize: "11.5px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                                                        <Trash2 size={11} strokeWidth={2} /> Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <MenuModal
                show={showModal}
                editId={editId}
                form={form}
                setForm={setForm}
                ingredients={ingredients}
                setIngredients={setIngredients}
                stocks={stocks}
                onClose={closeModal}
                onSubmit={handleSubmit}
            />
        </OwnerLayout>
    );
}