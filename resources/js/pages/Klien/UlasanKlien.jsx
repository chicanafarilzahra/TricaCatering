// resources/js/pages/Klien/RiwayatUlasanKlien.jsx

import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import NavbarKlien from "../../components/NavbarKlien";
import { FaStar, FaRegStar, FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import { MessageSquare, Star, Filter, Search, TrendingUp, ChevronRight, Activity } from "lucide-react";

/* ─────────────────── CONSTANTS ─────────────────── */

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

/* ─────────────────── GLOBAL STYLES (Home.jsx pattern) ─────────────────── */

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

  .ruk-root * { font-family: 'Inter', system-ui, sans-serif; box-sizing: border-box; }

  .stat-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .stat-card:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(0,0,0,0.35); }

  .ruk-card { transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease; }
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

  @media (max-width: 900px) {
    .ruk-hero-inner { flex-direction: column !important; }
    .ruk-hero-card { width: 100% !important; }
  }
  @media (max-width: 768px) {
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
              color: filled ? "#fbbf24" : "rgba(255,255,255,0.15)",
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

/* ─────────────────── CREATE MODAL (Beri Ulasan) ─────────────────── */

function CreateModal({ pesanan, onClose, onSaved }) {
  const [rating,      setRating]      = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [komentar,    setKomentar]    = useState("");
  const [tags,        setTags]        = useState([]);
  const [loading,     setLoading]     = useState(false);

  const toggleTag = (t) =>
    setTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const handleSave = async () => {
    if (!rating) { alert("Rating wajib diisi."); return; }
    setLoading(true);
    try {
      await axios.post("/klien/ulasan", {
        pesanan_id: pesanan.id,
        rating, komentar, tags,
      });
      onSaved();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Gagal mengirim ulasan.");
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
          border: "1px solid rgba(52,211,153,0.25)",
          borderRadius: "24px", padding: "28px",
          width: "100%", maxWidth: "500px",
          maxHeight: "90vh", overflowY: "auto",
          position: "relative", overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          position: "absolute", top: "-60px", right: "-40px",
          width: "200px", height: "200px", borderRadius: "999px",
          background: "rgba(52,211,153,0.1)", filter: "blur(60px)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: 0, left: "28px", right: "28px",
          height: "2px", borderRadius: "0 0 4px 4px",
          background: "linear-gradient(90deg, #059669, #34d399, transparent)",
        }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
              {pesanan.menu?.image_url ? (
                <img
                  src={pesanan.menu.image_url}
                  alt={pesanan.menu?.name}
                  style={{ width: "44px", height: "44px", borderRadius: "13px", objectFit: "cover", flexShrink: 0, border: "1px solid rgba(255,255,255,0.07)" }}
                />
              ) : (
                <div style={{
                  width: "44px", height: "44px", borderRadius: "13px",
                  background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", flexShrink: 0,
                }}>🍽️</div>
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ color: "white", fontSize: "19px", fontWeight: "800", letterSpacing: "-0.3px" }}>Beri Ulasan</div>
                <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {pesanan.menu?.name || "Menu"}
                </div>
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
              background: "rgba(0,0,0,0.3)", color: "white",
              padding: "12px 14px", fontSize: "14px",
              outline: "none", resize: "none", lineHeight: "1.55",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          />
          <div style={{ textAlign: "right", color: "#475569", fontSize: "12px", marginTop: "4px" }}>
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
                background: "linear-gradient(90deg,#059669,#34d399)",
                opacity: loading || !rating ? 0.5 : 1,
                cursor: loading || !rating ? "not-allowed" : "pointer",
              }}
            >
              <FaCheck style={{ fontSize: "13px" }} />
              {loading ? "Mengirim..." : "Kirim Ulasan"}
            </button>
          </div>
        </div>
      </div>
    </Overlay>
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
        <div style={{
          position: "absolute", top: "-60px", right: "-40px",
          width: "200px", height: "200px", borderRadius: "999px",
          background: "rgba(59,130,246,0.1)", filter: "blur(60px)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: 0, left: "28px", right: "28px",
          height: "2px", borderRadius: "0 0 4px 4px",
          background: "linear-gradient(90deg, #2563eb, #a78bfa, transparent)",
        }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <div style={{ color: "white", fontSize: "19px", fontWeight: "800", letterSpacing: "-0.3px" }}>Edit Ulasan</div>
              <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "3px" }}>
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
              background: "rgba(0,0,0,0.3)", color: "white",
              padding: "12px 14px", fontSize: "14px",
              outline: "none", resize: "none", lineHeight: "1.55",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          />
          <div style={{ textAlign: "right", color: "#475569", fontSize: "12px", marginTop: "4px" }}>
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
          <div style={{ color: "white", fontSize: "20px", fontWeight: "800", marginBottom: "10px", letterSpacing: "-0.3px" }}>
            Hapus Ulasan?
          </div>
          <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.7", marginBottom: "28px", margin: "0 0 28px" }}>
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
                color: "white", fontSize: "14px", fontWeight: "700",
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

