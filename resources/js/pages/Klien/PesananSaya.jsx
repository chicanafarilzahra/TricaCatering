// resources/js/pages/Klien/PesananSaya.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaClipboardList,
  FaBoxOpen,
  FaCheckCircle,
  FaTruck,
  FaClock,
} from "react-icons/fa";

import SidebarKlien from "../../components/SidebarKlien";
import NavbarKlien from "../../components/NavbarKlien";

export default function PesananSaya() {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPesanan();

    // HILANGKAN SCROLL PUTIH
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const getPesanan = async () => {
    try {
      const res = await axios.get("/api/klien/pesanan");

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
        return {
          bg: "rgba(245,158,11,0.15)",
          color: "#f59e0b",
          text: "Menunggu",
          icon: <FaClock />,
        };

      case "diproses":
        return {
          bg: "rgba(59,130,246,0.15)",
          color: "#3b82f6",
          text: "Diproses",
          icon: <FaBoxOpen />,
        };

      case "dikirim":
        return {
          bg: "rgba(168,85,247,0.15)",
          color: "#a855f7",
          text: "Dikirim",
          icon: <FaTruck />,
        };

      case "selesai":
        return {
          bg: "rgba(34,197,94,0.15)",
          color: "#22c55e",
          text: "Selesai",
          icon: <FaCheckCircle />,
        };

      default:
        return {
          bg: "rgba(148,163,184,0.15)",
          color: "#94a3b8",
          text: status || "Unknown",
          icon: <FaClipboardList />,
        };
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        background: "#071028",
        overflow: "hidden",
      }}
    >
      {/* SIDEBAR */}
      <SidebarKlien />

      {/* MAIN */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#071028",
        }}
      >
        {/* NAVBAR */}
        <NavbarKlien title="Pesanan Saya" />

        {/* CONTENT */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "32px",
            boxSizing: "border-box",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="hide-scrollbar"
        >
          {/* HEADER */}
          <div style={{ marginBottom: "30px" }}>
            <h1
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: "42px",
                fontWeight: "800",
                lineHeight: 1.1,
              }}
            >
              Histori Pemesanan
            </h1>

            <p
              style={{
                marginTop: "12px",
                color: "#94a3b8",
                fontSize: "16px",
              }}
            >
              Semua riwayat pesanan catering Anda tampil di halaman ini
            </p>
          </div>

          {/* LOADING */}
          {loading && (
            <div
              style={{
                background: "#182338",
                padding: "24px",
                borderRadius: "22px",
                color: "#94a3b8",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              Memuat data pesanan...
            </div>
          )}

          {/* EMPTY */}
          {!loading && pesanan.length === 0 && (
            <div
              style={{
                background: "#182338",
                borderRadius: "28px",
                padding: "60px 30px",
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div
                style={{
                  fontSize: "70px",
                  marginBottom: "20px",
                }}
              >
                📦
              </div>

              <h3
                style={{
                  margin: 0,
                  color: "#ffffff",
                  fontSize: "28px",
                  fontWeight: "800",
                  marginBottom: "12px",
                }}
              >
                Belum Ada Pesanan
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#94a3b8",
                  fontSize: "15px",
                }}
              >
                Silahkan lakukan pemesanan makanan terlebih dahulu
              </p>
            </div>
          )}

          {/* LIST PESANAN */}
          <div
            style={{
              display: "grid",
              gap: "24px",
            }}
          >
            {pesanan.map((item) => {
              const status = getStatus(item.status);

              return (
                <div
                  key={item.id}
                  style={{
                    background: "#182338",
                    borderRadius: "28px",
                    padding: "28px",
                    border: "1px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "22px",
                  }}
                >
                  {/* TOP */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: "#94a3b8",
                          fontSize: "13px",
                          marginBottom: "8px",
                        }}
                      >
                        ID Pesanan
                      </div>

                      <h2
                        style={{
                          margin: 0,
                          color: "#ffffff",
                          fontSize: "30px",
                          fontWeight: "800",
                        }}
                      >
                        #{item.id}
                      </h2>
                    </div>

                    <div
                      style={{
                        background: status.bg,
                        color: status.color,
                        padding: "11px 18px",
                        borderRadius: "14px",
                        fontSize: "14px",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {status.icon}
                      {status.text}
                    </div>
                  </div>

                  {/* BODY */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit,minmax(220px,1fr))",
                      gap: "18px",
                    }}
                  >
                    {/* MENU */}
                    <InfoCard
                      title="Nama Menu"
                      value={item.menu?.name || "-"}
                    />

                    {/* JUMLAH */}
                    <InfoCard
                      title="Jumlah Porsi"
                      value={`${item.jumlah || 1} Porsi`}
                    />

                    {/* TOTAL */}
                    <InfoCard
                      title="Total Harga"
                      value={`Rp ${Number(
                        item.total_harga || 0
                      ).toLocaleString("id-ID")}`}
                      color="#22c55e"
                    />

                    {/* TANGGAL */}
                    <InfoCard
                      title="Tanggal Pesanan"
                      value={new Date(
                        item.created_at
                      ).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    />
                  </div>

                  {/* CATATAN */}
                  {item.catatan && (
                    <div
                      style={{
                        background: "#0f172a",
                        borderRadius: "20px",
                        padding: "20px",
                      }}
                    >
                      <div
                        style={{
                          color: "#94a3b8",
                          fontSize: "13px",
                          marginBottom: "10px",
                        }}
                      >
                        Catatan
                      </div>

                      <div
                        style={{
                          color: "#ffffff",
                          lineHeight: 1.7,
                          fontSize: "14px",
                        }}
                      >
                        {item.catatan}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* HIDE SCROLLBAR */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
}

/* ========================= */

function InfoCard({
  title,
  value,
  color = "#ffffff",
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        borderRadius: "20px",
        padding: "20px",
      }}
    >
      <div
        style={{
          color: "#94a3b8",
          fontSize: "13px",
          marginBottom: "10px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color,
          fontSize: "21px",
          fontWeight: "800",
          lineHeight: 1.4,
        }}
      >
        {value}
      </div>
    </div>
  );
}