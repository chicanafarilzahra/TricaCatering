import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

// ── Fix icon Leaflet hilang di React/Webpack ──────────────────
const defaultIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

// Ikon kurir — titik biru bergerak
const kurirIcon = L.divIcon({
    html: `<div style="
        background:#3B82F6;width:16px;height:16px;
        border-radius:50%;border:3px solid #0C1529;
        box-shadow:0 0 8px rgba(59,130,246,0.7)">
    </div>`,
    className: "",
    iconAnchor: [8, 8],
});

// Ikon dapur — warna oranye
const dapurIcon = L.divIcon({
    html: `<div style="
        background:#F59E0B;width:16px;height:16px;
        border-radius:4px;border:3px solid #0C1529;
        box-shadow:0 0 8px rgba(245,158,11,0.7)">
    </div>`,
    className: "",
    iconAnchor: [8, 8],
});

// Ikon lokasi customer — titik merah. Order yang sedang aktif diantar
// dibuat lebih besar & lebih terang supaya beda dari titik lain.
function customerIcon(isActive) {
    const size = isActive ? 20 : 14;
    return L.divIcon({
        html: `<div style="
            background:#EF4444;width:${size}px;height:${size}px;
            border-radius:50%;border:3px solid #0C1529;
            box-shadow:0 0 ${isActive ? 14 : 6}px rgba(239,68,68,${isActive ? 0.9 : 0.55})">
        </div>`,
        className: "",
        iconAnchor: [size / 2, size / 2],
    });
}

axios.defaults.baseURL = "/api";
axios.defaults.headers.common["Authorization"] =
    `Bearer ${localStorage.getItem("auth_token")}`;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// ── Komponen garis rute (leaflet-routing-machine) ─────────────
function RoutingControl({ waypoints }) {
    const map       = useMap();
    const routingRef = useRef(null);

    useEffect(() => {
        if (!waypoints || waypoints.length < 2) return;

        if (routingRef.current) {
            map.removeControl(routingRef.current);
            routingRef.current = null;
        }

        routingRef.current = L.Routing.control({
            waypoints:          waypoints.map(([lat, lng]) => L.latLng(lat, lng)),
            routeWhileDragging: false,
            showAlternatives:   false,
            fitSelectedRoutes:  false,
            lineOptions: {
                styles: [{ color: "#3B82F6", weight: 4, opacity: 0.85 }],
            },
            createMarker: () => null,
        }).addTo(map);

        return () => {
            if (routingRef.current) {
                map.removeControl(routingRef.current);
                routingRef.current = null;
            }
        };
    }, [map, JSON.stringify(waypoints)]);

    return null;
}

// ── Auto fitBounds agar semua marker terlihat ─────────────────
function MapBoundsAdjuster({ positions }) {
    const map = useMap();

    useEffect(() => {
        if (!positions || positions.length === 0) return;
        const validPos = positions.filter(Boolean);
        if (validPos.length === 0) return;

        const bounds = L.latLngBounds(validPos);
        map.fitBounds(bounds, { padding: [60, 60] });
    }, [map, JSON.stringify(positions)]);

    return null;
}

