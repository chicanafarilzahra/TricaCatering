import { useEffect, useState } from "react";
import axios from "axios";
import {
    School, Users, UtensilsCrossed, Truck,
    TrendingUp, Bell, Activity, Package,
    FileBarChart2, CalendarDays, ArrowUpRight,
    ChevronRight, Zap, LayoutGrid,
} from "lucide-react";
import SidebarSPPG from "../../components/SidebarSPPG";
import { useNavigate } from "react-router-dom";

/* ─── Design Tokens ───────────────────────────────────────────── */
const T = {
    bg:       "#05080F",
    surface:  "#0A0F1C",
    elevated: "#0F1628",
    card:     "#111827",
    border:   "rgba(255,255,255,0.06)",
    borderMd: "rgba(255,255,255,0.10)",
    text:     "#F1F5F9",
    muted:    "#475569",
    sub:      "#94A3B8",
    accent:   "#3B82F6",
    accentLo: "rgba(59,130,246,0.12)",
    teal:     "#0EA5E9",
    green:    "#10B981",
    amber:    "#F59E0B",
    font:     "'Inter', system-ui, sans-serif",
    mono:     "'JetBrains Mono', 'Fira Code', monospace",
};

/* load Inter */
if (typeof document !== "undefined" && !document.getElementById("sppg-inter")) {
    const l = document.createElement("link");
    l.id = "sppg-inter"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";
    document.head.appendChild(l);
}

/* ─── Tiny helpers ─────────────────────────────────────────────── */
const num = (v) => (v ?? 0).toLocaleString("id-ID");

/* ─── KPI Card ─────────────────────────────────────────────────── */
function KpiCard({ label, value, icon: Icon, accent = T.accent, delta }) {
    return (
        <div style={{
            background: T.elevated,
            border: `0.5px solid ${T.border}`,
            borderRadius: "16px",
            padding: "22px 24px",
            position: "relative",
            overflow: "hidden",
            fontFamily: T.font,
        }}>
            <div style={{
                position: "absolute", top: 0, left: "20%", right: "20%", height: "1px",
                background: `linear-gradient(90deg, transparent, ${accent}60, transparent)`,
            }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "1px" }}>
                    {label}
                </span>
                <div style={{
                    width: "34px", height: "34px", borderRadius: "10px",
                    background: `${accent}18`,
                    border: `0.5px solid ${accent}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: accent,
                }}>
                    <Icon size={16} strokeWidth={1.8} />
                </div>
            </div>
            <div style={{ marginTop: "16px", fontSize: "32px", fontWeight: 800, color: T.text, letterSpacing: "-1px", lineHeight: 1 }}>
                {num(value)}
            </div>
            {delta !== undefined && (
                <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: T.green }}>
                    <TrendingUp size={12} strokeWidth={2} />
                    <span style={{ fontWeight: 600 }}>{delta}</span>
                    <span style={{ color: T.muted }}>dari kemarin</span>
                </div>
            )}
        </div>
    );
}

/* ─── Section header ───────────────────────────────────────────── */
function SectionHeader({ label, action, onAction }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: T.text, letterSpacing: "-.2px" }}>{label}</span>
            {action && (
                <button onClick={onAction} style={{
                    fontSize: "11.5px", fontWeight: 600, color: T.accent,
                    background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "3px", padding: 0,
                }}>
                    {action} <ChevronRight size={12} strokeWidth={2.5} />
                </button>
            )}
        </div>
    );
}

/* ─── Quick Action Button ──────────────────────────────────────── */
function QuickBtn({ icon: Icon, label, onClick, accent = T.accent }) {
    return (
        <button onClick={onClick} style={{
            background: T.card,
            border: `0.5px solid ${T.border}`,
            borderRadius: "14px",
            padding: "16px 14px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "12px",
            fontFamily: T.font,
            transition: "border-color .2s",
            textAlign: "left",
        }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${accent}50`}
            onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
        >
            <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: `${accent}18`,
                border: `0.5px solid ${accent}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: accent,
            }}>
                <Icon size={16} strokeWidth={1.8} />
            </div>
            <span style={{ fontSize: "12.5px", fontWeight: 600, color: T.text, lineHeight: 1.3 }}>{label}</span>
        </button>
    );
}

/* ─── School Row ───────────────────────────────────────────────── */
function SchoolRow({ item, index }) {
    const pct = Math.min(100, Math.round((item.jumlah_porsi / Math.max(item.jumlah_siswa, 1)) * 100));
    return (
        <div style={{
            padding: "14px 16px",
            borderRadius: "12px",
            background: T.card,
            border: `0.5px solid ${T.border}`,
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: T.text }}>{item.nama_sekolah}</div>
                    <div style={{ fontSize: "11.5px", color: T.muted, marginTop: "3px" }}>
                        {num(item.jumlah_siswa)} siswa
                    </div>
                </div>
                <span style={{
                    fontSize: "12px", fontWeight: 700, color: T.teal,
                    background: "rgba(14,165,233,.12)",
                    border: "0.5px solid rgba(14,165,233,.25)",
                    padding: "3px 10px", borderRadius: "20px",
                }}>
                    {num(item.jumlah_porsi)} porsi
                </span>
            </div>
            <div style={{ marginTop: "12px", height: "3px", borderRadius: "99px", background: T.border, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.teal})`, borderRadius: "99px" }} />
            </div>
        </div>
    );
}

