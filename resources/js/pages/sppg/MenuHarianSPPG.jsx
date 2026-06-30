import { useEffect, useState } from "react";
import axios from "axios";
import SidebarSPPG from "../../components/SidebarSPPG";
import {
    Calendar, Flame, Beef,
    Wheat, Droplets, Plus, X, Camera, Info,
    ClipboardList, Leaf, TrendingUp, ChevronRight,
    UtensilsCrossed, Pencil, Trash2,
} from "lucide-react";

/* ─── Design Tokens ─────────────────────────────────────────────── */
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
    orange:   "#F97316",
    purple:   "#A855F7",
    red:      "#EF4444",
    font:     "'Inter', system-ui, sans-serif",
};

if (typeof document !== "undefined" && !document.getElementById("sppg-inter")) {
    const l = document.createElement("link");
    l.id = "sppg-inter"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";
    document.head.appendChild(l);
}

/* ─── Helpers ────────────────────────────────────────────────────── */
const getDayName = (d) => {
    if (!d) return "";
    const [y, m, day] = d.split("-").map(Number);
    return new Date(y, m - 1, day).toLocaleDateString("id-ID", { weekday: "long" });
};

const getTodayStr = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

/* Resolve path gambar dari backend menjadi URL absolut */
const resolveImage = (path) => {
    if (!path) return null;
    if (/^https?:\/\//.test(path) || path.startsWith("blob:") || path.startsWith("data:")) return path;
    const base = (axios.defaults.baseURL || "").replace(/\/api\/?$/, "").replace(/\/$/, "");
    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
};

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

function KpiCard({ label, value, icon: Icon, accent = T.accent, unit = "" }) {
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
                    width: "34px", height: "34px", borderRadius: "10px",
                    background: `${accent}18`, border: `0.5px solid ${accent}30`,
                    display: "flex", alignItems: "center", justifyContent: "center", color: accent,
                }}>
                    <Icon size={15} strokeWidth={1.8} />
                </div>
            </div>
            <div style={{ marginTop: "14px", fontSize: "28px", fontWeight: 800, color: T.text, letterSpacing: "-1px", lineHeight: 1 }}>
                {value ?? "—"}
                {unit && <span style={{ fontSize: "13px", fontWeight: 500, color: T.muted, marginLeft: "4px" }}>{unit}</span>}
            </div>
        </div>
    );
}

