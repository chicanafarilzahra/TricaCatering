// resources/js/pages/Klien/RiwayatUlasanKlien.jsx

import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import NavbarKlien from "../../components/NavbarKlien";
import { FaStar, FaRegStar, FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import { MessageSquare, Star, Filter, Search, TrendingUp } from "lucide-react";

/* ─────────────────── CONSTANTS ─────────────────── */

const C = {
  bg:       "#020817",
  card:     "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
  cardSolid:"#0f172a",
  input:    "#0a1120",
  border:   "rgba(255,255,255,0.07)",
  borderBlue:"rgba(59,130,246,0.2)",
  white:    "#ffffff",
  muted:    "#94a3b8",
  dim:      "#475569",
  amber:    "#f59e0b",
  blue:     "#3b82f6",
  blueD:    "#2563eb",
  blueL:    "#60a5fa",
  purple:   "#a78bfa",
  green:    "#34d399",
  red:      "#ef4444",
  blueGrad: "linear-gradient(90deg,#2563eb,#3b82f6)",
};

const RATING_FILTERS = ["Semua", "5", "4", "3", "2", "1"];

const TAGS_AVAILABLE = [
  "Enak", "Porsi pas", "Pengiriman cepat",
  "Kemasan rapi", "Kurang hangat", "Pelayanan ramah", "Lainnya",
];

/* ─────────────────── HELPERS ─────────────────── */

const formatTanggal = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
};

