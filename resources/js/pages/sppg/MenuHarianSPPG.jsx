import { useEffect, useState } from "react";
import axios from "axios";
import SidebarSPPG from "../../components/SidebarSPPG";

import {
    Calendar,
    Utensils,
    Activity,
    Flame,
    Beef,
    Wheat,
    Droplets,
    Plus,
    X,
} from "lucide-react";

export default function MenuHarianSPPG() {
    const [menu, setMenu] = useState(null);
    const [gizi, setGizi] = useState(null);
    const [weekly, setWeekly] = useState([]);
    const [date, setDate] = useState("");
    const [openModal, setOpenModal] = useState(false);

    const [form, setForm] = useState({
        nama_menu: "",
        kategori: "",
        deskripsi: "",
        kalori: "",
        protein: "",
        lemak: "",
        karbo: "",
        serat: "",
    });

    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await axios.get("/sppg/menu-harian");

            setMenu(res.data?.menu_harian || null);
            setGizi(res.data?.gizi || null);
            setWeekly(res.data?.menu_mingguan || []);

            if (res.data?.menu_harian?.tanggal) {
                setDate(res.data.menu_harian.tanggal);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
        setImagePreview(URL.createObjectURL(file));

        setForm({
            ...form,
            gambar: file
        });
    }
};

    return (
        <>
            {/* GLOBAL FIX (ANTI GAP + ANTI SCROLL HOR) */}
            <style>{`
                html, body {
                    margin: 0;
                    padding: 0;
                    overflow-x: hidden !important;
                    background: #0b1220;
                }

                * {
                    box-sizing: border-box;
                }

                ::-webkit-scrollbar {
                    width: 0px;
                    height: 0px;
                }
            `}</style>

            <SidebarSPPG />

            {/* MAIN WRAPPER (NO GAP FULL) */}
            <div style={container}>

                {/* TOP BAR */}
                <div style={topBar}>
                    <div>
                        <h1 style={title}>🍽 Menu Harian SPPG</h1>
                        <p style={subtitle}>Kelola menu & gizi profesional</p>
                    </div>

                    <button style={btnAdd} onClick={() => setOpenModal(true)}>
                        <Plus size={18} />
                        Tambah Menu
                    </button>
                </div>

                {/* DATE */}
                <div style={dateBox}>
                    <Calendar size={18} color="#94a3b8" />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={dateInput}
                    />
                </div>

                {/* GRID */}
                <div style={grid}>

                    {/* MENU */}
                    <div style={card}>
                        <h2 style={cardTitle}><Utensils size={18} /> Menu Harian</h2>

                        {menu ? (
                            <>
                                <div style={menuBox}>
                                    <img src={menu?.gambar_menu} style={image} />
                                    <div style={{ flex: 1 }}>
                                        <h3 style={menuTitle}>{menu?.nama_menu}</h3>
                                        <ul style={list}>
                                            {menu?.detail_menu?.map((i, idx) => (
                                                <li key={idx}>• {i}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div style={note}>{menu?.catatan}</div>
                            </>
                        ) : (
                            <p style={empty}>Tidak ada menu</p>
                        )}

                        <h3 style={sectionTitle}>Menu Mingguan</h3>

                        <div style={weeklyBox}>
                            {weekly.map((item, i) => (
                                <div key={i} style={weeklyItem}>
                                    <span style={{ color: "#94a3b8" }}>{item.hari}</span>
                                    <strong style={{ color: "#fff" }}>{item.menu}</strong>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* GIZI */}
                    <div style={card}>
                        <h2 style={cardTitle}><Activity size={18} /> Gizi</h2>

                        {gizi ? (
                            <div style={giziGrid}>
                                <GiziCard icon={<Flame />} label="Energi" value={gizi.energi} unit="kkal" color="#f97316" />
                                <GiziCard icon={<Beef />} label="Protein" value={gizi.protein} unit="g" color="#22c55e" />
                                <GiziCard icon={<Droplets />} label="Lemak" value={gizi.lemak} unit="g" color="#3b82f6" />
                                <GiziCard icon={<Wheat />} label="Karbo" value={gizi.karbohidrat} unit="g" color="#a855f7" />
                            </div>
                        ) : (
                            <p style={empty}>Tidak ada data gizi</p>
                        )}
                    </div>

                </div>
            </div>

            {/* MODAL FIX (NO BLANK + CENTER SAFE) */}
{/* MODAL */}
{openModal && (
    <div style={modalOverlay}>

        <div style={modal}>

            {/* HEADER */}
            <div style={modalHeader}>
                <div>
                    <h2 style={{ color: "#fff", margin: 0 }}>
                        Tambah Menu
                    </h2>

                    <p style={{
                        color: "#94a3b8",
                        marginTop: 4,
                        fontSize: 13
                    }}>
                        Kelola informasi menu dan nilai gizi harian
                    </p>
                </div>

                <X
                    color="#fff"
                    style={{ cursor: "pointer" }}
                    onClick={() => setOpenModal(false)}
                />
            </div>

            {/* BODY */}
            <div style={modalBody}>

                {/* LEFT - INFORMASI MENU */}
                <div style={sectionCard}>

                    <div style={sectionHeader}>
                        📋 Informasi Menu
                    </div>

                    <input
                        name="nama_menu"
                        placeholder="Nama Menu"
                        onChange={handleChange}
                        style={input}
                    />

                    <div style={row2}>
                        <input
                            name="kategori"
                            placeholder="Kategori"
                            onChange={handleChange}
                            style={input}
                        />

                    </div>

                    <div style={row2}>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            style={input}
                        />

                        <input
                            placeholder="Hari (auto)"
                            disabled
                            value={
                                date
                                    ? new Date(date).toLocaleDateString("id-ID", {
                                        weekday: "long"
                                    })
                                    : ""
                            }
                            style={{
                                ...input,
                                opacity: 0.7
                            }}
                        />
                    </div>

                    <textarea
                        name="deskripsi"
                        placeholder="Deskripsi Menu"
                        onChange={handleChange}
                        style={textarea}
                    />

                       {/* PREVIEW GAMBAR */}
                    <div style={uploadWrapper}>

                        <div style={uploadPreviewBox}>
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="preview"
                                    style={uploadImage}
                                />
                            ) : (
                                <div style={{ color: "#94a3b8", fontSize: 13 }}>
                                    Belum ada gambar dipilih
                                </div>
                            )}
                        </div>

                        <label style={uploadBtn}>
                            📷 Pilih Gambar
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                            />
                        </label>

                    </div>
                </div>

                {/* RIGHT - INFORMASI GIZI */}
                <div style={sectionCard}>

                    <div style={sectionHeader}>
                        🥗 Informasi Gizi
                    </div>

                    <input name="kalori" placeholder="Kalori (kkal)" onChange={handleChange} style={input} />
                    <input name="protein" placeholder="Protein (g)" onChange={handleChange} style={input} />
                    <input name="lemak" placeholder="Lemak (g)" onChange={handleChange} style={input} />
                    <input name="karbo" placeholder="Karbohidrat (g)" onChange={handleChange} style={input} />
                    <input name="serat" placeholder="Serat (g)" onChange={handleChange} style={input} />

                </div>

            </div>

            {/* FOOTER */}
            <div style={actionRow}>
                <button
                    style={btnCancel}
                    onClick={() => setOpenModal(false)}
                >
                    Batal
                </button>

                <button style={btnSave}>
                    Simpan Menu
                </button>
            </div>

        </div>
    </div>
)}
        </>
    );
}

/* ================= COMPONENT ================= */
function GiziCard({ icon, label, value, unit, color }) {
    return (
        <div style={giziCardStyle}>
            <div style={{ ...iconBox, background: color + "22", color }}>
                {icon}
            </div>
            <p style={{ color: "#94a3b8", margin: 0 }}>{label}</p>
            <h3 style={{ color: "#fff", margin: 0 }}>
                {value} <small>{unit}</small>
            </h3>
        </div>
    );
}

/* ================= FULL EDGE FIX ================= */

const container = {
    marginLeft: 270,
    width: "calc(100vw - 270px)",
    minHeight: "100vh",
    background: "#0b1220",
    padding: 16,
};

const topBar = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    
};

const title = { color: "#fff", margin: 0 };
const subtitle = { color: "#94a3b8", margin: 0 };

const btnAdd = {
    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 12,
    display: "flex",
    gap: 8,
    alignItems: "center",
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 6px 18px rgba(37,99,235,0.25)",
    transition: "0.2s",
};

const dateBox = {
    marginTop: 10,
    background: "#111827",
    padding: 10,
    borderRadius: 12,
    display: "flex",
    gap: 10,
};

const dateInput = { background: "transparent", border: "none", color: "#fff" };

const grid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 12,
};

