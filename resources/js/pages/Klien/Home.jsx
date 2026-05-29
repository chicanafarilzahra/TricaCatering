// resources/js/pages/Klien/Home.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaHome,
  FaUtensils,
  FaClipboardList,
  FaMapMarkerAlt,
  FaFileInvoiceDollar,
  FaCommentDots,
  FaBell,
  FaClock,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";

import { Link } from "react-router-dom";

export default function HomeKlien() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    axios
      .get("/api/klien/pesanan")
      .then((res) => {
        setOrders(res.data || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const activeOrders = orders.filter((o) =>
    ["pending", "confirmed", "on_delivery"].includes(o.status)
  );

  const latestOrder = orders[0];

  const estimasi =
    latestOrder?.delivery_time || "-";

  const subscriptionLeft =
    user?.subscription_days || 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        background: "#071028",
        overflow: "hidden",
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: "310px",
          height: "100%",
          background:
            "linear-gradient(180deg,#020817 0%,#081633 50%,#0b1736 100%)",
          borderRight:
            "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div>
          {/* LOGO */}
          <div
            style={{
              padding: "30px 24px",
              borderBottom:
                "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "34px",
                fontWeight: "800",
                color: "#ffffff",
                lineHeight: 1.1,
              }}
            >
              TricaCatering
            </h1>

            <p
              style={{
                marginTop: "8px",
                color: "#94a3b8",
                fontSize: "16px",
              }}
            >
              Klien Panel
            </p>
          </div>

          {/* MENU */}
          <div style={{ padding: "18px" }}>
            <SidebarItem
              active
              icon={<FaHome />}
              title="Beranda"
              to="/klien"
            />

            <SidebarItem
              icon={<FaUtensils />}
              title="Pesan Makan"
              to="/klien/pesan"
            />

            <SidebarItem
              icon={<FaClipboardList />}
              title="Pesanan Saya"
              to="/klien/pesanan"
            />

            <SidebarItem
              icon={<FaMapMarkerAlt />}
              title="Lacak Pengiriman"
              to="/klien/tracking"
            />

            <SidebarItem
              icon={<FaFileInvoiceDollar />}
              title="Invoice & Tagihan"
              to="/klien/invoice"
            />

            <SidebarItem
              icon={<FaCommentDots />}
              title="Ulasan & Komplain"
              to="/klien/ulasan"
            />
          </div>
        </div>

        {/* PROFILE */}
        <div
          style={{
            padding: "22px",
            borderTop:
              "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg,#2563eb,#3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "18px",
                color: "#fff",
              }}
            >
              {user?.name?.charAt(0) || "K"}
            </div>

            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#fff",
                }}
              >
                {user?.name || "Klien"}
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  marginTop: "4px",
                }}
              >
                Pelanggan Catering
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#071028",
        }}
      >
        {/* NAVBAR */}
        <div
          style={{
            height: "84px",
            background:
              "linear-gradient(90deg,#17306a 0%,#1f3f8b 100%)",
            borderBottom:
              "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            flexShrink: 0,
            boxSizing: "border-box",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "30px",
                fontWeight: "800",
                color: "#fff",
                letterSpacing: "0.5px",
              }}
            >
              Beranda
            </h2>

            <p
              style={{
                marginTop: "4px",
                color: "rgba(255,255,255,0.7)",
                fontSize: "16px",
              }}
            >
              Selamat datang kembali
            </p>
          </div>

          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background:
                "rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "18px",
            }}
          >
            <FaBell />
          </div>
        </div>

        {/* CONTENT */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "28px",
            boxSizing: "border-box",
            color: "#fff",
          }}
        >
          {/* HEADER */}
          <div style={{ marginBottom: "24px" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "54px",
                fontWeight: "800",
                lineHeight: 1.1,
                color: "#ffffff",
              }}
            >
              Selamat Pagi,{" "}
              {user?.name || "Klien"}
            </h1>

            <p
              style={{
                marginTop: "10px",
                color: "#94a3b8",
                fontSize: "18px",
              }}
            >
              Pesanan catering Anda aktif hari ini
            </p>
          </div>

          {/* ALERT */}
          {latestOrder && (
            <div
              style={{
                width: "100%",
                background:
                  "rgba(34,197,94,0.12)",
                border:
                  "1px solid rgba(74,222,128,0.25)",
                color: "#86efac",
                padding: "20px 24px",
                borderRadius: "20px",
                fontSize: "16px",
                marginBottom: "24px",
                boxSizing: "border-box",
              }}
            >
              Pesanan Anda sedang diproses.
              Estimasi tiba{" "}
              <b>{estimasi}</b>.
            </div>
          )}

          {/* CARD */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: "18px",
              marginBottom: "28px",
            }}
          >
            <StatCard
              icon={<FaClipboardList />}
              title="Pesanan Aktif"
              value={activeOrders.length}
            />

            <StatCard
              icon={<FaClock />}
              title="Estimasi Tiba"
              value={estimasi}
            />

            <StatCard
              icon={<FaTruck />}
              title="Sisa Langganan"
              value={subscriptionLeft}
            />
          </div>

          {/* TIMELINE */}
          <div
            style={{
              background: "#182338",
              borderRadius: "24px",
              overflow: "hidden",
              border:
                "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                padding: "24px 28px",
                borderBottom:
                  "1px solid rgba(255,255,255,0.05)",
                fontSize: "24px",
                fontWeight: "700",
                color: "#fff",
              }}
            >
              🚚 Status Pesanan Hari Ini
            </div>

            <div style={{ padding: "8px 28px 24px" }}>
              <TimelineItem
                active
                title="Pesanan diterima"
                subtitle="Pesanan berhasil masuk sistem"
              />

              <TimelineItem
                active={
                  latestOrder?.status !==
                  "pending"
                }
                title="Pesanan diproses dapur"
                subtitle="Makanan sedang disiapkan"
              />

              <TimelineItem
                progress={
                  latestOrder?.status ===
                  "on_delivery"
                }
                title="Dalam perjalanan"
                subtitle={`Estimasi tiba ${estimasi}`}
              />

              <TimelineItem
                title="Pesanan diterima"
                subtitle="Menunggu kurir tiba"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================= */

