import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import SidebarSPPG from "../../components/SidebarSPPG";
import {
    School2, Building2, Users, Plus, Search,
    Pencil, Trash2, MapPin, X, Check, ChevronRight,
    AlertTriangle,
} from "lucide-react";

/* ── Leaflet default icon fix ─────────────────────────────────── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl:       "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl:     "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

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
    font:     "'Inter', system-ui, sans-serif",
};

/* ── Shared input style ───────────────────────────────────────── */
const inp = {
    width: "100%", height: "42px",
    padding: "0 14px",
    background: T.elevated,
    border: `0.5px solid ${T.borderMd}`,
    borderRadius: "10px",
    color: T.text,
    fontSize: "13.5px",
    fontFamily: T.font,
    outline: "none",
    boxSizing: "border-box",
};

const selectStyle = {
    ...inp,
    appearance: "none", WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
    paddingRight: "36px",
};

/* ── Map view updater ─────────────────────────────────────────── */
function ChangeMapView({ center }) {
    const map = useMap();
    useEffect(() => { map.setView(center, 16); }, [center]);
    return null;
}

/* ── FieldLabel ───────────────────────────────────────────────── */
function FieldLabel({ children, mt = true }) {
    return (
        <div style={{
            fontSize: "11px", fontWeight: 600, color: T.muted,
            textTransform: "uppercase", letterSpacing: ".7px",
            marginBottom: "6px", marginTop: mt ? "14px" : 0,
        }}>
            {children}
        </div>
    );
}

/* ── KPI Card ─────────────────────────────────────────────────── */
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

/* ── Delete Confirm Modal ─────────────────────────────────────── */
function DeleteModal({ onConfirm, onCancel, name }) {
    return (
        <div style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10000, padding: "20px",
        }}>
            <div style={{
                background: T.elevated, border: `0.5px solid ${T.borderMd}`,
                borderRadius: "18px", padding: "28px 28px 24px",
                maxWidth: "380px", width: "100%", fontFamily: T.font,
            }}>
                <div style={{
                    width: "48px", height: "48px", borderRadius: "14px",
                    background: "rgba(239,68,68,.12)", border: "0.5px solid rgba(239,68,68,.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: T.red, marginBottom: "18px",
                }}>
                    <AlertTriangle size={22} strokeWidth={1.8} />
                </div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: T.text, marginBottom: "8px" }}>Hapus Sekolah</div>
                <p style={{ fontSize: "13px", color: T.sub, lineHeight: 1.7, margin: "0 0 22px" }}>
                    Yakin ingin menghapus <strong style={{ color: T.text }}>{name}</strong>? Data yang dihapus tidak dapat dipulihkan.
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

