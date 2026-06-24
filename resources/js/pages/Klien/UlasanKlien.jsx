// resources/js/pages/Klien/RiwayatUlasanKlien.jsx

import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import NavbarKlien from "../../components/NavbarKlien";
import { FaStar, FaRegStar, FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";

/* ─────────────────── GLOBAL RESET ─────────────────── */

const RESET_ID  = "riwayat-ulasan-klien-reset";
const RESET_CSS = `
  html, body {
    margin: 0 !important; padding: 0 !important;
    background: #071028 !important;
    overflow-x: hidden !important; width: 100% !important;
  }
  #app, #root, body > div { margin:0!important; padding:0!important; max-width:none!important; width:100%!important; }
  * { box-sizing: border-box; }

  .ruk-card { transition: border-color .18s, box-shadow .18s; }
  .ruk-card:hover { border-color: rgba(255,255,255,0.12)!important; box-shadow: 0 4px 24px rgba(0,0,0,0.3)!important; }

  .ruk-btn-icon { transition: background .15s, color .15s; }
  .ruk-btn-icon:hover { background: rgba(255,255,255,0.1)!important; }

  .ruk-tag-active { transition: all .15s; }

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

  @keyframes ruk-fadein { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .ruk-fadein { animation: ruk-fadein .25s ease both; }
`;

function useGlobalReset() {
  useEffect(() => {
    let tag = document.getElementById(RESET_ID);
    const created = !tag;
    if (!tag) { tag = document.createElement("style"); tag.id = RESET_ID; document.head.appendChild(tag); }
    tag.innerHTML = RESET_CSS;
    return () => { if (created && tag?.parentNode) tag.parentNode.removeChild(tag); };
  }, []);
}

/* ─────────────────── CONSTANTS ─────────────────── */

const C = {
  bg:       "#071028",
  card:     "#0f1929",
  cardAlt:  "#111827",
  input:    "#0a1120",
  border:   "rgba(255,255,255,0.07)",
  white:    "#ffffff",
  muted:    "#94a3b8",
  dim:      "#475569",
  amber:    "#f59e0b",
  blue:     "#2563eb",
  blueL:    "#3b82f6",
  blueGrad: "linear-gradient(90deg,#2563eb,#3b82f6)",
  red:      "#ef4444",
  green:    "#34d399",
};

const RATING_FILTERS = ["Semua", "5 ⭐", "4 ⭐", "3 ⭐", "2 ⭐", "1 ⭐"];

const TAGS_AVAILABLE = [
  "Enak", "Porsi pas", "Pengiriman cepat",
  "Kemasan rapi", "Kurang hangat", "Pelayanan ramah", "Lainnya",
];

/* ─────────────────── HELPERS ─────────────────── */

const formatTanggal = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
};

const formatRupiah = (v) => "Rp " + Number(v || 0).toLocaleString("id-ID");

/* ─────────────────── STAR DISPLAY ─────────────────── */

