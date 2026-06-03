// resources/js/pages/LandingPage.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaStore,
  FaTruck,
  FaUtensils,
  FaClipboardList,
  FaUsers,
  FaBoxes,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

export default function LandingPage() {

  // =========================
  // MENU STATE
  // =========================
  const [menus, setMenus] = useState([]);
  const [loadingMenu, setLoadingMenu] =
    useState(true);

  // =========================
  // GET MENU OWNER
  // =========================
  useEffect(() => {
    fetch("/api/menus")
      .then((res) => res.json())
      .then((data) => {
        setMenus(data);
        setLoadingMenu(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingMenu(false);
      });
  }, []);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#071028,#0f172a,#111827)",
        overflowX: "hidden",
        color: "white",
        margin: 0,
        padding: 0,
      }}
    >
      {/* GLOBAL STYLE */}
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
        }

        html,body,#root{
          width:100%;
          min-height:100%;
          background:#071028;
          overflow-x:hidden;
          font-family:Inter,sans-serif;
          scroll-behavior:smooth;
        }

        body::-webkit-scrollbar{
          display:none;
        }

        body{
          -ms-overflow-style:none;
          scrollbar-width:none;
        }

        .container{
          width:100%;
          padding-left:7%;
          padding-right:7%;
        }

        .glass{
          background:rgba(255,255,255,0.05);
          backdrop-filter:blur(14px);
          border:1px solid rgba(255,255,255,0.06);
        }

        .hero-grid{
          display:grid;
          grid-template-columns:1.1fr 1fr;
          gap:60px;
          align-items:center;
        }

        .menu-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
          gap:22px;
        }

        .role-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
          gap:26px;
        }

        .feature-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
          gap:24px;
        }

        .hero-title{
          font-size:72px;
          line-height:1.05;
          font-weight:900;
        }

        .section-title{
          font-size:52px;
          font-weight:800;
        }

        .floating-card:hover{
          transform:translateY(-8px);
        }

        .floating-card{
          transition:0.3s ease;
        }

        @media(max-width:992px){
          .hero-grid{
            grid-template-columns:1fr;
          }

          .hero-title{
            font-size:52px;
          }

          .section-title{
            font-size:38px;
          }
        }

        @media(max-width:768px){

          .container{
            padding-left:5%;
            padding-right:5%;
          }

          .hero-title{
            font-size:42px;
          }

          .section-title{
            font-size:30px;
          }

          .menu-grid{
            grid-template-columns:repeat(auto-fit,minmax(170px,1fr));
          }

          .hero-buttons{
            flex-direction:column;
          }

          .hero-buttons a{
            width:100%;
            text-align:center;
          }

        }
      `}</style>

      {/* NAVBAR */}
      <div
        style={{
          width: "100%",
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(14px)",
          background: "rgba(7,16,40,0.8)",
          borderBottom:
            "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          className="container"
          style={{
            height: "84px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2
            style={{
              fontSize: "30px",
              fontWeight: "900",
            }}
          >
            TriCa Catering
          </h2>

          <div
            style={{
              display: "flex",
              gap: "14px",
            }}
          >
            <Link
              to="/login"
              style={{
                padding: "12px 24px",
                borderRadius: "14px",
                background:
                  "rgba(255,255,255,0.08)",
                color: "white",
                textDecoration: "none",
                fontWeight: "700",
              }}
            >
              Login
            </Link>

            <Link
              to="/register"
              style={{
                padding: "12px 24px",
                borderRadius: "14px",
                background:
                  "linear-gradient(135deg,#2563eb,#3b82f6)",
                color: "white",
                textDecoration: "none",
                fontWeight: "800",
                boxShadow:
                  "0 10px 30px rgba(37,99,235,0.35)",
              }}
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* HERO */}
<section
  className="container"
  style={{
    paddingTop: "70px",
    paddingBottom: "70px",
  }}
>
  <div
    className="hero-grid"
    style={{
      alignItems: "center",
      gap: "40px",
    }}
  >
    {/* LEFT */}
    <div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 18px",
          borderRadius: "999px",
          background:
            "rgba(59,130,246,0.15)",
          color: "#60a5fa",
          marginBottom: "24px",
          fontWeight: "700",
        }}
      >
        <FaCheckCircle />
        Sistem Catering Modern
      </div>

      <h1
        className="hero-title"
        style={{
          maxWidth: "760px",
          letterSpacing: "-2px",
        }}
      >
        Platform Digital
        Catering Modern
        untuk Bisnis , SPPG 
        & Delivery
      </h1>

      <p
        style={{
          marginTop: "22px",
          fontSize: "18px",
          color: "#94a3b8",
          lineHeight: "1.9",
          maxWidth: "640px",
        }}
      >
        Pesan catering harian,
        acara kantor, hingga
        kebutuhan event dengan
        lebih cepat, praktis,
        dan terorganisir dalam
        satu platform digital
        modern.
      </p>

      <div
        className="hero-buttons"
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "34px",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/register"
          style={{
            padding: "18px 32px",
            borderRadius: "18px",
            background:
              "linear-gradient(135deg,#2563eb,#3b82f6)",
            color: "white",
            textDecoration: "none",
            fontWeight: "800",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            boxShadow:
              "0 18px 40px rgba(37,99,235,0.35)",
          }}
        >
          Pesan Catering
          <FaArrowRight />
        </Link>

<button
    onClick={() => {
        const section =
            document.getElementById(
                "menus"
            );

        section?.scrollIntoView({
            behavior: "smooth",
        });
    }}
    style={{
        padding: "18px 32px",
        borderRadius: "18px",
        background:
            "rgba(255,255,255,0.07)",
        border:
            "1px solid rgba(255,255,255,0.08)",
        color: "white",
        textDecoration: "none",
        fontWeight: "800",
        backdropFilter: "blur(12px)",
        transition: "0.2s",
        cursor: "pointer",
    }}
>
    Lihat Menu
</button>
      </div>
    </div>

    {/* RIGHT */}
    <div
      className="glass"
      style={{
        borderRadius: "34px",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "500px",
          borderRadius: "30px",
          overflow: "hidden",
          position: "relative",
          background:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop') center/cover",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top,rgba(7,16,40,0.96),rgba(7,16,40,0.12))",
          }}
        />

        {/* FLOATING STATS */}
        <div
          style={{
            position: "absolute",
            bottom: "22px",
            left: "22px",
            right: "22px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2,1fr)",
              gap: "16px",
            }}
          >
            <StatCard
              icon={<FaUsers />}
              title="Customer"
              value="0"
            />

            <StatCard
              icon={<FaTruck />}
              title="Kurir"
              value="0"
            />

            <StatCard
              icon={<FaStore />}
              title="Owner"
              value="0"
            />

            <StatCard
              icon={<FaBoxes />}
              title="Pesanan"
              value="0"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

            {/* MENU SECTION */}
      <section
        id="menus"
        className="container"
        style={{
          paddingBottom: "100px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "34px",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <h2 className="section-title">
              Menu Catering
            </h2>

            <p
              style={{
                color: "#94a3b8",
                marginTop: "12px",
                fontSize: "16px",
              }}
            >
              Data menu otomatis
              terupdate ketika owner
              menambahkan menu baru.
            </p>
          </div>

          <Link
            to="/login"
            style={{
              padding: "14px 24px",
              borderRadius: "14px",
              background:
                "rgba(255,255,255,0.08)",
              color: "white",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            Lihat Semua Menu
          </Link>
        </div>

        {/* MENU GRID */}
        <div className="menu-grid">

          {loadingMenu ? (

            <h3
              style={{
                color: "#94a3b8",
              }}
            >
              Loading menu...
            </h3>

          ) : menus.length > 0 ? (

            menus.slice(0, 6).map((menu) => (

              <div
                key={menu.id}
                className="glass floating-card"
                style={{
                  borderRadius: "24px",
                  overflow: "hidden",
                }}
              >

                {/* IMAGE */}
                <img
                  src={
                    menu.image
                      ? `/storage/${menu.image}`
                      : "https://via.placeholder.com/500x300?text=Menu+Catering"
                  }
                  alt={menu.nama_menu}
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                  }}
                />

                {/* CONTENT */}
<div
  style={{
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  }}
>
  {/* NAMA MENU */}
  <h3
    style={{
      fontSize: "22px",
      marginBottom: "12px",
      fontWeight: "800",

      minHeight: "56px", // samakan area judul
    }}
  >
    {menu.name || "Menu Catering"}
  </h3>

  {/* DESKRIPSI */}
  <p
    style={{
      color: "#94a3b8",
      lineHeight: "1.7",

      flex: 1, // isi ruang kosong

      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 4,
      WebkitBoxOrient: "vertical",
    }}
  >
    {menu.description ||
      "Menu catering tersedia"}
  </p>

  {/* BUTTON */}
  <Link
    to="/login"
    style={{
      marginTop: "auto", // dorong ke bawah

      width: "100%",
      padding: "14px 18px",
      borderRadius: "14px",
      background:
        "linear-gradient(135deg,#2563eb,#3b82f6)",
      color: "white",
      textDecoration: "none",
      fontWeight: "800",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    Pesan
  </Link>
</div>
</div>

            ))

          ) : (

            <h3
              style={{
                color: "#94a3b8",
              }}
            >
              Belum ada menu tersedia
            </h3>

          )}

        </div>
      </section>

      {/* FEATURES */}
      <section
        className="container"
        style={{
          paddingBottom: "100px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "60px",
          }}
        >
          <h2 className="section-title">
            Kenapa TriCa Catering?
          </h2>

          <p
            style={{
              color: "#94a3b8",
              marginTop: "18px",
              fontSize: "17px",
              lineHeight: "1.9",
              maxWidth: "850px",
              marginInline: "auto",
            }}
          >
            Sistem catering modern
            dengan dashboard realtime,
            delivery tracking, dan
            monitoring operasional
            yang memudahkan seluruh
            proses bisnis catering.
          </p>
        </div>

        <div className="feature-grid">
          <FeatureCard
            icon={<FaUtensils />}
            title="Menu Variatif"
            desc="Kelola berbagai kategori menu catering secara modern dan realtime."
          />

          <FeatureCard
            icon={<FaTruck />}
            title="Delivery Tracking"
            desc="Pantau pengiriman kurir dan rute delivery langsung dari dashboard."
          />

          <FeatureCard
            icon={<FaClipboardList />}
            title="Monitoring Produksi"
            desc="Pantau proses produksi catering secara realtime dan terintegrasi."
          />
        </div>
      </section>

      {/* ROLE SECTION */}
      <section
        className="container"
        style={{
          paddingBottom: "120px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "60px",
          }}
        >
          <h2 className="section-title">
            Satu Platform untuk
            Semua Kebutuhan Catering
          </h2>
        </div>

        <div className="role-grid">
          <RoleCard
            icon={<FaStore />}
            title="Kelola Bisnis Catering Anda"
            desc="Kelola operasional catering dengan sistem yang praktis, cepat, dan terintegrasi."
            button="Daftarkan Catering Anda"
          />

          <RoleCard
            icon={<FaTruck />}
            title="Sistem Kurir Delivery"
            desc="Daftar menjadi kurir untuk mengantarkan pesanan klien dan pantau jadwal pengiriman, rute harian, dan status antar secara realtime."
            button="Gabung Sebagai Kurir"
          />

          <RoleCard
            icon={<FaClipboardList />}
            title="Sistem Operator SPPG"
            desc="Pantau seluruh aktivitas SPPG dengan sistem yang aman dan optimalkan proses distribusi."
            button="Daftar Sebagai Operator"
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop:
            "1px solid rgba(255,255,255,0.05)",
          padding: "40px 7%",
          textAlign: "center",
          color: "#94a3b8",
        }}
      >
        © 2026 TriCa Catering —
        Modern Catering Management
        System
      </footer>
    </div>
  );
}

/* ========================= */

function StatCard({
  icon,
  title,
  value,
}) {
  return (
    <div
      className="glass"
      style={{
        borderRadius: "18px",
        padding: "18px",
      }}
    >
      <div
        style={{
          fontSize: "22px",
          color: "#60a5fa",
          marginBottom: "14px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#cbd5e1",
          fontSize: "14px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "30px",
          fontWeight: "900",
          marginTop: "6px",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}) {
  return (
    <div
      className="glass floating-card"
      style={{
        borderRadius: "28px",
        padding: "34px",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "22px",
          background:
            "rgba(59,130,246,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#60a5fa",
          fontSize: "28px",
          marginBottom: "24px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          fontSize: "28px",
          marginBottom: "14px",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#94a3b8",
          lineHeight: "1.9",
        }}
      >
        {desc}
      </p>
    </div>
  );
}

function RoleCard({
  icon,
  title,
  desc,
  button,
}) {
  return (
    <div
      className="glass floating-card"
      style={{
        borderRadius: "30px",
        padding: "38px",
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background:
            "rgba(59,130,246,0.12)",
          top: "-80px",
          right: "-80px",
          filter: "blur(20px)",
        }}
      />

      <div
        style={{
          width: "76px",
          height: "76px",
          borderRadius: "24px",
          background:
            "rgba(59,130,246,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#60a5fa",
          fontSize: "30px",
          marginBottom: "26px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          fontSize: "30px",
          lineHeight: "1.3",
          marginBottom: "18px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#94a3b8",
          lineHeight: "1.9",
          flex: 1,
          marginBottom: "34px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {desc}
      </p>

      <Link
        to="/register"
        style={{
          width: "100%",
          minHeight: "58px",
          borderRadius: "16px",
          background:
            "linear-gradient(135deg,#2563eb,#3b82f6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          color: "white",
          fontWeight: "800",
          position: "relative",
          zIndex: 2,
          boxShadow:
            "0 14px 35px rgba(37,99,235,0.35)",
        }}
      >
        {button}
      </Link>
    </div>
  );
}