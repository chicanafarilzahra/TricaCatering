import { ShoppingCart, Clock, CheckCircle2, XCircle } from "lucide-react";
import OwnerLayout from "../../layouts/OwnerLayout";
import { useEffect, useState } from "react";
import axios from "axios";

function MetricCard({ title, value = "0", icon, color = "#60a5fa" }) {
  return (
    <div
      style={{
        background: "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))",
        border: "1px solid rgba(148,163,184,0.08)",
        borderRadius: "20px",
        padding: "20px 22px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 12px 32px rgba(0,0,0,0.28)",
      }}
    >
      <div>
        <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "8px" }}>
          {title}
        </div>
        <div style={{ fontSize: "30px", fontWeight: "800", color: "white", lineHeight: 1 }}>{value}</div>
      </div>
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "16px",
          background: "rgba(59,130,246,0.10)",
          border: "1px solid rgba(59,130,246,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
        }}
      >
        {icon}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ minHeight: "320px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "20px" }}>
      <div
        style={{
          width: "84px",
          height: "84px",
          borderRadius: "24px",
          background: "rgba(59,130,246,0.10)",
          border: "1px solid rgba(59,130,246,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#60a5fa",
          marginBottom: "24px",
        }}
      >
        <ShoppingCart size={38} />
      </div>
      <h3 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "white" }}>No Orders</h3>
    </div>
  );
}

export default function OrdersOwner() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const ownerId = user?.id;
      const res = await axios.get(`/api/owner/orders/${ownerId}`);
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const approveOrder = async (id) => {
    try {
      await axios.put(`/api/orders/${id}/approve`);
      getOrders();
    } catch (error) {
      console.error(error);
      alert("Gagal approve pesanan");
    }
  };

  const rejectOrder = async (id) => {
    try {
      await axios.put(`/api/orders/${id}/reject`);
      getOrders();
    } catch (error) {
      console.error(error);
      alert("Gagal reject pesanan");
    }
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status?.toLowerCase() === "pending").length;
  const completedOrders = orders.filter((o) => o.status?.toLowerCase() === "approved" || o.status?.toLowerCase() === "selesai").length;
  const cancelledOrders = orders.filter((o) => o.status?.toLowerCase() === "rejected" || o.status?.toLowerCase() === "dibatalkan").length;

  return (
    <OwnerLayout>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ margin: 0, fontSize: "34px", fontWeight: "800", color: "white" }}>Orders</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        <MetricCard title="Total Orders" value={totalOrders} icon={<ShoppingCart size={22} />} />
        <MetricCard title="Pending Orders" value={pendingOrders} icon={<Clock size={22} />} color="#f59e0b" />
        <MetricCard title="Completed" value={completedOrders} icon={<CheckCircle2 size={22} />} color="#22c55e" />
        <MetricCard title="Cancelled" value={cancelledOrders} icon={<XCircle size={22} />} color="#ef4444" />
      </div>

      <div style={{ background: "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))", border: "1px solid rgba(148,163,184,0.08)", borderRadius: "24px", padding: "20px" }}>
        {orders.length === 0 ? (
          <EmptyState />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#cbd5e1" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <th style={{ textAlign: "left", padding: "12px" }}>ID</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Customer</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Phone</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Address</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Menu</th>
                <th style={{ textAlign: "center", padding: "12px" }}>Qty</th>
                <th style={{ textAlign: "right", padding: "12px" }}>Total</th>
                <th style={{ textAlign: "center", padding: "12px" }}>Status</th>
                <th style={{ textAlign: "center", padding: "12px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <td style={{ padding: "12px" }}>{order.id}</td>
                  <td style={{ padding: "12px" }}>{order.customer_name}</td>
                  <td style={{ padding: "12px" }}>{order.phone}</td>
                  <td style={{ padding: "12px" }}>{order.address}</td>
                  <td style={{ padding: "12px" }}>{order.menu?.name}</td>
                  <td style={{ padding: "12px", textAlign: "center" }}>{order.quantity}</td>
                  <td style={{ padding: "12px", textAlign: "right", fontWeight: "700", color: "#22c55e" }}>
                    Rp {Number(order.total_price || 0).toLocaleString("id-ID")}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center", color: order.status?.toLowerCase() === "approved" ? "#22c55e" : order.status?.toLowerCase() === "rejected" ? "#ef4444" : "#f59e0b", fontWeight: "700" }}>
                    {order.status}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center", display: "flex", gap: "8px", justifyContent: "center" }}>
                    {order.status?.toLowerCase() === "pending" && (
                      <>
                        <button
                          onClick={() => approveOrder(order.id)}
                          style={{
                            background: "linear-gradient(135deg,#22c55e,#16a34a)",
                            border: "none",
                            color: "#fff",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "700",
                            fontSize: "13px",
                            boxShadow: "0 4px 12px rgba(34,197,94,.25)",
                          }}
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => rejectOrder(order.id)}
                          style={{
                            background: "linear-gradient(135deg,#ef4444,#dc2626)",
                            border: "none",
                            color: "#fff",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "700",
                            fontSize: "13px",
                            boxShadow: "0 4px 12px rgba(239,68,68,.25)",
                          }}
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </OwnerLayout>
  );
}