function Stars({ value, size = 16, interactive = false, hoverVal = 0, onHover, onClick }) {
  return (
    <span style={{ display: "inline-flex", gap: "4px" }}>
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
              color: filled ? C.amber : "rgba(255,255,255,0.18)",
              cursor: interactive ? "pointer" : "default",
              transition: "color .12s",
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
    <div style={{ background: C.card, borderRadius: "20px", padding: "24px", border: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", gap: "14px", marginBottom: "18px" }}>
        <div className="ruk-skeleton" style={{ width: "52px", height: "52px", borderRadius: "12px", flexShrink: 0 }} />
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
  const [rating,       setRating]       = useState(ulasan.rating || 0);
  const [hoverRating,  setHoverRating]  = useState(0);
  const [komentar,     setKomentar]     = useState(ulasan.komentar || "");
  const [tags,         setTags]         = useState(ulasan.tags || []);
  const [loading,      setLoading]      = useState(false);

  const toggleTag = (t) =>
    setTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const handleSave = async () => {
    if (!rating) { alert("Rating wajib diisi."); return; }
    setLoading(true);
    try {
      await axios.put(`/api/klien/ulasan/${ulasan.id}`, { rating, komentar, tags });
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
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: "24px", padding: "28px",
          width: "100%", maxWidth: "500px",
          maxHeight: "90vh", overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
          <div>
            <div style={{ color: C.white, fontSize: "19px", fontWeight: "700" }}>Edit Ulasan</div>
            <div style={{ color: C.muted, fontSize: "13px", marginTop: "3px" }}>
              {ulasan.pesanan?.menu?.name || "Menu"}
            </div>
          </div>
          <CloseBtn onClick={onClose} />
        </div>

        {/* Rating */}
        <FieldLabel text="Rating" />
        <Stars
          value={rating} size={34} interactive
          hoverVal={hoverRating}
          onHover={setHoverRating}
          onClick={setRating}
        />

        {/* Komentar */}
        <FieldLabel text="Komentar (Opsional)" />
        <textarea
          rows={4}
          value={komentar}
          onChange={(e) => setKomentar(e.target.value)}
          placeholder="Ceritakan pengalaman Anda..."
          maxLength={300}
          style={textareaStyle}
        />
        <div style={{ textAlign: "right", color: C.dim, fontSize: "12px", marginTop: "4px" }}>
          {komentar.length}/300
        </div>

        {/* Tags */}
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

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px", marginTop: "26px" }}>
          <button onClick={onClose} style={cancelBtnStyle}>Batal</button>
          <button
            onClick={handleSave}
            disabled={loading || !rating}
            style={{
              ...primaryBtnStyle,
              opacity: loading || !rating ? 0.6 : 1,
              cursor: loading || !rating ? "not-allowed" : "pointer",
            }}
          >
            <FaCheck style={{ fontSize: "13px" }} />
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
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
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: "24px", padding: "32px",
          width: "100%", maxWidth: "400px", textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: "42px", marginBottom: "16px" }}>🗑️</div>
        <div style={{ color: C.white, fontSize: "19px", fontWeight: "700", marginBottom: "10px" }}>
          Hapus Ulasan?
        </div>
        <p style={{ color: C.muted, fontSize: "14px", lineHeight: "1.6", marginBottom: "28px" }}>
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
            }}
          >
            <FaTrash style={{ fontSize: "13px" }} />
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </Overlay>
  );
}

/* ─────────────────── ULASAN CARD ─────────────────── */

