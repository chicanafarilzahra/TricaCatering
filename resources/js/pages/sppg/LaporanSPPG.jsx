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
    teal:     "#0EA5E9",
    green:    "#10B981",
    amber:    "#F59E0B",
    purple:   "#A78BFA",
    font:     "'Inter', system-ui, sans-serif",
};

if (typeof document !== "undefined" && !document.getElementById("sppg-inter")) {
    const l = document.createElement("link");
    l.id = "sppg-inter"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";
    document.head.appendChild(l);
}

const num = (v) => (v ?? 0).toLocaleString("id-ID");

const fmtTanggal = (raw) => {
    if (!raw) return "—";
    return new Date(raw).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
    });
};

function KpiCard({ label, value, icon: Icon, accent = T.accent }) {
    return (
        <div style={{
            background: T.elevated, border: `0.5px solid ${T.border}`,
            borderRadius: "16px", padding: "22px 24px",
            position: "relative", overflow: "hidden", fontFamily: T.font,
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
                    background: `${accent}18`, border: `0.5px solid ${accent}30`,
                    display: "flex", alignItems: "center", justifyContent: "center", color: accent,
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

export default function LaporanSPPG() {
    const [summary, setSummary] = useState({});
    const [laporan, setLaporan] = useState([]);
    const [search,  setSearch]  = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadLaporan(); }, []);

    const loadLaporan = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            const res = await axios.get("/sppg/laporan", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSummary(res.data.summary ?? {});
            setLaporan(res.data.data ?? []);
        } catch (err) {
            console.error(err);
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

    const COLS = ["Tanggal", "Total Distribusi", "Total Porsi"];

    return (
        <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
            <style>{`
                html,body{margin:0;padding:0;background:${T.bg}}
                *{box-sizing:border-box}
                ::-webkit-scrollbar{width:4px}
                ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}
                @keyframes spin{to{transform:rotate(360deg)}}
            `}</style>

            <SidebarSPPG />

            <div style={{ marginLeft: "260px", padding: "32px 36px", maxWidth: "1400px" }}>

                {/* ── Header ── */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                    <div>
                        <div style={{ fontSize: "11px", fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "8px" }}>
                            Monitoring MBG
                        </div>
                        <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 800, color: T.text, letterSpacing: "-.6px" }}>
                            Laporan SPPG
                        </h1>
                    </div>
                    <div style={{ fontSize: "12px", color: T.sub, fontWeight: 500, padding: "9px 16px", borderRadius: "10px", background: T.elevated, border: `0.5px solid ${T.border}` }}>
                        {today}
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: `2px solid ${T.border}`, borderTopColor: T.accent, animation: "spin 0.8s linear infinite" }} />
                    </div>
                ) : (
                    <>
                        {/* ── KPI ── */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "24px" }}>
                            <KpiCard label="Total Distribusi" value={summary.total_distribusi} icon={FileBarChart2} accent={T.accent} />
                            <KpiCard label="Total Porsi"      value={summary.total_porsi}      icon={Package}       accent={T.teal}   />
                            <KpiCard label="Total Sekolah"    value={summary.total_sekolah}    icon={School}        accent={T.green}  />
                            <KpiCard label="Total SPPG"       value={summary.total_sppg}       icon={Building2}     accent={T.amber}  />
                        </div>

                        {/* ── Table Card ── */}
                        <div style={{ background: T.elevated, border: `0.5px solid ${T.border}`, borderRadius: "18px", overflow: "hidden" }}>

                            {/* Toolbar */}
                            <div style={{ padding: "18px 22px", borderBottom: `0.5px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ fontSize: "15px", fontWeight: 700, color: T.text }}>Rekap Distribusi MBG</div>
                                    <div style={{ fontSize: "12px", color: T.muted, marginTop: "3px" }}>Dikelompokkan per tanggal distribusi</div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", background: T.card, border: `0.5px solid ${T.border}`, borderRadius: "10px", padding: "0 14px", height: "38px" }}>
                                    <Search size={14} color={T.muted} />
                                    <input
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Cari tanggal..."
                                        style={{ background: "none", border: "none", outline: "none", color: T.text, fontSize: "13px", fontFamily: T.font, width: "180px" }}
                                    />
                                </div>
                            </div>

                            {/* Table */}
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                                    <thead>
                                        <tr>
                                            {COLS.map(h => (
                                                <th key={h} style={{
                                                    padding: "12px 20px", textAlign: "left",
                                                    fontSize: "11px", fontWeight: 700, color: T.muted,
                                                    textTransform: "uppercase", letterSpacing: "0.8px",
                                                    borderBottom: `0.5px solid ${T.border}`,
                                                    background: T.card, whiteSpace: "nowrap",
                                                }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} style={{ padding: "52px", textAlign: "center", color: T.muted, fontSize: "13px" }}>
                                                    {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada laporan distribusi"}
                                                </td>
                                            </tr>
                                        ) : filtered.map((item, i) => (
                                            <tr key={i}
                                                style={{ borderBottom: `0.5px solid rgba(255,255,255,.04)`, transition: "background .15s" }}
                                                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                            >
                                                {/* Tanggal */}
                                                <td style={{ padding: "15px 20px", color: T.text, fontWeight: 500 }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                        <div style={{
                                                            width: "30px", height: "30px", borderRadius: "9px",
                                                            background: `${T.accent}18`, border: `0.5px solid ${T.accent}30`,
                                                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                                        }}>
                                                            <CalendarDays size={13} color={T.accent} strokeWidth={1.8} />
                                                        </div>
                                                        {fmtTanggal(item.tanggal)}
                                                    </div>
                                                </td>

                                                {/* Total Distribusi */}
                                                <td style={{ padding: "15px 20px" }}>
                                                    <span style={{
                                                        fontSize: "12px", fontWeight: 700, color: T.teal,
                                                        background: "rgba(14,165,233,.10)",
                                                        border: "0.5px solid rgba(14,165,233,.25)",
                                                        padding: "4px 12px", borderRadius: "20px",
                                                    }}>
                                                        {num(item.total_distribusi)} distribusi
                                                    </span>
                                                </td>

                                                {/* Total Porsi */}
                                                <td style={{ padding: "15px 20px" }}>
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

                            {/* Footer */}
                            {filtered.length > 0 && (
                                <div style={{ padding: "12px 22px", borderTop: `0.5px solid ${T.border}`, fontSize: "12px", color: T.muted }}>
                                    Menampilkan <span style={{ color: T.sub, fontWeight: 600 }}>{filtered.length}</span> dari{" "}
                                    <span style={{ color: T.sub, fontWeight: 600 }}>{laporan.length}</span> laporan
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}