function SidebarItem({
  icon,
  title,
  active = false,
  to,
}) {
  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "16px 18px",
          borderRadius: "18px",
          marginBottom: "12px",
          cursor: "pointer",
          background: active
            ? "linear-gradient(90deg,#1d4ed8,#2563eb)"
            : "transparent",
          color: "#ffffff",
          fontSize: "16px",
          fontWeight: active ? "700" : "500",
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontSize: "18px" }}>
          {icon}
        </div>

        {title}
      </div>
    </Link>
  );
}

function StatCard({
  icon,
  title,
  value,
}) {
  return (
    <div
      style={{
        background: "#182338",
        borderRadius: "22px",
        padding: "24px",
        border:
          "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "18px",
          background:
            "rgba(59,130,246,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#3b82f6",
          fontSize: "24px",
          marginBottom: "18px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontSize: "15px",
          color: "#94a3b8",
          marginBottom: "10px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "38px",
          fontWeight: "800",
          color: "#fff",
        }}
      >
        {value}
      </div>
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
        gap: "18px",
        padding: "22px 0",
        borderBottom:
          "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: active
            ? "linear-gradient(135deg,#2563eb,#3b82f6)"
            : progress
            ? "rgba(59,130,246,0.15)"
            : "rgba(255,255,255,0.08)",
          border: progress
            ? "2px solid #3b82f6"
            : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "#fff",
          fontSize: "18px",
        }}
      >
        {active ? (
          <FaCheckCircle />
        ) : (
          <FaTruck />
        )}
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: "18px",
            fontWeight: "700",
            marginBottom: "6px",
            color: "#fff",
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: "14px",
            color: "#94a3b8",
          }}
        >
          {subtitle}
        </div>

        {progress && (
          <div
            style={{
              width: "100%",
              height: "8px",
              background:
                "rgba(255,255,255,0.08)",
              borderRadius: "999px",
              overflow: "hidden",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                width: "70%",
                height: "100%",
                background:
                  "linear-gradient(90deg,#2563eb,#3b82f6)",
                borderRadius: "999px",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}