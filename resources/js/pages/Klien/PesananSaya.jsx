// resources/js/pages/Klien/PesananSaya.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarKlien from "../../components/NavbarKlien";

export default function PesananSaya() {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";

    getPesanan();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const getPesanan = async () => {
    try {
      const res = await axios.get("/api/klien/orders");
      console.log("DATA ORDER:", res.data);
      setPesanan(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (status) => {
    switch (status) {
      case "pending":
        return { bg: "rgba(245,158,11,0.15)", color: "#f59e0b", text: "Menunggu" };
      case "diproses":
        return { bg: "rgba(59,130,246,0.15)", color: "#3b82f6", text: "Diproses" };
      case "dikirim":
        return { bg: "rgba(168,85,247,0.15)", color: "#a855f7", text: "Dikirim" };
      case "selesai":
        return { bg: "rgba(34,197,94,0.15)", color: "#22c55e", text: "Selesai" };
      default:
        return { bg: "rgba(148,163,184,0.15)", color: "#94a3b8", text: status || "Unknown" };
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#071028", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* NAVBAR */}
      <NavbarKlien title="Pesanan Saya" />

      {/* CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "24px", boxSizing: "border-box" }}>
        <h1 style={{ color: "#ffffff", fontSize: "36px", fontWeight: "800", marginBottom: "8px" }}>
          Histori Pemesanan
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "24px" }}>
          Semua riwayat pesanan catering Anda tampil di halaman ini
        </p>

        {loading ? (
          <div style={{ background: "#182338", padding: "24px", borderRadius: "22px", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.05)" }}>
            Memuat data pesanan...
          </div>
        ) : pesanan.length === 0 ? (
          <div style={{ background: "#182338", borderRadius: "28px", padding: "60px 30px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)", color: "#fff" }}>
            <div style={{ fontSize: "70px", marginBottom: "20px" }}>📦</div>
            <h3 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "12px" }}>Belum Ada Pesanan</h3>
            <p style={{ fontSize: "15px", color: "#94a3b8" }}>Silahkan lakukan pemesanan makanan terlebih dahulu</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "24px" }}>
            {pesanan.map((item) => {
              const status = getStatus(item.status);
              return (
                <div key={item.id} style={{ background: "#182338", borderRadius: "28px", padding: "28px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: "22px" }}>
                  {/* Top */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "8px" }}>ID Pesanan</div>
                      <h2 style={{ color: "#ffffff", fontSize: "30px", fontWeight: "800", margin: 0 }}>#{item.id}</h2>
                    </div>
                    <div style={{ background: status.bg, color: status.color, padding: "11px 18px", borderRadius: "14px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                      {status.text}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "18px" }}>
                    <InfoCard title="Nama Menu" value={item.menu?.name || "-"} />
                    <InfoCard title="Jumlah Porsi" value={`${item.quantity || 1} Porsi`} />
                    <InfoCard title="Total Harga" value={`Rp ${Number(item.total_price || 0).toLocaleString("id-ID")}`} color="#22c55e" />
                    <InfoCard title="Tanggal Pesanan" value={new Date(item.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })} />
                  </div>

                  {/* Notes */}
                  {item.notes && (
                    <div style={{ background: "#0f172a", borderRadius: "20px", padding: "20px" }}>
                      <div style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "10px" }}>Catatan</div>
                      <div style={{ color: "#ffffff", lineHeight: 1.7, fontSize: "14px" }}>{item.notes}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

function InfoCard({ title, value, color = "#ffffff" }) {
  return (
    <div style={{ background: "#0f172a", borderRadius: "20px", padding: "20px" }}>
      <div style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "10px" }}>{title}</div>
      <div style={{ color, fontSize: "21px", fontWeight: "800", lineHeight: 1.4 }}>{value}</div>
    </div>
  );
}