// resources/js/pages/owner/CouriersOwner.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import {
    Truck, Users, CheckCircle, Clock,
    LayoutDashboard, XCircle,
} from "lucide-react";
import OwnerLayout from "../../layouts/OwnerLayout";

/* ── font injection ─────────────────────────────────────────── */
if (typeof document !== "undefined" && !document.getElementById("inter-font")) {
    const l = document.createElement("link");
    l.id   = "inter-font";
    l.rel  = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(l);
}

/* ── tokens (same as StocksOwner) ───────────────────────────── */
const C = {
    bg:      "#080C14",
    surface: "#0F1623",
    card:    "#141E30",
    border:  "rgba(255,255,255,0.07)",
    borderMd:"rgba(255,255,255,0.10)",
    text:    "#F8FAFC",
    muted:   "#64748B",
    sub:     "#94A3B8",
    font:    "'Inter', system-ui, -apple-system, sans-serif",
};

const bars = {
    indigo: "linear-gradient(90deg,#6366f1,#818cf8)",
    green:  "linear-gradient(90deg,#10b981,#34d399)",
    blue:   "linear-gradient(90deg,#3b82f6,#60a5fa)",
    amber:  "linear-gradient(90deg,#f59e0b,#fbbf24)",
};

/* ── status config ───────────────────────────────────────────── */
const STATUS_MAP = {
    approved: { label: "Disetujui", color: "#10b981", fill: "rgba(16,185,129,.12)",  border: "rgba(16,185,129,.30)" },
    pending:  { label: "Menunggu",  color: "#f59e0b", fill: "rgba(245,158,11,.12)",  border: "rgba(245,158,11,.30)" },
    rejected: { label: "Ditolak",   color: "#ef4444", fill: "rgba(239,68,68,.12)",   border: "rgba(239,68,68,.30)"  },
};

function getStatusStyle(status) {
    return STATUS_MAP[status] ?? {
        label: status ?? "-",
        color: "#64748b",
        fill: "rgba(100,116,139,.12)",
        border: "rgba(100,116,139,.30)",
    };
}