const card = {
    background: "rgba(17, 24, 39, 0.85)",
    border: "1px solid rgba(148,163,184,0.15)",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)",
};

const cardTitle = {
    color: "#fff",
    display: "flex",
    gap: 10,
};

const menuBox = { display: "flex", gap: 12 };
const image = { width: 90, height: 90, borderRadius: 12 };

const menuTitle = { color: "#fff", margin: 0 };
const list = { color: "#cbd5e1", paddingLeft: 16 };

const note = {
    marginTop: 10,
    padding: 10,
    background: "#0f172a",
    borderRadius: 10,
};

const sectionTitle = { color: "#94a3b8", marginTop: 14 };

const weeklyBox = { display: "grid", gap: 8 };
const weeklyItem = {
    background: "#0f172a",
    padding: 10,
    borderRadius: 10,
    display: "flex",
    justifyContent: "space-between",
};

const giziGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: 10,
};

const giziCardStyle = {
    background: "#0f172a",
    padding: 12,
    borderRadius: 12,
};

const iconBox = {
    width: 34,
    height: 34,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const empty = { color: "#94a3b8" };

/* MODAL FIX ANTI BLANK */
const modalOverlay = {
    position: "fixed",
    top: 0,
    left: "260px", // 🔥 ini kunci biar tidak nutup sidebar
    right: 0,
    bottom: 0,
    backdropFilter: "blur(6px)",
    background: "rgba(15, 23, 42, 0.25)", 
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
};

const modal = {
    width: "100%",
    maxWidth: "900px",
    background: "#0f172a",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
};

const modalHeader = {
    display: "flex",
    justifyContent: "space-between",
};

const formGrid = {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr", // kiri lebih besar (menu), kanan gizi
    gap: 16,
    marginTop: 10,
};
const input = {
    padding: "8px 10px",
    borderRadius: 10,
    background: "#111827",
    border: "1px solid #334155",
    color: "#fff",
    width: "100%",   // 🔥 INI WAJIB
    outline: "none",
    
};



const inputFull = { ...input, gridColumn: "span 2" };

const actionRow = {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 15,
};

const btnCancel = {
    background: "#334155",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 10,
};

const btnSave = {
    background: "#1f2937",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 10,
};

const leftBox = {
    display: "flex",
    flexDirection: "column",
    gap: 10,
};

const rightBox = {
    display: "flex",
    flexDirection: "column",
    gap: 10,
};

const uploadBox = {
    padding: 12,
    border: "1px dashed #334155",
    borderRadius: 12,
    background: "#0f172a",
};
const textarea = {
    padding: 10,
    borderRadius: 10,
    background: "#111827",
    border: "1px solid #334155",
    color: "#fff",
    minHeight: 80,
    resize: "none",
};

const uploadCard = {
    border: "1px dashed #334155",
    padding: 12,
    borderRadius: 12,
    background: "#0b1220",
};

const uploadPreviewBox = {
    width: "100%",
    height: 180,        // 🔥 kecilkan (260 → 180)
    borderRadius: 12,
    background: "#0b1220",
    border: "1px dashed #334155",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
};

const divider = {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    color: "#94a3b8",
    fontSize: 12,
    margin: "10px 0",
};
const modalBody = {
    display: "flex",
    gap: 14,   // 🔥 lebih lega
};

const sectionCard = {
    flex: 1,
    background: "rgba(17, 24, 39, 0.9)",
    border: "1px solid rgba(148,163,184,0.15)",
    borderRadius: 14,
    padding: 10,
};

const sectionHeader = {
    color: "#fff",
    fontWeight: 600,
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: "1px solid rgba(148,163,184,0.15)",
};

const row2 = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10, // 🔥 dari 10 ke 16 biar longgar
};
const uploadWrapper = {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
};
const uploadImage = {
    width: "100%",
    height: "100%",
    objectFit: "cover", // 🔥 penting biar gak kepotong
    background: "#0b1220",
};
const uploadBtn = {
    background: "#1f2937",
    color: "#fff",
    padding: "10px 12px",
    borderRadius: 10,
    textAlign: "center",
    cursor: "pointer",
    fontSize: 14,
};