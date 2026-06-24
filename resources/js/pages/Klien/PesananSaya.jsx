// resources/js/pages/Klien/PesananSaya.jsx

import React, { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import NavbarKlien from "../../components/NavbarKlien";

/* ─────────────────── GLOBAL CSS RESET ─────────────────── */

const GLOBAL_RESET_ID = "pesanan-saya-global-reset";
const GLOBAL_RESET_CSS = `
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #071028 !important;
    overflow-x: hidden !important;
    width: 100% !important;
  }
  #app, #root, body > div {
    margin: 0 !important;
    padding: 0 !important;
    max-width: none !important;
    width: 100% !important;
  }
  * { box-sizing: border-box; }

  .ps-row:hover { background: rgba(255,255,255,0.025) !important; }

  .ps-filter-btn { transition: all 0.15s; }
  .ps-filter-btn:hover { border-color: rgba(255,255,255,0.2) !important; }

  .ps-search-input:focus { border-color: rgba(99,130,246,0.5) !important; }

  @keyframes ps-shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }

  @keyframes ps-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .ps-skeleton {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.04) 25%,
      rgba(255,255,255,0.08) 50%,
      rgba(255,255,255,0.04) 75%
    );
    background-size: 600px 100%;
    animation: ps-shimmer 1.5s infinite linear;
    border-radius: 8px;
  }

  /* Hide scrollbar tapi tetap bisa scroll */
  .ps-scroll { scrollbar-width: none; -ms-overflow-style: none; }
  .ps-scroll::-webkit-scrollbar { display: none; }
`;

function useGlobalReset() {
  useEffect(() => {
    let tag = document.getElementById(GLOBAL_RESET_ID);
    const created = !tag;
    if (!tag) {
      tag = document.createElement("style");
      tag.id = GLOBAL_RESET_ID;
      document.head.appendChild(tag);
    }
    tag.innerHTML = GLOBAL_RESET_CSS;
    return () => {
      if (created && tag?.parentNode) tag.parentNode.removeChild(tag);
    };
  }, []);
}

/* ─────────────────── CONSTANTS ─────────────────── */

const FILTERS = ["Semua", "Pending", "Diproses", "Dikirim", "Selesai", "Dibatalkan"];

const STATUS_CFG = {
  Pending:    { bg: "rgba(251,146,60,0.12)",  color: "#fb923c", dot: "#fb923c",  label: "Pending"    },
  Diproses:   { bg: "rgba(96,165,250,0.12)",  color: "#60a5fa", dot: "#60a5fa",  label: "Diproses"   },
  Dikirim:    { bg: "rgba(129,140,248,0.12)", color: "#818cf8", dot: "#818cf8",  label: "Dikirim"    },
  Selesai:    { bg: "rgba(52,211,153,0.12)",  color: "#34d399", dot: "#34d399",  label: "Selesai"    },
  Dibatalkan: { bg: "rgba(248,113,113,0.12)", color: "#f87171", dot: "#f87171",  label: "Dibatalkan" },
};

const C = {
  bg:      "#071028",
  card:    "#0f1929",
  cardAlt: "#111827",
  border:  "rgba(255,255,255,0.06)",
  white:   "#ffffff",
  muted:   "#94a3b8",
  dim:     "#475569",
  blue:    "#2563eb",
  blueL:   "#3b82f6",
  blueGrad:"linear-gradient(90deg,#2563eb,#3b82f6)",
  green:   "#34d399",
  amber:   "#f59e0b",
};

/* ─────────────────── HELPERS ─────────────────── */

const getStatusMeta = (status) =>
  STATUS_CFG[status] || { bg: "rgba(148,163,184,0.1)", color: "#94a3b8", dot: "#94a3b8", label: status || "—" };

const formatRupiah = (v) =>
  "Rp " + Number(v || 0).toLocaleString("id-ID");

const formatTanggal = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString("id-ID", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return d; }
};

/* ─────────────────── SKELETON ─────────────────── */

