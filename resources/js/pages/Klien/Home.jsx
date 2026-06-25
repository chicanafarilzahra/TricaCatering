// resources/js/pages/Klien/Home.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

import NavbarKlien from "../../components/NavbarKlien";

import {
  FaClipboardList,
  FaTruck,
  FaClock,
  FaCheckCircle,
  FaUtensils,
  FaWallet,
} from "react-icons/fa";

export default function HomeKlien() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.background = "#020817";

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    axios
      .get("/klien/pesanan")
      .then((res) => {
        setOrders(res.data || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const activeOrders = orders.filter((item) =>
    [
      "pending",
      "confirmed",
      "on_delivery",
    ].includes(item.status)
  );

  const selesai = orders.filter(
    (item) => item.status === "delivered"
  );

  const totalTransaksi = orders.reduce(
    (sum, item) =>
      sum + Number(item.total_price || 0),
    0
  );

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#020817",
      }}
    >
      <NavbarKlien />

      <div
        style={{
          padding: "30px",
        }}
      >
        {/* HERO */}

        <div
          style={{
            background:
              "linear-gradient(135deg,#0f172a,#1e3a8a)",
            borderRadius: "30px",
            padding: "40px",
            marginBottom: "30px",
            color: "white",
            border:
              "1px solid rgba(255,255,255,.05)",
          }}
        >
          <h1
            style={{
              fontSize: "42px",
              margin: 0,
              fontWeight: "800",
            }}
          >
            Selamat Datang,
            {" "}
            {user?.name || "Klien"} 👋
          </h1>

          <p
            style={{
              color: "#cbd5e1",
              marginTop: "15px",
              maxWidth: "700px",
              lineHeight: "1.8",
            }}
          >
            Kelola pesanan catering,
            pantau pengiriman,
            lihat invoice dan riwayat
            transaksi dalam satu dashboard.
          </p>
        </div>

        {/* STAT */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <StatCard
            icon={<FaClipboardList />}
            title="Total Pesanan"
            value={orders.length}
          />

          <StatCard
            icon={<FaTruck />}
            title="Pesanan Aktif"
            value={activeOrders.length}
          />

          <StatCard
            icon={<FaCheckCircle />}
            title="Pesanan Selesai"
            value={selesai.length}
          />

          <StatCard
            icon={<FaWallet />}
            title="Total Transaksi"
            value={`Rp ${totalTransaksi.toLocaleString(
              "id-ID"
            )}`}
          />
        </div>

        {/* GRID */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr",
            gap: "25px",
          }}
        >
          {/* STATUS */}

          <div
            style={{
              background: "#0f172a",
              borderRadius: "25px",
              padding: "25px",
              border:
                "1px solid rgba(255,255,255,.05)",
            }}
          >
            <h2
              style={{
                color: "white",
                marginTop: 0,
                marginBottom: 25,
              }}
            >
              🚚 Status Pesanan
            </h2>

            <TimelineItem
              active
              title="Pesanan Masuk"
              subtitle="Pesanan berhasil diterima sistem"
            />

            <TimelineItem
              active={
                activeOrders.length > 0
              }
              title="Diproses Dapur"
              subtitle="Makanan sedang disiapkan"
            />

            <TimelineItem
              progress={
                activeOrders.some(
                  (o) =>
                    o.status ===
                    "on_delivery"
                )
              }
              title="Pengiriman"
              subtitle="Kurir sedang menuju lokasi"
            />

            <TimelineItem
              title="Pesanan Sampai"
              subtitle="Menunggu diterima pelanggan"
            />
          </div>

          {/* AKTIVITAS */}

          <div
            style={{
              background: "#0f172a",
              borderRadius: "25px",
              padding: "25px",
              border:
                "1px solid rgba(255,255,255,.05)",
            }}
          >
            <h2
              style={{
                color: "white",
                marginTop: 0,
                marginBottom: 25,
              }}
            >
              Aktivitas Terbaru
            </h2>

            {orders.length === 0 ? (
              <p
                style={{
                  color: "#94a3b8",
                }}
              >
                Belum ada aktivitas.
              </p>
            ) : (
              orders
                .slice(0, 5)
                .map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "15px 0",
                      borderBottom:
                        "1px solid rgba(255,255,255,.05)",
                    }}
                  >
                    <div
                      style={{
                        color: "white",
                        fontWeight: "700",
                      }}
                    >
                      Pesanan #{item.id}
                    </div>

                    <div
                      style={{
                        color: "#94a3b8",
                        marginTop: 5,
                        fontSize: "14px",
                      }}
                    >
                      Status :
                      {" "}
                      {item.status}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* MENU CEPAT */}

        <div
          style={{
            marginTop: "30px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: "20px",
          }}
        >
          <QuickCard
            icon={<FaUtensils />}
            title="Pesan Makanan"
            desc="Pesan menu catering harian dengan cepat."
          />

          <QuickCard
            icon={<FaTruck />}
            title="Tracking Pesanan"
            desc="Pantau posisi pengiriman secara realtime."
          />

          <QuickCard
            icon={<FaClock />}
            title="Riwayat Pesanan"
            desc="Lihat seluruh histori transaksi Anda."
          />
        </div>
      </div>
    </div>
  );
}

/* ===================== */

function StatCard({
  icon,
  title,
  value,
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        borderRadius: "25px",
        padding: "25px",
      }}
    >
      <div
        style={{
          color: "#3b82f6",
          fontSize: "26px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#94a3b8",
          marginTop: "15px",
        }}
      >
        {title}
      </div>

      <h2
        style={{
          color: "white",
          marginBottom: 0,
        }}
      >
        {value}
      </h2>
    </div>
  );
}

function QuickCard({
  icon,
  title,
  desc,
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        borderRadius: "25px",
        padding: "25px",
      }}
    >
      <div
        style={{
          color: "#3b82f6",
          fontSize: "30px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          color: "white",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#94a3b8",
          lineHeight: 1.8,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

function TimelineItem({
  title,
  subtitle,
  active,
  progress,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        marginBottom: "25px",
      }}
    >
      <div
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          marginTop: "6px",
          background: active
            ? "#3b82f6"
            : progress
            ? "#60a5fa"
            : "#334155",
        }}
      />

      <div>
        <div
          style={{
            color: "white",
            fontWeight: "700",
          }}
        >
          {title}
        </div>

        <div
          style={{
            color: "#94a3b8",
            marginTop: "5px",
            fontSize: "14px",
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
}