// ════════════════════════════════════════════════════════════
// KOMPONEN UTAMA
// ════════════════════════════════════════════════════════════
export default function RuteHariIni() {
    const [orders, setOrders]           = useState([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);
    const [activeOrder, setActiveOrder] = useState(null);
    const [kurirPos, setKurirPos]       = useState(null);
    const [isTracking, setIsTracking]   = useState(false);
    const [sendingLoc, setSendingLoc]   = useState(false);

    const watchIdRef  = useRef(null);
    const lastSentRef = useRef(0);

    // ── Fetch rute hari ini ───────────────────────────────────
    useEffect(() => {
        const fetchRute = async () => {
            try {
                const { data } = await axios.get("/kurir/rute");
                setOrders(data.data);
            } catch (err) {
                setError(
                    err.response?.data?.message ?? "Gagal memuat rute hari ini."
                );
            } finally {
                setLoading(false);
            }
        };
        fetchRute();
    }, []);

    // ── Kirim koordinat ke API setiap ~5 detik ────────────────
    const postLocation = useCallback(async (lat, lng, accuracy) => {
        if (!activeOrder) return;

        const now = Date.now();
        if (now - lastSentRef.current < 5000) return;
        lastSentRef.current = now;

        try {
            setSendingLoc(true);
            await axios.post(`/kurir/orders/${activeOrder.id}/location`, {
                latitude:  lat,
                longitude: lng,
                accuracy:  accuracy ?? null,
            });
        } catch (err) {
            console.warn("Gagal kirim lokasi:", err.response?.data?.message);
        } finally {
            setSendingLoc(false);
        }
    }, [activeOrder]);

    // ── Mulai GPS tracking ────────────────────────────────────
    const startTracking = useCallback(() => {
        if (!navigator.geolocation) {
            alert("Browser Anda tidak mendukung GPS.");
            return;
        }

        setIsTracking(true);

        watchIdRef.current = navigator.geolocation.watchPosition(
            ({ coords }) => {
                const { latitude, longitude, accuracy } = coords;
                setKurirPos([latitude, longitude]);
                postLocation(latitude, longitude, accuracy);
            },
            (err) => {
                console.error("GPS error:", err.message);
                if (err.code === err.PERMISSION_DENIED) {
                    stopTracking();
                    alert("Izin lokasi ditolak. Aktifkan GPS untuk mulai tracking.");
                }
            },
            {
                enableHighAccuracy: true,
                maximumAge:         0,
                timeout:            15000,
            }
        );
    }, [postLocation]);

    // ── Stop GPS tracking ─────────────────────────────────────
    const stopTracking = useCallback(() => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setIsTracking(false);
    }, []);

    // Cleanup saat komponen unmount
    useEffect(() => () => stopTracking(), [stopTracking]);

    // ── Tandai selesai pengiriman ─────────────────────────────
    const handleSelesai = async () => {
        if (!activeOrder) return;
        if (!window.confirm("Konfirmasi: pesanan sudah diterima klien?")) return;

        try {
            await axios.put(`/kurir/orders/${activeOrder.id}/update-status`, {
                status: "delivered",
            });
            stopTracking();
            setActiveOrder(null);
            setKurirPos(null);
            setOrders((prev) =>
                prev.map((o) =>
                    o.id === activeOrder.id ? { ...o, status: "delivered" } : o
                )
            );
            alert("✅ Pengiriman selesai! Terima kasih.");
        } catch (err) {
            alert(err.response?.data?.message ?? "Gagal update status.");
        }
    };

    // ── Semua titik customer hari ini (untuk ditampilkan sebagai dot merah) ──
    const customerPoints = useMemo(() => {
        return orders
            .filter((o) => o.lat_klien && o.lng_klien)
            .map((o) => ({
                order: o,
                pos: [o.lat_klien, o.lng_klien],
            }));
    }, [orders]);

    // ── Lokasi dapur (diasumsikan satu dapur untuk semua order) ──────
    const dapurPos = useMemo(() => {
        const withDapur = orders.find((o) => o.lat_dapur && o.lng_dapur);
        return withDapur ? [withDapur.lat_dapur, withDapur.lng_dapur] : null;
    }, [orders]);

    // ── Hitung waypoints rute (hanya saat ada order aktif) ────
    const routeWaypoints = (() => {
        if (!activeOrder?.lat_dapur || !activeOrder?.lat_klien) return null;
        const points = [];
        if (kurirPos) points.push(kurirPos);
        points.push([activeOrder.lat_dapur, activeOrder.lng_dapur]);
        points.push([activeOrder.lat_klien, activeOrder.lng_klien]);
        return points;
    })();

    // ── Semua posisi yang perlu masuk dalam viewport peta ─────
    const allPositions = useMemo(() => {
        const pts = [];
        if (kurirPos) pts.push(kurirPos);
        if (dapurPos) pts.push(dapurPos);
        customerPoints.forEach((c) => pts.push(c.pos));
        return pts;
    }, [kurirPos, dapurPos, customerPoints]);

    const mapCenter = kurirPos
        ?? (customerPoints[0]?.pos)
        ?? [-7.457, 112.691];

    const totalTitik = customerPoints.length;
    const sisaTitik   = orders.filter((o) => o.status !== "delivered").length;

    // ── Render ────────────────────────────────────────────────
    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-[#060D1F]">
            <div className="text-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-[#8B9FC0] text-sm">Memuat rute hari ini...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-screen bg-[#060D1F] p-4">
            <div className="w-full max-w-sm p-5 text-red-300 bg-red-500/10 border border-red-500/25 rounded-2xl text-center">
                <p className="font-semibold mb-1 text-red-200">Gagal memuat data</p>
                <p className="text-sm text-red-300/80">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-3 text-sm text-red-300 underline"
                >
                    Coba lagi
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-[#060D1F]">

            {/* ── Header ── */}
            <div className="bg-[#0C1529] border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.03)] px-4 py-3 flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-lg font-bold text-[#F0F4FF]">Rute Hari Ini</h1>
                    <p className="text-xs text-[#8B9FC0]">
                        {new Date().toLocaleDateString("id-ID", {
                            weekday: "long",
                            day:     "numeric",
                            month:   "long",
                            year:    "numeric",
                        })}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-red-500/15 text-red-300 border border-red-500/25 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {totalTitik} titik
                    </span>
                    <span className="bg-blue-500/15 text-blue-400 border border-blue-500/25 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {sisaTitik} belum selesai
                    </span>
                </div>
            </div>

            {/* ── Peta ── */}
            <div className="relative flex-1" style={{ minHeight: "280px" }}>
                <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ width: "100%", height: "100%" }}
                    zoomControl={true}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />

                    {/* Marker posisi kurir (saat GPS aktif) */}
                    {kurirPos && (
                        <Marker position={kurirPos} icon={kurirIcon}>
                            <Popup>📍 Posisi Anda sekarang</Popup>
                        </Marker>
                    )}

                    {/* Marker dapur */}
                    {dapurPos && (
                        <Marker position={dapurPos} icon={dapurIcon}>
                            <Popup>🍽️ Dapur Katering</Popup>
                        </Marker>
                    )}

                    {/* Titik merah — lokasi setiap customer hari ini */}
                    {customerPoints.map(({ order, pos }) => (
                        <Marker
                            key={order.id}
                            position={pos}
                            icon={customerIcon(activeOrder?.id === order.id)}
                        >
                            <Popup>
                                <strong>👤 {order.klien?.name ?? "—"}</strong><br />
                                📍 {order.address}<br />
                                🕐 {order.jam ? String(order.jam).substring(0, 5) : "—"}<br />
                                {order.klien?.phone && (
                                    <a href={`tel:${order.klien.phone}`}>📞 {order.klien.phone}</a>
                                )}
                            </Popup>
                        </Marker>
                    ))}

                    {/* Garis rute — hanya untuk order yang sedang diantar */}
                    {routeWaypoints && (
                        <RoutingControl waypoints={routeWaypoints} />
                    )}

                    {/* Auto fitBounds supaya semua titik & kurir terlihat */}
                    {allPositions.length > 0 && (
                        <MapBoundsAdjuster positions={allPositions} />
                    )}
                </MapContainer>

                {/* Legenda titik */}
                <div className="absolute bottom-3 left-3 z-[1000] bg-[#0C1529]/95 border border-white/10 rounded-xl shadow-lg px-3 py-2.5 flex flex-col gap-1.5 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                        <span className="text-xs text-[#F0F4FF]">Lokasi customer</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-[3px] bg-amber-500 shrink-0" />
                        <span className="text-xs text-[#F0F4FF]">Dapur</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                        <span className="text-xs text-[#F0F4FF]">Posisi Anda</span>
                    </div>
                </div>

                {/* Badge Live GPS */}
                {isTracking && (
                    <div className="absolute top-2 right-2 z-[1000] bg-[#0C1529]/95 border border-white/10 rounded-full shadow-lg px-3 py-1.5 flex items-center gap-2 backdrop-blur-sm">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            sendingLoc
                                ? "bg-amber-400 animate-pulse"
                                : "bg-green-500"
                        }`} />
                        <span className="text-xs font-medium text-[#F0F4FF]">
                            {sendingLoc ? "Mengirim..." : "GPS Aktif"}
                        </span>
                    </div>
                )}
            </div>

            {/* ── Daftar Pesanan ── */}
            <div
                className="bg-[#0C1529] overflow-y-auto shrink-0 border-t border-white/[0.06]"
                style={{ maxHeight: "46vh" }}
            >
                <div className="px-4 py-2 border-b border-white/[0.06] bg-white/[0.02]">
                    <p className="text-xs font-semibold text-[#3D5070] uppercase tracking-wide">
                        Titik Pengiriman Hari Ini
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="p-10 text-center text-[#3D5070]">
                        <p className="text-4xl mb-3">🎉</p>
                        <p className="font-medium text-[#8B9FC0]">Tidak ada pesanan hari ini</p>
                        <p className="text-sm mt-1">Nikmati hari libur Anda!</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            isActive={activeOrder?.id === order.id}
                            isTracking={isTracking}
                            onMulai={() => {
                                setActiveOrder(order);
                                startTracking();
                            }}
                            onSelesai={handleSelesai}
                            onStop={stopTracking}
                            onResume={startTracking}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

// ════════════════════════════════════════════════════════════
// SUB-KOMPONEN: Card setiap order di daftar bawah
// ════════════════════════════════════════════════════════════
function OrderCard({ order, isActive, isTracking, onMulai, onSelesai, onStop, onResume }) {
    const statusConfig = {
        pending:     { label: "Menunggu",         color: "bg-white/5 text-[#8B9FC0]" },
        confirmed:   { label: "Dikonfirmasi",     color: "bg-purple-500/15 text-purple-300" },
        preparing:   { label: "Disiapkan",        color: "bg-amber-500/15 text-amber-300" },
        dispatched:  { label: "Siap Dikirim",     color: "bg-blue-500/15 text-blue-300" },
        on_delivery: { label: "Dalam Perjalanan", color: "bg-green-500/15 text-green-300" },
        delivered:   { label: "Selesai",          color: "bg-white/5 text-[#3D5070]" },
        cancelled:   { label: "Dibatalkan",       color: "bg-red-500/15 text-red-300" },
    };

    const { label, color } = statusConfig[order.status] ?? {
        label: order.status,
        color: "bg-white/5 text-[#8B9FC0]",
    };

    const jamText = order.jam ? String(order.jam).substring(0, 5) : "—";

    return (
        <div className={`border-b border-white/[0.06] px-4 py-3 transition-colors ${
            isActive
                ? "bg-red-500/10 border-l-4 border-l-red-500"
                : "hover:bg-white/[0.03]"
        }`}>
            {/* Info order */}
            <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        <p className="font-semibold text-[#F0F4FF] truncate">
                            {order.klien?.name ?? "—"}
                        </p>
                    </div>
                    <p className="text-sm text-[#8B9FC0] line-clamp-1 mt-0.5">
                        {order.address}
                    </p>
                    {order.klien?.phone && (
                        <a
                            href={`tel:${order.klien.phone}`}
                            className="text-xs text-blue-400 underline"
                        >
                            📞 {order.klien.phone}
                        </a>
                    )}
                </div>
                <div className="text-right shrink-0">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
                        {label}
                    </span>
                    <p className="text-xs text-[#3D5070] mt-1">{jamText}</p>
                </div>
            </div>

            {/* Tombol aksi */}

            {/* Belum mulai — owner sudah klik "Kirim" */}
            {order.status === "dispatched" && !isActive && (
                <button
                    onClick={onMulai}
                    className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                >
                    🚀 Mulai Antar & Aktifkan GPS
                </button>
            )}

            {/* Sedang aktif antar */}
            {isActive && (
                <div className="flex gap-2 mt-1">
                    {isTracking ? (
                        <button
                            onClick={onStop}
                            className="flex-1 bg-white/10 hover:bg-white/20 text-[#F0F4FF] text-sm py-2 rounded-lg transition-colors"
                        >
                            ⏸ Pause GPS
                        </button>
                    ) : (
                        <button
                            onClick={onResume}
                            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-sm py-2 rounded-lg transition-colors"
                        >
                            ▶ Resume GPS
                        </button>
                    )}
                    <button
                        onClick={onSelesai}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                    >
                        ✅ Selesai Antar
                    </button>
                </div>
            )}

            {/* Sudah selesai */}
            {order.status === "delivered" && (
                <p className="text-xs text-[#3D5070] mt-1 text-center">
                    ✓ Pengiriman selesai
                </p>
            )}
        </div>
    );
}