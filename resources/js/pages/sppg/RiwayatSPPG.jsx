import { useEffect, useState } from "react";
import axios from "axios";
import SidebarSPPG from "../../components/SidebarSPPG";
import { History, CheckCircle, XCircle, Package, Search, ChevronRight } from "lucide-react";

/* ─── Design Tokens ─────────────────────────────────────────────── */
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
    red:      "#EF4444",
    font:     "'Inter', system-ui, sans-serif",
};

if (typeof document !== "undefined" && !document.getElementById("sppg-inter")) {
    const l = document.createElement("link");
    l.id = "sppg-inter"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";
    document.head.appendChild(l);
}

/* ─── KPI Card ───────────────────────────────────────────────────── */
function KpiCard({ label, value, icon: Icon, accent }) {
    return (
        <div style={{
            background: T.elevated, border: `0.5px solid ${T.border}`,
            borderRadius: "16px", padding: "20px 22px",
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
                    <Icon size={15} strokeWidth={1.8} />
                </div>
            </div>
            <div style={{ marginTop: "14px", fontSize: "28px", fontWeight: 800, color: T.text, letterSpacing: "-1px", lineHeight: 1 }}>
                {value ?? 0}
            </div>
        </div>
    );
}

/* ─── Section Header ─────────────────────────────────────────────── */
function SectionHeader({ label }) {
    return (
        <div style={{ marginBottom: "16px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: T.text, letterSpacing: "-.2px" }}>{label}</span>
        </div>
    );
}

/* ─── Status Badge ───────────────────────────────────────────────── */
function StatusBadge({ status }) {
    const s = status?.toLowerCase();
    const map = {
        berhasil: { color: T.green, bg: `${T.green}15`, border: `${T.green}30`, label: "Berhasil" },
        sukses:   { color: T.green, bg: `${T.green}15`, border: `${T.green}30`, label: "Berhasil" },
        gagal:    { color: T.red,   bg: `${T.red}15`,   border: `${T.red}30`,   label: "Gagal"    },
        pending:  { color: T.amber, bg: `${T.amber}15`, border: `${T.amber}30`, label: "Pending"  },
    };
    const cfg = map[s] || { color: T.sub, bg: `${T.sub}10`, border: `${T.sub}20`, label: status };
    return (
        <span style={{
            fontSize: "11.5px", fontWeight: 700, color: cfg.color,
            background: cfg.bg, border: `0.5px solid ${cfg.border}`,
            padding: "3px 10px", borderRadius: "20px", whiteSpace: "nowrap",
        }}>
            {cfg.label}
        </span>
    );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function RiwayatSPPG() {
    const [summary, setSummary] = useState({});
    const [data,    setData]    = useState([]);
    const [search,  setSearch]  = useState("");

    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await axios.get("/sppg/riwayat");
            setSummary(res.data.summary);
            setData(res.data.data);
        } catch (err) { console.log(err); }
    };

    const filtered = data.filter(item =>
        item.sekolah?.nama_sekolah?.toLowerCase().includes(search.toLowerCase())
    );

    const formatTanggal = (raw) => {
        if (!raw) return "—";
        return new Date(raw).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    };

    return (
        <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
            <style>{`
                html,body{margin:0;padding:0;overflow-x:hidden;background:${T.bg}}
                *{box-sizing:border-box}
                ::-webkit-scrollbar{width:4px}
                ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}
                ::placeholder{color:${T.muted}!important;opacity:.6}
                tbody tr:hover td{background:rgba(255,255,255,0.018)!important}
            `}</style>

            <SidebarSPPG />

            <div style={{ marginLeft: "260px", padding: "32px 36px", maxWidth: "1400px" }}>

                {/* ── Top Bar ── */}
                <div style={{ marginBottom: "28px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "8px" }}>
                        Monitoring MBG
                    </div>
                    <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 800, color: T.text, letterSpacing: "-.6px" }}>
                        Riwayat Distribusi
                    </h1>
                </div>

                {/* ── KPI Grid ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "22px" }}>
                    <KpiCard label="Total Distribusi" value={summary.total_distribusi} icon={History}      accent={T.accent} />
                    <KpiCard label="Total Porsi"       value={summary.total_porsi}      icon={Package}      accent={T.teal}   />
                    <KpiCard label="Berhasil"          value={summary.berhasil}         icon={CheckCircle}  accent={T.green}  />
                    <KpiCard label="Gagal"             value={summary.gagal}            icon={XCircle}      accent={T.red}    />
                </div>

                {/* ── Table Card ── */}
                <div style={{
                    background: T.elevated, border: `0.5px solid ${T.border}`,
                    borderRadius: "18px", overflow: "hidden",
                }}>
                    {/* Search */}
                    <div style={{ padding: "18px 22px", borderBottom: `0.5px solid ${T.border}` }}>
                        <SectionHeader label="Daftar Riwayat Pengiriman" />
                        <div style={{ position: "relative" }}>
                            <Search size={15} color={T.muted} style={{ position: "absolute", top: "50%", left: "13px", transform: "translateY(-50%)" }} />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari sekolah..."
                                style={{
                                    width: "100%", paddingLeft: "38px", padding: "9px 12px 9px 38px",
                                    background: T.card, border: `0.5px solid ${T.border}`,
                                    borderRadius: "10px", color: T.text,
                                    fontSize: "13px", outline: "none", fontFamily: T.font,
                                }}
                                onFocus={e => e.target.style.borderColor = `${T.accent}60`}
                                onBlur={e => e.target.style.borderColor = T.border}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <table style={{ width: "100%", borderCollapse: "collapse", color: T.text }}>
                        <thead>
                            <tr style={{ background: "rgba(255,255,255,0.025)" }}>
                                {["Tanggal", "Sekolah", "Menu", "Porsi", "Status"].map(h => (
                                    <th key={h} style={{
                                        padding: "13px 20px", textAlign: "left",
                                        fontSize: "11px", fontWeight: 700,
                                        color: T.muted, textTransform: "uppercase", letterSpacing: "1px",
                                        borderBottom: `0.5px solid ${T.border}`,
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: "48px", textAlign: "center", color: T.muted, fontSize: "13px" }}>
                                        {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada riwayat distribusi"}
                                    </td>
                                </tr>
                            ) : filtered.map(item => (
                                <tr key={item.id}>
                                    <td style={{ padding: "14px 20px", borderBottom: `0.5px solid ${T.border}`, fontSize: "12.5px", color: T.sub, whiteSpace: "nowrap" }}>
                                        {formatTanggal(item.tanggal)}
                                    </td>
                                    <td style={{ padding: "14px 20px", borderBottom: `0.5px solid ${T.border}`, fontSize: "13.5px", fontWeight: 600, color: T.text }}>
                                        {item.sekolah?.nama_sekolah ?? "—"}
                                    </td>
                                    <td style={{ padding: "14px 20px", borderBottom: `0.5px solid ${T.border}`, fontSize: "13px", color: T.sub }}>
                                        {item.menu?.nama_menu ?? "—"}
                                    </td>
                                    <td style={{ padding: "14px 20px", borderBottom: `0.5px solid ${T.border}`, fontSize: "13px", fontWeight: 600, color: T.text }}>
                                        {item.jumlah_porsi ?? "—"}
                                        <span style={{ fontSize: "11px", color: T.muted, fontWeight: 400, marginLeft: "4px" }}>porsi</span>
                                    </td>
                                    <td style={{ padding: "14px 20px", borderBottom: `0.5px solid ${T.border}` }}>
                                        <StatusBadge status={item.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Footer count */}
                    {filtered.length > 0 && (
                        <div style={{
                            padding: "12px 22px",
                            borderTop: `0.5px solid ${T.border}`,
                            fontSize: "12px", color: T.muted,
                        }}>
                            Menampilkan <span style={{ color: T.sub, fontWeight: 600 }}>{filtered.length}</span> dari <span style={{ color: T.sub, fontWeight: 600 }}>{data.length}</span> distribusi
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}