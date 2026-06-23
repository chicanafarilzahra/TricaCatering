// resources/js/pages/Klien/PesananSaya.jsx

import React, { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import NavbarKlien from "../../components/NavbarKlien";

/* ----------------------------------------------------------------
 * GLOBAL STYLE RESET
 * Disuntikkan langsung ke <head> agar tidak ada gap putih dari
 * margin/padding default html & body, terlepas dari layout luar.
 * Aman dipasang berkali-kali karena memakai id unik dan dibersihkan
 * saat komponen unmount.
 * ---------------------------------------------------------------- */
const GLOBAL_RESET_ID = "pesanan-saya-global-reset";
const GLOBAL_RESET_CSS = `
    html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #0B1220 !important;
        overflow-x: hidden !important;
        width: 100% !important;
        min-width: 100% !important;
    }
    #app, #root, body > div {
        margin: 0 !important;
        padding: 0 !important;
        max-width: none !important;
        width: 100% !important;
    }
    * {
        box-sizing: border-box;
    }
`;

function useGlobalDarkReset() {
    useEffect(() => {
        let styleTag = document.getElementById(GLOBAL_RESET_ID);
        const createdHere = !styleTag;
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = GLOBAL_RESET_ID;
            document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = GLOBAL_RESET_CSS;

        return () => {
            if (createdHere && styleTag?.parentNode) {
                styleTag.parentNode.removeChild(styleTag);
            }
        };
    }, []);
}

/* ----------------------------------------------------------------
 * KONFIGURASI STATUS
 * Satu sumber kebenaran untuk warna, label, dan urutan status.
 * ---------------------------------------------------------------- */
const STATUS_CONFIG = {
    Pending: { bg: "#FFF7ED", color: "#C2410C", dot: "#FB923C", label: "Pending" },
    Diproses: { bg: "#EFF6FF", color: "#1D4ED8", dot: "#60A5FA", label: "Diproses" },
    Dikirim: { bg: "#EEF2FF", color: "#4338CA", dot: "#818CF8", label: "Dikirim" },
    Selesai: { bg: "#ECFDF5", color: "#047857", dot: "#34D399", label: "Selesai" },
    Dibatalkan: { bg: "#FEF2F2", color: "#B91C1C", dot: "#F87171", label: "Dibatalkan" },
};

const FILTERS = ["Semua", "Pending", "Diproses", "Dikirim", "Selesai", "Dibatalkan"];

const getStatusMeta = (status) =>
    STATUS_CONFIG[status] || {
        bg: "#F1F5F9",
        color: "#475569",
        dot: "#94A3B8",
        label: status || "Tidak diketahui",
    };

const formatRupiah = (value) =>
    `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

const formatTanggal = (dateStr) => {
    if (!dateStr) return "-";
    try {
        return new Date(dateStr).toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return dateStr;
    }
};

const getGreetingName = (pesanan) => {
    const withUser = pesanan.find((p) => p?.user?.name);
    return withUser?.user?.name || null;
};

/* ----------------------------------------------------------------
 * SKELETON CARD — ditampilkan saat loading, menggantikan teks
 * "Loading..." polos agar terasa lebih profesional.
 * ---------------------------------------------------------------- */
function SkeletonCard() {
    return (
        <div
            style={{
                background: "#111827",
                borderRadius: "20px",
                padding: "26px",
                border: "1px solid rgba(255,255,255,0.05)",
            }}
        >
            <div
                style={{
                    width: "60%",
                    height: "20px",
                    borderRadius: "6px",
                    background: "rgba(255,255,255,0.06)",
                    marginBottom: "10px",
                }}
            />
            <div
                style={{
                    width: "30%",
                    height: "12px",
                    borderRadius: "6px",
                    background: "rgba(255,255,255,0.04)",
                    marginBottom: "22px",
                }}
            />
            <div
                style={{
                    width: "100%",
                    height: "14px",
                    borderRadius: "6px",
                    background: "rgba(255,255,255,0.04)",
                    marginBottom: "10px",
                }}
            />
            <div
                style={{
                    width: "100%",
                    height: "14px",
                    borderRadius: "6px",
                    background: "rgba(255,255,255,0.04)",
                }}
            />
        </div>
    );
}

export default function PesananSaya() {
    useGlobalDarkReset();

    const [pesanan, setPesanan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("Semua");
    const [search, setSearch] = useState("");

    const getPesanan = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get("/api/klien/orders");
            const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
            // Urutkan dari yang terbaru
            const sorted = [...data].sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            setPesanan(sorted);
        } catch (err) {
            console.error(err);
            setError(
                err?.response?.data?.message ||
                    "Gagal memuat data pesanan. Silakan coba lagi."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getPesanan();
    }, [getPesanan]);

    const countStatus = useCallback(
        (status) => pesanan.filter((item) => item.status === status).length,
        [pesanan]
    );

    const filteredOrders = useMemo(() => {
        let result =
            filter === "Semua"
                ? pesanan
                : pesanan.filter((item) => item.status === filter);

        const keyword = search.trim().toLowerCase();
        if (keyword) {
            result = result.filter((item) => {
                const menuName = (item.menu?.name || "").toLowerCase();
                const id = String(item.id || "");
                const notes = (item.notes || "").toLowerCase();
                return (
                    menuName.includes(keyword) ||
                    id.includes(keyword) ||
                    notes.includes(keyword)
                );
            });
        }
        return result;
    }, [pesanan, filter, search]);

    const namaKlien = useMemo(() => getGreetingName(pesanan), [pesanan]);

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                boxSizing: "border-box",
                background: "#0B1220",
                overflowX: "hidden",
            }}
        >
            <NavbarKlien title="Pesanan Saya" />

            <div
                style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "32px clamp(20px, 4vw, 48px)",
                }}
            >
                {/* ============ HEADER ============ */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "16px",
                        marginBottom: "28px",
                    }}
                >
                    <div>
                        <h1
                            style={{
                                color: "#fff",
                                fontSize: "32px",
                                fontWeight: "800",
                                margin: 0,
                                letterSpacing: "-0.02em",
                            }}
                        >
                            {namaKlien ? `Halo, ${namaKlien}` : "Pesanan Anda"}
                        </h1>
                        <p style={{ color: "#94A3B8", marginTop: "6px" }}>
                            Riwayat pemesanan catering Anda
                        </p>
                    </div>

                    {/* Search + Total Pesanan, sejajar dalam satu baris */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            flexWrap: "wrap",
                        }}
                    >
                        {/* Search box */}
                        <div
                            style={{
                                position: "relative",
                                width: "260px",
                            }}
                        >
                            <span
                                style={{
                                    position: "absolute",
                                    left: "14px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#64748B",
                                    fontSize: "14px",
                                    pointerEvents: "none",
                                }}
                            >
                                🔍
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari menu / ID pesanan..."
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(148,163,184,0.15)",
                                    borderRadius: "16px",
                                    padding: "14px 16px 14px 38px",
                                    color: "#fff",
                                    fontSize: "13px",
                                    outline: "none",
                                    height: "100%",
                                }}
                            />
                        </div>

                        {/* Total Pesanan, hanya tampil jika ada data */}
                        {!loading && pesanan.length > 0 && (
                            <div
                                style={{
                                    background: "#111827",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: "16px",
                                    padding: "14px 22px",
                                    textAlign: "right",
                                    minWidth: "180px",
                                }}
                            >
                                <div
                                    style={{
                                        color: "#64748B",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.04em",
                                    }}
                                >
                                    Total Pesanan
                                </div>
                                <div
                                    style={{
                                        color: "#A7F3D0",
                                        fontSize: "22px",
                                        fontWeight: "800",
                                        marginTop: "4px",
                                    }}
                                >
                                    {pesanan.length} Pesanan
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ============ FILTER ============ */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        marginBottom: "28px",
                    }}
                >
                    {FILTERS.map((status) => {
                        const isActive = filter === status;
                        const count =
                            status === "Semua" ? pesanan.length : countStatus(status);

                        return (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "10px 16px",
                                    borderRadius: "999px",
                                    border: "1px solid rgba(148,163,184,0.15)",
                                    cursor: "pointer",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    background: isActive
                                        ? "#1F2937"
                                        : "rgba(255,255,255,0.03)",
                                    color: isActive ? "#fff" : "#94A3B8",
                                    transition: ".2s",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {status}
                                <span
                                    style={{
                                        marginLeft: "8px",
                                        fontSize: "11px",
                                        padding: "2px 7px",
                                        borderRadius: "999px",
                                        background: isActive
                                            ? "rgba(255,255,255,0.12)"
                                            : "rgba(148,163,184,0.15)",
                                        color: isActive ? "#fff" : "#94A3B8",
                                    }}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ============ CONTENT ============ */}
                {error ? (
                    <div
                        style={{
                            background: "#111827",
                            border: "1px solid rgba(248,113,113,0.25)",
                            borderRadius: "20px",
                            padding: "40px",
                            textAlign: "center",
                        }}
                    >
                        <div style={{ fontSize: "32px", marginBottom: "10px" }}>⚠️</div>
                        <div
                            style={{
                                color: "#F87171",
                                fontWeight: "700",
                                fontSize: "16px",
                                marginBottom: "6px",
                            }}
                        >
                            Terjadi Kesalahan
                        </div>
                        <p style={{ color: "#94A3B8", marginBottom: "20px" }}>{error}</p>
                        <button
                            onClick={getPesanan}
                            style={{
                                background: "#1F2937",
                                color: "#fff",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "999px",
                                padding: "10px 22px",
                                fontSize: "13px",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : loading ? (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill,minmax(380px,1fr))",
                            gap: "22px",
                        }}
                    >
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div
                        style={{
                            background: "#111827",
                            border: "1px solid rgba(255,255,255,0.05)",
                            borderRadius: "20px",
                            padding: "60px 30px",
                            textAlign: "center",
                        }}
                    >
                        <div style={{ fontSize: "40px", marginBottom: "14px" }}>🍽️</div>
                        <div
                            style={{
                                color: "#fff",
                                fontWeight: "700",
                                fontSize: "18px",
                                marginBottom: "6px",
                            }}
                        >
                            {pesanan.length === 0
                                ? "Belum ada pesanan"
                                : "Tidak ada pesanan yang cocok"}
                        </div>
                        <p style={{ color: "#94A3B8", margin: 0 }}>
                            {pesanan.length === 0
                                ? "Pesanan catering Anda akan muncul di sini."
                                : "Coba ubah filter atau kata kunci pencarian."}
                        </p>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill,minmax(380px,1fr))",
                            gap: "22px",
                        }}
                    >
                        {filteredOrders.map((item) => {
                            const status = getStatusMeta(item.status);

                            return (
                                <div
                                    key={item.id}
                                    style={{
                                        background: "#111827",
                                        borderRadius: "20px",
                                        padding: "26px",
                                        border: "1px solid rgba(255,255,255,0.05)",
                                        transition: "border-color .2s, transform .2s",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor =
                                            "rgba(255,255,255,0.12)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor =
                                            "rgba(255,255,255,0.05)";
                                    }}
                                >
                                    {/* TOP */}
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                        }}
                                    >
                                        <div>
                                            <h2
                                                style={{
                                                    color: "#fff",
                                                    fontSize: "20px",
                                                    margin: 0,
                                                    fontWeight: "700",
                                                }}
                                            >
                                                {item.menu?.name || "Menu tidak tersedia"}
                                            </h2>
                                            <div
                                                style={{
                                                    color: "#64748B",
                                                    fontSize: "12px",
                                                    marginTop: "2px",
                                                }}
                                            >
                                                #{item.id}
                                            </div>
                                        </div>

                                        {/* STATUS BADGE */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                background: status.bg,
                                                color: status.color,
                                                padding: "6px 12px",
                                                borderRadius: "999px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: "6px",
                                                    height: "6px",
                                                    borderRadius: "50%",
                                                    background: status.dot,
                                                    display: "inline-block",
                                                }}
                                            />
                                            {status.label}
                                        </div>
                                    </div>

                                    {/* DATE */}
                                    <div
                                        style={{
                                            marginTop: "12px",
                                            color: "#94A3B8",
                                            fontSize: "13px",
                                        }}
                                    >
                                        🕒 {formatTanggal(item.created_at)}
                                    </div>

                                    {/* INFO */}
                                    <div
                                        style={{
                                            marginTop: "18px",
                                            paddingTop: "18px",
                                            borderTop: "1px dashed rgba(255,255,255,0.06)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                marginBottom: "10px",
                                                fontSize: "15px",
                                            }}
                                        >
                                            <span style={{ color: "#94A3B8" }}>Jumlah</span>
                                            <span style={{ color: "#fff" }}>
                                                {item.quantity} Porsi
                                            </span>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                fontSize: "15px",
                                            }}
                                        >
                                            <span style={{ color: "#94A3B8" }}>Total</span>
                                            <span
                                                style={{
                                                    color: "#A7F3D0",
                                                    fontWeight: "700",
                                                }}
                                            >
                                                {formatRupiah(item.total_price)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* NOTES */}
                                    {item.notes && (
                                        <div
                                            style={{
                                                marginTop: "16px",
                                                padding: "12px",
                                                borderRadius: "12px",
                                                background: "#0B1220",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: "11px",
                                                    color: "#64748B",
                                                }}
                                            >
                                                Catatan
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "13px",
                                                    color: "#fff",
                                                    marginTop: "2px",
                                                }}
                                            >
                                                {item.notes}
                                            </div>
                                        </div>
                                    )}

                                    {/* ACTION: hanya tampil jika pesanan masih bisa dibatalkan */}
                                    {item.status === "Pending" && (
                                        <div
                                            style={{
                                                marginTop: "18px",
                                                display: "flex",
                                                justifyContent: "flex-end",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#64748B",
                                                    fontStyle: "italic",
                                                }}
                                            >
                                                Menunggu konfirmasi penjual
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}