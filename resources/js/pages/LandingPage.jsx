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
  FaSchool,
} from "react-icons/fa";

export default function LandingPage() {
  const [menus, setMenus] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [stats, setStats] = useState({
    customers: 0,
    kurirs: 0,
    owners: 0,
    sppgs: 0,
  });

  useEffect(() => {
    fetch("/api/menus-sppg")
      .then((res) => res.json())
      .then((data) => {
        setMenus(Array.isArray(data) ? data : data.data ?? []);
        setLoadingMenu(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingMenu(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/dashboard-stats")
      .then((res) => res.json())
      .then((data) => {
        console.log("Dashboard Stats:", data);
        setStats(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#070d1a",
        overflowX: "hidden",
        color: "white",
        margin: 0,
        padding: 0,
      }}
    >
      <style>{`
        *, *::before, *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body, #root {
          width: 100%;
          min-height: 100%;
          background: #070d1a;
          overflow-x: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          scroll-behavior: smooth;
        }

        body::-webkit-scrollbar { display: none; }
        body { -ms-overflow-style: none; scrollbar-width: none; }

        .wrap {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 48px;
        }

        .glass {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .card-hover {
          transition: transform 0.28s ease, box-shadow 0.28s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.4);
        }

        .menu-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 26px;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .role-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .step-line {
          width: 1px;
          background: linear-gradient(to bottom, rgba(37,99,235,0.5), transparent);
          margin: 0 22px;
          min-height: 28px;
        }

        @media (max-width: 1024px) {
          .wrap { padding: 0 32px; }
          .menu-grid-3 { grid-template-columns: repeat(2, 1fr); }
          .feature-grid { grid-template-columns: repeat(2, 1fr); }
          .role-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .wrap { padding: 0 20px; }
          .menu-grid-3 { grid-template-columns: 1fr; }
          .feature-grid { grid-template-columns: 1fr; }
          .role-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(7,13,26,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="wrap"
          style={{
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg,#2563eb,#60a5fa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "900",
                fontSize: "18px",
              }}
            >
              T
            </div>
            <span style={{ fontSize: "18px", fontWeight: "800", letterSpacing: "-0.4px" }}>
              TriCa Catering
            </span>
          </div>

          {/* Nav buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <Link
              to="/login"
              style={{
                padding: "10px 22px",
                borderRadius: "10px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#cbd5e1",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.2s",
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                padding: "10px 22px",
                borderRadius: "10px",
                background: "linear-gradient(135deg,#2563eb,#3b82f6)",
                color: "white",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "14px",
                boxShadow: "0 6px 20px rgba(37,99,235,0.3)",
              }}
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="wrap" style={{ paddingTop: "96px", paddingBottom: "96px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: "64px",
            alignItems: "center",
          }}
        >
          {/* Left */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "999px",
                background: "rgba(37,99,235,0.12)",
                border: "1px solid rgba(37,99,235,0.25)",
                color: "#60a5fa",
                marginBottom: "28px",
                fontWeight: "600",
                fontSize: "13px",
                letterSpacing: "0.3px",
              }}
            >
              <FaCheckCircle size={12} />
              Sistem Catering Modern
            </div>

            <h1
              style={{
                fontSize: "clamp(40px, 5vw, 66px)",
                lineHeight: "1.06",
                fontWeight: "900",
                letterSpacing: "-2px",
                color: "#f8fafc",
                marginBottom: "24px",
              }}
            >
              Platform Digital
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg,#60a5fa,#a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Catering Modern
              </span>
              <br />
              untuk Bisnis & Delivery
            </h1>

            <p
              style={{
                fontSize: "16px",
                color: "#64748b",
                lineHeight: "1.85",
                maxWidth: "520px",
                marginBottom: "36px",
              }}
            >
              Pesan catering harian, acara kantor, hingga kebutuhan event dengan
              lebih cepat, praktis, dan terorganisir dalam satu platform digital.
            </p>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <Link
                to="/register"
                style={{
                  padding: "15px 28px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg,#2563eb,#3b82f6)",
                  color: "white",
                  textDecoration: "none",
                  fontWeight: "700",
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: "0 12px 30px rgba(37,99,235,0.32)",
                }}
              >
                Pesan Catering <FaArrowRight size={13} />
              </Link>

              <button
                onClick={() => {
                  document.getElementById("menus")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  padding: "15px 28px",
                  borderRadius: "12px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#cbd5e1",
                  fontWeight: "600",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                Lihat Menu
              </button>
            </div>
          </div>

          {/* Right — Stats Panel */}
          <div
            className="glass"
            style={{
              borderRadius: "28px",
              padding: "28px",
            }}
          >
            {/* Hero image */}
            <div
              style={{
                width: "100%",
                height: "280px",
                borderRadius: "18px",
                overflow: "hidden",
                background: "url('/storage/images/hero.jpg') center/cover",
                marginBottom: "20px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top,rgba(7,13,26,0.7),transparent)",
                }}
              />
            </div>

            {/* Stats grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: "14px",
              }}
            >
              <StatCard icon={<FaUsers />} title="Customer" value={stats.customers} />
              <StatCard icon={<FaTruck />} title="Kurir" value={stats.kurirs} />
              <StatCard icon={<FaStore />} title="Owner" value={stats.owners} />
              <StatCard icon={<FaClipboardList />} title="SPPG" value={stats.sppgs} />
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="wrap">
        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />
      </div>

      {/* ── MENU SECTION ── */}
      <section id="menus" className="wrap" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "40px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "#3b82f6",
                marginBottom: "10px",
              }}
            >
              Menu Tersedia
            </p>
            <h2
              style={{
                fontSize: "clamp(28px,3.5vw,44px)",
                fontWeight: "800",
                letterSpacing: "-1px",
                color: "#f1f5f9",
              }}
            >
              Menu SPPG Hari Ini
            </h2>
            <p style={{ color: "#475569", marginTop: "10px", fontSize: "15px" }}>
              Menu otomatis berganti setiap hari setelah SPPG mengunggah menu terbaru.
            </p>
          </div>

          <Link
            to="/login"
            style={{
              padding: "12px 22px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "14px",
              whiteSpace: "nowrap",
            }}
          >
            Lihat Semua →
          </Link>
        </div>

        {/* Grid — 1 card per SPPG, menu terbaru */}
        <div className="menu-grid-3">
          {loadingMenu ? (
            <p style={{ color: "#475569" }}>Loading menu...</p>
          ) : menus.length > 0 ? (
            menus.map((menu) => (
              <div
                key={menu.id}
                className="glass card-hover"
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Image */}
                <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                  <img
                    src={menu.image ?? "https://via.placeholder.com/500x300?text=Menu+SPPG"}
                    alt={menu.name || "Menu SPPG"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  {/* Badge terbaru */}
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      background: "rgba(37,99,235,0.82)",
                      backdropFilter: "blur(8px)",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "700",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      letterSpacing: "0.3px",
                    }}
                  >
                    Menu Terbaru
                  </div>
                </div>

                {/* Content */}
                <div
                  style={{
                    padding: "20px 22px 24px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    gap: "12px",
                  }}
                >
                  {/* ① Tanggal */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#3b82f6",
                        flexShrink: 0,
                      }}
                    />
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#3b82f6",
                        letterSpacing: "0.3px",
                        margin: 0,
                      }}
                    >
                      {menu.tanggal
                        ? new Date(menu.tanggal).toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Tanggal belum tersedia"}
                    </p>
                  </div>

                  {/* ② Nama Menu */}
                  <h3
                    style={{
                      fontSize: "17px",
                      fontWeight: "700",
                      color: "#f1f5f9",
                      lineHeight: "1.35",
                      margin: 0,
                    }}
                  >
                    {menu.name || "Menu Catering"}
                  </h3>

                  {/* Divider tipis */}
                  <div
                    style={{
                      height: "1px",
                      background: "rgba(255,255,255,0.06)",
                    }}
                  />

                  {/* ③ Nama SPPG */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaClipboardList size={12} color="#60a5fa" style={{ flexShrink: 0 }} />
                    <div>
                      <p
                        style={{
                          fontSize: "10px",
                          fontWeight: "600",
                          color: "#475569",
                          textTransform: "uppercase",
                          letterSpacing: "0.8px",
                          margin: "0 0 2px",
                        }}
                      >
                        SPPG
                      </p>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "#cbd5e1",
                          margin: 0,
                        }}
                      >
                        {menu.sppg_name || "SPPG belum tersedia"}
                      </p>
                    </div>
                  </div>

                  {/* ④ Sekolah */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <FaSchool size={12} color="#60a5fa" style={{ marginTop: "14px", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: "10px",
                          fontWeight: "600",
                          color: "#475569",
                          textTransform: "uppercase",
                          letterSpacing: "0.8px",
                          margin: "0 0 6px",
                        }}
                      >
                        Sekolah
                      </p>
                      {Array.isArray(menu.sekolah) && menu.sekolah.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {menu.sekolah.map((s, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "12px",
                                color: "#94a3b8",
                                lineHeight: "1.5",
                              }}
                            >
                              <span
                                style={{
                                  width: "4px",
                                  height: "4px",
                                  borderRadius: "50%",
                                  background: "#334155",
                                  flexShrink: 0,
                                }}
                              />
                              {s}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: "12px", color: "#475569", margin: 0 }}>
                          {typeof menu.sekolah === "string"
                            ? menu.sekolah
                            : "Belum ada data sekolah"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#475569" }}>Belum ada menu tersedia.</p>
          )}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="wrap">
        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />
      </div>

      {/* ── FEATURES ── */}
      <section className="wrap" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "#3b82f6",
              marginBottom: "12px",
            }}
          >
            Keunggulan
          </p>
          <h2
            style={{
              fontSize: "clamp(26px,3.5vw,42px)",
              fontWeight: "800",
              letterSpacing: "-1px",
              color: "#f1f5f9",
              marginBottom: "14px",
            }}
          >
            Kenapa TriCa Catering?
          </h2>
          <p style={{ color: "#475569", fontSize: "15px", maxWidth: "520px", margin: "0 auto", lineHeight: "1.8" }}>
            Sistem modern dengan dashboard realtime, delivery tracking,
            dan monitoring operasional yang terintegrasi.
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

      {/* ── DIVIDER ── */}
      <div className="wrap">
        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />
      </div>

      {/* ── ROLE SECTION ── */}
      <section className="wrap" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "#3b82f6",
              marginBottom: "12px",
            }}
          >
            Untuk Siapa
          </p>
          <h2
            style={{
              fontSize: "clamp(26px,3.5vw,42px)",
              fontWeight: "800",
              letterSpacing: "-1px",
              color: "#f1f5f9",
            }}
          >
            Satu Platform untuk Semua Kebutuhan
          </h2>
        </div>

        <div className="role-grid">
          <RoleCard
            icon={<FaStore />}
            title="Owner Catering"
            desc="Kelola operasional catering dengan sistem yang praktis, cepat, dan terintegrasi."
            button="Daftarkan Catering Anda"
          />
          <RoleCard
            icon={<FaTruck />}
            title="Kurir Delivery"
            desc="Pantau jadwal pengiriman, rute harian, dan status antar secara realtime."
            button="Gabung Sebagai Kurir"
          />
          <RoleCard
            icon={<FaClipboardList />}
            title="Operator SPPG"
            desc="Pantau seluruh aktivitas SPPG dan optimalkan proses distribusi dengan aman."
            button="Daftar Sebagai Operator"
          />
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="wrap">
        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />
      </div>

      {/* ── PANDUAN PENDAFTARAN ── */}
      <section className="wrap" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "#3b82f6",
              marginBottom: "12px",
            }}
          >
            Cara Bergabung
          </p>
          <h2
            style={{
              fontSize: "clamp(24px,3.5vw,40px)",
              fontWeight: "800",
              letterSpacing: "-1px",
              color: "#f1f5f9",
              marginBottom: "12px",
            }}
          >
            Panduan Pendaftaran
          </h2>
          <p style={{ color: "#475569", fontSize: "15px" }}>
            Untuk Owner, Kurir & Operator SPPG
          </p>
        </div>

        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
          }}
        >
          {[
            {
              step: 1,
              color: "#2563eb",
              title: "Lakukan Registrasi",
              desc: (
                <>
                  Daftarkan akun sebagai <strong style={{ color: "#e2e8f0" }}>Owner</strong>,{" "}
                  <strong style={{ color: "#e2e8f0" }}>Kurir</strong>, atau{" "}
                  <strong style={{ color: "#e2e8f0" }}>Operator SPPG</strong> menggunakan
                  email yang aktif dan data yang benar.
                </>
              ),
            },
            {
              step: 2,
              color: "#2563eb",
              title: "Tunggu Validasi Admin",
              desc: "Setelah registrasi, akun akan masuk ke proses verifikasi oleh Admin TriCa Catering. Mohon menunggu hingga proses validasi selesai.",
            },
            {
              step: 3,
              color: "#2563eb",
              title: "Pantau Email",
              desc: "Pantau inbox email yang digunakan saat registrasi. Jika disetujui, Anda akan menerima pemberitahuan dari TriCa Catering.",
            },
            {
              step: 4,
              color: "#22c55e",
              title: "Login dan Mulai Menggunakan Sistem",
              desc: "Setelah menerima email persetujuan, login menggunakan akun yang telah didaftarkan dan mulai gunakan fitur sesuai peran Anda.",
            },
          ].map(({ step, color, title, desc }, i, arr) => (
            <div key={step}>
              <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                {/* Number + line */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background: color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "800",
                      fontSize: "15px",
                      flexShrink: 0,
                      boxShadow: `0 4px 16px ${color}55`,
                    }}
                  >
                    {step}
                  </div>
                  {i < arr.length - 1 && (
                    <div
                      style={{
                        width: "1px",
                        flex: 1,
                        minHeight: "32px",
                        background: "rgba(37,99,235,0.25)",
                        margin: "8px 0",
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div style={{ paddingBottom: i < arr.length - 1 ? "8px" : "0" }}>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#f1f5f9",
                      marginBottom: "8px",
                      paddingTop: "8px",
                    }}
                  >
                    {title}
                  </h3>
                  <p style={{ color: "#64748b", lineHeight: "1.8", fontSize: "14px", marginBottom: "24px" }}>
                    {desc}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Note */}
          <div
            style={{
              marginTop: "8px",
              padding: "16px 20px",
              borderRadius: "12px",
              background: "rgba(37,99,235,0.08)",
              border: "1px solid rgba(37,99,235,0.18)",
              color: "#94a3b8",
              fontSize: "14px",
              lineHeight: "1.8",
            }}
          >
            <strong style={{ color: "#60a5fa" }}>Catatan:</strong> Role{" "}
            <strong style={{ color: "#e2e8f0" }}>Klien</strong> tidak memerlukan validasi
            admin dan dapat langsung menggunakan sistem setelah registrasi.
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="wrap" style={{ paddingBottom: "80px" }}>
        <div
          style={{
            borderRadius: "24px",
            background: "linear-gradient(135deg,rgba(37,99,235,0.18),rgba(99,102,241,0.12))",
            border: "1px solid rgba(37,99,235,0.2)",
            padding: "56px 48px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(24px,3vw,38px)",
              fontWeight: "800",
              letterSpacing: "-0.8px",
              marginBottom: "14px",
              color: "#f1f5f9",
            }}
          >
            Siap memulai dengan TriCa Catering?
          </h2>
          <p style={{ color: "#64748b", fontSize: "15px", marginBottom: "30px" }}>
            Daftarkan diri Anda sekarang dan nikmati kemudahan sistem catering modern.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/register"
              style={{
                padding: "14px 28px",
                borderRadius: "12px",
                background: "linear-gradient(135deg,#2563eb,#3b82f6)",
                color: "white",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "15px",
                boxShadow: "0 10px 28px rgba(37,99,235,0.3)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Daftar Sekarang <FaArrowRight size={13} />
            </Link>
            <Link
              to="/login"
              style={{
                padding: "14px 28px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#94a3b8",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "15px",
              }}
            >
              Sudah punya akun
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "32px 48px",
          textAlign: "center",
          color: "#334155",
          fontSize: "14px",
        }}
      >
        © 2026 TriCa Catering — Modern Catering Management System
      </footer>
    </div>
  );
}

/* ── Sub-components ── */

function StatCard({ icon, title, value }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "14px",
        padding: "16px 18px",
      }}
    >
      <div style={{ fontSize: "18px", color: "#3b82f6", marginBottom: "10px" }}>{icon}</div>
      <div style={{ color: "#64748b", fontSize: "12px", fontWeight: "600", letterSpacing: "0.3px", textTransform: "uppercase" }}>{title}</div>
      <div style={{ fontSize: "26px", fontWeight: "900", color: "#f1f5f9", marginTop: "4px" }}>{value}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div
      className="glass card-hover"
      style={{
        borderRadius: "20px",
        padding: "32px",
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "14px",
          background: "rgba(37,99,235,0.12)",
          border: "1px solid rgba(37,99,235,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#60a5fa",
          fontSize: "22px",
          marginBottom: "22px",
        }}
      >
        {icon}
      </div>
      <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f1f5f9", marginBottom: "10px" }}>{title}</h3>
      <p style={{ color: "#64748b", lineHeight: "1.75", fontSize: "14px" }}>{desc}</p>
    </div>
  );
}

function RoleCard({ icon, title, desc, button }) {
  return (
    <div
      className="glass card-hover"
      style={{
        borderRadius: "20px",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative glow */}
      <div
        style={{
          position: "absolute",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background: "rgba(37,99,235,0.08)",
          top: "-60px",
          right: "-60px",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "14px",
          background: "rgba(37,99,235,0.12)",
          border: "1px solid rgba(37,99,235,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#60a5fa",
          fontSize: "22px",
          marginBottom: "20px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          fontSize: "18px",
          fontWeight: "700",
          color: "#f1f5f9",
          marginBottom: "10px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#64748b",
          lineHeight: "1.75",
          fontSize: "14px",
          flex: 1,
          marginBottom: "24px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {desc}
      </p>

      <Link
        to="/register"
        style={{
          display: "block",
          textAlign: "center",
          padding: "13px",
          borderRadius: "10px",
          background: "linear-gradient(135deg,#2563eb,#3b82f6)",
          color: "white",
          textDecoration: "none",
          fontWeight: "700",
          fontSize: "14px",
          position: "relative",
          zIndex: 2,
          boxShadow: "0 8px 24px rgba(37,99,235,0.28)",
        }}
      >
        {button}
      </Link>
    </div>
  );
}