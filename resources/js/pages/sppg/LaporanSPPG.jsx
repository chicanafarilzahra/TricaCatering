import { useEffect, useState } from "react";
import axios from "axios";
import SidebarSPPG from "../../components/SidebarSPPG";
import {
    FileBarChart2,
    Package,
    School,
    Building2,
    Search,
    ChevronRight,
    CalendarDays,
    TrendingUp,
} from "lucide-react";

/* ─── Design Tokens (sama persis dengan Dashboard) ───────────── */
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
    purple:   "#A78BFA",
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

const num = (v) => (v ?? 0).toLocaleString("id-ID");

/* ─── KPI Card (sama dengan Dashboard) ─────────────────────────── */
function KpiCard({ label, value, icon: Icon, accent = T.accent }) {
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
        </div>
    );
}

/* ─── Section Header (sama dengan Dashboard) ────────────────────── */
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

/* ─── Main Laporan ──────────────────────────────────────────────── */
export default function LaporanSPPG() {
    const [summary, setSummary] = useState({});
    const [laporan, setLaporan] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadLaporan(); }, []);

    const loadLaporan = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            const res = await axios.get("/sppg/laporan", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSummary(res.data.summary);
            setLaporan(res.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = laporan.filter((item) =>
        item.tanggal?.toLowerCase().includes(search.toLowerCase())
    );

    const today = new Date().toLocaleDateString("id-ID", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    return (
        <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
            <SidebarSPPG />

            <div style={{ marginLeft: "260px", padding: "32px 36px", maxWidth: "1400px" }}>

                {/* ── Top Bar ── */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                    <div>
                        <div style={{
                            fontSize: "11px", fontWeight: 600, color: T.muted,
                            textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "8px",
                        }}>
                            Monitoring MBG
                        </div>
                        <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 800, color: T.text, letterSpacing: "-.6px" }}>
                            Laporan SPPG
                        </h1>
                    </div>

                    <div style={{
                        fontSize: "12px", color: T.sub, fontWeight: 500,
                        padding: "9px 16px", borderRadius: "10px",
                        background: T.elevated, border: `0.5px solid ${T.border}`,
                    }}>
                        {today}
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
                        {/* ── KPI Grid ── */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "24px" }}>
                            <KpiCard label="Total Distribusi" value={summary.total_distribusi} icon={FileBarChart2} accent={T.accent} />
                            <KpiCard label="Total Porsi"      value={summary.total_porsi}      icon={Package}       accent={T.teal}   />
                            <KpiCard label="Total Sekolah"    value={summary.total_sekolah}    icon={School}        accent={T.green}  />
                            <KpiCard label="Total SPPG"       value={summary.total_sppg}       icon={Building2}     accent={T.amber}  />
                        </div>

                        {/* ── Search + Table ── */}
                        <div style={{
                            background: T.elevated,
                            border: `0.5px solid ${T.border}`,
                            borderRadius: "18px",
                            padding: "22px",
                        }}>
                            <SectionHeader label="Rekap Distribusi MBG" />

                            {/* Search */}
                            <div style={{ position: "relative", marginBottom: "16px" }}>
                                <Search size={15} style={{
                                    position: "absolute", top: "50%", left: "14px",
                                    transform: "translateY(-50%)", color: T.muted,
                                    pointerEvents: "none",
                                }} />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari tanggal laporan..."
                                    style={{
                                        width: "100%",
                                        boxSizing: "border-box",
                                        padding: "11px 14px 11px 40px",
                                        border: `0.5px solid ${T.border}`,
                                        borderRadius: "10px",
                                        background: T.card,
                                        color: T.text,
                                        fontSize: "13px",
                                        fontFamily: T.font,
                                        outline: "none",
                                    }}
                                    onFocus={e => e.target.style.borderColor = `${T.accent}60`}
                                    onBlur={e => e.target.style.borderColor = T.border}
                                />
                            </div>

                            {/* Table */}
                            <div style={{ borderRadius: "12px", overflow: "hidden", border: `0.5px solid ${T.border}` }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: T.font }}>
                                    <thead>
                                        <tr style={{ background: T.card }}>
                                            {["Tanggal", "Total Distribusi", "Total Porsi"].map((h) => (
                                                <th key={h} style={{
                                                    padding: "13px 18px",
                                                    textAlign: "left",
                                                    fontSize: "11px",
                                                    fontWeight: 700,
                                                    color: T.muted,
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.8px",
                                                    borderBottom: `0.5px solid ${T.border}`,
                                                }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" style={{
                                                    textAlign: "center",
                                                    padding: "48px",
                                                    color: T.muted,
                                                    fontSize: "13px",
                                                }}>
                                                    Belum ada laporan
                                                </td>
                                            </tr>
                                        ) : filtered.map((item, i) => (
                                            <tr key={i}
                                                style={{ transition: "background .15s" }}
                                                onMouseEnter={e => e.currentTarget.style.background = T.card}
                                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                            >
                                                {/* Tanggal */}
                                                <td style={{
                                                    padding: "15px 18px",
                                                    borderTop: `0.5px solid ${T.border}`,
                                                    fontSize: "13px", color: T.text, fontWeight: 500,
                                                }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <div style={{
                                                            width: "28px", height: "28px", borderRadius: "8px",
                                                            background: `${T.accent}18`,
                                                            border: `0.5px solid ${T.accent}30`,
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                        }}>
                                                            <CalendarDays size={13} color={T.accent} strokeWidth={1.8} />
                                                        </div>
                                                        {item.tanggal}
                                                    </div>
                                                </td>

                                                {/* Total Distribusi */}
                                                <td style={{
                                                    padding: "15px 18px",
                                                    borderTop: `0.5px solid ${T.border}`,
                                                    fontSize: "14px", color: T.text, fontWeight: 700,
                                                }}>
                                                    <span style={{
                                                        fontSize: "12px", fontWeight: 700, color: T.teal,
                                                        background: "rgba(14,165,233,.10)",
                                                        border: "0.5px solid rgba(14,165,233,.25)",
                                                        padding: "3px 10px", borderRadius: "20px",
                                                    }}>
                                                        {num(item.total_distribusi)}
                                                    </span>
                                                </td>

                                                {/* Total Porsi */}
                                                <td style={{
                                                    padding: "15px 18px",
                                                    borderTop: `0.5px solid ${T.border}`,
                                                    fontSize: "13px", color: T.sub,
                                                }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                        <TrendingUp size={13} color={T.green} strokeWidth={2} />
                                                        <span style={{ fontWeight: 700, color: T.green }}>{num(item.total_porsi)}</span>
                                                        <span style={{ color: T.muted, fontSize: "12px" }}>porsi</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer count */}
                            {filtered.length > 0 && (
                                <div style={{ marginTop: "12px", fontSize: "12px", color: T.muted, textAlign: "right" }}>
                                    Menampilkan <span style={{ color: T.sub, fontWeight: 600 }}>{filtered.length}</span> laporan
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}