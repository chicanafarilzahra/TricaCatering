import { useEffect, useState } from "react";
import axios from "axios";
import SidebarSPPG from "../../components/SidebarSPPG";
import {
    Truck, Search, Plus, Package, UtensilsCrossed,
    Trash2, X, Check, AlertTriangle, CalendarDays, Clock, ChevronRight,
} from "lucide-react";

/* ── Font ─────────────────────────────────────────────────────── */
if (typeof document !== "undefined" && !document.getElementById("sppg-inter")) {
    const l = document.createElement("link");
    l.id = "sppg-inter"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";
    document.head.appendChild(l);
}

/* ── Design Tokens ────────────────────────────────────────────── */
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

const selectStyle = {
    ...inp,
    appearance: "none", WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
    paddingRight: "36px",
};

/* ── Status config ────────────────────────────────────────────── */
const STATUS = {
    Diproses:  { color: T.amber,  bg: "rgba(245,158,11,.12)",  border: "rgba(245,158,11,.25)",  step: 1 },
    Disiapkan: { color: T.violet, bg: "rgba(139,92,246,.12)",  border: "rgba(139,92,246,.25)",  step: 2 },
    Dikirim:   { color: T.teal,   bg: "rgba(14,165,233,.12)",  border: "rgba(14,165,233,.25)",  step: 3 },
    Selesai:   { color: T.green,  bg: "rgba(16,185,129,.12)",  border: "rgba(16,185,129,.25)",  step: 4 },
};

function FieldLabel({ children, mt = true }) {
    return (
        <div style={{
            fontSize: "11px", fontWeight: 600, color: T.muted,
            textTransform: "uppercase", letterSpacing: ".7px",
            marginBottom: "6px", marginTop: mt ? "14px" : 0,
        }}>{children}</div>
    );
}

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

/* ── Status Badge dengan pulse animasi untuk "Dikirim" ────────── */
function StatusBadge({ status }) {
    const s = STATUS[status] || STATUS.Diproses;
    const isDikirim = status === "Dikirim";
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            fontSize: "11px", fontWeight: 700,
            padding: "3px 10px", borderRadius: "20px",
            background: s.bg, border: `0.5px solid ${s.border}`, color: s.color,
            animation: isDikirim ? "pulse-dikirim 1.8s ease-in-out infinite" : "none",
        }}>
            {isDikirim && (
                <span style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: T.teal, flexShrink: 0,
                    animation: "pulse-dikirim 1.8s ease-in-out infinite",
                }} />
            )}
            {status}
        </span>
    );
}