/* ─────────────────── GLOBAL STYLES ─────────────────── */

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  html, body {
    margin: 0 !important; padding: 0 !important;
    background: #020817 !important;
    overflow-x: hidden !important; width: 100% !important;
    font-family: 'Inter', system-ui, sans-serif;
  }
  #app, #root, body > div { margin:0!important; padding:0!important; max-width:none!important; width:100%!important; }
  * { box-sizing: border-box; }

  .ruk-card {
    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
  }
  .ruk-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.4) !important;
    border-color: rgba(59,130,246,0.25) !important;
  }

  .ruk-btn-icon { transition: background .15s, transform .15s; }
  .ruk-btn-icon:hover { background: rgba(255,255,255,0.1) !important; transform: scale(1.08); }

  .ruk-filter-btn { transition: all .15s ease; }
  .ruk-filter-btn:hover { border-color: rgba(59,130,246,0.4) !important; }

  @keyframes ruk-shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .ruk-skeleton {
    background: linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%);
    background-size: 600px 100%;
    animation: ruk-shimmer 1.4s infinite linear;
    border-radius: 8px;
  }

  .ruk-scroll { scrollbar-width:none; -ms-overflow-style:none; }
  .ruk-scroll::-webkit-scrollbar { display:none; }

  @keyframes ruk-fadein { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  .ruk-fadein { animation: ruk-fadein .28s ease both; }

  .pulse-dot { animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  @media (max-width: 768px) {
    .ruk-hero-inner { flex-direction: column !important; }
    .ruk-summary-bar { flex-direction: column !important; gap: 16px !important; }
    .ruk-divider-v { display: none !important; }
  }
`;

function useGlobalStyles() {
  useEffect(() => {
    const id = "ruk-global-styles";
    let tag = document.getElementById(id);
    const created = !tag;
    if (!tag) { tag = document.createElement("style"); tag.id = id; document.head.appendChild(tag); }
    tag.innerHTML = GLOBAL_CSS;
    return () => { if (created && tag?.parentNode) tag.parentNode.removeChild(tag); };
  }, []);
}

/* ─────────────────── STAR DISPLAY ─────────────────── */

function Stars({ value, size = 16, interactive = false, hoverVal = 0, onHover, onClick }) {
  return (
    <span style={{ display: "inline-flex", gap: "3px" }}>
      {[1, 2, 3, 4, 5].map((s) => {
        const filled = s <= (interactive ? (hoverVal || value) : value);
        return (
          <span
            key={s}
            onMouseEnter={() => interactive && onHover?.(s)}
            onMouseLeave={() => interactive && onHover?.(0)}
            onClick={() => interactive && onClick?.(s)}
            style={{
              fontSize: size + "px",
              color: filled ? C.amber : "rgba(255,255,255,0.15)",
              cursor: interactive ? "pointer" : "default",
              transition: "color .12s, transform .12s",
              display: "inline-block",
            }}
          >
            {filled ? <FaStar /> : <FaRegStar />}
          </span>
        );
      })}
    </span>
  );
}

/* ─────────────────── SKELETON ─────────────────── */

function SkeletonCard() {
  return (
    <div style={{
      background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
      borderRadius: "20px", padding: "24px",
      border: "1px solid rgba(255,255,255,0.07)",
    }}>
      <div style={{ display: "flex", gap: "14px", marginBottom: "18px" }}>
        <div className="ruk-skeleton" style={{ width: "52px", height: "52px", borderRadius: "14px", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="ruk-skeleton" style={{ height: "16px", width: "55%", marginBottom: "8px" }} />
          <div className="ruk-skeleton" style={{ height: "12px", width: "30%" }} />
        </div>
      </div>
      <div className="ruk-skeleton" style={{ height: "12px", width: "40%", marginBottom: "14px" }} />
      <div className="ruk-skeleton" style={{ height: "14px", width: "90%", marginBottom: "8px" }} />
      <div className="ruk-skeleton" style={{ height: "14px", width: "70%" }} />
    </div>
  );
}

/* ─────────────────── EDIT MODAL ─────────────────── */

function EditModal({ ulasan, onClose, onSaved }) {
  const [rating,      setRating]      = useState(ulasan.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [komentar,    setKomentar]    = useState(ulasan.komentar || "");
  const [tags,        setTags]        = useState(ulasan.tags || []);
  const [loading,     setLoading]     = useState(false);

  const toggleTag = (t) =>
    setTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const handleSave = async () => {
    if (!rating) { alert("Rating wajib diisi."); return; }
    setLoading(true);
    try {
      await axios.put(`/klien/ulasan/${ulasan.id}`, { rating, komentar, tags });
      onSaved();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan perubahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <div
        className="ruk-scroll"
        style={{
          background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
          border: "1px solid rgba(59,130,246,0.2)",
          borderRadius: "24px", padding: "28px",
          width: "100%", maxWidth: "500px",
          maxHeight: "90vh", overflowY: "auto",
          position: "relative", overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div style={{
          position: "absolute", top: "-60px", right: "-40px",
          width: "200px", height: "200px", borderRadius: "999px",
          background: "rgba(59,130,246,0.1)", filter: "blur(60px)",
          pointerEvents: "none",
        }} />
        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: "28px", right: "28px",
          height: "2px", borderRadius: "0 0 4px 4px",
          background: "linear-gradient(90deg, #2563eb, #a78bfa, transparent)",
        }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <div style={{ color: C.white, fontSize: "19px", fontWeight: "800", letterSpacing: "-0.3px" }}>Edit Ulasan</div>
              <div style={{ color: C.muted, fontSize: "13px", marginTop: "3px" }}>
                {ulasan.pesanan?.menu?.name || "Menu"}
              </div>
            </div>
            <CloseBtn onClick={onClose} />
          </div>

          <FieldLabel text="Rating" />
          <Stars
            value={rating} size={36} interactive
            hoverVal={hoverRating}
            onHover={setHoverRating}
            onClick={setRating}
          />

          <FieldLabel text="Komentar (Opsional)" />
          <textarea
            rows={4}
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
            placeholder="Ceritakan pengalaman Anda..."
            maxLength={300}
            style={{
              width: "100%", borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(0,0,0,0.3)", color: C.white,
              padding: "12px 14px", fontSize: "14px",
              outline: "none", resize: "none", lineHeight: "1.55",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          />
          <div style={{ textAlign: "right", color: C.dim, fontSize: "12px", marginTop: "4px" }}>
            {komentar.length}/300
          </div>

          <FieldLabel text="Tag" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {TAGS_AVAILABLE.map((t) => {
              const active = tags.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  style={tagChipStyle(active)}
                >
                  {t}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "26px" }}>
            <button onClick={onClose} style={cancelBtnStyle}>Batal</button>
            <button
              onClick={handleSave}
              disabled={loading || !rating}
              style={{
                ...primaryBtnStyle,
                opacity: loading || !rating ? 0.5 : 1,
                cursor: loading || !rating ? "not-allowed" : "pointer",
              }}
            >
              <FaCheck style={{ fontSize: "13px" }} />
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

/* ─────────────────── CONFIRM DELETE MODAL ─────────────────── */

function ConfirmDeleteModal({ onClose, onConfirm, loading }) {
  return (
    <Overlay onClose={onClose}>
      <div
        style={{
          background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: "24px", padding: "36px",
          width: "100%", maxWidth: "400px", textAlign: "center",
          position: "relative", overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          position: "absolute", top: 0, left: "36px", right: "36px",
          height: "2px", background: "linear-gradient(90deg, #dc2626, #ef4444, transparent)",
        }} />
        <div style={{
          position: "absolute", top: "-40px", right: "-30px",
          width: "150px", height: "150px", borderRadius: "999px",
          background: "rgba(239,68,68,0.08)", filter: "blur(50px)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{
            width: "60px", height: "60px", borderRadius: "18px",
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "26px", margin: "0 auto 20px",
          }}>🗑️</div>
          <div style={{ color: C.white, fontSize: "20px", fontWeight: "800", marginBottom: "10px", letterSpacing: "-0.3px" }}>
            Hapus Ulasan?
          </div>
          <p style={{ color: C.muted, fontSize: "14px", lineHeight: "1.7", marginBottom: "28px", margin: "0 0 28px" }}>
            Ulasan yang dihapus tidak dapat dikembalikan.
            Anda tetap bisa memberi ulasan baru untuk pesanan ini.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={onClose} style={{ ...cancelBtnStyle, flex: 1 }}>Batal</button>
            <button
              onClick={onConfirm}
              disabled={loading}
              style={{
                flex: 1, height: "48px", borderRadius: "12px", border: "none",
                background: "linear-gradient(90deg,#dc2626,#ef4444)",
                color: C.white, fontSize: "14px", fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              <FaTrash style={{ fontSize: "13px" }} />
              {loading ? "Menghapus..." : "Ya, Hapus"}
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

/* ─────────────────── ULASAN CARD ─────────────────── */

function UlasanCard({ item, onEdit, onDelete }) {
  const ratingColor = item.rating >= 4 ? C.green : item.rating === 3 ? C.amber : C.red;

  return (
    <div
      className="ruk-card ruk-fadein"
      style={{
        background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "20px", padding: "22px",
        display: "flex", flexDirection: "column", gap: "14px",
        position: "relative", overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Top accent line color-coded by rating */}
      <div style={{
        position: "absolute", top: 0, left: "22px", right: "22px",
        height: "2px", borderRadius: "0 0 4px 4px",
        background: `linear-gradient(90deg, ${ratingColor}, transparent)`,
      }} />

      {/* Subtle glow */}
      <div style={{
        position: "absolute", top: "-50px", right: "-30px",
        width: "120px", height: "120px", borderRadius: "999px",
        background: `${ratingColor}0f`, filter: "blur(40px)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* Top: menu info + aksi */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
            {item.pesanan?.menu?.image_url ? (
              <img
                src={item.pesanan.menu.image_url}
                alt={item.pesanan.menu?.name}
                style={{ width: "48px", height: "48px", borderRadius: "14px", objectFit: "cover", flexShrink: 0, border: "1px solid rgba(255,255,255,0.07)" }}
              />
            ) : (
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px", flexShrink: 0,
              }}>🍽️</div>
            )}
            <div style={{ minWidth: 0 }}>
              <div style={{ color: C.white, fontWeight: "700", fontSize: "15px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {item.pesanan?.menu?.name || "Menu"}
              </div>
              <div style={{ color: C.dim, fontSize: "12px", marginTop: "3px" }}>
                Order #{item.pesanan_id} &nbsp;·&nbsp; {formatTanggal(item.created_at)}
              </div>
            </div>
          </div>

          {/* Edit + Delete */}
          <div style={{ display: "flex", gap: "6px", flexShrink: 0, marginLeft: "10px" }}>
            <button
              className="ruk-btn-icon"
              onClick={() => onEdit(item)}
              title="Edit ulasan"
              style={iconBtnStyle("#60a5fa", "rgba(59,130,246,0.1)", "rgba(59,130,246,0.2)")}
            ><FaEdit /></button>
            <button
              className="ruk-btn-icon"
              onClick={() => onDelete(item)}
              title="Hapus ulasan"
              style={iconBtnStyle("#f87171", "rgba(239,68,68,0.1)", "rgba(239,68,68,0.2)")}
            ><FaTrash /></button>
          </div>
        </div>

        {/* Rating */}
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "10px 14px", borderRadius: "12px",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
        }}>
          <Stars value={item.rating} size={16} />
          <span style={{ color: ratingColor, fontWeight: "700", fontSize: "14px" }}>
            {item.rating}/5
          </span>
        </div>

        {/* Komentar */}
        {item.komentar && (
          <p style={{
            color: C.muted, fontSize: "14px", lineHeight: "1.65",
            margin: 0, background: "rgba(0,0,0,0.2)",
            borderRadius: "12px", padding: "12px 14px",
            border: "1px solid rgba(255,255,255,0.05)",
            fontStyle: "italic",
          }}>
            "{item.komentar}"
          </p>
        )}

        {/* Tags */}
        {Array.isArray(item.tags) && item.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {item.tags.map((t) => (
              <span key={t} style={{
                padding: "4px 12px", borderRadius: "20px",
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.2)",
                color: C.blueL, fontSize: "12px", fontWeight: "600",
              }}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────── STAT MINI CARD ─────────────────── */

function MiniStat({ icon, label, value, color, bg, border }) {
  return (
    <div style={{
      background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
      border: `1px solid ${border}`,
      borderRadius: "20px", padding: "22px 24px",
      position: "relative", overflow: "hidden",
      transition: "transform .2s ease, box-shadow .2s ease",
    }}>
      <div style={{
        position: "absolute", top: 0, left: "24px", right: "24px",
        height: "2px", background: `linear-gradient(90deg, ${color}, transparent)`,
      }} />
      <div style={{
        position: "absolute", top: "-30px", right: "-30px",
        width: "100px", height: "100px", borderRadius: "999px",
        background: bg, filter: "blur(30px)", pointerEvents: "none",
      }} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "12px",
          background: bg, border: `1px solid ${border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color, marginBottom: "16px",
        }}>
          {icon}
        </div>
        <div style={{ color: C.white, fontSize: "24px", fontWeight: "800", letterSpacing: "-0.8px", marginBottom: "4px" }}>
          {value}
        </div>
        <div style={{ color: C.dim, fontSize: "12px", fontWeight: "500" }}>{label}</div>
      </div>
    </div>
  );
}