function GiziProgressRow({ label, value, target, unit, color }) {
    const pct = target ? Math.min(100, Math.round((value / target) * 100)) : 0;
    return (
        <div style={{ padding: "11px 0", borderBottom: `0.5px solid ${T.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: T.muted }}>{label}</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color }}>
                    {value ?? "—"} <span style={{ fontSize: "11px", fontWeight: 400, color: T.muted }}>{unit}</span>
                </span>
            </div>
            <div style={{ height: "3px", borderRadius: "99px", background: T.border, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "99px", transition: "width .4s ease" }} />
            </div>
        </div>
    );
}

function IconBtn({ icon: Icon, color, hoverBg, onClick, title }) {
    const [hovered, setHovered] = useState(false);
    return (
        <button
            title={title}
            onClick={e => { e.stopPropagation(); onClick && onClick(); }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: "28px", height: "28px", borderRadius: "8px",
                background: hovered ? hoverBg : "rgba(255,255,255,0.04)",
                border: `0.5px solid ${hovered ? color + "50" : T.border}`,
                color: hovered ? color : T.muted,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0, transition: "all .15s ease",
            }}
        >
            <Icon size={13} strokeWidth={2} />
        </button>
    );
}

/* ─── Weekly Row — read-only, tanpa tombol edit/hapus ───────────── */
function WeeklyRow({ item, active, onClick }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                padding: "12px 15px", borderRadius: "12px",
                background: active ? `${T.accent}10` : hovered ? T.elevated : T.card,
                border: `0.5px solid ${active ? T.accent + "40" : hovered ? T.borderMd : T.border}`,
                display: "flex", alignItems: "center", gap: "12px",
                cursor: "pointer", transition: "all .15s ease",
            }}
        >
            <div style={{
                width: "44px", height: "44px", borderRadius: "10px", flexShrink: 0,
                background: `linear-gradient(135deg, ${T.surface}, ${T.elevated})`,
                border: `0.5px solid ${T.border}`,
                overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                {item.gambar_menu
                    ? <img
                        src={resolveImage(item.gambar_menu)}
                        alt={item.menu}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={e => { e.target.style.display = "none"; }}
                      />
                    : <span style={{ fontSize: "20px" }}>🍱</span>
                }
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "11px", color: active ? T.accent : T.muted, fontWeight: active ? 600 : 400, marginBottom: "2px" }}>
                    {item.hari}
                </div>
                <div style={{
                    fontSize: "12.5px", fontWeight: 600, color: T.text,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                    {item.menu || item.nama_menu}
                </div>
            </div>
        </div>
    );
}

function Field({ name, placeholder, type = "text", value, onChange, disabled, style: extra }) {
    return (
        <input
            name={name} type={type} placeholder={placeholder}
            value={value} onChange={onChange} disabled={disabled}
            style={{
                background: "rgba(255,255,255,0.04)", border: `0.5px solid ${T.borderMd}`,
                color: T.text, borderRadius: "10px", padding: "9px 12px",
                fontSize: "13px", fontFamily: T.font, width: "100%", outline: "none",
                opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "text", ...extra,
            }}
            onFocus={e => { if (!disabled) e.target.style.borderColor = `${T.accent}80`; }}
            onBlur={e => { e.target.style.borderColor = T.borderMd; }}
        />
    );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(5,8,15,0.85)",
            backdropFilter: "blur(6px)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 99998,
        }}>
            <div style={{
                background: T.elevated, border: `0.5px solid ${T.borderMd}`,
                borderRadius: "18px", padding: "28px 28px 22px",
                width: "100%", maxWidth: "360px",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6)", fontFamily: T.font,
            }}>
                <div style={{
                    width: "44px", height: "44px", borderRadius: "12px",
                    background: `${T.red}18`, border: `0.5px solid ${T.red}40`,
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px",
                }}>
                    <Trash2 size={20} color={T.red} strokeWidth={1.8} />
                </div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: T.text, marginBottom: "8px" }}>Hapus Menu</div>
                <div style={{ fontSize: "13px", color: T.muted, lineHeight: 1.6, marginBottom: "22px" }}>{message}</div>
                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button onClick={onCancel} style={{
                        background: "rgba(255,255,255,0.05)", border: `0.5px solid ${T.border}`,
                        color: T.sub, padding: "8px 16px", borderRadius: "9px",
                        fontSize: "13px", cursor: "pointer", fontFamily: T.font,
                    }}>Batal</button>
                    <button onClick={onConfirm} style={{
                        background: T.red, border: "none", color: "#fff",
                        padding: "8px 18px", borderRadius: "9px",
                        fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: T.font,
                    }}>Hapus</button>
                </div>
            </div>
        </div>
    );
}

function Toast({ message, type, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
    const color = type === "success" ? T.green : type === "warning" ? T.amber : "#EF4444";
    const bg    = type === "success" ? `${T.green}18` : type === "warning" ? `${T.amber}18` : "rgba(239,68,68,0.12)";
    const icon  = type === "success" ? "✓" : type === "warning" ? "!" : "✕";
    const label = type === "success" ? "Berhasil" : type === "warning" ? "Perhatian" : "Gagal";
    return (
        <div style={{
            position: "fixed", bottom: "28px", right: "28px",
            background: T.elevated, border: `0.5px solid ${color}40`,
            borderRadius: "14px", padding: "14px 18px",
            display: "flex", alignItems: "flex-start", gap: "12px",
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
            zIndex: 99999, fontFamily: T.font, maxWidth: "360px",
            animation: "slideUp .25s ease",
        }}>
            <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
            <div style={{
                width: "32px", height: "32px", borderRadius: "9px",
                background: bg, display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0,
            }}>
                <span style={{ fontSize: "15px" }}>{icon}</span>
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: T.text }}>{label}</div>
                <div style={{ fontSize: "12px", color: T.muted, marginTop: "3px", lineHeight: 1.5 }}>{message}</div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", padding: 0, flexShrink: 0 }}>
                <X size={13} />
            </button>
        </div>
    );
}

/* ─── Weekly Detail Modal ────────────────────────────────────────── */
function WeeklyDetailModal({ item, onClose }) {
    if (!item) return null;
    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(5,8,15,0.85)",
            backdropFilter: "blur(8px)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 99997,
        }} onClick={onClose}>
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width: "100%", maxWidth: "480px",
                    background: T.elevated, border: `0.5px solid ${T.borderMd}`,
                    borderRadius: "20px", overflow: "hidden",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.7)", fontFamily: T.font,
                    animation: "fadeUp .2s ease",
                }}
            >
                <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
                <div style={{
                    height: "180px", background: `linear-gradient(135deg, ${T.surface}, ${T.card})`,
                    position: "relative", overflow: "hidden",
                }}>
                    {item.gambar_menu
                        ? <img src={resolveImage(item.gambar_menu)} alt={item.menu} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ fontSize: "60px" }}>🍱</span>
                            </div>
                        )
                    }
                    <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to top, rgba(15,22,40,0.9) 0%, transparent 60%)",
                    }} />
                    <div style={{
                        position: "absolute", top: "14px", left: "16px",
                        background: `${T.accent}30`, border: `0.5px solid ${T.accent}60`,
                        borderRadius: "8px", padding: "4px 10px",
                        fontSize: "11px", fontWeight: 700, color: T.accent, letterSpacing: ".5px",
                    }}>
                        {item.hari}
                    </div>
                    <button onClick={onClose} style={{
                        position: "absolute", top: "12px", right: "12px",
                        background: "rgba(0,0,0,0.4)", border: `0.5px solid ${T.border}`,
                        color: T.sub, width: "30px", height: "30px", borderRadius: "8px",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <X size={14} strokeWidth={2} />
                    </button>
                    <div style={{ position: "absolute", bottom: "14px", left: "16px", right: "16px" }}>
                        <div style={{ fontSize: "17px", fontWeight: 800, color: T.text, letterSpacing: "-.4px" }}>
                            {item.menu || item.nama_menu}
                        </div>
                    </div>
                </div>
                <div style={{ padding: "20px 22px" }}>
                    {item.deskripsi && (
                        <p style={{ margin: "0 0 16px", fontSize: "13px", color: T.sub, lineHeight: 1.7 }}>
                            {item.deskripsi}
                        </p>
                    )}
                    {(item.kalori || item.protein || item.lemak || item.karbohidrat) && (
                        <>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: T.muted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
                                Nilai Gizi
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "16px" }}>
                                {[
                                    { label: "Kalori",  value: item.kalori,      unit: "kkal", color: T.orange },
                                    { label: "Protein", value: item.protein,     unit: "g",    color: T.green  },
                                    { label: "Lemak",   value: item.lemak,       unit: "g",    color: T.accent },
                                    { label: "Karbo",   value: item.karbohidrat, unit: "g",    color: T.purple },
                                ].map(({ label, value, unit, color }) => (
                                    <div key={label} style={{
                                        background: T.card, border: `0.5px solid ${T.border}`,
                                        borderRadius: "10px", padding: "10px 12px", textAlign: "center",
                                    }}>
                                        <div style={{ fontSize: "15px", fontWeight: 800, color, letterSpacing: "-.5px" }}>
                                            {value ?? "—"}
                                        </div>
                                        <div style={{ fontSize: "10px", color: T.muted, marginTop: "2px" }}>{unit}</div>
                                        <div style={{ fontSize: "10px", color: T.muted, marginTop: "1px" }}>{label}</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    {item.serat !== undefined && item.serat !== null && (
                        <div style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "10px 14px", background: `${T.teal}10`,
                            border: `0.5px solid ${T.teal}30`, borderRadius: "10px",
                        }}>
                            <span style={{ fontSize: "12.5px", color: T.sub }}>Serat</span>
                            <span style={{ fontSize: "13px", fontWeight: 700, color: T.teal }}>{item.serat} g</span>
                        </div>
                    )}
                    {item.kategori && (
                        <div style={{
                            marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "6px",
                            padding: "5px 12px", background: `${T.purple}15`,
                            border: `0.5px solid ${T.purple}30`, borderRadius: "8px",
                        }}>
                            <span style={{ fontSize: "11px", color: T.purple, fontWeight: 600 }}>{item.kategori}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function MenuHarianSPPG() {
    const [menu,          setMenu]          = useState(null);
    const [gizi,          setGizi]          = useState(null);
    const [weekly,        setWeekly]        = useState([]);
    const [date,          setDate]          = useState("");
    const [openModal,     setOpenModal]     = useState(false);
    const [imagePreview,  setImagePreview]  = useState(null);
    const [saving,        setSaving]        = useState(false);
    const [toast,         setToast]         = useState(null);
    const [editMode,      setEditMode]      = useState(false);
    const [editTarget,    setEditTarget]    = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [weeklyDetail,  setWeeklyDetail]  = useState(null);
    const [modalDate,     setModalDate]     = useState("");
    const [form, setForm] = useState({
        nama_menu: "", kategori: "", deskripsi: "",
        kalori: "", protein: "", lemak: "", karbo: "", serat: "",
    });

    useEffect(() => { loadData(); }, []);

    const getToken  = () => localStorage.getItem("auth_token");
    const showToast = (message, type = "error") => setToast({ message, type });
    const today     = getTodayStr();

    const loadData = async () => {
        try {
            const res = await axios.get("/sppg/menu-harian", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setMenu(res.data?.menu_harian || null);
            setGizi(res.data?.gizi || null);
            setWeekly(res.data?.menu_mingguan || []);
            if (res.data?.menu_harian?.tanggal) setDate(res.data.menu_harian.tanggal);
        } catch (err) { console.log(err); }
    };

    const isDayTaken = (dateStr, excludeId = null) => {
    if (!dateStr) return false;
    // Hitung nama hari dengan fix timezone
    const [y, m, day] = dateStr.split("-").map(Number);
    const dayName = new Date(y, m - 1, day).toLocaleDateString("id-ID", { weekday: "long" });
    return weekly.some(w => w.hari === dayName && w.id !== excludeId);
};

    const handleModalDateChange = (e) => {
        const newDate = e.target.value;
        if (newDate < today) {
            showToast("Tidak bisa memilih tanggal yang sudah lewat.", "warning");
            return;
        }
        const excludeId = editMode && editTarget ? editTarget.id : null;
        if (isDayTaken(newDate, excludeId)) {
            const dayName = getDayName(newDate);
            showToast(`Hari ${dayName} sudah memiliki menu. Pilih tanggal lain.`, "warning");
            return;
        }
        setModalDate(newDate);
    };

    /* ── Edit menu harian (data lengkap dari API) ── */
    const openEditMenu = (data) => {
        setEditMode(true);
        setEditTarget({ type: "menu", id: data.id });
        setForm({
            nama_menu: data.nama_menu    || "",
            kategori:  data.kategori    || "",
            deskripsi: data.deskripsi   || "",
            kalori:    data.kalori      ?? "",
            protein:   data.protein     ?? "",
            lemak:     data.lemak       ?? "",
            karbo:     data.karbohidrat ?? "",
            serat:     data.serat       ?? "",
        });
        setModalDate(data.tanggal || "");
        setImagePreview(resolveImage(data.gambar_menu));
        setOpenModal(true);
    };

    const openAddModal = () => {
        setEditMode(false);
        setEditTarget(null);
        setForm({ nama_menu: "", kategori: "", deskripsi: "", kalori: "", protein: "", lemak: "", karbo: "", serat: "" });
        setImagePreview(null);
        setModalDate("");
        setOpenModal(true);
    };

    const isSaveBlocked = () => {
        if (saving) return true;
        if (!modalDate) return false;
        if (modalDate < today) return true;
        if (!editMode && isDayTaken(modalDate)) return true;
        if (editMode && editTarget && isDayTaken(modalDate, editTarget.id)) return true;
        return false;
    };

    const handleSaveMenu = async () => {
        if (!form.nama_menu.trim()) { showToast("Nama menu wajib diisi."); return; }
        if (!modalDate)             { showToast("Tanggal wajib dipilih."); return; }
        if (modalDate < today) {
            showToast("Tidak bisa menyimpan menu dengan tanggal yang sudah lewat.", "warning");
            return;
        }
        const excludeId = editMode && editTarget ? editTarget.id : null;
        if (isDayTaken(modalDate, excludeId)) {
            const dayName = getDayName(modalDate);
            showToast(`Hari ${dayName} sudah memiliki menu. Pilih tanggal lain.`, "warning");
            return;
        }

        setSaving(true);
        try {
            const parseNum = (val) => {
                if (!val && val !== 0) return "";
                const cleaned = String(val).replace(/[^\d,\.]/g, "").replace(",", ".");
                const num = parseFloat(cleaned);
                return isNaN(num) ? "" : num;
            };

            const formData = new FormData();
            formData.append("nama_menu",   form.nama_menu);
            formData.append("kategori",    form.kategori);
            formData.append("deskripsi",   form.deskripsi);
            formData.append("tanggal",     modalDate);
            formData.append("kalori",      parseNum(form.kalori));
            formData.append("protein",     parseNum(form.protein));
            formData.append("lemak",       parseNum(form.lemak));
            formData.append("karbohidrat", parseNum(form.karbo));
            formData.append("serat",       parseNum(form.serat));
            if (form.gambar) formData.append("gambar", form.gambar);

            if (editMode && editTarget) {
                await axios.post(`/sppg/menus/${editTarget.id}?_method=PUT`, formData, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                showToast("Menu berhasil diperbarui.", "success");
            } else {
                await axios.post("/sppg/menus", formData, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                showToast("Menu berhasil disimpan.", "success");
            }

            loadData();
            setOpenModal(false);
            setForm({ nama_menu: "", kategori: "", deskripsi: "", kalori: "", protein: "", lemak: "", karbo: "", serat: "" });
            setImagePreview(null);
            setModalDate("");
        } catch (err) {
            console.error("Save menu error:", err.response?.data || err);
            const serverMsg = err.response?.data?.message
                || (err.response?.data?.errors
                    ? Object.values(err.response.data.errors).flat().join(", ")
                    : null)
                || `Error ${err.response?.status ?? "network"}: coba lagi.`;
            showToast(serverMsg);
        } finally {
            setSaving(false);
        }
    };

    /* ── Hapus hanya untuk menu harian (dari hero / detail card) ── */
    const handleDelete = async () => {
        if (!confirmDelete) return;
        try {
            await axios.delete(`/sppg/menus/${confirmDelete.id}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            showToast(`${confirmDelete.label} berhasil dihapus.`, "success");
            loadData();
        } catch (err) {
            showToast("Gagal menghapus. Coba lagi.");
        } finally {
            setConfirmDelete(null);
        }
    };

    const handleChange      = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) { setImagePreview(URL.createObjectURL(file)); setForm({ ...form, gambar: file }); }
    };

    const modalDayWarning  = modalDate && !editMode && isDayTaken(modalDate);
    const modalPastWarning = modalDate && modalDate < today;

    return (
        <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
            <style>{`
                html,body{margin:0;padding:0;overflow-x:hidden;background:${T.bg}}
                *{box-sizing:border-box}
                ::-webkit-scrollbar{width:4px}
                ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}
                input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(.4);cursor:pointer}
                ::placeholder{color:${T.muted}!important;opacity:.6}
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
                            Menu Harian
                        </h1>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                            display: "flex", alignItems: "center", gap: "8px",
                            fontSize: "12px", color: T.sub, fontWeight: 500,
                            padding: "9px 14px", borderRadius: "10px",
                            background: T.elevated, border: `0.5px solid ${T.border}`,
                        }}>
                            <Calendar size={14} strokeWidth={1.8} color={T.accent} />
                            <input
                                type="date" value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={{ background: "transparent", border: "none", color: T.sub, fontSize: "12px", outline: "none", fontFamily: T.font, cursor: "pointer" }}
                            />
                        </div>
                        <button
                            onClick={openAddModal}
                            style={{
                                background: T.accent, color: "#fff", border: "none",
                                padding: "9px 18px", borderRadius: "10px",
                                fontSize: "13px", fontWeight: 600, cursor: "pointer",
                                display: "flex", alignItems: "center", gap: "6px", fontFamily: T.font,
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
                            onMouseLeave={e => e.currentTarget.style.background = T.accent}
                        >
                            <Plus size={15} strokeWidth={2.5} /> Tambah Menu
                        </button>
                    </div>
                </div>

                {/* ── Hero Banner ── */}
                <div style={{
                    background: T.elevated, border: `0.5px solid ${T.borderMd}`,
                    borderRadius: "20px", padding: "24px 30px", marginBottom: "22px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    position: "relative", overflow: "hidden",
                }}>
                    <div style={{
                        position: "absolute", right: "-60px", top: "-60px",
                        width: "240px", height: "240px", borderRadius: "50%",
                        background: `radial-gradient(circle, ${T.green}18 0%, transparent 70%)`,
                        pointerEvents: "none",
                    }} />
                    <div>
                        <div style={{ fontSize: "12px", color: T.muted, marginBottom: "6px" }}>Menu aktif hari ini</div>
                        <div style={{ fontSize: "20px", fontWeight: 800, color: T.text, letterSpacing: "-.4px" }}>
                            {menu?.nama_menu || "Belum ada menu dipilih"}
                        </div>
                        {menu?.catatan && (
                            <div style={{ marginTop: "8px", fontSize: "13px", color: T.sub, lineHeight: 1.6 }}>
                                <Info size={12} color={T.teal} style={{ marginRight: 5, verticalAlign: -2 }} />
                                {menu.catatan}
                            </div>
                        )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {menu && (
                            <>
                                <IconBtn icon={Pencil} color={T.accent} hoverBg={`${T.accent}18`} onClick={() => openEditMenu(menu)} title="Edit menu" />
                                <IconBtn icon={Trash2} color={T.red}    hoverBg={`${T.red}18`}    onClick={() => setConfirmDelete({ id: menu.id, label: menu.nama_menu })} title="Hapus menu" />
                            </>
                        )}
                        <div style={{
                            display: "flex", alignItems: "center", gap: "8px",
                            padding: "10px 18px", borderRadius: "12px",
                            background: `${T.green}18`, border: `0.5px solid ${T.green}40`,
                            fontSize: "13px", fontWeight: 600, color: T.green, flexShrink: 0,
                        }}>
                            <UtensilsCrossed size={15} strokeWidth={2} /> Menu Aktif
                        </div>
                    </div>
                </div>

                {/* ── KPI Row ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "22px" }}>
                    <KpiCard label="Energi"      value={gizi?.energi}      icon={Flame}    accent={T.orange} unit="kkal" />
                    <KpiCard label="Protein"     value={gizi?.protein}     icon={Beef}     accent={T.green}  unit="g"    />
                    <KpiCard label="Lemak"       value={gizi?.lemak}       icon={Droplets} accent={T.accent} unit="g"    />
                    <KpiCard label="Karbohidrat" value={gizi?.karbohidrat} icon={Wheat}    accent={T.purple} unit="g"    />
                </div>

                {/* ── Main Grid ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                        {/* Detail Menu Harian */}
                        <div style={{ background: T.elevated, border: `0.5px solid ${T.border}`, borderRadius: "18px", padding: "22px" }}>
                            <SectionHeader label="Detail Menu Hari Ini" />
                            {menu ? (
                                <div style={{ display: "flex", gap: "16px" }}>
                                    <div style={{
                                        width: "90px", height: "90px", borderRadius: "14px",
                                        background: `linear-gradient(135deg, ${T.card}, ${T.surface})`,
                                        border: `0.5px solid ${T.border}`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        flexShrink: 0, overflow: "hidden",
                                    }}>
                                        {menu.gambar_menu
                                            ? <img
                                                src={resolveImage(menu.gambar_menu)}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                alt=""
                                                onError={e => { e.target.style.display = "none"; }}
                                              />
                                            : <span style={{ fontSize: 30 }}>🍱</span>
                                        }
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                                            <div style={{ fontSize: "15px", fontWeight: 700, color: T.text }}>{menu.nama_menu}</div>
                                            <div style={{ display: "flex", gap: "6px", flexShrink: 0, marginLeft: "10px" }}>
                                                <IconBtn icon={Pencil} color={T.accent} hoverBg={`${T.accent}18`} onClick={() => openEditMenu(menu)} title="Edit" />
                                                <IconBtn icon={Trash2} color={T.red}    hoverBg={`${T.red}18`}    onClick={() => setConfirmDelete({ id: menu.id, label: menu.nama_menu })} title="Hapus" />
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                            {menu.detail_menu?.map((item, i) => (
                                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: T.sub }}>
                                                    <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: T.accent, flexShrink: 0 }} />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: "32px", textAlign: "center", color: T.muted, fontSize: "13px", background: T.card, borderRadius: "12px", border: `0.5px solid ${T.border}` }}>
                                    Belum ada menu hari ini
                                </div>
                            )}
                        </div>

                        {/* Menu Mingguan — read-only, klik untuk lihat detail */}
                        <div style={{ background: T.elevated, border: `0.5px solid ${T.border}`, borderRadius: "18px", padding: "22px" }}>
                            <SectionHeader label="Menu Mingguan" />
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {weekly.length > 0 ? weekly.map((item, i) => (
                                    <WeeklyRow
                                        key={i}
                                        item={item}
                                        active={item.hari === getDayName(date)}
                                        onClick={() => setWeeklyDetail(item)}
                                    />
                                )) : (
                                    <div style={{ padding: "20px", textAlign: "center", color: T.muted, fontSize: "13px", background: T.card, borderRadius: "12px", border: `0.5px solid ${T.border}` }}>
                                        Belum ada jadwal mingguan
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ background: T.elevated, border: `0.5px solid ${T.border}`, borderRadius: "18px", padding: "22px", flex: 1 }}>
                            <SectionHeader label="Kecukupan Gizi Harian" />
                            {gizi ? (
                                <>
                                    <GiziProgressRow label="Energi"      value={gizi.energi}      target={gizi.target?.energi}      unit="kkal" color={T.orange} />
                                    <GiziProgressRow label="Protein"     value={gizi.protein}     target={gizi.target?.protein}     unit="g"    color={T.green} />
                                    <GiziProgressRow label="Lemak"       value={gizi.lemak}       target={gizi.target?.lemak}       unit="g"    color={T.accent} />
                                    <GiziProgressRow label="Karbohidrat" value={gizi.karbohidrat} target={gizi.target?.karbohidrat} unit="g"    color={T.purple} />
                                    {gizi.serat !== undefined && (
                                        <GiziProgressRow label="Serat" value={gizi.serat} target={gizi.target?.serat} unit="g" color={T.teal} />
                                    )}
                                </>
                            ) : (
                                <div style={{ padding: "20px", textAlign: "center", color: T.muted, fontSize: "13px", background: T.card, borderRadius: "12px", border: `0.5px solid ${T.border}` }}>
                                    Belum ada data gizi
                                </div>
                            )}
                        </div>

                        <div style={{
                            background: T.elevated, border: `0.5px solid ${T.green}30`,
                            borderRadius: "18px", padding: "22px", position: "relative", overflow: "hidden",
                        }}>
                            <div style={{
                                position: "absolute", bottom: "-30px", right: "-30px",
                                width: "100px", height: "100px", borderRadius: "50%",
                                background: `${T.green}10`, pointerEvents: "none",
                            }} />
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                                <TrendingUp size={15} strokeWidth={2} color={T.green} />
                                <span style={{ fontSize: "13px", fontWeight: 700, color: T.green }}>Gizi Seimbang</span>
                            </div>
                            <p style={{ margin: 0, fontSize: "12.5px", color: T.muted, lineHeight: 1.7 }}>
                                Menu hari ini dirancang memenuhi standar gizi harian program MBG untuk siswa.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MODAL TAMBAH / EDIT MENU HARIAN ── */}
            {openModal && (
                <div style={{
                    position: "fixed", top: 0, left: "260px", right: 0, bottom: 0,
                    background: "rgba(5,8,15,0.85)", backdropFilter: "blur(6px)",
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
                }}>
                    <div style={{
                        width: "100%", maxWidth: "820px",
                        background: T.elevated, border: `0.5px solid ${T.borderMd}`,
                        borderRadius: "20px", boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
                        overflow: "hidden", fontFamily: T.font,
                    }}>
                        <div style={{
                            padding: "20px 24px", borderBottom: `0.5px solid ${T.border}`,
                            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                        }}>
                            <div>
                                <div style={{ fontSize: "16px", fontWeight: 700, color: T.text, letterSpacing: "-.3px" }}>
                                    {editMode ? "Edit Menu" : "Tambah Menu Harian"}
                                </div>
                                <div style={{ fontSize: "12px", color: T.muted, marginTop: "3px" }}>Lengkapi informasi menu dan nilai gizi</div>
                            </div>
                            <button onClick={() => setOpenModal(false)} style={{
                                background: "rgba(255,255,255,0.06)", border: `0.5px solid ${T.border}`,
                                color: T.sub, width: "30px", height: "30px", borderRadius: "8px",
                                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <X size={14} strokeWidth={2} />
                            </button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: T.border }}>
                            {/* Left */}
                            <div style={{ background: T.elevated, padding: "20px 22px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                <div style={{
                                    fontSize: "11px", fontWeight: 700, color: T.accent,
                                    letterSpacing: "1px", textTransform: "uppercase",
                                    paddingBottom: "10px", borderBottom: `0.5px solid ${T.border}`,
                                    display: "flex", alignItems: "center", gap: "6px",
                                }}>
                                    <ClipboardList size={12} /> Informasi Menu
                                </div>
                                <Field name="nama_menu" placeholder="Nama menu *" value={form.nama_menu} onChange={handleChange} />
                                <Field name="kategori"  placeholder="Kategori"    value={form.kategori}  onChange={handleChange} />
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                    <input
                                        type="date" value={modalDate} min={today}
                                        onChange={handleModalDateChange}
                                        style={{
                                            background: "rgba(255,255,255,0.04)", border: `0.5px solid ${T.borderMd}`,
                                            color: T.text, borderRadius: "10px", padding: "9px 12px",
                                            fontSize: "13px", fontFamily: T.font, width: "100%", outline: "none",
                                        }}
                                        onFocus={e => e.target.style.borderColor = `${T.accent}80`}
                                        onBlur={e => e.target.style.borderColor = T.borderMd}
                                    />
                                    <Field placeholder="Hari (otomatis)" value={getDayName(modalDate)} disabled />
                                </div>

                                {modalPastWarning && (
                                    <div style={{
                                        display: "flex", alignItems: "center", gap: "8px",
                                        padding: "8px 12px", background: `${T.red}12`,
                                        border: `0.5px solid ${T.red}40`, borderRadius: "8px",
                                        fontSize: "12px", color: T.red,
                                    }}>
                                        <span>✕</span> Tanggal yang dipilih sudah lewat.
                                    </div>
                                )}
                                {!modalPastWarning && modalDayWarning && (
                                    <div style={{
                                        display: "flex", alignItems: "center", gap: "8px",
                                        padding: "8px 12px", background: `${T.amber}12`,
                                        border: `0.5px solid ${T.amber}40`, borderRadius: "8px",
                                        fontSize: "12px", color: T.amber,
                                    }}>
                                        <span>⚠</span> Hari {getDayName(modalDate)} sudah ada menu.
                                    </div>
                                )}

                                <textarea
                                    name="deskripsi" placeholder="Deskripsi menu..."
                                    value={form.deskripsi} onChange={handleChange}
                                    style={{
                                        background: "rgba(255,255,255,0.04)", border: `0.5px solid ${T.borderMd}`,
                                        color: T.text, borderRadius: "10px", padding: "9px 12px",
                                        fontSize: "13px", fontFamily: T.font, width: "100%",
                                        minHeight: "70px", resize: "none", outline: "none",
                                    }}
                                    onFocus={e => e.target.style.borderColor = `${T.accent}80`}
                                    onBlur={e => e.target.style.borderColor = T.borderMd}
                                />
                                <label style={{
                                    border: `0.5px dashed ${T.borderMd}`, borderRadius: "12px",
                                    background: "rgba(255,255,255,0.02)", height: "120px",
                                    display: "flex", flexDirection: "column",
                                    alignItems: "center", justifyContent: "center",
                                    gap: "6px", cursor: "pointer", overflow: "hidden",
                                }}>
                                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                                    {imagePreview
                                        ? <img src={imagePreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        : <>
                                            <Camera size={20} color={T.muted} strokeWidth={1.5} />
                                            <span style={{ fontSize: "12px", color: T.muted }}>Pilih gambar menu</span>
                                            <span style={{ fontSize: "11px", color: T.muted, opacity: 0.5 }}>PNG, JPG hingga 5MB</span>
                                          </>
                                    }
                                </label>
                            </div>

                            {/* Right */}
                            <div style={{ background: T.elevated, padding: "20px 22px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                <div style={{
                                    fontSize: "11px", fontWeight: 700, color: T.green,
                                    letterSpacing: "1px", textTransform: "uppercase",
                                    paddingBottom: "10px", borderBottom: `0.5px solid ${T.border}`,
                                    display: "flex", alignItems: "center", gap: "6px",
                                }}>
                                    <Leaf size={12} /> Nilai Gizi
                                </div>
                                <Field name="kalori"  placeholder="Kalori (kkal)"   value={form.kalori}  onChange={handleChange} />
                                <Field name="protein" placeholder="Protein (g)"     value={form.protein} onChange={handleChange} />
                                <Field name="lemak"   placeholder="Lemak (g)"       value={form.lemak}   onChange={handleChange} />
                                <Field name="karbo"   placeholder="Karbohidrat (g)" value={form.karbo}   onChange={handleChange} />
                                <Field name="serat"   placeholder="Serat (g)"       value={form.serat}   onChange={handleChange} />
                                <div style={{
                                    background: `${T.accent}08`, border: `0.5px solid ${T.accent}25`,
                                    borderRadius: "12px", padding: "13px 15px", marginTop: "4px",
                                }}>
                                    <div style={{ fontSize: "11px", fontWeight: 700, color: T.accent, marginBottom: "6px", letterSpacing: ".5px" }}>
                                        Estimasi Kecukupan
                                    </div>
                                    <div style={{ fontSize: "12px", color: T.muted, lineHeight: 1.6 }}>
                                        Isi nilai gizi di atas untuk melihat persentase kecukupan gizi harian secara otomatis.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            padding: "14px 22px", borderTop: `0.5px solid ${T.border}`,
                            display: "flex", justifyContent: "flex-end", gap: "8px",
                        }}>
                            <button onClick={() => setOpenModal(false)} disabled={saving} style={{
                                background: "rgba(255,255,255,0.05)", border: `0.5px solid ${T.border}`,
                                color: T.sub, padding: "8px 16px", borderRadius: "9px",
                                fontSize: "13px", cursor: "pointer", fontFamily: T.font,
                                opacity: saving ? 0.5 : 1,
                            }}>Batal</button>
                            <button
                                onClick={handleSaveMenu}
                                disabled={isSaveBlocked()}
                                style={{
                                    background: isSaveBlocked() ? T.muted : T.accent,
                                    border: "none", color: "#fff", padding: "8px 20px", borderRadius: "9px",
                                    fontSize: "13px", fontWeight: 600,
                                    cursor: isSaveBlocked() ? "not-allowed" : "pointer",
                                    fontFamily: T.font, display: "flex", alignItems: "center", gap: "6px",
                                    transition: "background .2s",
                                }}
                                onMouseEnter={e => { if (!isSaveBlocked()) e.currentTarget.style.background = "#1d4ed8"; }}
                                onMouseLeave={e => { if (!isSaveBlocked()) e.currentTarget.style.background = T.accent; }}
                            >
                                {saving ? "Menyimpan..." : editMode ? "Simpan Perubahan" : "Simpan Menu"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {weeklyDetail && (
                <WeeklyDetailModal item={weeklyDetail} onClose={() => setWeeklyDetail(null)} />
            )}

            {confirmDelete && (
                <ConfirmModal
                    message={`Yakin ingin menghapus "${confirmDelete.label}"? Tindakan ini tidak bisa dibatalkan.`}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}

            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
        </div>
    );
}