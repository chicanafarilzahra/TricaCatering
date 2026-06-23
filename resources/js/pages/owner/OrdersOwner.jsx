import { ShoppingCart, Clock, CheckCircle2, XCircle, ChefHat, Truck, Bell } from "lucide-react";
import OwnerLayout from "../../layouts/OwnerLayout";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

// ─── Helpers ────────────────────────────────────────────────────────────────
const STATUS = {
  PENDING:   "pending",
  APPROVED:  "approved",
  PROCESSED: "processed",
  SENT:      "sent",
  REJECTED:  "rejected",
};

function statusColor(s) {
  switch (s?.toLowerCase()) {
    case STATUS.APPROVED:  return "#22c55e";
    case STATUS.PROCESSED: return "#3b82f6";
    case STATUS.SENT:      return "#a855f7";
    case STATUS.REJECTED:  return "#ef4444";
    default:               return "#f59e0b"; // pending
  }
}

function statusLabel(s) {
  switch (s?.toLowerCase()) {
    case STATUS.PENDING:   return "Menunggu";
    case STATUS.APPROVED:  return "Disetujui";
    case STATUS.PROCESSED: return "Diproses";
    case STATUS.SENT:      return "Dikirim";
    case STATUS.REJECTED:  return "Ditolak";
    default:               return s || "-";
  }
}

// ─── Toast Notification ──────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "10px" }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.98))",
            border: `1px solid ${t.color || "rgba(99,102,241,0.4)"}`,
            borderRadius: "14px",
            padding: "14px 18px",
            minWidth: "280px",
            boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${t.color || "rgba(99,102,241,0.2)"}`,
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            animation: "slideIn 0.3s ease",
          }}
        >
          <div style={{ color: t.color || "#818cf8", marginTop: "2px", flexShrink: 0 }}>
            <Bell size={18} />
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "white", marginBottom: "3px" }}>{t.title}</div>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>{t.message}</div>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Tracking Modal ──────────────────────────────────────────────────────────
function TrackingModal({ order, onClose }) {
  if (!order) return null;

  const steps = [
    { key: STATUS.APPROVED,  icon: <CheckCircle2 size={18} />, label: "Pesanan Disetujui",      desc: "Owner telah menyetujui pesananmu." },
    { key: STATUS.PROCESSED, icon: <ChefHat size={18} />,      label: "Diproses di Dapur",      desc: "Pesananmu sedang disiapkan di dapur." },
    { key: STATUS.SENT,      icon: <Truck size={18} />,        label: "Pesanan Dikirim",         desc: `Estimasi tiba: ${order.estimasi || "–"} menit.` },
  ];

  const currentIdx = order.status?.toLowerCase() === STATUS.SENT      ? 2
                   : order.status?.toLowerCase() === STATUS.PROCESSED  ? 1
                   : order.status?.toLowerCase() === STATUS.APPROVED   ? 0
                   : -1;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
        zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(145deg,rgba(15,23,42,0.98),rgba(30,41,59,0.98))",
          border: "1px solid rgba(148,163,184,0.12)",
          borderRadius: "24px", padding: "32px", minWidth: "360px", maxWidth: "440px", width: "100%",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "11px", color: "#60a5fa", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
            Tracking Pesanan
          </div>
          <div style={{ fontSize: "20px", fontWeight: "800", color: "white" }}>
            #{order.id} — {order.customer_name}
          </div>
          <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>{order.menu?.name} × {order.quantity}</div>
        </div>

        <div style={{ position: "relative", paddingLeft: "28px" }}>
          {/* vertical line */}
          <div style={{
            position: "absolute", left: "9px", top: "8px", bottom: "8px",
            width: "2px", background: "rgba(255,255,255,0.08)", borderRadius: "2px",
          }} />

          {steps.map((step, i) => {
            const done    = i <= currentIdx;
            const active  = i === currentIdx;
            return (
              <div key={step.key} style={{ position: "relative", marginBottom: i < steps.length - 1 ? "24px" : 0 }}>
                {/* dot */}
                <div style={{
                  position: "absolute", left: "-28px", top: "2px",
                  width: "20px", height: "20px", borderRadius: "50%",
                  background: done ? (active ? "#3b82f6" : "#22c55e") : "rgba(255,255,255,0.06)",
                  border: `2px solid ${done ? (active ? "#60a5fa" : "#4ade80") : "rgba(255,255,255,0.12)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: done ? "white" : "#475569",
                  fontSize: "10px",
                  boxShadow: active ? "0 0 12px rgba(59,130,246,0.5)" : "none",
                  transition: "all 0.4s ease",
                }} />

                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: done ? "white" : "#475569", marginBottom: "3px" }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: "12px", color: done ? "#94a3b8" : "#334155" }}>
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {order.status?.toLowerCase() === STATUS.REJECTED && (
          <div style={{ marginTop: "24px", padding: "14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", color: "#fca5a5", fontSize: "13px" }}>
            ✕ Pesanan ini telah ditolak oleh owner.
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: "28px", width: "100%", padding: "12px",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px", color: "#cbd5e1", cursor: "pointer", fontSize: "14px", fontWeight: "600",
          }}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

