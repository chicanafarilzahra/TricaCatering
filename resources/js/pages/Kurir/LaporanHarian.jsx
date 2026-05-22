// resources/js/pages/Kurir/LaporanHarian.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTruck, FaCheckCircle, FaMoneyBillWave, FaClock } from "react-icons/fa";
import SidebarKurir from "../../components/SidebarKurir";
import NavbarKurir from "../../components/NavbarKurir";

export default function LaporanHarian({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customer: "",
    pesanan: "",
    quantity: "",
    waktu: "",
    diterima: true,
    alasan: "",
    foto: null,
  });

  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
    try {
      const res = await axios.get("/api/kurir/laporan");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const totalOrder = orders.length;
  const terkirim = orders.filter(o => o.diterima).length;
  const pending = orders.filter(o => !o.diterima).length;
  const totalFee = orders.reduce((acc, o) => acc + (o.delivery_fee || 0), 0);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (file) setFormData(prev => ({ ...prev, foto: file }));
  };

  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      fd.append("customer", formData.customer);
      fd.append("pesanan", formData.pesanan);
      fd.append("quantity", formData.quantity);
      fd.append("waktu", formData.waktu);
      fd.append("diterima", formData.diterima);
      fd.append("alasan", formData.alasan);
      if (formData.foto) fd.append("photo", formData.foto);

      await axios.post("/api/kurir/laporan", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowForm(false);
      setFormData({
        customer: "",
        pesanan: "",
        quantity: "",
        waktu: "",
        diterima: true,
        alasan: "",
        foto: null,
      });

      fetchLaporan();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan laporan");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", overflow: "hidden", background: "#071028" }}>
      <div style={{ width: "260px", height: "100%", flexShrink: 0 }}>
        <SidebarKurir onLogout={onLogout} />
      </div>

      <div style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", background: "#071028" }}>
        <div style={{ width: "100%", height: "78px", flexShrink: 0 }}>
          <NavbarKurir title="Laporan Harian" />
        </div>

        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "24px", background: "#071028", color: "#ffffff" }}>
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ margin: 0, fontSize: "34px", fontWeight: "800" }}>Laporan Harian</h2>
            <p style={{ marginTop: "8px", color: "#94a3b8", fontSize: "15px" }}>Rekap aktivitas pengiriman kurir hari ini.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px", marginBottom: "24px" }}>
            <StatCard title="Total Pengiriman" value={totalOrder} icon={<FaTruck />} />
            <StatCard title="Terkirim" value={terkirim} icon={<FaCheckCircle />} />
            <StatCard title="Menunggu" value={pending} icon={<FaClock />} />
            <StatCard title="Total Biaya" value={`Rp ${totalFee.toLocaleString()}`} icon={<FaMoneyBillWave />} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>Laporan Kurir</h3>
              <p style={{ marginTop: "6px", color: "#94a3b8", fontSize: "14px" }}>Upload bukti pengiriman dan status penerimaan customer.</p>
            </div>
            <button onClick={() => setShowForm(true)} style={{ border: "none", height: "48px", padding: "0 22px", borderRadius: "14px", background: "linear-gradient(135deg,#2563eb,#3b82f6)", color: "#ffffff", fontSize: "14px", fontWeight: "700", cursor: "pointer", boxShadow: "0 10px 20px rgba(37,99,235,0.25)" }}>
              + Tambah Laporan
            </button>
          </div>

          {showForm && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
              <div style={{ width: "100%", maxWidth: "520px", background: "#182338", borderRadius: "24px", padding: "26px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
                <h2 style={{ marginTop: 0, marginBottom: "22px", color: "#ffffff", fontSize: "28px", fontWeight: "800" }}>Tambah Laporan</h2>

                <FormField label="Nama Customer" name="customer" value={formData.customer} onChange={handleChange} />
                <FormField label="Pesanan" name="pesanan" value={formData.pesanan} onChange={handleChange} />
                <FormField label="Jumlah Porsi" name="quantity" type="number" value={formData.quantity} onChange={handleChange} />
                <FormField label="Waktu Pengiriman" name="waktu" type="time" value={formData.waktu} onChange={handleChange} />

                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Foto Bukti</label>
                  <input type="file" onChange={handlePhoto} style={{ ...inputStyle, padding: "10px" }} />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Status Penerimaan</label>
                  <select value={formData.diterima} onChange={e => setFormData({ ...formData, diterima: e.target.value === "true" })} style={inputStyle}>
                    <option value={true}>Diterima</option>
                    <option value={false}>Tidak Diterima</option>
                  </select>
                </div>

                {!formData.diterima && (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={labelStyle}>Alasan Tidak Diterima</label>
                    <textarea name="alasan" value={formData.alasan} onChange={handleChange} rows={4} style={{ ...inputStyle, resize: "none", height: "110px", padding: "14px" }} />
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                  <button onClick={() => setShowForm(false)} style={{ height: "46px", padding: "0 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#ffffff", cursor: "pointer" }}>
                    Batal
                  </button>
                  <button onClick={handleSubmit} style={{ height: "46px", padding: "0 20px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#2563eb,#3b82f6)", color: "#ffffff", fontWeight: "700", cursor: "pointer" }}>
                    Simpan Laporan
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={{ background: "#182338", borderRadius: "18px", padding: "20px", boxShadow: "0 8px 25px rgba(0,0,0,0.25)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                  <th style={thStyle}>Foto</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Pesanan</th>
                  <th style={thStyle}>Waktu</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Penerimaan</th>
                  <th style={thStyle}>Alasan</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={tdStyle}>
                      <img src={o.photo || "https://via.placeholder.com/70x70.png?text=Foto"} alt="foto" style={{ width: "70px", height: "70px", borderRadius: "14px", objectFit: "cover" }} />
                    </td>
                    <td style={tdStyle}>{o.customer}</td>
                    <td style={tdStyle}>{o.pesanan}</td>
                    <td style={tdStyle}>{o.waktu}</td>
                    <td style={tdStyle}>{o.diterima ? "Terkirim" : "Pending"}</td>
                    <td style={tdStyle}>{o.diterima ? "Diterima" : "Ditolak"}</td>
                    <td style={tdStyle}>{o.alasan || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

// =========================
const StatCard = ({ title, value, icon }) => (
  <div style={{ background: "#182338", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
    <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(59,130,246,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", fontSize: "20px" }}>{icon}</div>
    <div style={{ fontSize: "14px", color: "#94a3b8" }}>{title}</div>
    <div style={{ fontSize: "30px", fontWeight: "800" }}>{value}</div>
  </div>
);

// =========================
const FormField = ({ label, name, type = "text", value, onChange }) => (
  <div style={{ marginBottom: "16px" }}>
    <label style={labelStyle}>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} style={inputStyle} />
  </div>
);

// =========================
const thStyle = { padding: "14px 10px", textAlign: "left", color: "#cbd5e1", fontSize: "13px", fontWeight: "700" };
const tdStyle = { padding: "16px 10px", fontSize: "14px", color: "#f8fafc" };
const labelStyle = { display: "block", marginBottom: "8px", color: "#cbd5e1", fontSize: "14px", fontWeight: "600" };
const inputStyle = { width: "100%", height: "48px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", background: "#0f172a", color: "#ffffff", padding: "0 14px", outline: "none", fontSize: "14px", boxSizing: "border-box" };