function UlasanCard({ item, onEdit, onDelete }) {
  return (
    <div
      className="ruk-card ruk-fadein"
      style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: "20px", padding: "22px",
        display: "flex", flexDirection: "column", gap: "14px",
      }}
    >
      {/* Top: menu info + aksi */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
          {item.pesanan?.menu?.image_url ? (
            <img
              src={item.pesanan.menu.image_url}
              alt={item.pesanan.menu?.name}
              style={{ width: "50px", height: "50px", borderRadius: "12px", objectFit: "cover", flexShrink: 0 }}
            />
          ) : (
            <div style={{
              width: "50px", height: "50px", borderRadius: "12px",
              background: "rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px", flexShrink: 0,
            }}>🍽️</div>
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ color: C.white, fontWeight: "700", fontSize: "15px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {item.pesanan?.menu?.name || "Menu"}
            </div>
            <div style={{ color: C.muted, fontSize: "12px", marginTop: "2px" }}>
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
            style={iconBtnStyle("#60a5fa")}
          ><FaEdit /></button>
          <button
            className="ruk-btn-icon"
            onClick={() => onDelete(item)}
            title="Hapus ulasan"
            style={iconBtnStyle("#f87171")}
          ><FaTrash /></button>
        </div>
      </div>

      {/* Rating */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Stars value={item.rating} size={18} />
        <span style={{ color: C.amber, fontWeight: "700", fontSize: "14px" }}>
          {item.rating}/5
        </span>
      </div>

      {/* Komentar */}
      {item.komentar && (
        <p style={{
          color: C.muted, fontSize: "14px", lineHeight: "1.65",
          margin: 0, background: C.input,
          borderRadius: "12px", padding: "12px 14px",
          border: `1px solid ${C.border}`,
        }}>
          "{item.komentar}"
        </p>
      )}

      {/* Tags */}
      {Array.isArray(item.tags) && item.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {item.tags.map((t) => (
            <span key={t} style={tagChipStyle(true, true)}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────── MAIN COMPONENT ─────────────────── */

export default function RiwayatUlasanKlien() {
  useGlobalReset();

  /* ── State ── */
  const [ulasan,        setUlasan]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [ratingFilter,  setRatingFilter]  = useState("Semua");
  const [searchMenu,    setSearchMenu]    = useState("");
  const [editTarget,    setEditTarget]    = useState(null);   // item yang diedit
  const [deleteTarget,  setDeleteTarget]  = useState(null);  // item yang dihapus
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ── Fetch ── */
  const getUlasan = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await axios.get("/api/klien/ulasan");
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

  /* ── Derived ── */
  const avgRating = useMemo(() => {
    if (!ulasan.length) return 0;
    return (ulasan.reduce((s, u) => s + (u.rating || 0), 0) / ulasan.length).toFixed(1);
  }, [ulasan]);

  const ratingDist = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ulasan.forEach((u) => { if (dist[u.rating] !== undefined) dist[u.rating]++; });
    return dist;
  }, [ulasan]);

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

  /* ── Handlers ── */
  const handleEditSaved = async () => {
    setEditTarget(null);
    await getUlasan();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/klien/ulasan/${deleteTarget.id}`);
      setDeleteTarget(null);
      await getUlasan();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus ulasan.");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ── Render ── */
  return (
    <div style={{ minHeight: "100vh", width: "100%", background: C.bg, overflowX: "hidden" }}>
      <NavbarKlien title="Ulasan Saya" />

      <div style={{ padding: "32px clamp(20px,4vw,48px)", width: "100%", boxSizing: "border-box" }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ color: C.white, fontSize: "34px", fontWeight: "800", margin: 0, letterSpacing: "-0.02em" }}>
            Riwayat Ulasan
          </h1>
          <p style={{ color: C.muted, marginTop: "8px", fontSize: "15px" }}>
            Semua ulasan yang pernah Anda kirimkan
          </p>
        </div>

        {/* ── SUMMARY BAR ── */}
        {!loading && ulasan.length > 0 && (
          <div
            style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: "20px", padding: "22px 26px",
              display: "flex", alignItems: "center",
              gap: "32px", flexWrap: "wrap",
              marginBottom: "24px",
            }}
          >
            {/* Avg */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "80px" }}>
              <div style={{ color: C.amber, fontSize: "44px", fontWeight: "800", lineHeight: 1 }}>
                {avgRating}
              </div>
              <Stars value={Math.round(avgRating)} size={16} />
              <div style={{ color: C.muted, fontSize: "12px", marginTop: "4px" }}>
                {ulasan.length} ulasan
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: "1px", height: "64px", background: C.border, flexShrink: 0 }} />

            {/* Distribution bars */}
            <div style={{ flex: 1, minWidth: "200px" }}>
              {[5, 4, 3, 2, 1].map((r) => {
                const count = ratingDist[r] || 0;
                const pct   = ulasan.length ? Math.round((count / ulasan.length) * 100) : 0;
                return (
                  <div key={r} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={{ color: C.muted, fontSize: "12px", width: "14px", textAlign: "right" }}>{r}</span>
                    <FaStar style={{ color: C.amber, fontSize: "11px", flexShrink: 0 }} />
                    <div style={{ flex: 1, height: "8px", borderRadius: "99px", background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: "99px",
                        width: pct + "%",
                        background: r >= 4 ? C.green : r === 3 ? C.amber : C.red,
                        transition: "width .5s ease",
                      }} />
                    </div>
                    <span style={{ color: C.dim, fontSize: "12px", width: "32px" }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── FILTER + SEARCH ── */}
        <div
          style={{
            display: "flex", gap: "12px", flexWrap: "wrap",
            alignItems: "center", marginBottom: "24px",
          }}
        >
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 220px", maxWidth: "320px" }}>
            <span style={{
              position: "absolute", left: "14px", top: "50%",
              transform: "translateY(-50%)", color: C.dim,
              fontSize: "14px", pointerEvents: "none",
            }}>🔍</span>
            <input
              type="text"
              value={searchMenu}
              onChange={(e) => setSearchMenu(e.target.value)}
              placeholder="Cari nama menu / komentar..."
              style={{
                width: "100%", height: "44px",
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: "12px", padding: "0 14px 0 38px",
                color: C.white, fontSize: "13px", outline: "none",
              }}
            />
          </div>

          {/* Rating Tabs */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {RATING_FILTERS.map((f) => {
              const active = ratingFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setRatingFilter(f)}
                  style={{
                    padding: "8px 14px", borderRadius: "10px",
                    border: `1px solid ${active ? "transparent" : C.border}`,
                    background: active ? C.blueGrad : "transparent",
                    color: active ? C.white : C.muted,
                    fontSize: "13px", fontWeight: "600",
                    cursor: "pointer", whiteSpace: "nowrap",
                    transition: "all .15s",
                  }}
                >
                  {f}
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
          <div style={{ color: C.dim, fontSize: "13px", marginTop: "20px", textAlign: "center" }}>
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
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(6px)",
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
        background: "rgba(255,255,255,0.06)", border: "none",
        borderRadius: "10px", color: C.muted,
        width: "36px", height: "36px",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", fontSize: "17px", flexShrink: 0,
      }}
    >
      <FaTimes />
    </button>
  );
}

function FieldLabel({ text }) {
  return (
    <div style={{
      color: C.muted, fontSize: "11px", fontWeight: "700",
      textTransform: "uppercase", letterSpacing: "0.8px",
      marginTop: "20px", marginBottom: "10px",
    }}>{text}</div>
  );
}

function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: "20px", padding: "64px 32px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: "42px", marginBottom: "14px" }}>{icon}</div>
      <div style={{ color: C.white, fontWeight: "700", fontSize: "18px", marginBottom: "8px" }}>{title}</div>
      <p style={{ color: C.muted, margin: "0 0 24px" }}>{subtitle}</p>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            background: C.blueGrad, border: "none",
            borderRadius: "12px", padding: "12px 28px",
            color: C.white, fontSize: "14px", fontWeight: "700", cursor: "pointer",
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

/* ─────────────────── STYLE OBJECTS ─────────────────── */

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))",
  gap: "18px",
};

const textareaStyle = {
  width: "100%", borderRadius: "14px",
  border: `1px solid ${C.border}`,
  background: C.input, color: C.white,
  padding: "12px 14px", fontSize: "14px",
  outline: "none", resize: "none",
  lineHeight: "1.55",
};

const tagChipStyle = (active, small = false) => ({
  padding: small ? "5px 11px" : "7px 14px",
  borderRadius: "20px",
  border: active ? "none" : `1px solid ${C.border}`,
  background: active ? "linear-gradient(90deg,#2563eb,#3b82f6)" : "transparent",
  color: active ? C.white : C.muted,
  fontSize: small ? "12px" : "13px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all .15s",
});

const iconBtnStyle = (color) => ({
  width: "34px", height: "34px",
  borderRadius: "9px",
  border: "none",
  background: "rgba(255,255,255,0.05)",
  color,
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", fontSize: "14px",
});

const cancelBtnStyle = {
  flex: 1, height: "48px",
  borderRadius: "12px",
  border: `1px solid ${C.border}`,
  background: "transparent",
  color: C.muted,
  fontSize: "14px", fontWeight: "700",
  cursor: "pointer",
};

const primaryBtnStyle = {
  flex: 1, height: "48px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(90deg,#2563eb,#3b82f6)",
  color: C.white,
  fontSize: "14px", fontWeight: "700",
  cursor: "pointer",
  display: "flex", alignItems: "center",
  justifyContent: "center", gap: "8px",
};