// ─── Metric Card ─────────────────────────────────────────────────────────────
function MetricCard({ title, value = "0", icon, color = "#60a5fa" }) {
  return (
    <div style={{
      background: "linear-gradient(145deg,rgba(15,23,42,0.95),rgba(30,41,59,0.95))",
      border: "1px solid rgba(148,163,184,0.08)", borderRadius: "20px",
      padding: "20px 22px", display: "flex", justifyContent: "space-between", alignItems: "center",
      boxShadow: "0 12px 32px rgba(0,0,0,0.28)",
    }}>
      <div>
        <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "8px" }}>
          {title}
        </div>
        <div style={{ fontSize: "30px", fontWeight: "800", color: "white", lineHeight: 1 }}>{value}</div>
      </div>
      <div style={{
        width: "52px", height: "52px", borderRadius: "16px",
        background: "rgba(59,130,246,0.10)", border: "1px solid rgba(59,130,246,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center", color,
      }}>
        {icon}
      </div>
    </div>
  );
}

// ─── Action Button ───────────────────────────────────────────────────────────
function ActionBtn({ label, onClick, color, disabled, loading }) {
  const bg = disabled || loading
    ? "rgba(100,116,139,0.25)"
    : color === "green"  ? "linear-gradient(135deg,#22c55e,#16a34a)"
    : color === "red"    ? "linear-gradient(135deg,#ef4444,#dc2626)"
    : color === "blue"   ? "linear-gradient(135deg,#3b82f6,#2563eb)"
    : color === "purple" ? "linear-gradient(135deg,#a855f7,#7c3aed)"
    : "rgba(100,116,139,0.25)";

  const shadow = disabled || loading ? "none"
    : color === "green"  ? "0 4px 12px rgba(34,197,94,.3)"
    : color === "red"    ? "0 4px 12px rgba(239,68,68,.3)"
    : color === "blue"   ? "0 4px 12px rgba(59,130,246,.3)"
    : color === "purple" ? "0 4px 12px rgba(168,85,247,.3)"
    : "none";

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        background: bg, border: "none", color: disabled || loading ? "#475569" : "#fff",
        padding: "7px 12px", borderRadius: "8px", cursor: disabled || loading ? "not-allowed" : "pointer",
        fontWeight: "700", fontSize: "12px", boxShadow: shadow,
        transition: "all 0.25s ease", whiteSpace: "nowrap",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? "..." : label}
    </button>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={{ minHeight: "320px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "20px" }}>
      <div style={{
        width: "84px", height: "84px", borderRadius: "24px",
        background: "rgba(59,130,246,0.10)", border: "1px solid rgba(59,130,246,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#60a5fa", marginBottom: "24px",
      }}>
        <ShoppingCart size={38} />
      </div>
      <h3 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "white" }}>Belum Ada Pesanan</h3>
      <p style={{ color: "#64748b", marginTop: "8px", fontSize: "14px" }}>Pesanan masuk akan tampil di sini.</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OrdersOwner() {
  const [orders,          setOrders]          = useState([]);
  const [loadingIds,      setLoadingIds]       = useState({});   // { [orderId]: true }
  const [toasts,          setToasts]           = useState([]);
  const [trackingOrder,   setTrackingOrder]    = useState(null);

  // ── fetch ──
  const getOrders = useCallback(async () => {
    try {
      const user    = JSON.parse(localStorage.getItem("user"));
      const ownerId = user?.id;
      const res     = await axios.get(`/api/owner/orders/${ownerId}`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { getOrders(); }, [getOrders]);

  // ── toast helper ──
  const pushToast = (title, message, color) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message, color }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  // ── set loading per order ──
  const setLoading = (id, val) =>
    setLoadingIds((prev) => ({ ...prev, [id]: val }));

  // ── notify client (fire & forget) ──
  const notifyClient = async (orderId, type, extra = {}) => {
    try {
      await axios.post(`/api/notifications/client`, { order_id: orderId, type, ...extra });
    } catch (e) {
      console.error("Notif error:", e);
    }
  };

  // ── APPROVE ──
  const approveOrder = async (id) => {
    setLoading(id, "approve");
    try {
      await axios.put(`/api/orders/${id}/approve`);
      await notifyClient(id, "approved");
      pushToast("✅ Pesanan Disetujui", `Order #${id} berhasil disetujui dan langsung diproses.`, "#22c55e");
      getOrders();
    } catch {
      pushToast("❌ Gagal", "Tidak bisa approve pesanan.", "#ef4444");
    } finally {
      setLoading(id, null);
    }
  };

  // ── REJECT ──
  const rejectOrder = async (id) => {
    setLoading(id, "reject");
    try {
      await axios.put(`/api/orders/${id}/reject`);
      await notifyClient(id, "rejected");
      pushToast("🚫 Pesanan Ditolak", `Order #${id} telah ditolak.`, "#ef4444");
      getOrders();
    } catch {
      pushToast("❌ Gagal", "Tidak bisa reject pesanan.", "#ef4444");
    } finally {
      setLoading(id, null);
    }
  };

  // ── PROCESS (diproses) ──
  const processOrder = async (id) => {
    setLoading(id, "process");
    try {
      await axios.put(`/api/orders/${id}/process`);
      await notifyClient(id, "processed");
      pushToast("👨‍🍳 Sedang Diproses", `Order #${id} sedang disiapkan di dapur.`, "#3b82f6");
      getOrders();
    } catch {
      pushToast("❌ Gagal", "Tidak bisa memproses pesanan.", "#ef4444");
    } finally {
      setLoading(id, null);
    }
  };

  // ── SEND (dikirim) ──
  const sendOrder = async (order) => {
    setLoading(order.id, "send");
    try {
      // hitung estimasi (mock: bisa diganti dengan kalkulasi jarak real)
      const estimasi = 15 + Math.floor(Math.random() * 20); // 15–35 menit
      await axios.put(`/api/orders/${order.id}/send`, { estimasi });
      await notifyClient(order.id, "sent", { estimasi });
      pushToast("🚚 Pesanan Dikirim", `Order #${order.id} dikirim! Estimasi tiba: ${estimasi} menit.`, "#a855f7");
      getOrders();
    } catch {
      pushToast("❌ Gagal", "Tidak bisa mengirim pesanan.", "#ef4444");
    } finally {
      setLoading(order.id, null);
    }
  };

  // ── metrics ──
  const totalOrders     = orders.length;
  const pendingOrders   = orders.filter((o) => o.status?.toLowerCase() === STATUS.PENDING).length;
  const completedOrders = orders.filter((o) => [STATUS.APPROVED, STATUS.PROCESSED, STATUS.SENT, "selesai"].includes(o.status?.toLowerCase())).length;
  const cancelledOrders = orders.filter((o) => [STATUS.REJECTED, "dibatalkan"].includes(o.status?.toLowerCase())).length;

  return (
    <OwnerLayout>
      <Toast toasts={toasts} />
      {trackingOrder && (
        <TrackingModal
          order={trackingOrder}
          onClose={() => setTrackingOrder(null)}
        />
      )}

      {/* Header */}
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ margin: 0, fontSize: "34px", fontWeight: "800", color: "white" }}>Pesanan Masuk</h1>
        <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "14px" }}>Kelola dan pantau semua pesanan dari pelanggan.</p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <MetricCard title="Total Pesanan"   value={totalOrders}     icon={<ShoppingCart size={22} />} />
        <MetricCard title="Menunggu"        value={pendingOrders}   icon={<Clock size={22} />}        color="#f59e0b" />
        <MetricCard title="Aktif / Selesai" value={completedOrders} icon={<CheckCircle2 size={22} />} color="#22c55e" />
        <MetricCard title="Dibatalkan"      value={cancelledOrders} icon={<XCircle size={22} />}      color="#ef4444" />
      </div>

      {/* Table */}
      <div style={{
        background: "linear-gradient(145deg,rgba(15,23,42,0.95),rgba(30,41,59,0.95))",
        border: "1px solid rgba(148,163,184,0.08)", borderRadius: "24px",
        padding: "20px", overflowX: "auto",
      }}>
        {orders.length === 0 ? (
          <EmptyState />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#cbd5e1", minWidth: "900px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                {["ID","Pelanggan","Telepon","Alamat","Menu","Qty","Total","Status","Tracking","Aksi"].map((h) => (
                  <th key={h} style={{ textAlign: h === "Qty" || h === "Total" || h === "Status" || h === "Tracking" || h === "Aksi" ? "center" : "left", padding: "12px 10px", fontSize: "12px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const s          = order.status?.toLowerCase();
                const isPending   = s === STATUS.PENDING;
                const isApproved  = s === STATUS.APPROVED;
                const isProcessed = s === STATUS.PROCESSED;
                const isSent      = s === STATUS.SENT;
                const isRejected  = s === STATUS.REJECTED;
                const busy        = loadingIds[order.id];

                return (
                  <tr
                    key={order.id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", transition: "background 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "12px 10px", fontSize: "13px", color: "#94a3b8" }}>#{order.id}</td>
                    <td style={{ padding: "12px 10px", fontWeight: "600", color: "white" }}>{order.customer_name}</td>
                    <td style={{ padding: "12px 10px", fontSize: "13px" }}>{order.phone}</td>
                    <td style={{ padding: "12px 10px", fontSize: "13px", maxWidth: "160px" }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.address}</div>
                    </td>
                    <td style={{ padding: "12px 10px", fontSize: "13px" }}>{order.menu?.name}</td>
                    <td style={{ padding: "12px 10px", textAlign: "center" }}>{order.quantity}</td>
                    <td style={{ padding: "12px 10px", textAlign: "center", fontWeight: "700", color: "#22c55e" }}>
                      Rp {Number(order.total_price || 0).toLocaleString("id-ID")}
                    </td>

                    {/* Status badge */}
                    <td style={{ padding: "12px 10px", textAlign: "center" }}>
                      <span style={{
                        display: "inline-block", padding: "4px 10px", borderRadius: "999px",
                        fontSize: "11px", fontWeight: "700", textTransform: "uppercase",
                        background: `${statusColor(s)}18`,
                        border: `1px solid ${statusColor(s)}40`,
                        color: statusColor(s),
                      }}>
                        {statusLabel(s)}
                      </span>
                    </td>

                    {/* Tracking button */}
                    <td style={{ padding: "12px 10px", textAlign: "center" }}>
                      {!isPending && !isRejected ? (
                        <button
                          onClick={() => setTrackingOrder(order)}
                          style={{
                            background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
                            color: "#818cf8", padding: "5px 12px", borderRadius: "8px",
                            cursor: "pointer", fontSize: "12px", fontWeight: "600",
                          }}
                        >
                          Lihat
                        </button>
                      ) : (
                        <span style={{ color: "#334155", fontSize: "12px" }}>—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "12px 10px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>

                        {/* Approve — show only when pending */}
                        {isPending && (
                          <ActionBtn
                            label="✓ Setuju"
                            color="green"
                            onClick={() => approveOrder(order.id)}
                            loading={busy === "approve"}
                          />
                        )}

                        {/* Reject — show only when pending */}
                        {isPending && (
                          <ActionBtn
                            label="✕ Tolak"
                            color="red"
                            onClick={() => rejectOrder(order.id)}
                            loading={busy === "reject"}
                          />
                        )}

                        {/* Proses — auto disabled after approve (becomes grey); enabled only when approved */}
                        {(isApproved || isProcessed || isSent) && (
                          <ActionBtn
                            label="🍽 Proses"
                            color="blue"
                            onClick={() => processOrder(order.id)}
                            disabled={isProcessed || isSent}  // grey setelah approved → processed
                            loading={busy === "process"}
                          />
                        )}

                        {/* Kirim — enabled only when processed */}
                        {(isProcessed || isSent) && (
                          <ActionBtn
                            label="🚚 Kirim"
                            color="purple"
                            onClick={() => sendOrder(order)}
                            disabled={isSent}  // grey setelah dikirim
                            loading={busy === "send"}
                          />
                        )}

                        {/* Rejected state */}
                        {isRejected && (
                          <span style={{ color: "#475569", fontSize: "12px", fontStyle: "italic" }}>Ditolak</span>
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