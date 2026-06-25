import { ShoppingCart, Clock, CheckCircle2, XCircle, ChefHat, Truck, Bell, X, MapPin } from "lucide-react";
import OwnerLayout from "../../layouts/OwnerLayout";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

// ─── Global font ─────────────────────────────────────────────────────────────
const FONT = "'Arial', 'Helvetica Neue', Helvetica, sans-serif";

// ─── Status constants (SESUAI ENUM DATABASE) ─────────────────────────────────
// pending -> confirmed -> preparing -> dispatched -> on_delivery -> delivered
// (atau -> cancelled dari pending/confirmed)
const STATUS = {
  PENDING:     "pending",
  CONFIRMED:   "confirmed",
  PREPARING:   "preparing",
  DISPATCHED:  "dispatched",
  ON_DELIVERY: "on_delivery",
  DELIVERED:   "delivered",
  CANCELLED:   "cancelled",
};

function statusColor(s) {
  switch (s?.toLowerCase()) {
    case STATUS.CONFIRMED:   return "#22c55e";
    case STATUS.PREPARING:   return "#3b82f6";
    case STATUS.DISPATCHED:  return "#a855f7";
    case STATUS.ON_DELIVERY: return "#06b6d4";
    case STATUS.DELIVERED:   return "#10b981";
    case STATUS.CANCELLED:   return "#ef4444";
    default:                 return "#f59e0b"; // pending
  }
}