function SkeletonRow() {
  const cell = (w) => (
    <td style={{ padding: "18px 20px" }}>
      <div className="ps-skeleton" style={{ height: "16px", width: w }} />
    </td>
  );
  return (
    <tr style={{ borderBottom: `1px solid ${C.border}` }}>
      {cell("80px")}
      {cell("110px")}
      <td style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="ps-skeleton" style={{ width: "42px", height: "42px", borderRadius: "10px", flexShrink: 0 }} />
          <div>
            <div className="ps-skeleton" style={{ height: "14px", width: "120px", marginBottom: "6px" }} />
            <div className="ps-skeleton" style={{ height: "11px", width: "60px" }} />
          </div>
        </div>
      </td>
      {cell("70px")}
      {cell("90px")}
      {cell("80px")}
      {cell("110px")}
    </tr>
  );
}

/* ─────────────────── STAT CARD ─────────────────── */

function StatCard({ label, value, accent }) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: "18px",
        padding: "18px 22px",
        minWidth: "140px",
      }}
    >
      <div style={{ color: C.dim, fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px" }}>
        {label}
      </div>
      <div style={{ color: accent || C.white, fontSize: "26px", fontWeight: "800", marginTop: "6px" }}>
        {value}
      </div>
    </div>
  );
}

/* ─────────────────── DETAIL MODAL ─────────────────── */