/* ─── Activity Row ─────────────────────────────────────────────── */
function ActivityRow({ title, time, desc }) {
    return (
        <div style={{
            display: "flex", gap: "12px", alignItems: "flex-start",
            padding: "12px 0",
            borderBottom: `0.5px solid ${T.border}`,
        }}>
            <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: T.accent, marginTop: "5px", flexShrink: 0,
                boxShadow: `0 0 6px ${T.accent}`,
            }} />
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: T.text }}>{title}</div>
                {desc && <div style={{ fontSize: "12px", color: T.muted, marginTop: "3px" }}>{desc}</div>}
                {time && <div style={{ fontSize: "11px", color: T.muted, marginTop: "4px" }}>{time}</div>}
            </div>
        </div>
    );
}

/* ─── Summary Metric ───────────────────────────────────────────── */
function MetricRow({ label, value, accent = T.sub }) {
    return (
        <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "11px 0", borderBottom: `0.5px solid ${T.border}`,
        }}>
            <span style={{ fontSize: "12.5px", color: T.muted }}>{label}</span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: accent }}>{num(value)}</span>
        </div>
    );
}

/* ─── Main Dashboard ───────────────────────────────────────────── */
export default function DashboardSPPG() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const user       = JSON.parse(localStorage.getItem("user") || "{}");
    const activities = summary?.activities || [];

    useEffect(() => { loadDashboard(); }, []);

    const loadDashboard = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            const res = await axios.get("/sppg/dashboard", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSummary(res.data);
        } catch (err) {
            console.error("Dashboard load error:", err);
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    return (
        <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
            <SidebarSPPG />

            <div style={{ marginLeft: "260px", padding: "32px 36px", maxWidth: "1400px" }}>

                {/* ── Top Bar ── */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                    <div>
                        <div style={{ fontSize: "11px", fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "8px" }}>
                            Monitoring MBG
                        </div>
                        <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 800, color: T.text, letterSpacing: "-.6px" }}>
                            Dashboard SPPG
                        </h1>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                            fontSize: "12px", color: T.sub, fontWeight: 500,
                            padding: "9px 16px", borderRadius: "10px",
                            background: T.elevated, border: `0.5px solid ${T.border}`,
                        }}>
                            {today}
                        </div>
                        <div style={{
                            width: "40px", height: "40px", borderRadius: "10px",
                            background: T.elevated, border: `0.5px solid ${T.border}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: T.sub, cursor: "pointer",
                        }}>
                            <Bell size={17} strokeWidth={1.8} />
                        </div>
                        <div style={{
                            height: "40px", padding: "0 14px", borderRadius: "10px",
                            background: T.elevated, border: `0.5px solid ${T.border}`,
                            display: "flex", alignItems: "center", gap: "8px",
                            fontSize: "13px", fontWeight: 600, color: T.text,
                        }}>
                            <div style={{
                                width: "24px", height: "24px", borderRadius: "50%",
                                background: `linear-gradient(135deg, ${T.accent}, ${T.teal})`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "10px", fontWeight: 800, color: "#fff",
                            }}>
                                {(user?.name || "U")[0].toUpperCase()}
                            </div>
                            {user?.name}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
                        <div style={{
                            width: "40px", height: "40px", borderRadius: "50%",
                            border: `2px solid ${T.border}`,
                            borderTopColor: T.accent,
                            animation: "spin 0.8s linear infinite",
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : (
                    <>
                        {/* ── Hero Banner ── */}
                        <div style={{
                            background: T.elevated,
                            border: `0.5px solid ${T.borderMd}`,
                            borderRadius: "20px",
                            padding: "28px 32px",
                            marginBottom: "24px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            overflow: "hidden",
                            position: "relative",
                        }}>
                            <div style={{
                                position: "absolute", right: "-80px", top: "-80px",
                                width: "280px", height: "280px", borderRadius: "50%",
                                background: `radial-gradient(circle, ${T.accent}20 0%, transparent 70%)`,
                                pointerEvents: "none",
                            }} />
                            <div style={{ position: "relative" }}>
                                <div style={{ fontSize: "12px", color: T.muted, fontWeight: 500, marginBottom: "8px" }}>
                                    Selamat datang kembali,
                                </div>
                                <div style={{ fontSize: "22px", fontWeight: 800, color: T.text, letterSpacing: "-.5px" }}>
                                    {user?.nama_sppg || user?.name}
                                </div>
                                <div style={{ marginTop: "10px", fontSize: "13.5px", color: T.sub, lineHeight: 1.6 }}>
                                    <span style={{ color: T.teal, fontWeight: 700 }}>{num(summary?.total_siswa)}</span> siswa terdaftar menerima Program MBG hari ini
                                </div>
                            </div>
                            <div style={{
                                display: "flex", alignItems: "center", gap: "8px",
                                padding: "10px 18px", borderRadius: "12px",
                                background: `${T.accent}18`,
                                border: `0.5px solid ${T.accent}40`,
                                fontSize: "13px", fontWeight: 600, color: T.accent,
                                flexShrink: 0,
                            }}>
                                <Zap size={15} strokeWidth={2} />
                                Sistem Aktif
                            </div>
                        </div>

                        {/* ── KPI Grid ── */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "24px" }}>
                            <KpiCard label="Sekolah"      value={summary?.total_sekolah}       icon={School}          accent={T.accent} />
                            <KpiCard label="Total Siswa"  value={summary?.total_siswa}         icon={Users}           accent={T.teal}   />
                            <KpiCard label="Menu Aktif"   value={summary?.menu_hari_ini}       icon={UtensilsCrossed} accent={T.green}  />
                            <KpiCard label="Distribusi"   value={summary?.distribusi_hari_ini} icon={Truck}           accent={T.amber}  />
                        </div>

                        {/* ── Quick Actions + Activity ── */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "16px", marginBottom: "20px" }}>

                            {/* Quick Actions */}
                            <div style={{
                                background: T.elevated, border: `0.5px solid ${T.border}`,
                                borderRadius: "18px", padding: "22px",
                            }}>
                                <SectionHeader label="Aksi Cepat" />
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px" }}>
                                    <QuickBtn
                                        icon={School}
                                        label="Kelola Sekolah"
                                        onClick={() => navigate("/sppg/sekolah")}
                                        accent={T.accent}
                                    />
                                    <QuickBtn
                                        icon={UtensilsCrossed}
                                        label="Kelola Menu"
                                        onClick={() => navigate("/sppg/menu-harian")}
                                        accent={T.green}
                                    />
                                    <QuickBtn
                                        icon={Truck}
                                        label="Distribusi"
                                        onClick={() => navigate("/sppg/distribusi")}
                                        accent={T.amber}
                                    />
                                    <QuickBtn
                                        icon={Package}
                                        label="Stok Bahan"
                                        onClick={() => navigate("/sppg/stok")}
                                        accent={T.teal}
                                    />
                                    <QuickBtn
                                        icon={FileBarChart2}
                                        label="Laporan"
                                        onClick={() => navigate("/sppg/laporan")}
                                        accent="#A78BFA"
                                    />
                                    <QuickBtn
                                        icon={Activity}
                                        label="Riwayat"
                                        onClick={() => navigate("/sppg/riwayat")}
                                        accent="#F472B6"
                                    />
                                </div>
                            </div>

                            {/* Activity */}
                            <div style={{
                                background: T.elevated, border: `0.5px solid ${T.border}`,
                                borderRadius: "18px", padding: "22px",
                            }}>
                                <SectionHeader label="Aktivitas Terbaru" action="Lihat semua" />
                                {activities.length > 0
                                    ? activities.map((a, i) => (
                                        <ActivityRow key={i} title={a.title} time={a.time} desc={a.desc} />
                                    ))
                                    : (
                                        <>
                                            <ActivityRow title="Distribusi dijadwalkan"    desc="Pengiriman makanan ke sekolah penerima" time="Hari ini, 06:00" />
                                            <ActivityRow title="Menu baru dipublikasikan"  desc="Menu hari ini berhasil diaktifkan"      time="Hari ini, 05:30" />
                                            <ActivityRow title="Data siswa diperbarui"     desc="Jumlah penerima program diperbaharui"   time="Kemarin, 17:00" />
                                        </>
                                    )
                                }
                            </div>
                        </div>

                        {/* ── Schools + Summary ── */}
                        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px" }}>

                            {/* School List */}
                            <div style={{
                                background: T.elevated, border: `0.5px solid ${T.border}`,
                                borderRadius: "18px", padding: "22px",
                            }}>
                                <SectionHeader label="Sekolah Penerima MBG" action="Kelola sekolah" onAction={() => navigate("/sppg/sekolah")} />
                                {summary?.jadwal?.length > 0 ? (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        {summary.jadwal.map((item, i) => (
                                            <SchoolRow key={item.id ?? i} item={item} index={i} />
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{
                                        padding: "32px", textAlign: "center",
                                        color: T.muted, fontSize: "13px",
                                        background: T.card, borderRadius: "12px",
                                        border: `0.5px solid ${T.border}`,
                                    }}>
                                        Belum ada jadwal distribusi hari ini
                                    </div>
                                )}
                            </div>

                            {/* Summary + Status */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                                {/* Metrics */}
                                <div style={{
                                    background: T.elevated, border: `0.5px solid ${T.border}`,
                                    borderRadius: "18px", padding: "22px", flex: 1,
                                }}>
                                    <SectionHeader label="Ringkasan Hari Ini" />
                                    <MetricRow label="Sekolah terdaftar"   value={summary?.total_sekolah}       accent={T.accent} />
                                    <MetricRow label="Total penerima"      value={summary?.total_siswa}         accent={T.teal}   />
                                    <MetricRow label="Menu aktif"          value={summary?.menu_hari_ini}       accent={T.green}  />
                                    <MetricRow label="Distribusi hari ini" value={summary?.distribusi_hari_ini} accent={T.amber}  />
                                </div>

                                {/* Status Card */}
                                <div style={{
                                    background: T.elevated,
                                    border: `0.5px solid ${T.green}30`,
                                    borderRadius: "18px",
                                    padding: "22px",
                                    position: "relative",
                                    overflow: "hidden",
                                }}>
                                    <div style={{
                                        position: "absolute", bottom: "-30px", right: "-30px",
                                        width: "100px", height: "100px", borderRadius: "50%",
                                        background: `${T.green}10`, pointerEvents: "none",
                                    }} />
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                                        <TrendingUp size={16} strokeWidth={2} color={T.green} />
                                        <span style={{ fontSize: "13px", fontWeight: 700, color: T.green }}>Distribusi Lancar</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: "12.5px", color: T.muted, lineHeight: 1.7 }}>
                                        Semua sekolah terjadwal menerima distribusi MBG hari ini tanpa kendala.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}