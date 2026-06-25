import { useState, useEffect, useRef, useCallback } from "react";
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
        background:#2563eb;width:16px;height:16px;
        border-radius:50%;border:3px solid white;
        box-shadow:0 0 6px rgba(0,0,0,0.4)">
    </div>`,
    className: "",
    iconAnchor: [8, 8],
});

// Ikon dapur — warna oranye
const dapurIcon = L.divIcon({
    html: `<div style="
        background:#ea580c;width:16px;height:16px;
        border-radius:4px;border:3px solid white;
        box-shadow:0 0 6px rgba(0,0,0,0.4)">
    </div>`,
    className: "",
    iconAnchor: [8, 8],
});

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
                styles: [{ color: "#2563eb", weight: 4, opacity: 0.8 }],
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

    // ── Hitung waypoints rute ─────────────────────────────────
    const routeWaypoints = (() => {
        if (!activeOrder?.lat_dapur || !activeOrder?.lat_klien) return null;
        const points = [];
        if (kurirPos) points.push(kurirPos);
        points.push([activeOrder.lat_dapur, activeOrder.lng_dapur]);
        points.push([activeOrder.lat_klien, activeOrder.lng_klien]);
        return points;
    })();

    const allPositions = (() => {
        const pts = [];
        if (kurirPos) pts.push(kurirPos);
        if (activeOrder?.lat_dapur) pts.push([activeOrder.lat_dapur, activeOrder.lng_dapur]);
        if (activeOrder?.lat_klien) pts.push([activeOrder.lat_klien, activeOrder.lng_klien]);
        return pts;
    })();

    const mapCenter = kurirPos
        ?? (activeOrder?.lat_klien
            ? [activeOrder.lat_klien, activeOrder.lng_klien]
            : [-7.457, 112.691]);

    // ── Render ────────────────────────────────────────────────
    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Memuat rute hari ini...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="p-4 m-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <p className="font-semibold mb-1">Gagal memuat data</p>
            <p className="text-sm">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-3 text-sm text-red-700 underline"
            >
                Coba lagi
            </button>
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-gray-50">

            {/* ── Header ── */}
            <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-lg font-bold text-gray-800">Rute Hari Ini</h1>
                    <p className="text-xs text-gray-500">
                        {new Date().toLocaleDateString("id-ID", {
                            weekday: "long",
                            day:     "numeric",
                            month:   "long",
                            year:    "numeric",
                        })}
                    </p>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                    {orders.filter((o) => o.status !== "delivered").length} aktif
                </span>
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

                    {/* Marker posisi kurir */}
                    {kurirPos && (
                        <Marker position={kurirPos} icon={kurirIcon}>
                            <Popup>📍 Posisi Anda sekarang</Popup>
                        </Marker>
                    )}

                    {/* Marker dapur */}
                    {activeOrder?.lat_dapur && (
                        <Marker
                            position={[activeOrder.lat_dapur, activeOrder.lng_dapur]}
                            icon={dapurIcon}
                        >
                            <Popup>🍽️ Dapur Katering</Popup>
                        </Marker>
                    )}

                    {/* Marker klien */}
                    {activeOrder?.lat_klien && (
                        <Marker position={[activeOrder.lat_klien, activeOrder.lng_klien]}>
                            <Popup>
                                👤 {activeOrder.klien?.name}<br />
                                📍 {activeOrder.address}<br />
                                {activeOrder.klien?.phone && (
                                    <a href={`tel:${activeOrder.klien.phone}`}>
                                        📞 {activeOrder.klien.phone}
                                    </a>
                                )}
                            </Popup>
                        </Marker>
                    )}

                    {/* Garis rute */}
                    {routeWaypoints && (
                        <RoutingControl waypoints={routeWaypoints} />
                    )}

                    {/* Auto fitBounds */}
                    {allPositions.length > 0 && (
                        <MapBoundsAdjuster positions={allPositions} />
                    )}
                </MapContainer>

                {/* Badge Live GPS */}
                {isTracking && (
                    <div className="absolute top-2 right-2 z-[1000] bg-white rounded-full shadow-md px-3 py-1.5 flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            sendingLoc
                                ? "bg-yellow-400 animate-pulse"
                                : "bg-green-500"
                        }`} />
                        <span className="text-xs font-medium text-gray-700">
                            {sendingLoc ? "Mengirim..." : "GPS Aktif"}
                        </span>
                    </div>
                )}
            </div>

            {/* ── Daftar Pesanan ── */}
            <div
                className="bg-white overflow-y-auto shrink-0 border-t"
                style={{ maxHeight: "46vh" }}
            >
                <div className="px-4 py-2 border-b bg-gray-50">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Pesanan Hari Ini
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">
                        <p className="text-4xl mb-3">🎉</p>
                        <p className="font-medium">Tidak ada pesanan hari ini</p>
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
        pending:     { label: "Menunggu",         color: "bg-gray-100 text-gray-600" },
        confirmed:   { label: "Dikonfirmasi",     color: "bg-purple-100 text-purple-700" },
        preparing:   { label: "Disiapkan",        color: "bg-yellow-100 text-yellow-700" },
        dispatched:  { label: "Siap Dikirim",     color: "bg-blue-100 text-blue-700" },
        on_delivery: { label: "Dalam Perjalanan", color: "bg-green-100 text-green-700" },
        delivered:   { label: "Selesai",          color: "bg-gray-100 text-gray-400" },
        cancelled:   { label: "Dibatalkan",       color: "bg-red-100 text-red-600" },
    };

    const { label, color } = statusConfig[order.status] ?? {
        label: order.status,
        color: "bg-gray-100",
    };

    const jamText = order.jam ? String(order.jam).substring(0, 5) : "—";

    return (
        <div className={`border-b px-4 py-3 transition-colors ${
            isActive
                ? "bg-blue-50 border-l-4 border-l-blue-500"
                : "hover:bg-gray-50"
        }`}>
            {/* Info order */}
            <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                        {order.klien?.name ?? "—"}
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-1">
                        {order.address}
                    </p>
                    {order.klien?.phone && (
                        <a
                            href={`tel:${order.klien.phone}`}
                            className="text-xs text-blue-600 underline"
                        >
                            📞 {order.klien.phone}
                        </a>
                    )}
                </div>
                <div className="text-right shrink-0">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
                        {label}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{jamText}</p>
                </div>
            </div>

            {/* Tombol aksi */}

            {/* Belum mulai — owner sudah klik "Kirim" */}
            {order.status === "dispatched" && !isActive && (
                <button
                    onClick={onMulai}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
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
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm py-2 rounded-lg transition-colors"
                        >
                            ⏸ Pause GPS
                        </button>
                    ) : (
                        <button
                            onClick={onResume}
                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-2 rounded-lg transition-colors"
                        >
                            ▶ Resume GPS
                        </button>
                    )}
                    <button
                        onClick={onSelesai}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                    >
                        ✅ Selesai Antar
                    </button>
                </div>
            )}

            {/* Sudah selesai */}
            {order.status === "delivered" && (
                <p className="text-xs text-gray-400 mt-1 text-center">
                    ✓ Pengiriman selesai
                </p>
            )}
        </div>
    );
}