/* ─────────────────── MAIN COMPONENT ─────────────────── */

export default function RiwayatUlasanKlien() {
  useGlobalStyles();

  const [ulasan,        setUlasan]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [ratingFilter,  setRatingFilter]  = useState("Semua");
  const [searchMenu,    setSearchMenu]    = useState("");
  const [editTarget,    setEditTarget]    = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getUlasan = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await axios.get("/klien/ulasan");
      const raw = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setUlasan([...raw].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Gagal memuat ulasan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { getUlasan(); }, [getUlasan]);

  const avgRating = useMemo(() => {
    if (!ulasan.length) return 0;
    return (ulasan.reduce((s, u) => s + (u.rating || 0), 0) / ulasan.length).toFixed(1);
  }, [ulasan]);

  const ratingDist = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ulasan.forEach((u) => { if (dist[u.rating] !== undefined) dist[u.rating]++; });
    return dist;
  }, [ulasan]);

  const positiveCount = useMemo(() => ulasan.filter((u) => u.rating >= 4).length, [ulasan]);

  const filtered = useMemo(() => {
    let list = ulasan;
    if (ratingFilter !== "Semua") {
      const r = parseInt(ratingFilter);
      list = list.filter((u) => u.rating === r);
    }
    const kw = searchMenu.trim().toLowerCase();
    if (kw) {
      list = list.filter((u) =>
        (u.pesanan?.menu?.name || "").toLowerCase().includes(kw) ||
        (u.komentar || "").toLowerCase().includes(kw)
      );
    }
    return list;
  }, [ulasan, ratingFilter, searchMenu]);

  const handleEditSaved = async () => {
    setEditTarget(null);
    await getUlasan();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`/klien/ulasan/${deleteTarget.id}`);
      setDeleteTarget(null);
      await getUlasan();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus ulasan.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: C.bg, overflowX: "hidden", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <NavbarKlien title="Ulasan Saya" />

      <div style={{ padding: "30px" }}>

        {/* ── HERO HEADER ── */}
        <div style={{
          position: "relative",
          borderRadius: "24px", padding: "40px",
          background: "linear-gradient(135deg, #0d1117 0%, #0f172a 60%, #131c2e 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          overflow: "hidden", marginBottom: "24px",
        }}>
          {/* Grid texture */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "28px 28px", pointerEvents: "none",
          }} />
          {/* Glow orbs */}
          <div style={{
            position: "absolute", top: "-80px", right: "80px",
            width: "280px", height: "280px", borderRadius: "999px",
            background: "rgba(59,130,246,0.1)", filter: "blur(90px)", pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "-60px", right: "-30px",
            width: "180px", height: "180px", borderRadius: "999px",
            background: "rgba(167,139,250,0.08)", filter: "blur(70px)", pointerEvents: "none",
          }} />

          <div className="ruk-hero-inner" style={{
            position: "relative", zIndex: 2,
            display: "flex", justifyContent: "space-between",
            alignItems: "center", gap: "32px", flexWrap: "wrap",
          }}>
            {/* Left */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "6px 14px", borderRadius: "999px",
                background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.22)",
                color: C.blueL, fontSize: "12px", fontWeight: "600",
                letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "22px",
              }}>
                <span className="pulse-dot" style={{
                  width: "6px", height: "6px", borderRadius: "999px",
                  background: C.blueL, display: "inline-block",
                }} />
                Riwayat Ulasan
              </div>

              <h1 style={{
                margin: 0, fontSize: "clamp(26px, 3.5vw, 42px)",
                lineHeight: 1.15, color: "white", fontWeight: "800",
                letterSpacing: "-1.5px", maxWidth: "520px",
              }}>
                Ulasan &amp; Feedback
                <br />
                <span style={{
                  background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  Pesanan Anda 🌟
                </span>
              </h1>

              <p style={{
                margin: "16px 0 0", color: "#64748b",
                fontSize: "15px", lineHeight: "1.8", maxWidth: "480px",
              }}>
                Kelola seluruh ulasan yang pernah Anda kirimkan.
                Edit atau hapus kapan saja.
              </p>
            </div>

            {/* Right: Rating summary card */}
            {!loading && ulasan.length > 0 && (
              <div style={{
                width: "280px", flexShrink: 0,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "20px", padding: "24px",
                backdropFilter: "blur(12px)",
              }}>
                <div style={{
                  fontSize: "11px", fontWeight: "700",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: "#475569", marginBottom: "18px",
                }}>
                  Ringkasan Rating
                </div>

                {/* Avg big number */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ color: C.amber, fontSize: "48px", fontWeight: "800", lineHeight: 1, letterSpacing: "-2px" }}>
                    {avgRating}
                  </div>
                  <div style={{ paddingBottom: "6px" }}>
                    <Stars value={Math.round(Number(avgRating))} size={15} />
                    <div style={{ color: C.dim, fontSize: "12px", marginTop: "4px" }}>
                      dari {ulasan.length} ulasan
                    </div>
                  </div>
                </div>

                {/* Mini bars */}
                {[5, 4, 3, 2, 1].map((r) => {
                  const count = ratingDist[r] || 0;
                  const pct = ulasan.length ? Math.round((count / ulasan.length) * 100) : 0;
                  const barColor = r >= 4 ? C.green : r === 3 ? C.amber : C.red;
                  return (
                    <div key={r} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                      <span style={{ color: C.dim, fontSize: "11px", width: "10px", textAlign: "right" }}>{r}</span>
                      <FaStar style={{ color: C.amber, fontSize: "10px", flexShrink: 0 }} />
                      <div style={{ flex: 1, height: "6px", borderRadius: "99px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: "99px",
                          width: pct + "%", background: barColor,
                          transition: "width .5s ease",
                        }} />
                      </div>
                      <span style={{ color: C.dim, fontSize: "11px", width: "28px" }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── MINI STATS ── */}
        {!loading && ulasan.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px", marginBottom: "24px",
          }}>
            <MiniStat
              icon={<MessageSquare size={18} />}
              label="Total Ulasan"
              value={ulasan.length}
              color="#60a5fa"
              bg="rgba(59,130,246,0.08)"
              border="rgba(59,130,246,0.2)"
            />
            <MiniStat
              icon={<Star size={18} />}
              label="Rating Rata-rata"
              value={`${avgRating} / 5`}
              color="#f59e0b"
              bg="rgba(245,158,11,0.08)"
              border="rgba(245,158,11,0.2)"
            />
            <MiniStat
              icon={<TrendingUp size={18} />}
              label="Ulasan Positif (≥4⭐)"
              value={positiveCount}
              color="#34d399"
              bg="rgba(52,211,153,0.08)"
              border="rgba(52,211,153,0.2)"
            />
          </div>
        )}

        {/* ── FILTER + SEARCH ── */}
        <div style={{
          background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "20px", padding: "20px 24px",
          display: "flex", gap: "14px", flexWrap: "wrap",
          alignItems: "center", marginBottom: "20px",
        }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 220px", maxWidth: "320px" }}>
            <Search size={14} style={{
              position: "absolute", left: "14px", top: "50%",
              transform: "translateY(-50%)", color: C.dim,
              pointerEvents: "none",
            }} />
            <input
              type="text"
              value={searchMenu}
              onChange={(e) => setSearchMenu(e.target.value)}
              placeholder="Cari nama menu / komentar..."
              style={{
                width: "100%", height: "42px",
                background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px", padding: "0 14px 0 38px",
                color: C.white, fontSize: "13px", outline: "none",
                fontFamily: "'Inter', system-ui, sans-serif",
                transition: "border-color .15s",
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(59,130,246,0.4)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.07)"}
            />
          </div>

          {/* Divider */}
          <div style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />

          {/* Label */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: C.dim, fontSize: "12px", fontWeight: "600" }}>
            <Filter size={13} />
            Filter
          </div>

          {/* Rating Tabs */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {RATING_FILTERS.map((f) => {
              const active = ratingFilter === f;
              const label = f === "Semua" ? "Semua" : `${f} ⭐`;
              return (
                <button
                  key={f}
                  className="ruk-filter-btn"
                  onClick={() => setRatingFilter(f)}
                  style={{
                    padding: "7px 14px", borderRadius: "10px",
                    border: `1px solid ${active ? "transparent" : "rgba(255,255,255,0.07)"}`,
                    background: active ? "linear-gradient(90deg,#2563eb,#3b82f6)" : "rgba(255,255,255,0.03)",
                    color: active ? C.white : C.muted,
                    fontSize: "13px", fontWeight: "600",
                    cursor: "pointer", whiteSpace: "nowrap",
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── CONTENT ── */}

        {/* Error */}
        {error && (
          <EmptyState
            icon="⚠️"
            title="Terjadi kesalahan"
            subtitle={error}
            action={{ label: "Coba Lagi", onClick: getUlasan }}
          />
        )}

        {/* Skeleton */}
        {!error && loading && (
          <div style={gridStyle}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!error && !loading && filtered.length === 0 && (
          <EmptyState
            icon="💬"
            title={ulasan.length === 0 ? "Belum ada ulasan" : "Tidak ada ulasan yang cocok"}
            subtitle={
              ulasan.length === 0
                ? "Ulasan Anda akan muncul di sini setelah pesanan selesai."
                : "Coba ubah filter atau kata kunci pencarian."
            }
          />
        )}

        {/* Cards */}
        {!error && !loading && filtered.length > 0 && (
          <div style={gridStyle}>
            {filtered.map((item) => (
              <UlasanCard
                key={item.id}
                item={item}
                onEdit={setEditTarget}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}

        {/* Footer count */}
        {!error && !loading && filtered.length > 0 && (
          <div style={{
            color: C.dim, fontSize: "13px", marginTop: "24px", textAlign: "center",
            padding: "16px",
            background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
          }}>
            Menampilkan <strong style={{ color: C.white }}>{filtered.length}</strong> dari{" "}
            <strong style={{ color: C.white }}>{ulasan.length}</strong> ulasan
          </div>
        )}
      </div>

      {/* ── MODALS ── */}
      {editTarget && (
        <EditModal
          ulasan={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={handleEditSaved}
        />
      )}
      {deleteTarget && (
        <ConfirmDeleteModal
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}

/* ─────────────────── SHARED SUB-COMPONENTS ─────────────────── */

function Overlay({ children, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(2,8,23,0.85)",
        backdropFilter: "blur(8px)",
        zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
    >
      {children}
    </div>
  );
}

function CloseBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "10px", color: C.muted,
        width: "36px", height: "36px",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", fontSize: "16px", flexShrink: 0,
        transition: "background .15s",
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
      onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
    >
      <FaTimes />
    </button>
  );
}

function FieldLabel({ text }) {
  return (
    <div style={{
      color: C.dim, fontSize: "11px", fontWeight: "700",
      textTransform: "uppercase", letterSpacing: "0.8px",
      marginTop: "20px", marginBottom: "10px",
    }}>{text}</div>
  );
}

function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div style={{
      background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "20px", padding: "72px 32px",
      textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "-40px", left: "50%", transform: "translateX(-50%)",
        width: "200px", height: "200px", borderRadius: "999px",
        background: "rgba(59,130,246,0.06)", filter: "blur(60px)", pointerEvents: "none",
      }} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{
          width: "64px", height: "64px", borderRadius: "18px",
          background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "28px", margin: "0 auto 18px",
        }}>{icon}</div>
        <div style={{ color: C.white, fontWeight: "800", fontSize: "18px", marginBottom: "8px", letterSpacing: "-0.3px" }}>{title}</div>
        <p style={{ color: C.muted, margin: "0 0 26px", fontSize: "14px", lineHeight: "1.7" }}>{subtitle}</p>
        {action && (
          <button
            onClick={action.onClick}
            style={{
              background: "linear-gradient(90deg,#2563eb,#3b82f6)",
              border: "none", borderRadius: "12px", padding: "12px 28px",
              color: C.white, fontSize: "14px", fontWeight: "700", cursor: "pointer",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────── STYLE OBJECTS ─────────────────── */

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
  gap: "16px",
};

const tagChipStyle = (active) => ({
  padding: "7px 14px", borderRadius: "20px",
  border: active ? "none" : "1px solid rgba(255,255,255,0.07)",
  background: active ? "linear-gradient(90deg,#2563eb,#3b82f6)" : "rgba(255,255,255,0.03)",
  color: active ? "#ffffff" : "#94a3b8",
  fontSize: "13px", fontWeight: "600",
  cursor: "pointer", transition: "all .15s",
  fontFamily: "'Inter', system-ui, sans-serif",
});

const iconBtnStyle = (color, bg, border) => ({
  width: "34px", height: "34px",
  borderRadius: "10px",
  border: `1px solid ${border}`,
  background: bg,
  color,
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", fontSize: "13px",
});

const cancelBtnStyle = {
  flex: 1, height: "48px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.07)",
  background: "rgba(255,255,255,0.03)",
  color: "#94a3b8",
  fontSize: "14px", fontWeight: "700",
  cursor: "pointer",
  fontFamily: "'Inter', system-ui, sans-serif",
};

const primaryBtnStyle = {
  flex: 1, height: "48px",
  borderRadius: "12px", border: "none",
  background: "linear-gradient(90deg,#2563eb,#3b82f6)",
  color: "#ffffff",
  fontSize: "14px", fontWeight: "700",
  cursor: "pointer",
  display: "flex", alignItems: "center",
  justifyContent: "center", gap: "8px",
  fontFamily: "'Inter', system-ui, sans-serif",
};