/* ── Main Page ────────────────────────────────────────────────── */
export default function SekolahSPPG() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [sekolahs,        setSekolahs]        = useState([]);
    const [showModal,       setShowModal]        = useState(false);
    const [editId,          setEditId]           = useState(null);
    const [search,          setSearch]           = useState("");
    const [deleteTarget,    setDeleteTarget]     = useState(null); // {id, name}
    const [searchLocation,  setSearchLocation]   = useState("");
    const [latitude,        setLatitude]         = useState("");
    const [longitude,       setLongitude]        = useState("");
    const [position,        setPosition]         = useState([-7.6498, 112.6878]);

    const [form, setForm] = useState({
        nama_sekolah: "", jenjang: "", alamat: "", jumlah_siswa: "",
    });

    const token   = () => localStorage.getItem("auth_token");
    const headers = () => ({ Authorization: `Bearer ${token()}` });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get("/sppg/sekolah", { headers: headers() });
            setSekolahs(res.data);
        } catch (e) { console.error("fetchData error:", e); }
    };

    const searchMapLocation = async () => {
        if (!searchLocation.trim()) return;
        try {
            const res = await axios.get("https://nominatim.openstreetmap.org/search", {
                params: { q: `${searchLocation}, Indonesia`, format: "json", limit: 5 },
            });
            if (res.data.length) {
                const lat = Number(res.data[0].lat);
                const lng = Number(res.data[0].lon);
                setPosition([lat, lng]);
                setLatitude(lat.toFixed(8));
                setLongitude(lng.toFixed(8));
            }
        } catch (err) { console.error("geocode error:", err); }
    };

    const saveData = async (e) => {
        e.preventDefault();
        const { nama_sekolah, jenjang, alamat, jumlah_siswa } = form;
        if (!nama_sekolah || !jenjang || !alamat || !jumlah_siswa) {
            alert("Semua field wajib diisi"); return;
        }
        const payload = {
            nama_sekolah, jenjang, alamat,
            jumlah_siswa: Number(jumlah_siswa),
            latitude, longitude,
        };
        try {
            if (editId) {
                await axios.put(`/api/sppg/sekolah/${editId}`, payload, { headers: headers() });
            } else {
                await axios.post("/sppg/sekolah", payload, { headers: headers() });
            }
            closeModal();
            fetchData();
        } catch (err) {
            console.error("saveData error:", err.response?.data || err);
            alert(err.response?.data?.message || "Gagal menyimpan data");
        }
    };

    const editData = (item) => {
        setEditId(item.id);
        setForm({
            nama_sekolah: item.nama_sekolah || "",
            jenjang:      item.jenjang      || "",
            alamat:       item.alamat       || "",
            jumlah_siswa: item.jumlah_siswa || "",
        });
        setLatitude(item.latitude   || "");
        setLongitude(item.longitude || "");
        if (item.latitude && item.longitude) {
            setPosition([Number(item.latitude), Number(item.longitude)]);
        }
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await axios.delete(`/api/sppg/sekolah/${deleteTarget.id}`, { headers: headers() });
            setDeleteTarget(null);
            fetchData();
        } catch (err) {
            console.error("delete error:", err);
            alert("Gagal menghapus data");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditId(null);
        setSearchLocation("");
        setLatitude(""); setLongitude("");
        setPosition([-7.6498, 112.6878]);
        setForm({ nama_sekolah: "", jenjang: "", alamat: "", jumlah_siswa: "" });
    };

    const openCreate = () => {
        closeModal();
        setShowModal(true);
    };

    const totalSiswa = sekolahs.reduce((a, b) => a + Number(b.jumlah_siswa || 0), 0);

    const filtered = sekolahs.filter(item =>
        item.nama_sekolah?.toLowerCase().includes(search.toLowerCase()) ||
        item.alamat?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
            <SidebarSPPG />

            <div style={{ marginLeft: "260px", padding: "32px 36px" }}>

                {/* ── Page Header ── */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "28px" }}>
                    <div>
                        <div style={{ fontSize: "11px", fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "8px" }}>
                            SPPG › Sekolah
                        </div>
                        <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 800, color: T.text, letterSpacing: "-.6px" }}>
                            Sekolah Binaan
                        </h1>
                        <p style={{ margin: "6px 0 0", fontSize: "13px", color: T.muted }}>
                            Kelola data sekolah penerima Program MBG
                        </p>
                    </div>
                    <button onClick={openCreate} style={{
                        height: "42px", padding: "0 20px", borderRadius: "11px",
                        border: `0.5px solid ${T.accent}40`,
                        background: `${T.accent}18`,
                        color: "#93C5FD", fontFamily: T.font,
                        fontSize: "13px", fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "8px",
                    }}>
                        <Plus size={16} strokeWidth={2.5} /> Tambah Sekolah
                    </button>
                </div>

                {/* ── KPI Cards ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "24px" }}>
                    <KpiCard label="Total Sekolah"    value={sekolahs.length} icon={Building2} accent={T.accent} />
                    <KpiCard label="Total Siswa"      value={totalSiswa}      icon={Users}     accent={T.green}  />
                    <KpiCard label="Lokasi Terdaftar" value={sekolahs.filter(s => s.latitude).length} icon={MapPin} accent={T.amber} />
                </div>

                {/* ── Table Card ── */}
                <div style={{
                    background: T.elevated, border: `0.5px solid ${T.border}`,
                    borderRadius: "18px", overflow: "hidden",
                }}>
                    {/* toolbar */}
                    <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "18px 22px", borderBottom: `0.5px solid ${T.border}`,
                    }}>
                        <div>
                            <div style={{ fontSize: "15px", fontWeight: 700, color: T.text }}>Data Sekolah</div>
                            <div style={{ fontSize: "12px", color: T.muted, marginTop: "3px" }}>
                                Daftar sekolah penerima program MBG
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {/* search */}
                            <div style={{
                                display: "flex", alignItems: "center", gap: "8px",
                                background: T.card, border: `0.5px solid ${T.border}`,
                                borderRadius: "10px", padding: "0 14px", height: "38px",
                            }}>
                                <Search size={14} strokeWidth={2} color={T.muted} />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Cari sekolah..."
                                    style={{
                                        background: "none", border: "none", outline: "none",
                                        color: T.text, fontSize: "13px", fontFamily: T.font,
                                        width: "200px",
                                    }}
                                />
                            </div>
                            <span style={{
                                fontSize: "11px", fontWeight: 700, padding: "4px 12px",
                                borderRadius: "20px",
                                background: `${T.accent}18`, border: `0.5px solid ${T.accent}30`,
                                color: "#93C5FD",
                            }}>
                                {filtered.length} sekolah
                            </span>
                        </div>
                    </div>

                    {/* table */}
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "700px" }}>
                            <thead>
                                <tr>
                                    {["No", "Sekolah", "Jenjang", "Alamat", "Siswa", "Aksi"].map(h => (
                                        <th key={h} style={{
                                            padding: "11px 18px",
                                            textAlign: h === "No" || h === "Aksi" ? "center" : "left",
                                            fontSize: "10.5px", fontWeight: 600, color: T.muted,
                                            textTransform: "uppercase", letterSpacing: ".7px",
                                            borderBottom: `0.5px solid ${T.border}`,
                                            background: T.card,
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ padding: "48px", textAlign: "center", color: T.muted, fontSize: "13px" }}>
                                            {search ? `Tidak ada sekolah yang cocok dengan "${search}"` : "Belum ada data sekolah"}
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
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <div style={{
                                                    width: "40px", height: "40px", borderRadius: "11px", flexShrink: 0,
                                                    background: `linear-gradient(135deg, ${T.accent}, ${T.teal})`,
                                                    display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
                                                }}>
                                                    <School2 size={18} strokeWidth={1.8} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: T.text }}>{item.nama_sekolah}</div>
                                                    <div style={{ fontSize: "11px", color: T.muted, marginTop: "2px" }}>ID #{item.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: "14px 18px" }}>
                                            {item.jenjang ? (
                                                <span style={{
                                                    fontSize: "11px", fontWeight: 700, padding: "3px 10px",
                                                    borderRadius: "20px",
                                                    background: `${T.teal}15`, border: `0.5px solid ${T.teal}30`,
                                                    color: T.teal,
                                                }}>{item.jenjang}</span>
                                            ) : <span style={{ color: T.muted }}>—</span>}
                                        </td>
                                        <td style={{ padding: "14px 18px", color: T.sub, maxWidth: "280px" }}>
                                            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {item.alamat || "—"}
                                            </div>
                                        </td>
                                        <td style={{ padding: "14px 18px", textAlign: "center" }}>
                                            <span style={{
                                                fontSize: "12px", fontWeight: 700, padding: "4px 12px",
                                                borderRadius: "20px",
                                                background: `${T.green}15`, border: `0.5px solid ${T.green}30`,
                                                color: T.green,
                                            }}>
                                                {Number(item.jumlah_siswa || 0).toLocaleString("id-ID")} siswa
                                            </span>
                                        </td>
                                        <td style={{ padding: "14px 18px" }}>
                                            <div style={{ display: "flex", justifyContent: "center", gap: "7px" }}>
                                                <button onClick={() => editData(item)} style={{
                                                    height: "32px", padding: "0 12px", borderRadius: "8px",
                                                    border: `0.5px solid ${T.accent}30`,
                                                    background: `${T.accent}12`, color: "#93C5FD",
                                                    fontFamily: T.font, fontSize: "11.5px", fontWeight: 600,
                                                    cursor: "pointer", display: "flex", alignItems: "center", gap: "5px",
                                                }}>
                                                    <Pencil size={11} strokeWidth={2} /> Edit
                                                </button>
                                                <button onClick={() => setDeleteTarget({ id: item.id, name: item.nama_sekolah })} style={{
                                                    height: "32px", padding: "0 12px", borderRadius: "8px",
                                                    border: `0.5px solid ${T.red}25`,
                                                    background: `${T.red}10`, color: "#FCA5A5",
                                                    fontFamily: T.font, fontSize: "11.5px", fontWeight: 600,
                                                    cursor: "pointer", display: "flex", alignItems: "center", gap: "5px",
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
            {deleteTarget && (
                <DeleteModal
                    name={deleteTarget.name}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {/* ── Add/Edit Modal ── */}
            {showModal && (
                <div style={{
                    position: "fixed", inset: 0,
                    background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 9999, padding: "20px",
                }}>
                    <div style={{
                        width: "100%", maxWidth: "580px",
                        background: T.elevated, border: `0.5px solid ${T.borderMd}`,
                        borderRadius: "18px", fontFamily: T.font,
                        maxHeight: "92vh", overflowY: "auto",
                        scrollbarWidth: "thin",
                    }}>
                        {/* modal header */}
                        <div style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "22px 24px 18px",
                            borderBottom: `0.5px solid ${T.border}`,
                            position: "sticky", top: 0, background: T.elevated, zIndex: 1,
                        }}>
                            <div>
                                <div style={{ fontSize: "17px", fontWeight: 800, color: T.text, letterSpacing: "-.3px" }}>
                                    {editId ? "Edit Sekolah" : "Tambah Sekolah"}
                                </div>
                                <div style={{ fontSize: "12px", color: T.muted, marginTop: "3px" }}>
                                    Lengkapi informasi sekolah binaan
                                </div>
                            </div>
                            <button onClick={closeModal} style={{
                                width: "30px", height: "30px", borderRadius: "8px",
                                background: T.card, border: `0.5px solid ${T.border}`,
                                color: T.muted, display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer",
                            }}>
                                <X size={14} strokeWidth={2} />
                            </button>
                        </div>

                        <form onSubmit={saveData} style={{ padding: "20px 24px 24px" }}>
                            {/* section label */}
                            <div style={{ fontSize: "11px", fontWeight: 700, color: "#818cf8", textTransform: "uppercase", letterSpacing: ".8px", marginBottom: "14px", paddingBottom: "8px", borderBottom: `0.5px solid ${T.border}` }}>
                                Informasi Sekolah
                            </div>

                            <FieldLabel mt={false}>Nama Sekolah</FieldLabel>
                            <input style={inp} type="text" placeholder="e.g. SDN Sidoarjo 1"
                                value={form.nama_sekolah}
                                onChange={e => setForm({ ...form, nama_sekolah: e.target.value })} />

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                <div>
                                    <FieldLabel>Jenjang</FieldLabel>
                                    <select style={selectStyle} value={form.jenjang}
                                        onChange={e => setForm({ ...form, jenjang: e.target.value })}>
                                        <option value="">Pilih jenjang</option>
                                        {["TK","SD","SMP","SMA","SMK"].map(j => <option key={j} value={j}>{j}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <FieldLabel>Jumlah Siswa</FieldLabel>
                                    <input style={inp} type="number" placeholder="e.g. 320"
                                        value={form.jumlah_siswa}
                                        onChange={e => setForm({ ...form, jumlah_siswa: e.target.value })} />
                                </div>
                            </div>

                            <FieldLabel>Alamat</FieldLabel>
                            <textarea style={{ ...inp, height: "72px", padding: "10px 14px", resize: "vertical", lineHeight: 1.6 }}
                                placeholder="Masukkan alamat lengkap sekolah"
                                value={form.alamat}
                                onChange={e => setForm({ ...form, alamat: e.target.value })} />

                            {/* map section */}
                            <div style={{ fontSize: "11px", fontWeight: 700, color: "#34d399", textTransform: "uppercase", letterSpacing: ".8px", margin: "20px 0 14px", paddingBottom: "8px", borderBottom: `0.5px solid ${T.border}` }}>
                                Lokasi pada Peta
                            </div>

                            <FieldLabel mt={false}>Cari Lokasi</FieldLabel>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                                <input style={{ ...inp, flex: 1 }}
                                    type="text" placeholder="Cari nama jalan, daerah..."
                                    value={searchLocation}
                                    onChange={e => setSearchLocation(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), searchMapLocation())}
                                />
                                <button type="button" onClick={searchMapLocation} style={{
                                    height: "42px", padding: "0 18px", borderRadius: "10px",
                                    border: "none", background: T.accent, color: "#fff",
                                    fontFamily: T.font, fontSize: "13px", fontWeight: 600, cursor: "pointer",
                                    display: "flex", alignItems: "center", gap: "6px", flexShrink: 0,
                                }}>
                                    <Search size={14} strokeWidth={2.5} /> Cari
                                </button>
                            </div>

                            <div style={{ height: "220px", borderRadius: "12px", overflow: "hidden", border: `0.5px solid ${T.borderMd}`, marginBottom: "14px" }}>
                                <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%" }}>
                                    <ChangeMapView center={position} />
                                    <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker draggable position={position}
                                        eventHandlers={{
                                            dragend: (e) => {
                                                const ll = e.target.getLatLng();
                                                setPosition([ll.lat, ll.lng]);
                                                setLatitude(ll.lat.toFixed(8));
                                                setLongitude(ll.lng.toFixed(8));
                                            }
                                        }}
                                    />
                                </MapContainer>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "8px" }}>
                                {[["Latitude", latitude], ["Longitude", longitude]].map(([label, val]) => (
                                    <div key={label} style={{
                                        background: T.card, borderRadius: "10px",
                                        border: `0.5px solid ${T.border}`, padding: "10px 14px",
                                    }}>
                                        <div style={{ fontSize: "10px", fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: ".7px" }}>{label}</div>
                                        <div style={{ fontSize: "13px", fontWeight: 700, color: val ? T.teal : T.muted, marginTop: "4px", fontFamily: "monospace" }}>
                                            {val || "—"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ fontSize: "11.5px", color: T.muted, marginBottom: "4px" }}>
                                💡 Geser marker pada peta untuk menentukan titik lokasi yang tepat
                            </div>

                            {/* actions */}
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