function DetailModal({ item, onClose }) {
  if (!item) return null;
  const meta = getStatusMeta(item.status);

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
      <div
        onClick={(e) => e.stopPropagation()}
        className="ps-scroll"
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: "24px",
          padding: "28px",
          width: "100%", maxWidth: "500px",
          maxHeight: "90vh", overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "22px" }}>
          <div>
            <div style={{ color: C.white, fontSize: "19px", fontWeight: "700" }}>Detail Pesanan</div>
            <div style={{ color: C.muted, fontSize: "13px", marginTop: "3px" }}>Order #{item.id}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.06)", border: "none",
              borderRadius: "10px", color: C.muted,
              width: "36px", height: "36px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: "18px", flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Status Badge */}
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: meta.bg, color: meta.color,
            padding: "7px 14px", borderRadius: "10px",
            fontSize: "13px", fontWeight: "700", marginBottom: "22px",
          }}
        >
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: meta.dot, display: "inline-block" }} />
          {meta.label}
        </div>

        {/* Menu Info */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: "14px",
            background: "#0B1220", borderRadius: "14px",
            padding: "14px 16px", border: `1px solid ${C.border}`,
            marginBottom: "20px",
          }}
        >
          {item.menu?.image_url && (
            <img
              src={item.menu.image_url}
              alt={item.menu?.name}
              style={{ width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover", flexShrink: 0 }}
            />
          )}
          <div>
            <div style={{ color: C.white, fontWeight: "700", fontSize: "16px" }}>
              {item.menu?.name || "Menu"}
            </div>
            <div style={{ color: C.muted, fontSize: "13px", marginTop: "3px" }}>
              {item.menu?.category || ""}
            </div>
          </div>
        </div>

        {/* Detail Rows */}
        {[
          { label: "Tanggal Pesan",  value: formatTanggal(item.created_at) },
          { label: "Jumlah",         value: `${item.quantity || item.qty || 1} Porsi` },
          { label: "Harga Satuan",   value: formatRupiah(item.menu?.price || item.price_per_item) },
          { label: "Total Harga",    value: formatRupiah(item.total_price || item.total), accent: C.green },
          { label: "Alamat Kirim",   value: item.delivery_address || item.address || "—" },
          { label: "Tanggal Kirim",  value: formatTanggal(item.delivery_date) },
        ].map(({ label, value, accent }) => (
          <div
            key={label}
            style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "flex-start", gap: "16px",
              padding: "12px 0",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <span style={{ color: C.muted, fontSize: "14px", flexShrink: 0 }}>{label}</span>
            <span style={{ color: accent || C.white, fontSize: "14px", fontWeight: "600", textAlign: "right" }}>{value}</span>
          </div>
        ))}

        {/* Catatan */}
        {item.notes && (
          <div style={{ marginTop: "16px" }}>
            <div style={{ color: C.dim, fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>
              Catatan
            </div>
            <div
              style={{
                background: "#0B1220", borderRadius: "12px",
                padding: "12px 14px", border: `1px solid ${C.border}`,
                color: C.white, fontSize: "14px", lineHeight: "1.6",
              }}
            >
              {item.notes}
            </div>
          </div>
        )}

        {/* Bukti Pembayaran */}
        {item.payment_proof_url && (
          <div style={{ marginTop: "16px" }}>
            <div style={{ color: C.dim, fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>
              Bukti Pembayaran
            </div>
            <img
              src={item.payment_proof_url}
              alt="Bukti Pembayaran"
              style={{ width: "100%", borderRadius: "12px", border: `1px solid ${C.border}` }}
            />
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: "24px", width: "100%", height: "48px",
            borderRadius: "12px", border: `1px solid ${C.border}`,
            background: "transparent", color: C.muted,
            fontSize: "14px", fontWeight: "700", cursor: "pointer",
          }}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

/* ─────────────────── MAIN COMPONENT ─────────────────── */

export default function PesananSaya() {
  useGlobalReset();

  /* ── State ── */
  const [pesanan, setPesanan]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [filter, setFilter]           = useState("Semua");
  const [search, setSearch]           = useState("");
  const [detailItem, setDetailItem]   = useState(null);

  /* ── Fetch ── */
  const getPesanan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/klien/orders");
      const raw = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      const sorted = [...raw].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPesanan(sorted);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Gagal memuat data pesanan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { getPesanan(); }, [getPesanan]);

  /* ── Derived Data ── */
  const countStatus = useCallback(
    (s) => pesanan.filter((p) => p.status === s).length,
    [pesanan]
  );

  const filtered = useMemo(() => {
    let list = filter === "Semua" ? pesanan : pesanan.filter((p) => p.status === filter);
    const kw = search.trim().toLowerCase();
    if (kw) {
      list = list.filter((p) => {
        const menu  = (p.menu?.name || "").toLowerCase();
        const id    = String(p.id || "");
        const notes = (p.notes || "").toLowerCase();
        const addr  = (p.delivery_address || p.address || "").toLowerCase();
        return menu.includes(kw) || id.includes(kw) || notes.includes(kw) || addr.includes(kw);
      });
    }
    return list;
  }, [pesanan, filter, search]);

  const namaKlien = useMemo(() => {
    const found = pesanan.find((p) => p?.user?.name);
    return found?.user?.name || null;
  }, [pesanan]);

  const totalBelanja = useMemo(
    () => pesanan.filter((p) => p.status === "Selesai")
              .reduce((acc, p) => acc + Number(p.total_price || p.total || 0), 0),
    [pesanan]
  );

  /* ── Render ── */
  return (
    <div style={{ minHeight: "100vh", width: "100%", background: C.bg, overflowX: "hidden" }}>
      <NavbarKlien title="Pesanan Saya" />

      <div style={{ padding: "32px clamp(20px,4vw,48px)", width: "100%", boxSizing: "border-box" }}>

        {/* ── PAGE HEADER ── */}
        <div
          style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", flexWrap: "wrap",
            gap: "20px", marginBottom: "28px",
          }}
        >
          <div>
            <h1 style={{ color: C.white, fontSize: "34px", fontWeight: "800", margin: 0, letterSpacing: "-0.02em" }}>
              {namaKlien ? `Halo, ${namaKlien} 👋` : "Pesanan Saya"}
            </h1>
            <p style={{ color: C.muted, marginTop: "8px", fontSize: "15px" }}>
              Kelola semua pesanan catering Anda di sini
            </p>
          </div>

          {/* Search */}
          <div style={{ position: "relative", width: "280px" }}>
            <span style={{
              position: "absolute", left: "14px", top: "50%",
              transform: "translateY(-50%)", color: C.dim,
              fontSize: "15px", pointerEvents: "none",
            }}>🔍</span>
            <input
              className="ps-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari menu, ID, catatan..."
              style={{
                width: "100%", height: "48px",
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: "14px", padding: "0 16px 0 40px",
                color: C.white, fontSize: "14px", outline: "none",
                transition: "border-color 0.15s",
              }}
            />
          </div>
        </div>

        {/* ── STAT CARDS (hanya tampil jika ada data) ── */}
        {!loading && pesanan.length > 0 && (
          <div
            style={{
              display: "flex", gap: "14px", flexWrap: "wrap",
              marginBottom: "28px",
            }}
          >
            <StatCard label="Total Pesanan"   value={`${pesanan.length}`}                         />
            <StatCard label="Selesai"         value={`${countStatus("Selesai")}`}   accent={C.green}  />
            <StatCard label="Diproses"        value={`${countStatus("Diproses")}`}  accent="#60a5fa"  />
            <StatCard label="Total Belanja"   value={formatRupiah(totalBelanja)}    accent={C.green}  />
          </div>
        )}

        {/* ── FILTER TABS ── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
          {FILTERS.map((f) => {
            const active = filter === f;
            const count  = f === "Semua" ? pesanan.length : countStatus(f);
            return (
              <button
                key={f}
                className="ps-filter-btn"
                onClick={() => setFilter(f)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "9px 16px",
                  borderRadius: "999px",
                  border: `1px solid ${active ? "transparent" : C.border}`,
                  background: active ? C.blueGrad : "transparent",
                  color: active ? C.white : C.muted,
                  fontSize: "13px", fontWeight: "600",
                  cursor: "pointer", whiteSpace: "nowrap",
                }}
              >
                {f}
                <span
                  style={{
                    fontSize: "11px", padding: "2px 7px",
                    borderRadius: "999px",
                    background: active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                    color: active ? C.white : C.muted,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── CONTENT ── */}

        {/* Error */}
        {error && !loading && (
          <div
            style={{
              background: C.card, border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: "20px", padding: "48px 32px", textAlign: "center",
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</div>
            <div style={{ color: "#f87171", fontWeight: "700", fontSize: "17px", marginBottom: "8px" }}>
              Terjadi Kesalahan
            </div>
            <p style={{ color: C.muted, marginBottom: "24px" }}>{error}</p>
            <button
              onClick={getPesanan}
              style={{
                background: C.blueGrad, border: "none",
                borderRadius: "12px", padding: "12px 28px",
                color: C.white, fontSize: "14px", fontWeight: "700", cursor: "pointer",
              }}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Table */}
        {!error && (
          <div
            style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: "20px", overflow: "hidden",
            }}
          >
            <div style={{ overflowX: "auto" }} className="ps-scroll">
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {["Order ID", "Tanggal", "Menu", "Jumlah", "Total", "Status", "Aksi"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "14px 20px",
                          color: C.muted, fontSize: "11px", fontWeight: "700",
                          textTransform: "uppercase", letterSpacing: "0.8px",
                          textAlign: "left", whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {/* Skeleton Rows */}
                  {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

                  {/* Empty State */}
                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: "60px 20px", textAlign: "center" }}>
                        <div style={{ fontSize: "38px", marginBottom: "14px" }}>🍱</div>
                        <div style={{ color: C.white, fontWeight: "700", fontSize: "17px", marginBottom: "6px" }}>
                          {pesanan.length === 0 ? "Belum ada pesanan" : "Tidak ada pesanan yang cocok"}
                        </div>
                        <p style={{ color: C.muted, margin: 0 }}>
                          {pesanan.length === 0
                            ? "Pesanan catering Anda akan tampil di sini setelah Anda memesan."
                            : "Coba ubah filter atau kata kunci pencarian."}
                        </p>
                      </td>
                    </tr>
                  )}

                  {/* Data Rows */}
                  {!loading && filtered.map((item, idx) => {
                    const meta    = getStatusMeta(item.status);
                    const isLast  = idx === filtered.length - 1;

                    return (
                      <tr
                        key={item.id}
                        className="ps-row"
                        style={{
                          borderBottom: isLast ? "none" : `1px solid ${C.border}`,
                          cursor: "default",
                        }}
                      >
                        {/* Order ID */}
                        <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                          <span style={{ color: "#60a5fa", fontWeight: "600", fontSize: "13px" }}>
                            #{item.id}
                          </span>
                        </td>

                        {/* Tanggal */}
                        <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                          <div style={{ color: C.white, fontSize: "13px" }}>
                            {new Date(item.created_at).toLocaleDateString("id-ID", {
                              day: "2-digit", month: "short", year: "numeric",
                            })}
                          </div>
                          <div style={{ color: C.muted, fontSize: "11px", marginTop: "2px" }}>
                            {new Date(item.created_at).toLocaleTimeString("id-ID", {
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </div>
                        </td>

                        {/* Menu */}
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            {item.menu?.image_url ? (
                              <img
                                src={item.menu.image_url}
                                alt={item.menu?.name}
                                style={{
                                  width: "42px", height: "42px",
                                  borderRadius: "10px", objectFit: "cover", flexShrink: 0,
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "42px", height: "42px",
                                  borderRadius: "10px", background: "rgba(255,255,255,0.06)",
                                  display: "flex", alignItems: "center",
                                  justifyContent: "center", fontSize: "18px", flexShrink: 0,
                                }}
                              >
                                🍽️
                              </div>
                            )}
                            <div>
                              <div style={{ color: C.white, fontSize: "14px", fontWeight: "600" }}>
                                {item.menu?.name || "Menu"}
                              </div>
                              {item.menu?.category && (
                                <div style={{ color: C.muted, fontSize: "11px", marginTop: "2px" }}>
                                  {item.menu.category}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Jumlah */}
                        <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                          <span style={{ color: C.white, fontSize: "14px" }}>
                            {item.quantity || item.qty || 1} Porsi
                          </span>
                        </td>

                        {/* Total */}
                        <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                          <span style={{ color: C.green, fontSize: "14px", fontWeight: "700" }}>
                            {formatRupiah(item.total_price || item.total)}
                          </span>
                        </td>

                        {/* Status */}
                        <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                          <span
                            style={{
                              display: "inline-flex", alignItems: "center", gap: "6px",
                              background: meta.bg, color: meta.color,
                              padding: "5px 12px", borderRadius: "8px",
                              fontSize: "12px", fontWeight: "700",
                            }}
                          >
                            <span style={{
                              width: "6px", height: "6px",
                              borderRadius: "50%", background: meta.dot,
                              display: "inline-block",
                            }} />
                            {meta.label}
                          </span>
                        </td>

                        {/* Aksi */}
                        <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                          <button
                            onClick={() => setDetailItem(item)}
                            style={{
                              padding: "8px 16px",
                              borderRadius: "10px",
                              border: `1px solid ${C.border}`,
                              background: "transparent",
                              color: "#60a5fa",
                              fontSize: "13px", fontWeight: "600",
                              cursor: "pointer",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(96,165,250,0.08)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                          >
                            Lihat Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer Info */}
            {!loading && filtered.length > 0 && (
              <div
                style={{
                  padding: "14px 22px",
                  borderTop: `1px solid ${C.border}`,
                  color: C.muted, fontSize: "13px",
                }}
              >
                Menampilkan <strong style={{ color: C.white }}>{filtered.length}</strong> dari{" "}
                <strong style={{ color: C.white }}>{pesanan.length}</strong> pesanan
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── DETAIL MODAL ── */}
      {detailItem && (
        <DetailModal item={detailItem} onClose={() => setDetailItem(null)} />
      )}
    </div>
  );
}