/* ── StatCard ───────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, bar }) {
    return (
        <div style={{
            background: C.surface, border: `0.5px solid ${C.border}`,
            borderRadius: "12px", padding: "18px 20px",
            position: "relative", overflow: "hidden", fontFamily: C.font,
        }}>
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: "2px", background: bar,
            }} />
            <div style={{
                fontSize: "11px", fontWeight: 600, color: C.muted,
                textTransform: "uppercase", letterSpacing: ".7px", marginBottom: "10px",
            }}>{label}</div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div style={{
                    fontSize: "30px", fontWeight: 800, color: C.text,
                    letterSpacing: "-1.2px", lineHeight: 1,
                }}>{value ?? "—"}</div>
                <div style={{
                    width: "38px", height: "38px", borderRadius: "9px",
                    background: C.card, border: `0.5px solid ${C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: C.muted, flexShrink: 0,
                }}>
                    <Icon size={18} strokeWidth={1.7} />
                </div>
            </div>
        </div>
    );
}

/* ── EmptyState ─────────────────────────────────────────────── */
function EmptyState({ title, subtitle, icon: Icon }) {
    return (
        <div style={{
            padding: "48px 20px", display: "flex",
            flexDirection: "column", alignItems: "center", textAlign: "center",
            fontFamily: C.font,
        }}>
            <div style={{
                width: "60px", height: "60px", borderRadius: "16px",
                background: C.card, border: `0.5px solid ${C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: C.muted, marginBottom: "16px",
            }}>
                <Icon size={26} strokeWidth={1.4} />
            </div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: C.text, marginBottom: "6px" }}>{title}</div>
            <p style={{ fontSize: "13px", color: C.muted, lineHeight: "1.7", maxWidth: "360px", margin: 0 }}>{subtitle}</p>
        </div>
    );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function CouriersOwner() {
    const [couriers, setCouriers] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(null);

    useEffect(() => { fetchCouriers(); }, []);

    const fetchCouriers = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get("/owner/couriers");
            setCouriers(Array.isArray(res.data) ? res.data : res.data.data ?? []);
        } catch (err) {
            console.error(err);
            setError("Gagal memuat data kurir.");
        } finally {
            setLoading(false);
        }
    };

    /* ── derived counts ── */
    const totalCount    = couriers.length;
    const approvedCount = couriers.filter(c => c.status === "approved").length;
    const pendingCount  = couriers.filter(c => c.status === "pending").length;
    const rejectedCount = couriers.filter(c => c.status === "rejected").length;

    return (
        <OwnerLayout>
            <div style={{ fontFamily: C.font }}>

                {/* ── header ── */}
                <div style={{ marginBottom: "28px" }}>
                    <div style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        fontSize: "11px", fontWeight: 600, color: C.muted,
                        textTransform: "uppercase", letterSpacing: ".8px",
                        marginBottom: "14px",
                    }}>
                        <LayoutDashboard size={13} strokeWidth={2} />
                        <span>Owner</span>
                        <span style={{ color: "#1E293B" }}>›</span>
                        <span>Couriers</span>
                    </div>
                    <h1 style={{
                        fontSize: "28px", fontWeight: 800, color: C.text,
                        letterSpacing: "-.8px", lineHeight: 1.1, margin: 0,
                    }}>Manajemen kurir</h1>
                    <p style={{ marginTop: "8px", fontSize: "13.5px", color: C.muted, lineHeight: "1.7" }}>
                        Lihat daftar kurir yang terdaftar di catering Anda beserta status persetujuannya.
                    </p>
                </div>

                {/* ── stat cards ── */}
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(4,1fr)",
                    gap: "12px", marginBottom: "22px",
                }}>
                    <StatCard label="Total kurir"         value={totalCount    || null} icon={Users}        bar={bars.indigo} />
                    <StatCard label="Kurir aktif"         value={approvedCount || null} icon={Truck}        bar={bars.green}  />
                    <StatCard label="Menunggu persetujuan"value={pendingCount  || null} icon={Clock}        bar={bars.amber}  />
                    <StatCard label="Ditolak"             value={rejectedCount || null} icon={XCircle}      bar={bars.blue}   />
                </div>

                {/* ── courier table ── */}
                <div style={{
                    background: C.surface, border: `0.5px solid ${C.border}`,
                    borderRadius: "14px", overflow: "hidden",
                }}>
                    <div style={{ padding: "18px 22px", borderBottom: `0.5px solid ${C.border}` }}>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: C.text }}>Daftar kurir</div>
                        <div style={{ fontSize: "12px", color: C.muted, marginTop: "3px" }}>
                            Seluruh kurir yang terdaftar beserta status dan informasi kontak
                        </div>
                    </div>

                    {/* loading */}
                    {loading && (
                        <div style={{ padding: "48px 20px", textAlign: "center", color: C.muted, fontSize: "13px" }}>
                            Memuat data...
                        </div>
                    )}

                    {/* error */}
                    {!loading && error && (
                        <div style={{ padding: "48px 20px", textAlign: "center", color: "#ef4444", fontSize: "13px" }}>
                            {error}
                        </div>
                    )}

                    {/* empty */}
                    {!loading && !error && couriers.length === 0 && (
                        <EmptyState
                            title="Belum ada kurir"
                            subtitle="Kurir yang mendaftar ke catering Anda akan muncul di sini setelah disetujui admin."
                            icon={Truck}
                        />
                    )}

                    {/* table */}
                    {!loading && !error && couriers.length > 0 && (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{
                                width: "100%", borderCollapse: "collapse",
                                fontSize: "13px", minWidth: "700px",
                            }}>
                                <thead>
                                    <tr>
                                        {["Nama kurir","Email","No. telepon","Nama tempat","Alamat","Status"].map(h => (
                                            <th key={h} style={{
                                                padding: "11px 16px", textAlign: "left",
                                                fontSize: "11px", fontWeight: 600,
                                                color: C.muted, textTransform: "uppercase",
                                                letterSpacing: ".6px",
                                                borderBottom: `0.5px solid ${C.border}`,
                                                whiteSpace: "nowrap",
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {couriers.map(courier => {
                                        const st = getStatusStyle(courier.status);
                                        return (
                                            <tr key={courier.id} style={{ borderBottom: `0.5px solid rgba(255,255,255,.04)` }}>
                                                <td style={{ padding: "12px 16px", fontWeight: 600, color: C.text }}>
                                                    {courier.name}
                                                </td>
                                                <td style={{ padding: "12px 16px", color: C.sub }}>
                                                    {courier.email ?? "-"}
                                                </td>
                                                <td style={{ padding: "12px 16px", color: C.sub }}>
                                                    {courier.no_hp ?? courier.no_telp ?? "-"}
                                                </td>
                                                <td style={{ padding: "12px 16px", color: C.sub }}>
                                                    {courier.nama_tempat_kurir ?? "-"}
                                                </td>
                                                <td style={{ padding: "12px 16px", color: C.sub, maxWidth: "200px" }}>
                                                    {courier.alamat_tempat_kurir ?? "-"}
                                                </td>
                                                <td style={{ padding: "12px 16px" }}>
                                                    <span style={{
                                                        display: "inline-flex", alignItems: "center",
                                                        fontSize: "11px", fontWeight: 600,
                                                        padding: "3px 10px", borderRadius: "20px",
                                                        background: st.fill,
                                                        border: `0.5px solid ${st.border}`,
                                                        color: st.color,
                                                    }}>{st.label}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </OwnerLayout>
    );
}