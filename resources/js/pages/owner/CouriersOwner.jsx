// resources/js/pages/owner/CouriersOwner.jsx

import { useEffect, useState } from "react";
import axios from "axios";

import {
    Truck,
    Users,
    CheckCircle,
    Clock,
} from "lucide-react";

import OwnerLayout from "../../layouts/OwnerLayout";

function MetricCard({ title, value = 0, icon, color = "#60a5fa" }) {
    return (
        <div
            style={{
                background: "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))",
                border: "1px solid rgba(148,163,184,0.08)",
                borderRadius: "20px",
                padding: "20px 22px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 12px 32px rgba(0,0,0,0.28)",
            }}
        >
            <div>
                <div
                    style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.6px",
                        marginBottom: "8px",
                    }}
                >
                    {title}
                </div>
                <div
                    style={{
                        fontSize: "30px",
                        fontWeight: "800",
                        color: "white",
                        lineHeight: 1,
                    }}
                >
                    {value}
                </div>
            </div>
            <div
                style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "16px",
                    background: "rgba(59,130,246,0.10)",
                    border: "1px solid rgba(59,130,246,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color,
                }}
            >
                {icon}
            </div>
        </div>
    );
}

function EmptyState({ title, subtitle, icon }) {
    return (
        <div
            style={{
                minHeight: "300px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: "20px",
            }}
        >
            <div
                style={{
                    width: "84px",
                    height: "84px",
                    borderRadius: "24px",
                    background: "rgba(59,130,246,0.10)",
                    border: "1px solid rgba(59,130,246,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#60a5fa",
                    marginBottom: "24px",
                }}
            >
                {icon}
            </div>
            <h3 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "white" }}>
                {title}
            </h3>
            <p
                style={{
                    margin: "12px 0 0",
                    maxWidth: "520px",
                    color: "#94a3b8",
                    fontSize: "15px",
                    lineHeight: "1.8",
                }}
            >
                {subtitle}
            </p>
        </div>
    );
}

const STATUS_COLORS = {
    approved: "#22c55e",
    pending:  "#f59e0b",
    rejected: "#ef4444",
};

export default function CouriersOwner() {
    const [couriers, setCouriers] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);

    useEffect(() => {
        fetchCouriers();
    }, []);

    const fetchCouriers = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get("/owner/couriers");
            setCouriers(res.data || []);
        } catch (err) {
            console.error(err);
            setError("Gagal memuat data kurir.");
        } finally {
            setLoading(false);
        }
    };

    const totalApproved = couriers.filter((c) => c.status === "approved").length;
    const totalPending  = couriers.filter((c) => c.status === "pending").length;

    return (
        <OwnerLayout>
            {/* Header */}
            <div style={{ marginBottom: "30px" }}>
                <h1
                    style={{
                        margin: 0,
                        fontSize: "34px",
                        fontWeight: "800",
                        color: "white",
                    }}
                >
                    Couriers
                </h1>
                <p
                    style={{
                        margin: "10px 0 0",
                        color: "#94a3b8",
                        fontSize: "14px",
                        lineHeight: "1.8",
                        maxWidth: "650px",
                    }}
                >
                    Lihat daftar kurir yang terdaftar di catering Anda.
                </p>
            </div>

            {/* Metrics */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "20px",
                    marginBottom: "24px",
                }}
            >
                <MetricCard
                    title="Total Kurir"
                    value={couriers.length}
                    icon={<Users size={22} />}
                    color="#10b981"
                />
                <MetricCard
                    title="Kurir Aktif"
                    value={totalApproved}
                    icon={<Truck size={22} />}
                    color="#3b82f6"
                />
                <MetricCard
                    title="Kurir Disetujui"
                    value={totalApproved}
                    icon={<CheckCircle size={22} />}
                    color="#22c55e"
                />
                <MetricCard
                    title="Menunggu Persetujuan"
                    value={totalPending}
                    icon={<Clock size={22} />}
                    color="#f59e0b"
                />
            </div>

            {/* Courier Table */}
            <div
                style={{
                    background: "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))",
                    border: "1px solid rgba(148,163,184,0.08)",
                    borderRadius: "24px",
                    padding: "28px",
                    marginBottom: "24px",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.30)",
                    overflowX: "auto",
                }}
            >
                <div style={{ marginBottom: "22px" }}>
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "22px",
                            fontWeight: "700",
                            color: "white",
                        }}
                    >
                        Daftar Kurir
                    </h2>
                </div>

                {/* Loading & Error states */}
                {loading && (
                    <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px 0" }}>
                        Memuat data...
                    </p>
                )}

                {error && (
                    <p style={{ color: "#ef4444", textAlign: "center", padding: "40px 0" }}>
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            minWidth: "900px",
                        }}
                    >
                        <thead>
                            <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                                {[
                                    "Nama Kurir",
                                    "Email",
                                    "No. Telepon",
                                    "Nama Tempat",
                                    "Alamat Tempat",
                                    "Status",
                                ].map((item) => (
                                    <th
                                        key={item}
                                        style={{
                                            padding: "16px",
                                            textAlign: "left",
                                            color: "#cbd5e1",
                                            fontSize: "13px",
                                            fontWeight: "600",
                                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                                        }}
                                    >
                                        {item}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {couriers.map((courier) => (
                                <tr
                                    key={courier.id}
                                    style={{
                                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                                        transition: "background 0.15s",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.background = "rgba(255,255,255,0.03)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.background = "transparent")
                                    }
                                >
                                    <td style={{ padding: "16px", color: "white", fontWeight: "600" }}>
                                        {courier.name}
                                    </td>
                                    <td style={{ padding: "16px", color: "#cbd5e1" }}>
                                        {courier.email ?? "-"}
                                    </td>
                                    <td style={{ padding: "16px", color: "#cbd5e1" }}>
                                        {courier.phone ?? "-"}
                                    </td>
                                    <td style={{ padding: "16px", color: "#cbd5e1" }}>
                                        {courier.nama_tempat_kurir ?? "-"}
                                    </td>
                                    <td style={{ padding: "16px", color: "#cbd5e1", maxWidth: "200px" }}>
                                        {courier.alamat_tempat_kurir ?? "-"}
                                    </td>
                                    <td style={{ padding: "16px" }}>
                                        <span
                                            style={{
                                                display: "inline-block",
                                                padding: "4px 12px",
                                                borderRadius: "999px",
                                                fontSize: "12px",
                                                fontWeight: "700",
                                                background: `${STATUS_COLORS[courier.status] ?? "#64748b"}22`,
                                                color: STATUS_COLORS[courier.status] ?? "#64748b",
                                                border: `1px solid ${STATUS_COLORS[courier.status] ?? "#64748b"}44`,
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            {courier.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {!loading && !error && couriers.length === 0 && (
                    <EmptyState
                        title="Belum Ada Kurir"
                        subtitle="Kurir yang mendaftar ke catering Anda akan muncul di sini setelah disetujui admin."
                        icon={<Truck size={38} />}
                    />
                )}
            </div>
        </OwnerLayout>
    );
}