function statusLabel(s) {
  switch (s?.toLowerCase()) {
    case STATUS.PENDING:     return "Menunggu";
    case STATUS.CONFIRMED:   return "Disetujui";
    case STATUS.PREPARING:   return "Diproses";
    case STATUS.DISPATCHED:  return "Dikirim";
    case STATUS.ON_DELIVERY: return "Dalam Perjalanan";
    case STATUS.DELIVERED:   return "Selesai";
    case STATUS.CANCELLED:   return "Ditolak";
    default:                 return s || "-";
  }
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toasts, onDismiss }) {
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 9999,
      display: "flex", flexDirection: "column", gap: 10,
      fontFamily: FONT,
    }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: "linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.98))",
            border: `1px solid ${t.color || "rgba(99,102,241,0.4)"}`,
            borderRadius: 14, padding: "14px 16px",
            minWidth: 300, maxWidth: 360,
            boxShadow: `0 8px 32px rgba(0,0,0,0.4),0 0 0 1px ${t.color || "rgba(99,102,241,0.2)"}`,
            display: "flex", alignItems: "flex-start", gap: 12,
            animation: "slideIn 0.3s ease",
            position: "relative",
          }}
        >
          <div style={{ color: t.color || "#818cf8", marginTop: 2, flexShrink: 0 }}>
            <Bell size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 3 }}>{t.title}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{t.message}</div>
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 0, marginTop: 2 }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { opacity:0; transform:translateX(40px); }
          to   { opacity:1; transform:translateX(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Pilih Kurir Modal (muncul saat klik "Proses") ──────────────────────────
function PilihKurirModal({ order, kurirs, onClose, onConfirm, loading }) {
  const [selected, setSelected] = useState("");

  if (!order) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
        zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: FONT,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(145deg,rgba(15,23,42,0.98),rgba(30,41,59,0.98))",
          border: "1px solid rgba(148,163,184,0.12)",
          borderRadius: 24, padding: "32px 30px",
          minWidth: 360, maxWidth: 420, width: "100%",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ fontSize: 10, color: "#60a5fa", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
          Proses Pesanan #{order.id}
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 18 }}>
          Pilih Kurir Pengantar
        </div>

        {kurirs.length === 0 ? (
          <div style={{
            padding: 16, borderRadius: 12, fontSize: 13, color: "#fca5a5",
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
          }}>
            Belum ada kurir aktif yang terdaftar di catering ini. Tambahkan kurir terlebih dahulu.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 240, overflowY: "auto" }}>
            {kurirs.map((k) => (
              <label
                key={k.id}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 12, cursor: "pointer",
                  background: selected === String(k.id) ? "rgba(59,130,246,0.14)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${selected === String(k.id) ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.06)"}`,
                  transition: "all 0.15s",
                }}
              >
                <input
                  type="radio"
                  name="kurir"
                  value={k.id}
                  checked={selected === String(k.id)}
                  onChange={(e) => setSelected(e.target.value)}
                  style={{ accentColor: "#3b82f6" }}
                />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{k.name}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{k.phone || "-"}</div>
                </div>
              </label>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "11px 0",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 12, color: "#94a3b8", cursor: "pointer",
              fontSize: 14, fontWeight: 600, fontFamily: FONT,
            }}
          >
            Batal
          </button>
          <button
            onClick={() => selected && onConfirm(selected)}
            disabled={!selected || loading}
            style={{
              flex: 1, padding: "11px 0",
              background: selected && !loading ? "linear-gradient(135deg,#3b82f6,#2563eb)" : "rgba(71,85,105,0.22)",
              border: "none", borderRadius: 12,
              color: selected && !loading ? "white" : "#475569",
              cursor: selected && !loading ? "pointer" : "not-allowed",
              fontSize: 14, fontWeight: 700, fontFamily: FONT,
            }}
          >
            {loading ? "Memproses..." : "Konfirmasi"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tracking Modal ───────────────────────────────────────────────────────────
function TrackingModal({ order, onClose }) {
  if (!order) return null;
  const s = order.status?.toLowerCase();

  const steps = [
    {
      key: STATUS.CONFIRMED,
      icon: <CheckCircle2 size={16} />,
      label: "Pesanan Disetujui",
      desc: "Owner telah menyetujui pesananmu.",
    },
    {
      key: STATUS.PREPARING,
      icon: <ChefHat size={16} />,
      label: "Diproses di Dapur",
      desc: order.kurir
        ? `Pesananmu disiapkan. Kurir: ${order.kurir.name}.`
        : "Pesananmu sedang disiapkan oleh tim dapur kami.",
    },
    {
      key: STATUS.DISPATCHED,
      icon: <Truck size={16} />,
      label: "Pesanan Dikirim",
      desc: order.estimasi_menit
        ? `Estimasi tiba: ${order.estimasi_menit} menit dari lokasi catering.`
        : "Pesananmu sedang dalam perjalanan.",
    },
    {
      key: STATUS.ON_DELIVERY,
      icon: <MapPin size={16} />,
      label: "Dalam Perjalanan",
      desc: "Kurir sedang menuju lokasimu. Lihat posisi live di bawah.",
    },
    {
      key: STATUS.DELIVERED,
      icon: <CheckCircle2 size={16} />,
      label: "Pesanan Selesai",
      desc: "Pesanan telah diterima. Selamat menikmati!",
    },
  ];

  const flowOrder = [STATUS.CONFIRMED, STATUS.PREPARING, STATUS.DISPATCHED, STATUS.ON_DELIVERY, STATUS.DELIVERED];
  const currentIdx = flowOrder.indexOf(s);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
        zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: FONT,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(145deg,rgba(15,23,42,0.98),rgba(30,41,59,0.98))",
          border: "1px solid rgba(148,163,184,0.12)",
          borderRadius: 24, padding: "32px 30px",
          minWidth: 360, maxWidth: 440, width: "100%",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, color: "#60a5fa", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
            Live Tracking Pesanan
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "white" }}>
            #{order.id} — {order.customer_name}
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
            {order.menu?.name} × {order.quantity}
          </div>
        </div>

        {/* Steps */}
        <div style={{ position: "relative", paddingLeft: 32 }}>
          <div style={{
            position: "absolute", left: 9, top: 10, bottom: 10,
            width: 2, background: "rgba(255,255,255,0.07)", borderRadius: 2,
          }} />
          {steps.map((step, i) => {
            const done   = i <= currentIdx;
            const active = i === currentIdx;
            return (
              <div key={step.key} style={{ position: "relative", marginBottom: i < steps.length - 1 ? 28 : 0 }}>
                {/* dot */}
                <div style={{
                  position: "absolute", left: -32, top: 3,
                  width: 20, height: 20, borderRadius: "50%",
                  background: done ? (active ? "#3b82f6" : "#16a34a") : "rgba(255,255,255,0.05)",
                  border: `2px solid ${done ? (active ? "#60a5fa" : "#4ade80") : "rgba(255,255,255,0.10)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: done ? "white" : "#334155",
                  boxShadow: active ? "0 0 14px rgba(59,130,246,0.55)" : "none",
                  transition: "all 0.35s ease",
                }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: done ? "white" : "#334155", marginBottom: 4 }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: 12, color: done ? "#94a3b8" : "#1e293b", lineHeight: 1.5 }}>
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cancelled notice */}
        {s === STATUS.CANCELLED && (
          <div style={{
            marginTop: 24, padding: 14,
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 12, color: "#fca5a5", fontSize: 13,
          }}>
            ✕ Pesanan ini telah ditolak oleh owner.
          </div>
        )}

        {/* Estimasi & posisi kurir live jika sedang dikirim/dalam perjalanan */}
        {(s === STATUS.DISPATCHED || s === STATUS.ON_DELIVERY) && (
          <div style={{
            marginTop: 20, padding: "10px 14px",
            background: "rgba(168,85,247,0.10)", border: "1px solid rgba(168,85,247,0.25)",
            borderRadius: 12, color: "#d8b4fe", fontSize: 13, fontWeight: 600,
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Truck size={15} />
              Estimasi tiba: <strong>{order.estimasi_menit ?? "-"} menit</strong>
            </div>
            {order.kurir && (
              <div style={{ fontSize: 12, color: "#c4b5fd" }}>
                Kurir: {order.kurir.name} {order.kurir.phone ? `· ${order.kurir.phone}` : ""}
              </div>
            )}
            {order.last_kurir_lat && order.last_kurir_lng && (
              <div style={{ fontSize: 11, color: "#a78bfa" }}>
                Posisi terakhir: {Number(order.last_kurir_lat).toFixed(5)}, {Number(order.last_kurir_lng).toFixed(5)}
              </div>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: 28, width: "100%", padding: "11px 0",
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 12, color: "#94a3b8", cursor: "pointer",
            fontSize: 14, fontWeight: 600, fontFamily: FONT,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.09)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────
function MetricCard({ title, value = "0", icon, color = "#60a5fa" }) {
  return (
    <div style={{
      background: "linear-gradient(145deg,rgba(15,23,42,0.95),rgba(30,41,59,0.95))",
      border: "1px solid rgba(148,163,184,0.08)",
      borderRadius: 20, padding: "20px 22px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      boxShadow: "0 12px 32px rgba(0,0,0,0.28)",
      fontFamily: FONT,
    }}>
      <div>
        <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 8 }}>
          {title}
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, color: "white", lineHeight: 1 }}>{value}</div>
      </div>
      <div style={{
        width: 52, height: 52, borderRadius: 16,
        background: `${color}18`, border: `1px solid ${color}28`,
        display: "flex", alignItems: "center", justifyContent: "center", color,
      }}>
        {icon}
      </div>
    </div>
  );
}

// ─── Action Button ────────────────────────────────────────────────────────────
function ActionBtn({ label, onClick, color, disabled, loading }) {
  const active = !disabled && !loading;

  const bg =
    !active
      ? "rgba(71,85,105,0.22)"
      : color === "green"  ? "linear-gradient(135deg,#22c55e,#16a34a)"
      : color === "red"    ? "linear-gradient(135deg,#ef4444,#dc2626)"
      : color === "blue"   ? "linear-gradient(135deg,#3b82f6,#2563eb)"
      : color === "purple" ? "linear-gradient(135deg,#a855f7,#7c3aed)"
      : "rgba(71,85,105,0.22)";

  const shadow = !active ? "none"
    : color === "green"  ? "0 4px 14px rgba(34,197,94,0.35)"
    : color === "red"    ? "0 4px 14px rgba(239,68,68,0.35)"
    : color === "blue"   ? "0 4px 14px rgba(59,130,246,0.35)"
    : color === "purple" ? "0 4px 14px rgba(168,85,247,0.35)"
    : "none";

  return (
    <button
      onClick={onClick}
      disabled={!active}
      title={disabled ? "Sudah selesai" : undefined}
      style={{
        background: bg, border: "none",
        color: active ? "#fff" : "#475569",
        padding: "7px 13px", borderRadius: 9,
        cursor: active ? "pointer" : "not-allowed",
        fontWeight: 700, fontSize: 12, boxShadow: shadow,
        transition: "all 0.25s ease", whiteSpace: "nowrap",
        opacity: loading ? 0.65 : 1,
        fontFamily: FONT,
      }}
    >
      {loading ? "···" : label}
    </button>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={{
      minHeight: 320, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", textAlign: "center",
      padding: 24, fontFamily: FONT,
    }}>
      <div style={{
        width: 84, height: 84, borderRadius: 24,
        background: "rgba(59,130,246,0.10)", border: "1px solid rgba(59,130,246,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#60a5fa", marginBottom: 24,
      }}>
        <ShoppingCart size={38} />
      </div>
      <h3 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "white" }}>Belum Ada Pesanan</h3>
      <p style={{ color: "#64748b", marginTop: 8, fontSize: 14 }}>Pesanan masuk akan tampil di sini secara otomatis.</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OrdersOwner() {
  const [orders,        setOrders]        = useState([]);
  const [kurirs,        setKurirs]        = useState([]);
  const [loadingIds,    setLoadingIds]    = useState({});
  const [toasts,        setToasts]        = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [processOrderTarget, setProcessOrderTarget] = useState(null);
  const [processLoading, setProcessLoading] = useState(false);

  // ── fetch orders & kurirs ──
  const getOrders = useCallback(async () => {
    try {
      const res = await axios.get("/owner/orders");
      setOrders(res.data.data ?? []);
    } catch (err) {
      console.error("Fetch orders error:", err);
    }
  }, []);

  const getKurirs = useCallback(async () => {
    try {
      const res = await axios.get("/owner/kurirs");
      setKurirs(res.data.data ?? []);
    } catch (err) {
      console.error("Fetch kurirs error:", err);
    }
  }, []);

  useEffect(() => {
    getOrders();
    getKurirs();
    // Poll setiap 15 detik agar status & posisi kurir sinkron dengan
    // live tracking klien (klien polling di sisi halaman "Pesanan Saya").
    const interval = setInterval(getOrders, 15_000);
    return () => clearInterval(interval);
  }, [getOrders, getKurirs]);

  // ── toast helpers ──
  const pushToast = useCallback((title, message, color) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message, color }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── per-order loading state ──
  const setLoading = (id, val) =>
    setLoadingIds((prev) => ({ ...prev, [id]: val }));

  // ── APPROVE ──
  // pending -> confirmed. Tracking klien otomatis menampilkan step "Disetujui".
  const approveOrder = async (id) => {
    setLoading(id, "approve");
    try {
      await axios.put(`/owner/orders/${id}/approve`);
      pushToast(
        "✅ Pesanan Disetujui",
        `Order #${id} disetujui. Tracking klien sudah berjalan — langkah "Disetujui" aktif.`,
        "#22c55e",
      );
      getOrders();
    } catch (err) {
      pushToast("❌ Gagal", err?.response?.data?.message || "Tidak bisa menyetujui pesanan.", "#ef4444");
    } finally {
      setLoading(id, null);
    }
  };

  // ── REJECT ──
  const rejectOrder = async (id) => {
    setLoading(id, "reject");
    try {
      await axios.put(`/owner/orders/${id}/reject`);
      pushToast("🚫 Pesanan Ditolak", `Order #${id} telah ditolak dan klien sudah diberitahu.`, "#ef4444");
      getOrders();
    } catch (err) {
      pushToast("❌ Gagal", err?.response?.data?.message || "Tidak bisa menolak pesanan.", "#ef4444");
    } finally {
      setLoading(id, null);
    }
  };

  // ── PROCESS (buka modal pilih kurir dulu) ──
  // confirmed -> preparing. Kurir wajib dipilih dari daftar kurir milik owner ini.
  const openProcessModal = (order) => setProcessOrderTarget(order);

  const confirmProcess = async (kurirId) => {
    const order = processOrderTarget;
    if (!order) return;
    setProcessLoading(true);
    try {
      await axios.put(`/owner/orders/${order.id}/process`, { kurir_id: kurirId });
      pushToast(
        "👨‍🍳 Sedang Diproses",
        `Order #${order.id} kini diproses di dapur. Tracking klien diperbarui otomatis.`,
        "#3b82f6",
      );
      setProcessOrderTarget(null);
      getOrders();
    } catch (err) {
      pushToast("❌ Gagal", err?.response?.data?.message || "Tidak bisa memproses pesanan.", "#ef4444");
    } finally {
      setProcessLoading(false);
    }
  };

  // ── SEND ──
  // preparing -> dispatched. Estimasi dikirim ke backend & live tracking klien.
  // Begitu kurir mengirim lokasi pertamanya, backend otomatis menaikkan
  // status menjadi on_delivery — rute hari ini kurir mulai berjalan.
  const sendOrder = async (order) => {
    setLoading(order.id, "send");
    try {
      const estimasi = 15 + Math.floor(Math.random() * 21); // 15–35 menit
      await axios.put(`/owner/orders/${order.id}/send`, { estimasi });
      pushToast(
        "🚚 Pesanan Dikirim",
        `Order #${order.id} sudah dalam perjalanan! Estimasi tiba: ${estimasi} menit.`,
        "#a855f7",
      );
      getOrders();
    } catch (err) {
      pushToast("❌ Gagal", err?.response?.data?.message || "Tidak bisa mengirim pesanan.", "#ef4444");
    } finally {
      setLoading(order.id, null);
    }
  };

  // ── Metrics ──
  const totalOrders     = orders.length;
  const pendingOrders   = orders.filter((o) => o.status?.toLowerCase() === STATUS.PENDING).length;
  const activeOrders    = orders.filter((o) =>
    [STATUS.CONFIRMED, STATUS.PREPARING, STATUS.DISPATCHED, STATUS.ON_DELIVERY, STATUS.DELIVERED].includes(o.status?.toLowerCase())
  ).length;
  const rejectedOrders  = orders.filter((o) => o.status?.toLowerCase() === STATUS.CANCELLED).length;

  return (
    <OwnerLayout>
      <style>{`
        * { font-family: ${FONT}; }
        .order-row:hover td { background: rgba(255,255,255,0.025); }
      `}</style>

      <Toast toasts={toasts} onDismiss={dismissToast} />

      {trackingOrder && (
        <TrackingModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />
      )}

      {processOrderTarget && (
        <PilihKurirModal
          order={processOrderTarget}
          kurirs={kurirs}
          loading={processLoading}
          onClose={() => setProcessOrderTarget(null)}
          onConfirm={confirmProcess}
        />
      )}

      {/* ── Header ── */}
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: "white", letterSpacing: -0.5 }}>
          Pesanan Masuk
        </h1>
        <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 14 }}>
          Kelola dan pantau semua pesanan pelanggan secara real-time.
        </p>
      </div>

      {/* ── Metric Cards ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
        gap: 16, marginBottom: 24,
      }}>
        <MetricCard title="Total Pesanan"    value={totalOrders}    icon={<ShoppingCart size={22} />} color="#60a5fa" />
        <MetricCard title="Menunggu"         value={pendingOrders}  icon={<Clock size={22} />}        color="#f59e0b" />
        <MetricCard title="Aktif / Selesai"  value={activeOrders}   icon={<CheckCircle2 size={22} />} color="#22c55e" />
        <MetricCard title="Ditolak"          value={rejectedOrders} icon={<XCircle size={22} />}      color="#ef4444" />
      </div>

      {/* ── Table Card ── */}
      <div style={{
        background: "linear-gradient(145deg,rgba(15,23,42,0.95),rgba(30,41,59,0.95))",
        border: "1px solid rgba(148,163,184,0.08)",
        borderRadius: 24, padding: "20px 16px", overflowX: "auto",
        boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
      }}>
        {orders.length === 0 ? (
          <EmptyState />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#cbd5e1", minWidth: 1020, fontFamily: FONT }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.09)" }}>
                {["ID", "Pelanggan", "Telepon", "Alamat", "Menu", "Qty", "Total", "Kurir", "Status", "Tracking", "Aksi"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: ["Qty","Total","Status","Tracking","Aksi"].includes(h) ? "center" : "left",
                      padding: "10px 10px 12px",
                      fontSize: 11, color: "#475569", fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: 0.6,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const s            = order.status?.toLowerCase();
                const isPending    = s === STATUS.PENDING;
                const isConfirmed  = s === STATUS.CONFIRMED;
                const isPreparing  = s === STATUS.PREPARING;
                const isDispatched = s === STATUS.DISPATCHED;
                const isOnDelivery = s === STATUS.ON_DELIVERY;
                const isDelivered  = s === STATUS.DELIVERED;
                const isCancelled  = s === STATUS.CANCELLED;
                const busy         = loadingIds[order.id];

                const showApprove  = isPending;
                const showReject   = isPending || isConfirmed;
                // Tombol "Proses" muncul setelah confirmed, abu-abu begitu sudah lewat preparing.
                const showProcess  = isConfirmed || isPreparing || isDispatched || isOnDelivery || isDelivered;
                const processGrey  = isPreparing || isDispatched || isOnDelivery || isDelivered;
                // Tombol "Kirim" muncul setelah preparing, abu-abu begitu sudah dispatched/seterusnya.
                const showSend     = isPreparing || isDispatched || isOnDelivery || isDelivered;
                const sendGrey     = isDispatched || isOnDelivery || isDelivered;

                return (
                  <tr
                    key={order.id}
                    className="order-row"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.055)", transition: "background 0.15s" }}
                  >
                    <td style={{ padding: "12px 10px", fontSize: 13, color: "#64748b" }}>#{order.id}</td>
                    <td style={{ padding: "12px 10px", fontWeight: 700, color: "white" }}>{order.customer_name}</td>
                    <td style={{ padding: "12px 10px", fontSize: 13 }}>{order.phone}</td>
                    <td style={{ padding: "12px 10px", fontSize: 13, maxWidth: 150 }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.address}</div>
                    </td>
                    <td style={{ padding: "12px 10px", fontSize: 13 }}>{order.menu?.name}</td>
                    <td style={{ padding: "12px 10px", textAlign: "center", fontSize: 13 }}>{order.quantity}</td>
                    <td style={{ padding: "12px 10px", textAlign: "center", fontWeight: 700, color: "#4ade80" }}>
                      Rp {Number(order.total_price || 0).toLocaleString("id-ID")}
                    </td>

                    {/* Kurir */}
                    <td style={{ padding: "12px 10px", fontSize: 12, color: order.kurir ? "#cbd5e1" : "#334155" }}>
                      {order.kurir ? order.kurir.name : "—"}
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: "12px 10px", textAlign: "center" }}>
                      <span style={{
                        display: "inline-block", padding: "4px 10px", borderRadius: 999,
                        fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                        background: `${statusColor(s)}16`,
                        border: `1px solid ${statusColor(s)}38`,
                        color: statusColor(s),
                        letterSpacing: 0.4,
                      }}>
                        {statusLabel(s)}
                      </span>
                    </td>

                    {/* Tracking Button */}
                    <td style={{ padding: "12px 10px", textAlign: "center" }}>
                      {!isPending && !isCancelled ? (
                        <button
                          onClick={() => setTrackingOrder(order)}
                          style={{
                            background: "rgba(99,102,241,0.10)",
                            border: "1px solid rgba(99,102,241,0.28)",
                            color: "#818cf8", padding: "5px 13px", borderRadius: 8,
                            cursor: "pointer", fontSize: 12, fontWeight: 600,
                            fontFamily: FONT, transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.20)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.10)")}
                        >
                          Lihat
                        </button>
                      ) : (
                        <span style={{ color: "#334155", fontSize: 12 }}>—</span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td style={{ padding: "12px 10px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>

                        {/* Setuju — hanya saat pending */}
                        {showApprove && (
                          <ActionBtn
                            label="✓ Setuju"
                            color="green"
                            onClick={() => approveOrder(order.id)}
                            loading={busy === "approve"}
                          />
                        )}

                        {/* Tolak — saat pending atau confirmed (belum diproses dapur) */}
                        {showReject && (
                          <ActionBtn
                            label="✕ Tolak"
                            color="red"
                            onClick={() => rejectOrder(order.id)}
                            loading={busy === "reject"}
                          />
                        )}

                        {/*
                          Proses — muncul setelah confirmed. Klik akan membuka
                          modal pilih kurir terlebih dahulu (wajib pilih kurir
                          milik catering ini sebelum status berubah).
                          Abu-abu otomatis begitu sudah preparing/dst.
                        */}
                        {showProcess && (
                          <ActionBtn
                            label="🍽 Proses"
                            color="blue"
                            onClick={() => openProcessModal(order)}
                            disabled={processGrey}
                            loading={busy === "process"}
                          />
                        )}

                        {/*
                          Kirim — muncul setelah preparing.
                          Abu-abu otomatis begitu sudah dispatched/dst.
                        */}
                        {showSend && (
                          <ActionBtn
                            label="🚚 Kirim"
                            color="purple"
                            onClick={() => sendOrder(order)}
                            disabled={sendGrey}
                            loading={busy === "send"}
                          />
                        )}

                        {/* Cancelled label */}
                        {isCancelled && (
                          <span style={{ color: "#475569", fontSize: 12, fontStyle: "italic" }}>—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </OwnerLayout>
  );
}