/* ── Status Stepper (read-only, otomatis) ─────────────────────── */
function StatusStepper({ current }) {
    const steps = Object.entries(STATUS);
    const currentStep = STATUS[current]?.step ?? 1;
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "0", marginTop: "8px" }}>
            {steps.map(([key, cfg], i) => {
                const done    = cfg.step < currentStep;
                const active  = cfg.step === currentStep;
                const color   = done || active ? cfg.color : T.muted;
                const bg      = done || active ? cfg.bg : "transparent";
                const border  = done || active ? cfg.border : T.border;
                return (
                    <div key={key} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                            <div style={{
                                width: "28px", height: "28px", borderRadius: "50%",
                                background: bg, border: `1px solid ${border}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "11px", fontWeight: 700, color,
                            }}>
                                {done ? "✓" : cfg.step}
                            </div>
                            <div style={{ fontSize: "10px", fontWeight: 600, color: active ? color : T.muted, marginTop: "5px", whiteSpace: "nowrap" }}>
                                {key}
                            </div>
                            {active && (
                                <div style={{ fontSize: "9px", color: T.muted, marginTop: "2px" }}>
                                    {key === "Dikirim" ? "otomatis" : key === "Selesai" ? "otomatis" : "manual"}
                                </div>
                            )}
                        </div>
                        {i < steps.length - 1 && (
                            <div style={{
                                height: "1px", flex: 1, marginBottom: "18px",
                                background: done ? cfg.color + "60" : T.border,
                            }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function DeleteModal({ onConfirm, onCancel }) {
    return (
        <div style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10000, padding: "20px",
        }}>
            <div style={{
                background: T.elevated, border: `0.5px solid ${T.borderMd}`,
                borderRadius: "18px", padding: "28px",
                maxWidth: "360px", width: "100%", fontFamily: T.font,
            }}>
                <div style={{
                    width: "46px", height: "46px", borderRadius: "13px",
                    background: "rgba(239,68,68,.12)", border: "0.5px solid rgba(239,68,68,.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: T.red, marginBottom: "16px",
                }}>
                    <AlertTriangle size={20} strokeWidth={1.8} />
                </div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: T.text, marginBottom: "8px" }}>Hapus Distribusi</div>
                <p style={{ fontSize: "13px", color: T.sub, lineHeight: 1.7, margin: "0 0 20px" }}>
                    Yakin ingin menghapus data distribusi ini? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <button onClick={onCancel} style={{
                        height: "36px", padding: "0 16px", borderRadius: "9px",
                        border: `0.5px solid ${T.borderMd}`, background: "transparent",
                        color: T.sub, fontFamily: T.font, fontSize: "13px", fontWeight: 600, cursor: "pointer",
                    }}>Batal</button>
                    <button onClick={onConfirm} style={{
                        height: "36px", padding: "0 18px", borderRadius: "9px",
                        border: "none", background: T.red,
                        color: "#fff", fontFamily: T.font, fontSize: "13px", fontWeight: 700, cursor: "pointer",
                    }}>Hapus</button>
                </div>
            </div>
        </div>
    );
}

/* ── Main ─────────────────────────────────────────────────────── */
export default function DistribusiSPPG() {
    const [distribusi, setDistribusi] = useState([]);
    const [sekolahs,   setSekolahs]   = useState([]);
    const [menus,      setMenus]      = useState([]);
    const [search,     setSearch]     = useState("");
    const [showModal,  setShowModal]  = useState(false);
    const [editId,     setEditId]     = useState(null);
    const [deleteId,   setDeleteId]   = useState(null);

    const emptyForm = { sekolah_id: "", menu_id: "", tanggal: "", jam_distribusi: "", jumlah_porsi: "" };
    const [form, setForm] = useState(emptyForm);

    const token   = () => localStorage.getItem("auth_token");
    const headers = () => ({ Authorization: `Bearer ${token()}` });

    useEffect(() => {
        fetchDistribusi();
        fetchSekolah();
        fetchMenu();
    }, []);

    const fetchDistribusi = async () => {
        try {
            const res = await axios.get("/sppg/distribusi", { headers: headers() });
            setDistribusi(Array.isArray(res.data) ? res.data : []);
        } catch (err) { console.error("fetchDistribusi:", err); }
    };

    const fetchSekolah = async () => {
        try {
            const res = await axios.get("/sppg/sekolah", { headers: headers() });
            setSekolahs(res.data);
        } catch (err) { console.error("fetchSekolah:", err); }
    };

    const fetchMenu = async () => {
        try {
            const res = await axios.get("/sppg/menus", { headers: headers() });
            setMenus(res.data);
        } catch (err) { console.error("fetchMenu:", err); }
    };

    const saveData = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`/sppg/distribusi/${editId}`, form, { headers: headers() });
            } else {
                await axios.post("/sppg/distribusi", form, { headers: headers() });
            }
            closeModal();
            fetchDistribusi();
        } catch (err) {
            console.error("saveData:", err.response?.data || err);
            alert(err.response?.data?.message || "Gagal menyimpan data");
        }
    };

    /* Klik "Disiapkan" — satu-satunya status yang bisa diubah manual */
    const tandaiDisiapkan = async (id) => {
        try {
            await axios.patch(`/sppg/distribusi/${id}/disiapkan`, {}, { headers: headers() });
            fetchDistribusi();
        } catch (err) {
            alert(err.response?.data?.message || "Gagal update status");
        }
    };

    const editData = (item) => {
        setEditId(item.id);
        setForm({
            sekolah_id:     item.sekolah_id    || "",
            menu_id:        item.menu_id        || "",
            tanggal:        item.tanggal        || "",
            jam_distribusi: item.jam_distribusi || "",
            jumlah_porsi:   item.jumlah_porsi   || "",
        });
        setShowModal(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/sppg/distribusi/${deleteId}`, { headers: headers() });
            setDeleteId(null);
            fetchDistribusi();
        } catch (err) {
            console.error("delete:", err);
            alert("Gagal menghapus data");
        }
    };

    const closeModal = () => { setShowModal(false); setEditId(null); setForm(emptyForm); };

    const filtered = distribusi.filter(item => {
        const s = item.sekolah?.nama_sekolah?.toLowerCase() || "";
        const m = item.menu?.nama_menu?.toLowerCase() || "";
        return s.includes(search.toLowerCase()) || m.includes(search.toLowerCase());
    });

    const totalPorsi   = distribusi.reduce((a, b) => a + Number(b.jumlah_porsi || 0), 0);
    const totalSelesai = distribusi.filter(x => x.status === "Selesai").length;

    const jamOptions = Array.from({ length: 24 * 12 }, (_, i) => {
        const h = String(Math.floor(i / 12)).padStart(2, "0");
        const m = String((i % 12) * 5).padStart(2, "0");
        return `${h}:${m}`;
    });

    return (
        <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
            <style>{`
                html,body{margin:0;padding:0;background:${T.bg}}
                *{box-sizing:border-box}
                ::-webkit-scrollbar{width:4px}
                ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}
                input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(.4);cursor:pointer}
                option{background:${T.card}}
                tbody tr:hover td{background:rgba(255,255,255,0.015)!important;transition:background .15s}

                @keyframes pulse-dikirim {
                    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(14,165,233,0.4); }
                    50%       { opacity: 0.85; box-shadow: 0 0 0 5px rgba(14,165,233,0); }
                }
            `}</style>

            <SidebarSPPG />

            <div style={{ marginLeft: "260px", padding: "32px 36px" }}>

                {/* ── Page Header ── */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "28px" }}>
                    <div>
                        <div style={{ fontSize: "11px", fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "8px" }}>
                            SPPG › Distribusi
                        </div>
                        <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 800, color: T.text, letterSpacing: "-.6px" }}>
                            Distribusi MBG
                        </h1>
                        <p style={{ margin: "6px 0 0", fontSize: "13px", color: T.muted }}>
                            Kelola distribusi makanan ke seluruh sekolah penerima
                        </p>
                    </div>
                    <button onClick={() => { setEditId(null); setForm(emptyForm); setShowModal(true); }} style={{
                        height: "42px", padding: "0 20px", borderRadius: "11px",
                        border: `0.5px solid ${T.accent}40`, background: `${T.accent}18`,
                        color: "#93C5FD", fontFamily: T.font,
                        fontSize: "13px", fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "8px",
                    }}>
                        <Plus size={16} strokeWidth={2.5} /> Tambah Distribusi
                    </button>
                </div>

                {/* ── KPI Cards ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "24px" }}>
                    <KpiCard label="Total Distribusi"   value={distribusi.length} icon={Truck}          accent={T.accent} />
                    <KpiCard label="Total Porsi"        value={totalPorsi}        icon={Package}         accent={T.teal}   />
                    <KpiCard label="Distribusi Selesai" value={totalSelesai}      icon={UtensilsCrossed} accent={T.green}  />
                </div>

                {/* ── Info alur status ── */}
                <div style={{
                    background: T.elevated, border: `0.5px solid ${T.border}`,
                    borderRadius: "14px", padding: "16px 22px", marginBottom: "20px",
                    display: "flex", alignItems: "center", gap: "16px",
                }}>
                    <div style={{ fontSize: "12px", color: T.muted, flexShrink: 0 }}>Alur Status:</div>
                    {Object.entries(STATUS).map(([key, cfg], i) => (
                        <div key={key} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{
                                fontSize: "11px", fontWeight: 700, padding: "2px 10px", borderRadius: "20px",
                                background: cfg.bg, border: `0.5px solid ${cfg.border}`, color: cfg.color,
                            }}>{key}</span>
                            {i < 3 && <ChevronRight size={13} color={T.muted} />}
                        </div>
                    ))}
                    <div style={{ marginLeft: "auto", fontSize: "11.5px", color: T.muted }}>
                        <span style={{ color: T.violet, fontWeight: 600 }}>Disiapkan</span> → diklik manual ·
                        <span style={{ color: T.teal, fontWeight: 600 }}> Dikirim</span> & <span style={{ color: T.green, fontWeight: 600 }}>Selesai</span> → otomatis
                    </div>
                </div>

                {/* ── Table Card ── */}
                <div style={{ background: T.elevated, border: `0.5px solid ${T.border}`, borderRadius: "18px", overflow: "hidden" }}>
                    {/* toolbar */}
                    <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "18px 22px", borderBottom: `0.5px solid ${T.border}`,
                    }}>
                        <div>
                            <div style={{ fontSize: "15px", fontWeight: 700, color: T.text }}>Data Distribusi</div>
                            <div style={{ fontSize: "12px", color: T.muted, marginTop: "3px" }}>Daftar distribusi makanan MBG</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{
                                display: "flex", alignItems: "center", gap: "8px",
                                background: T.card, border: `0.5px solid ${T.border}`,
                                borderRadius: "10px", padding: "0 14px", height: "38px",
                            }}>
                                <Search size={14} strokeWidth={2} color={T.muted} />
                                <input
                                    value={search} onChange={e => setSearch(e.target.value)}
                                    placeholder="Cari sekolah atau menu..."
                                    style={{ background: "none", border: "none", outline: "none", color: T.text, fontSize: "13px", fontFamily: T.font, width: "220px" }}
                                />
                            </div>
                            <span style={{
                                fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px",
                                background: `${T.accent}18`, border: `0.5px solid ${T.accent}30`, color: "#93C5FD",
                            }}>{filtered.length} data</span>
                        </div>
                    </div>

                    {/* table */}
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "900px" }}>
                            <thead>
                                <tr>
                                    {["No", "Sekolah", "Menu", "Tanggal", "Jam", "Porsi", "Status", "Aksi"].map(h => (
                                        <th key={h} style={{
                                            padding: "11px 18px",
                                            textAlign: ["No", "Porsi", "Aksi", "Status"].includes(h) ? "center" : "left",
                                            fontSize: "10.5px", fontWeight: 600, color: T.muted,
                                            textTransform: "uppercase", letterSpacing: ".7px",
                                            borderBottom: `0.5px solid ${T.border}`,
                                            background: T.card, whiteSpace: "nowrap",
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{ padding: "48px", textAlign: "center", color: T.muted, fontSize: "13px" }}>
                                            {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada data distribusi"}
                                        </td>
                                    </tr>
                                ) : filtered.map((item, i) => (
                                    <tr key={item.id} style={{ borderBottom: `0.5px solid rgba(255,255,255,.04)` }}>
                                        <td style={{ padding: "14px 18px", textAlign: "center" }}>
                                            <span style={{
                                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                                width: "28px", height: "28px", borderRadius: "8px",
                                                background: `${T.accent}15`, color: "#93C5FD",
                                                fontSize: "12px", fontWeight: 700,
                                            }}>{i + 1}</span>
                                        </td>
                                        <td style={{ padding: "14px 18px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <div style={{
                                                    width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                                                    background: `linear-gradient(135deg, ${T.accent}, ${T.teal})`,
                                                    display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
                                                }}>
                                                    <Truck size={15} strokeWidth={1.8} />
                                                </div>
                                                <span style={{ fontWeight: 600, color: T.text }}>
                                                    {item.sekolah?.nama_sekolah || "—"}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: "14px 18px", color: T.sub }}>{item.menu?.nama_menu || "—"}</td>
                                        <td style={{ padding: "14px 18px", color: T.sub, whiteSpace: "nowrap" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <CalendarDays size={13} strokeWidth={1.8} color={T.muted} />
                                                {item.tanggal ? new Date(item.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                                            </div>
                                        </td>
                                        <td style={{ padding: "14px 18px", color: T.sub, whiteSpace: "nowrap" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <Clock size={13} strokeWidth={1.8} color={T.muted} />
                                                {item.jam_distribusi || "—"}
                                            </div>
                                        </td>
                                        <td style={{ padding: "14px 18px", textAlign: "center" }}>
                                            <span style={{
                                                fontSize: "12px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px",
                                                background: `${T.teal}15`, border: `0.5px solid ${T.teal}30`, color: T.teal,
                                            }}>
                                                {Number(item.jumlah_porsi || 0).toLocaleString("id-ID")}
                                            </span>
                                        </td>
                                        <td style={{ padding: "14px 18px", textAlign: "center" }}>
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td style={{ padding: "14px 18px" }}>
                                            <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
                                                {/* Tombol Disiapkan — hanya muncul kalau status masih Diproses */}
                                                {item.status === "Diproses" && (
                                                    <button onClick={() => tandaiDisiapkan(item.id)} style={{
                                                        height: "32px", padding: "0 12px", borderRadius: "8px",
                                                        border: `0.5px solid ${T.violet}30`, background: `${T.violet}12`,
                                                        color: "#c4b5fd", fontFamily: T.font, fontSize: "11.5px",
                                                        fontWeight: 600, cursor: "pointer",
                                                        display: "flex", alignItems: "center", gap: "5px",
                                                    }}>
                                                        <Check size={11} strokeWidth={2.5} /> Disiapkan
                                                    </button>
                                                )}
                                                {/* Edit hanya boleh kalau belum Dikirim/Selesai */}
                                                {["Diproses", "Disiapkan"].includes(item.status) && (
                                                    <button onClick={() => editData(item)} style={{
                                                        height: "32px", padding: "0 12px", borderRadius: "8px",
                                                        border: `0.5px solid ${T.accent}30`, background: `${T.accent}12`,
                                                        color: "#93C5FD", fontFamily: T.font, fontSize: "11.5px",
                                                        fontWeight: 600, cursor: "pointer",
                                                        display: "flex", alignItems: "center", gap: "5px",
                                                    }}>
                                                        Edit
                                                    </button>
                                                )}
                                                <button onClick={() => setDeleteId(item.id)} style={{
                                                    height: "32px", padding: "0 12px", borderRadius: "8px",
                                                    border: `0.5px solid ${T.red}25`, background: `${T.red}10`,
                                                    color: "#FCA5A5", fontFamily: T.font, fontSize: "11.5px",
                                                    fontWeight: 600, cursor: "pointer",
                                                    display: "flex", alignItems: "center", gap: "5px",
                                                }}>
                                                    <Trash2 size={11} strokeWidth={2} /> Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Delete Modal ── */}
            {deleteId && <DeleteModal onConfirm={confirmDelete} onCancel={() => setDeleteId(null)} />}

            {/* ── Add / Edit Modal ── */}
            {showModal && (
                <div style={{
                    position: "fixed", inset: 0,
                    background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 9999, padding: "20px",
                }}>
                    <div style={{
                        width: "100%", maxWidth: "560px",
                        background: T.elevated, border: `0.5px solid ${T.borderMd}`,
                        borderRadius: "18px", fontFamily: T.font,
                        maxHeight: "92vh", overflowY: "auto", scrollbarWidth: "thin",
                    }}>
                        {/* modal header */}
                        <div style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "22px 24px 18px", borderBottom: `0.5px solid ${T.border}`,
                            position: "sticky", top: 0, background: T.elevated, zIndex: 1,
                        }}>
                            <div>
                                <div style={{ fontSize: "17px", fontWeight: 800, color: T.text, letterSpacing: "-.3px" }}>
                                    {editId ? "Edit Distribusi" : "Tambah Distribusi"}
                                </div>
                                <div style={{ fontSize: "12px", color: T.muted, marginTop: "3px" }}>
                                    Lengkapi informasi jadwal distribusi MBG
                                </div>
                            </div>
                            <button onClick={closeModal} style={{
                                width: "30px", height: "30px", borderRadius: "8px",
                                background: T.card, border: `0.5px solid ${T.border}`,
                                color: T.muted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                            }}>
                                <X size={14} strokeWidth={2} />
                            </button>
                        </div>

                        <form onSubmit={saveData} style={{ padding: "20px 24px 24px" }}>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: "#818cf8", textTransform: "uppercase", letterSpacing: ".8px", marginBottom: "14px", paddingBottom: "8px", borderBottom: `0.5px solid ${T.border}` }}>
                                Informasi Distribusi
                            </div>

                            <FieldLabel mt={false}>Sekolah</FieldLabel>
                            <select style={selectStyle} value={form.sekolah_id}
                                onChange={e => {
                                    const s = sekolahs.find(x => x.id == e.target.value);
                                    setForm({ ...form, sekolah_id: e.target.value, jumlah_porsi: s?.jumlah_siswa || 0 });
                                }}>
                                <option value="">Pilih sekolah</option>
                                {sekolahs.map(s => <option key={s.id} value={s.id}>{s.nama_sekolah}</option>)}
                            </select>

                            <FieldLabel>Menu</FieldLabel>
                            <select style={selectStyle} value={form.menu_id}
                                onChange={e => setForm({ ...form, menu_id: e.target.value })}>
                                <option value="">Pilih menu</option>
                                {menus.map(m => <option key={m.id} value={m.id}>{m.nama_menu}</option>)}
                            </select>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                                <div>
                                    <FieldLabel>Tanggal</FieldLabel>
                                    <input type="date" style={inp}
                                        value={form.tanggal}
                                        onChange={e => setForm({ ...form, tanggal: e.target.value })} />
                                </div>
                                <div>
                                    <FieldLabel>Jam</FieldLabel>
                                    <select style={selectStyle} value={form.jam_distribusi}
                                        onChange={e => setForm({ ...form, jam_distribusi: e.target.value })}>
                                        <option value="">Pilih jam</option>
                                        {jamOptions.map(j => <option key={j} value={j}>{j}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <FieldLabel>Jumlah Porsi</FieldLabel>
                                    <div style={{ ...inp, display: "flex", alignItems: "center", background: T.card, color: T.teal, fontWeight: 700, cursor: "default" }}>
                                        {Number(form.jumlah_porsi || 0).toLocaleString("id-ID")}
                                    </div>
                                    <div style={{ fontSize: "10.5px", color: T.muted, marginTop: "4px" }}>Otomatis dari data siswa</div>
                                </div>
                            </div>

                            {/* Info status — tidak bisa diubah dari modal */}
                            <div style={{
                                marginTop: "20px", padding: "14px 16px", borderRadius: "12px",
                                background: `${T.accent}08`, border: `0.5px solid ${T.accent}20`,
                            }}>
                                <div style={{ fontSize: "11px", fontWeight: 700, color: T.accent, marginBottom: "4px", letterSpacing: ".5px", textTransform: "uppercase" }}>
                                    Info Status
                                </div>
                                <div style={{ fontSize: "12px", color: T.muted, lineHeight: 1.6 }}>
                                    Status dimulai dari <span style={{ color: T.amber, fontWeight: 600 }}>Diproses</span>.
                                    Klik <span style={{ color: T.violet, fontWeight: 600 }}>Disiapkan</span> di tabel saat makanan siap dikemas.
                                    Status <span style={{ color: T.teal, fontWeight: 600 }}>Dikirim</span> dan <span style={{ color: T.green, fontWeight: 600 }}>Selesai</span> berubah otomatis sesuai jadwal.
                                </div>
                            </div>

                            <div style={{
                                display: "flex", justifyContent: "flex-end", gap: "8px",
                                marginTop: "22px", paddingTop: "16px", borderTop: `0.5px solid ${T.border}`,
                            }}>
                                <button type="button" onClick={closeModal} style={{
                                    height: "38px", padding: "0 16px", borderRadius: "9px",
                                    border: `0.5px solid ${T.borderMd}`, background: "transparent",
                                    color: T.sub, fontFamily: T.font, fontSize: "13px", fontWeight: 600, cursor: "pointer",
                                }}>Batal</button>
                                <button type="submit" style={{
                                    height: "38px", padding: "0 20px", borderRadius: "9px",
                                    border: "none", background: T.accent,
                                    color: "#fff", fontFamily: T.font, fontSize: "13px", fontWeight: 700,
                                    cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
                                }}>
                                    <Check size={14} strokeWidth={2.5} />
                                    {editId ? "Update Data" : "Simpan Data"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}