/* ─────────────────── PESANAN SELESAI CARD (belum diulas) ─────────────────── */

function PesananSelesaiCard({ item, onReview }) {
  return (
    <div
      className="ruk-card ruk-fadein"
      style={{
        background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
        border: "1px solid rgba(52,211,153,0.18)",
        borderRadius: "20px", padding: "22px",
        display: "flex", flexDirection: "column", gap: "14px",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: "22px", right: "22px",
        height: "2px", borderRadius: "0 0 4px 4px",
        background: "linear-gradient(90deg, #34d399, transparent)",
      }} />
      <div style={{
        position: "absolute", top: "-50px", right: "-30px",
        width: "120px", height: "120px", borderRadius: "999px",
        background: "rgba(52,211,153,0.08)", filter: "blur(40px)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {item.menu?.image_url ? (
            <img
              src={item.menu.image_url}
              alt={item.menu?.name}
              style={{ width: "48px", height: "48px", borderRadius: "14px", objectFit: "cover", flexShrink: 0, border: "1px solid rgba(255,255,255,0.07)" }}
            />
          ) : (
            <div style={{
              width: "48px", height: "48px", borderRadius: "14px",
              background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px", flexShrink: 0,
            }}>🍽️</div>
          )}
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ color: "white", fontWeight: "700", fontSize: "15px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {item.menu?.name || "Menu"}
            </div>
            <div style={{ color: "#475569", fontSize: "12px", marginTop: "3px" }}>
              Order #{item.id} &nbsp;·&nbsp; {formatTanggal(item.created_at)}
            </div>
          </div>
          <span style={{
            padding: "4px 12px", borderRadius: "20px",
            background: "rgba(52,211,153,0.1)",
            border: "1px solid rgba(52,211,153,0.25)",
            color: "#34d399", fontSize: "11px", fontWeight: "700",
            textTransform: "uppercase", letterSpacing: "0.5px",
            flexShrink: 0,
          }}>
            Selesai
          </span>
        </div>

        <button
          onClick={() => onReview(item)}
          style={{
            height: "44px", borderRadius: "12px", border: "none",
            background: "linear-gradient(90deg,#059669,#34d399)",
            color: "white", fontSize: "13.5px", fontWeight: "700",
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", gap: "8px",
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          <Star size={15} />
          Beri Rating &amp; Ulasan
        </button>
      </div>
    </div>
  );
}

/* ─────────────────── ULASAN CARD ─────────────────── */

function UlasanCard({ item, onEdit, onDelete }) {
  const ratingColor = item.rating >= 4 ? "#34d399" : item.rating === 3 ? "#fbbf24" : "#ef4444";

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
      <div style={{
        position: "absolute", top: 0, left: "22px", right: "22px",
        height: "2px", borderRadius: "0 0 4px 4px",
        background: `linear-gradient(90deg, ${ratingColor}, transparent)`,
      }} />

      <div style={{
        position: "absolute", top: "-50px", right: "-30px",
        width: "120px", height: "120px", borderRadius: "999px",
        background: `${ratingColor}0f`, filter: "blur(40px)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "14px" }}>
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
              <div style={{ color: "white", fontWeight: "700", fontSize: "15px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {item.pesanan?.menu?.name || "Menu"}
              </div>
              <div style={{ color: "#475569", fontSize: "12px", marginTop: "3px" }}>
                Order #{item.pesanan_id} &nbsp;·&nbsp; {formatTanggal(item.created_at)}
              </div>
            </div>
          </div>

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

        {item.komentar && (
          <p style={{
            color: "#94a3b8", fontSize: "14px", lineHeight: "1.65",
            margin: 0, background: "rgba(0,0,0,0.2)",
            borderRadius: "12px", padding: "12px 14px",
            border: "1px solid rgba(255,255,255,0.05)",
            fontStyle: "italic",
          }}>
            "{item.komentar}"
          </p>
        )}

        {Array.isArray(item.tags) && item.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {item.tags.map((t) => (
              <span key={t} style={{
                padding: "4px 12px", borderRadius: "20px",
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.2)",
                color: "#60a5fa", fontSize: "12px", fontWeight: "600",
              }}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────── STAT CARD (Home.jsx pattern) ─────────────────── */

function StatCard({ icon, title, value, color, accent, bg, border }) {
  return (
    <div className="stat-card" style={{
      background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
      border: `1px solid ${border}`,
      borderRadius: "20px", padding: "24px",
      position: "relative", overflow: "hidden", cursor: "default",
    }}>
      <div style={{
        position: "absolute", top: 0, left: "24px", right: "24px",
        height: "2px", borderRadius: "0 0 4px 4px",
        background: `linear-gradient(90deg, ${accent}, transparent)`,
      }} />
      <div style={{
        position: "absolute", top: "-40px", right: "-40px",
        width: "110px", height: "110px", borderRadius: "999px",
        background: bg, filter: "blur(30px)", pointerEvents: "none",
      }} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "14px",
          background: bg, border: `1px solid ${border}`,
          color,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "20px",
        }}>
          {icon}
        </div>
        <div style={{
          color: "white", fontSize: "26px", fontWeight: "800",
          lineHeight: 1, letterSpacing: "-0.8px", marginBottom: "8px",
        }}>
          {value}
        </div>
        <div style={{ color: "#475569", fontSize: "13px", fontWeight: "500", letterSpacing: "0.01em" }}>
          {title}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── MAIN COMPONENT ─────────────────── */

export default function RiwayatUlasanKlien() {
  useGlobalStyles();

  const [ulasan,        setUlasan]        = useState([]);
  const [pesananSelesai,setPesananSelesai]= useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [ratingFilter,  setRatingFilter]  = useState("Semua");
  const [searchMenu,    setSearchMenu]    = useState("");
  const [reviewTarget,  setReviewTarget]  = useState(null);
  const [editTarget,    setEditTarget]    = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getUlasan = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [resUlasan, resPesanan] = await Promise.all([
        axios.get("/klien/ulasan"),
        axios.get("/klien/pesanan-selesai"),
      ]);
      const rawUlasan = Array.isArray(resUlasan.data) ? resUlasan.data : (resUlasan.data?.data || []);
      const rawPesanan = Array.isArray(resPesanan.data) ? resPesanan.data : (resPesanan.data?.data || []);
      setUlasan([...rawUlasan].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      setPesananSelesai(rawPesanan);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Gagal memuat ulasan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { getUlasan(); }, [getUlasan]);

  const now = new Date();
  const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

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

  const stats = [
    {
      title: "Total Ulasan",
      value: ulasan.length,
      icon: <MessageSquare size={20} />,
      color: "#60a5fa", accent: "#3b82f6",
      bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)",
    },
    {
      title: "Rating Rata-rata",
      value: `${avgRating} / 5`,
      icon: <Star size={20} />,
      color: "#fbbf24", accent: "#f59e0b",
      bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)",
    },
    {
      title: "Ulasan Positif (≥4⭐)",
      value: positiveCount,
      icon: <TrendingUp size={20} />,
      color: "#34d399", accent: "#10b981",
      bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)",
    },
    {
      title: "Menunggu Diulas",
      value: pesananSelesai.length,
      icon: <Activity size={20} />,
      color: "#a78bfa", accent: "#8b5cf6",
      bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)",
    },
  ];

  const handleReviewSaved = async () => {
    setReviewTarget(null);
    await getUlasan();
  };

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
    <div style={{ width: "100%", minHeight: "100vh", background: "#020817" }}>
      <NavbarKlien title="Ulasan Saya" />

      <div className="ruk-root" style={{ padding: "30px" }}>

        {/* ── HERO (pola Home.jsx) ── */}
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
            background: "rgba(59,130,246,0.12)", filter: "blur(90px)", pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "-60px", right: "-40px",
            width: "200px", height: "200px", borderRadius: "999px",
            background: "rgba(139,92,246,0.1)", filter: "blur(70px)", pointerEvents: "none",
          }} />

          <div className="ruk-hero-inner" style={{
            position: "relative", zIndex: 2,
            display: "flex", justifyContent: "space-between",
            alignItems: "center", gap: "32px", flexWrap: "wrap",
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "6px 14px", borderRadius: "999px",
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.22)",
                color: "#60a5fa", fontSize: "12px", fontWeight: "600",
                letterSpacing: "0.04em", textTransform: "uppercase",
                marginBottom: "22px",
              }}>
                <span className="pulse-dot" style={{
                  width: "6px", height: "6px", borderRadius: "999px",
                  background: "#60a5fa", display: "inline-block",
                }} />
                Riwayat Ulasan
              </div>

              <h1 style={{
                margin: 0,
                fontSize: "clamp(28px, 3.5vw, 44px)",
                lineHeight: 1.15, color: "white",
                fontWeight: "800", letterSpacing: "-1.5px", maxWidth: "600px",
              }}>
                Ulasan &amp; Feedback
                <br />
                <span style={{
                  background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  pesanan Anda 🌟
                </span>
              </h1>

              <p style={{
                margin: "16px 0 0", color: "#64748b",
                fontSize: "15px", lineHeight: "1.8", maxWidth: "560px",
              }}>
                Kelola seluruh ulasan yang pernah Anda kirimkan untuk pesanan catering.
                Edit atau hapus kapan saja.
              </p>

              <div style={{
                marginTop: "28px",
                display: "inline-flex", alignItems: "center", gap: "10px",
                padding: "8px 16px", borderRadius: "12px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#94a3b8", fontSize: "13px",
              }}>
                <Activity size={14} color="#60a5fa" />
                <span>{dateStr}</span>
                <span style={{ width: "1px", height: "14px", background: "rgba(255,255,255,0.1)" }} />
                <span style={{ color: "white", fontWeight: "600" }}>{timeStr}</span>
              </div>
            </div>

            {/* Right — rating summary card, gaya Home.jsx hero card */}
            {!loading && ulasan.length > 0 && (
              <div className="ruk-hero-card" style={{
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

                <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ color: "#fbbf24", fontSize: "48px", fontWeight: "800", lineHeight: 1, letterSpacing: "-2px" }}>
                    {avgRating}
                  </div>
                  <div style={{ paddingBottom: "6px" }}>
                    <Stars value={Math.round(Number(avgRating))} size={15} />
                    <div style={{ color: "#475569", fontSize: "12px", marginTop: "4px" }}>
                      dari {ulasan.length} ulasan
                    </div>
                  </div>
                </div>

                {[5, 4, 3, 2, 1].map((r) => {
                  const count = ratingDist[r] || 0;
                  const pct = ulasan.length ? Math.round((count / ulasan.length) * 100) : 0;
                  const barColor = r >= 4 ? "#34d399" : r === 3 ? "#fbbf24" : "#ef4444";
                  return (
                    <div key={r} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                      <span style={{ color: "#475569", fontSize: "11px", width: "10px", textAlign: "right" }}>{r}</span>
                      <FaStar style={{ color: "#fbbf24", fontSize: "10px", flexShrink: 0 }} />
                      <div style={{ flex: 1, height: "6px", borderRadius: "99px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: "99px",
                          width: pct + "%", background: barColor,
                          transition: "width .5s ease",
                        }} />
                      </div>
                      <span style={{ color: "#475569", fontSize: "11px", width: "28px" }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── STATS GRID (pola Home.jsx) ── */}
        {!loading && ulasan.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px", marginBottom: "24px",
          }}>
            {stats.map((item, index) => (
              <StatCard key={index} {...item} />
            ))}
          </div>
        )}

        {/* ── PESANAN SELESAI: BELUM DIULAS ── */}
        {!loading && !error && pesananSelesai.length > 0 && (
          <div style={{
            background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px", padding: "28px",
            marginBottom: "24px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <h2 style={{ margin: 0, color: "white", fontSize: "18px", fontWeight: "700", letterSpacing: "-0.3px" }}>
                  Menu Selesai — Belum Diulas
                </h2>
                <p style={{ margin: "4px 0 0", color: "#475569", fontSize: "13px" }}>
                  Bagikan pengalaman Anda untuk pesanan yang sudah selesai
                </p>
              </div>
              <ChevronRight size={16} color="#334155" />
            </div>

            <div style={gridStyle}>
              {pesananSelesai.map((item) => (
                <PesananSelesaiCard
                  key={item.id}
                  item={item}
                  onReview={setReviewTarget}
                />
              ))}
            </div>
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
          <div style={{ position: "relative", flex: "1 1 220px", maxWidth: "320px" }}>
            <Search size={14} style={{
              position: "absolute", left: "14px", top: "50%",
              transform: "translateY(-50%)", color: "#475569",
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
                color: "white", fontSize: "13px", outline: "none",
                fontFamily: "'Inter', system-ui, sans-serif",
                transition: "border-color .15s",
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(59,130,246,0.4)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.07)"}
            />
          </div>

          <div className="ruk-divider-v" style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />

          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#475569", fontSize: "12px", fontWeight: "600" }}>
            <Filter size={13} />
            Filter
          </div>

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
                    color: active ? "white" : "#94a3b8",
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

        {error && (
          <EmptyState
            icon="⚠️"
            title="Terjadi kesalahan"
            subtitle={error}
            action={{ label: "Coba Lagi", onClick: getUlasan }}
          />
        )}

        {!error && loading && (
          <div style={gridStyle}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

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

        {!error && !loading && filtered.length > 0 && (
          <div style={{
            color: "#475569", fontSize: "13px", marginTop: "24px", textAlign: "center",
            padding: "16px",
            background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
          }}>
            Menampilkan <strong style={{ color: "white" }}>{filtered.length}</strong> dari{" "}
            <strong style={{ color: "white" }}>{ulasan.length}</strong> ulasan
          </div>
        )}
      </div>

      {/* ── MODALS ── */}
      {reviewTarget && (
        <CreateModal
          pesanan={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onSaved={handleReviewSaved}
        />
      )}
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
        borderRadius: "10px", color: "#94a3b8",
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
      color: "#475569", fontSize: "11px", fontWeight: "700",
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
        <div style={{ color: "white", fontWeight: "800", fontSize: "18px", marginBottom: "8px", letterSpacing: "-0.3px" }}>{title}</div>
        <p style={{ color: "#94a3b8", margin: "0 0 26px", fontSize: "14px", lineHeight: "1.7" }}>{subtitle}</p>
        {action && (
          <button
            onClick={action.onClick}
            style={{
              background: "linear-gradient(90deg,#2563eb,#3b82f6)",
              border: "none", borderRadius: "12px", padding: "12px 28px",
              color: "white", fontSize: "14px", fontWeight: "700", cursor: "pointer",
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