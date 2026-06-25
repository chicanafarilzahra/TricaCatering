import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

// ── Fix icon Leaflet ──────────────────────────────────────────
const defaultIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

// Ikon kurir — titik biru bergerak
const kurirIcon = L.divIcon({
    html: `<div style="
        background:#2563eb;width:18px;height:18px;
        border-radius:50%;border:3px solid white;
        box-shadow:0 2px 8px rgba(37,99,235,0.5)">
    </div>`,
    className: "",
    iconAnchor: [9, 9],
});

// Ikon dapur — kotak oranye
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

// ── Setup Laravel Echo + Reverb ───────────────────────────────
window.Pusher = Pusher;

const echo = new Echo({
    broadcaster:       "reverb",
    key:               import.meta.env.VITE_REVERB_APP_KEY,
    wsHost:            import.meta.env.VITE_REVERB_HOST ?? window.location.hostname,
    wsPort:            import.meta.env.VITE_REVERB_PORT ?? 8080,
    wssPort:           import.meta.env.VITE_REVERB_PORT ?? 8080,
    forceTLS:          (import.meta.env.VITE_REVERB_SCHEME ?? "http") === "https",
    enabledTransports: ["ws", "wss"],
    authEndpoint:      "/broadcasting/auth",
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
    },
});

// ════════════════════════════════════════════════════════════
// Auto fitBounds — marker kurir + klien selalu terlihat
// ════════════════════════════════════════════════════════════
function MapBoundsAdjuster({ kurirPos, klienPos }) {
    const map     = useMap();
    const isFirst = useRef(true);

    useEffect(() => {
        if (!kurirPos || !klienPos) return;

        const bounds = L.latLngBounds([kurirPos, klienPos]);

        if (isFirst.current) {
            map.fitBounds(bounds, { padding: [60, 60] });
            isFirst.current = false;
        } else {
            map.flyToBounds(bounds, {
                padding:       [60, 60],
                duration:      0.8,
                easeLinearity: 0.5,
            });
        }
    }, [map, kurirPos?.[0], kurirPos?.[1], klienPos?.[0], klienPos?.[1]]);

    return null;
}

// ════════════════════════════════════════════════════════════
// KOMPONEN UTAMA
// Props: orderId (number) — dari Inertia props atau useParams
// ════════════════════════════════════════════════════════════
export default function TrackingPage({ orderId }) {
    const [order, setOrder]       = useState(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);
    const [kurirPos, setKurirPos] = useState(null);
    const [wsStatus, setWsStatus] = useState("connecting");

    const pollingRef = useRef(null);

    // ── 1. Load data order saat pertama buka ─────────────────
    useEffect(() => {
        if (!orderId) return;

        const loadOrder = async () => {
            try {
                const { data } = await axios.get(`/orders/${orderId}`);
                const o = data.data;
                setOrder(o);

                if (o.last_kurir_lat && o.last_kurir_lng) {
                    setKurirPos([o.last_kurir_lat, o.last_kurir_lng]);
                }
            } catch (err) {
                setError(
                    err.response?.status === 403
                        ? "Anda tidak memiliki akses ke pesanan ini."
                        : err.response?.status === 404
                        ? "Pesanan tidak ditemukan."
                        : "Gagal memuat data pesanan. Coba refresh halaman."
                );
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [orderId]);

    // ── 2. Subscribe WebSocket channel ───────────────────────
    useEffect(() => {
        if (!orderId || !order) return;

        const activeStatuses = ["dispatched", "on_delivery"];
        if (!activeStatuses.includes(order.status)) return;

        const channel = echo.private(`orders.${orderId}`);

        channel.listen(".kurir.location.updated", (e) => {
            setKurirPos([e.latitude, e.longitude]);
            setOrder((prev) =>
                prev ? { ...prev, last_update: new Date().toISOString() } : prev
            );
        });

        channel.listen(".order.dispatched", (e) => {
            setOrder((prev) =>
                prev ? { ...prev, status: e.status } : prev
            );
        });

        channel.listen(".order.delivered", () => {
            setOrder((prev) =>
                prev ? { ...prev, status: "delivered" } : prev
            );
        });

        const conn = echo.connector.pusher.connection;
        conn.bind("connected",   () => setWsStatus("connected"));
        conn.bind("unavailable", () => setWsStatus("error"));
        conn.bind("failed",      () => setWsStatus("error"));

        return () => {
            channel.stopListening(".kurir.location.updated");
            channel.stopListening(".order.dispatched");
            channel.stopListening(".order.delivered");
            echo.leave(`orders.${orderId}`);
        };
    }, [orderId, order?.status]);

    // ── 3. Fallback polling jika WebSocket gagal ─────────────
    useEffect(() => {
        if (wsStatus !== "error" || !orderId) return;
        if (!["dispatched", "on_delivery"].includes(order?.status)) return;

        const poll = async () => {
            try {
                const { data } = await axios.get(`/orders/${orderId}`);
                const o = data.data;
                if (o.last_kurir_lat && o.last_kurir_lng) {
                    setKurirPos([o.last_kurir_lat, o.last_kurir_lng]);
                }
                setOrder(o);
            } catch (err) {
                console.warn("Polling gagal:", err.message);
            }
        };

        pollingRef.current = setInterval(poll, 8000);
        poll();

        return () => clearInterval(pollingRef.current);
    }, [wsStatus, orderId, order?.status]);

    // ── Render kondisional ────────────────────────────────────
    if (loading) return <LoadingScreen />;
    if (error)   return <ErrorScreen message={error} />;
    if (!order)  return null;

    const klienPos = order.lat && order.lng
        ? [order.lat, order.lng]
        : null;

    const dapurPos = order.lat_dapur && order.lng_dapur
        ? [order.lat_dapur, order.lng_dapur]
        : null;

    if (["pending", "confirmed", "preparing"].includes(order.status))
        return <PreparingScreen order={order} />;

    if (order.status === "delivered")
        return <DeliveredScreen />;

    if (order.status === "cancelled")
        return <CancelledScreen />;

    // ── Status dispatched / on_delivery → tampilkan peta ─────
    return (
        <div className="flex flex-col h-screen bg-gray-50">

            {/* ── Header ── */}
            <div className="bg-white shadow-sm px-4 py-3 shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-base font-bold text-gray-800">
                            Lacak Pesanan
                        </h1>
                        {order.kurir ? (
                            <p className="text-sm text-gray-500">
                                Kurir:{" "}
                                <span className="font-medium text-gray-700">
                                    {order.kurir.name}
                                </span>
                                {order.kurir.phone && (
                                    <>
                                        {" · "}
                                        <a
                                            href={`tel:${order.kurir.phone}`}
                                            className="text-blue-600"
                                        >
                                            {order.kurir.phone}
                                        </a>
                                    </>
                                )}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-400">
                                Menunggu info kurir...
                            </p>
                        )}
                    </div>
                    <WsBadge status={wsStatus} />
                </div>

                {/* Status banner */}
                <div className="mt-2 flex items-center gap-2 text-sm text-blue-700 bg-blue-50 rounded-lg px-3 py-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shrink-0" />
                    {order.status === "dispatched"
                        ? "Kurir sedang dalam perjalanan ke dapur katering"
                        : "Kurir sedang menuju lokasi Anda"}
                </div>
            </div>

            {/* ── Peta ── */}
            <div className="flex-1" style={{ minHeight: "400px" }}>
                <MapContainer
                    center={klienPos ?? [-7.457, 112.691]}
                    zoom={14}
                    style={{ width: "100%", height: "100%" }}
                    zoomControl={true}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />

                    {/* Marker klien (statis) */}
                    {klienPos && (
                        <Marker position={klienPos}>
                            <Popup>
                                📍 Lokasi Anda<br />
                                <span className="text-xs text-gray-500">
                                    {order.address}
                                </span>
                            </Popup>
                        </Marker>
                    )}

                    {/* Marker dapur (statis) */}
                    {dapurPos && (
                        <Marker position={dapurPos} icon={dapurIcon}>
                            <Popup>🍽️ Dapur Katering</Popup>
                        </Marker>
                    )}

                    {/* Marker kurir (bergerak real-time) */}
                    {kurirPos && (
                        <Marker position={kurirPos} icon={kurirIcon}>
                            <Popup>
                                🛵 {order.kurir?.name ?? "Kurir"}
                                {order.last_update && (
                                    <>
                                        <br />
                                        <span className="text-xs text-gray-400">
                                            Update:{" "}
                                            {new Date(order.last_update)
                                                .toLocaleTimeString("id-ID")}
                                        </span>
                                    </>
                                )}
                            </Popup>
                        </Marker>
                    )}

                    {/* Auto fitBounds */}
                    {kurirPos && klienPos && (
                        <MapBoundsAdjuster
                            kurirPos={kurirPos}
                            klienPos={klienPos}
                        />
                    )}
                </MapContainer>
            </div>

            {/* ── Info bawah ── */}
            <div className="bg-white px-4 py-3 border-t shrink-0">
                <p className="text-sm text-gray-700">
                    <span className="font-medium">Alamat pengiriman:</span>{" "}
                    {order.address}
                </p>
                {order.menu && (
                    <p className="text-sm text-gray-500 mt-0.5">
                        <span className="font-medium">Menu:</span> {order.menu}
                        {order.quantity && ` × ${order.quantity} porsi`}
                    </p>
                )}
                {order.last_update && (
                    <p className="text-xs text-gray-400 mt-1">
                        Posisi kurir terakhir diperbarui:{" "}
                        {new Date(order.last_update).toLocaleTimeString("id-ID")}
                    </p>
                )}
                {wsStatus === "error" && (
                    <p className="text-xs text-gray-400 mt-1">
                        ⚠️ Mode polling aktif — posisi diperbarui setiap 8 detik
                    </p>
                )}
            </div>
        </div>
    );
}

// ════════════════════════════════════════════════════════════
// LAYAR STATUS
// ════════════════════════════════════════════════════════════

function LoadingScreen() {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Memuat informasi pesanan...</p>
        </div>
    );
}

function ErrorScreen({ message }) {
    return (
        <div className="flex flex-col items-center justify-center h-screen px-6 text-center gap-4">
            <p className="text-5xl">⚠️</p>
            <p className="text-gray-700 font-medium">{message}</p>
            <button
                onClick={() => window.location.reload()}
                className="text-sm text-blue-600 underline"
            >
                Refresh halaman
            </button>
        </div>
    );
}

function PreparingScreen({ order }) {
    const msg = {
        pending:   "Pesanan sedang menunggu konfirmasi owner",
        confirmed: "Pesanan sudah dikonfirmasi",
        preparing: "Makanan sedang disiapkan di dapur",
    };

    const jamText = order.jam ? String(order.jam).substring(0, 5) : "—";

    return (
        <div className="flex flex-col items-center justify-center h-screen px-6 text-center bg-orange-50">
            <p className="text-6xl mb-4">👨‍🍳</p>
            <h2 className="text-xl font-bold text-orange-800 mb-2">
                {msg[order.status] ?? "Pesanan sedang diproses"}
            </h2>
            <p className="text-orange-600 text-sm">
                Estimasi pengiriman:{" "}
                <span className="font-semibold">{jamText}</span>
            </p>
            {order.tanggal && (
                <p className="text-orange-500 text-xs mt-1">
                    Tanggal:{" "}
                    {new Date(order.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </p>
            )}
            <div className="mt-6 text-gray-400 text-xs space-y-1">
                <p>Halaman ini akan otomatis berubah saat kurir berangkat</p>
                <p>(refresh manual jika tidak berubah dalam 10 menit)</p>
            </div>
        </div>
    );
}

function DeliveredScreen() {
    return (
        <div className="flex flex-col items-center justify-center h-screen px-6 text-center bg-green-50">
            <p className="text-6xl mb-4">✅</p>
            <h2 className="text-xl font-bold text-green-800 mb-2">
                Pesanan Sudah Sampai!
            </h2>
            <p className="text-green-600 text-sm">
                Semoga makanan Anda dinikmati.<br />
                Terima kasih sudah memesan!
            </p>
        </div>
    );
}

function CancelledScreen() {
    return (
        <div className="flex flex-col items-center justify-center h-screen px-6 text-center bg-red-50">
            <p className="text-6xl mb-4">❌</p>
            <h2 className="text-xl font-bold text-red-800 mb-2">
                Pesanan Dibatalkan
            </h2>
            <p className="text-red-600 text-sm">
                Hubungi kami jika ada pertanyaan.
            </p>
        </div>
    );
}

// Badge status WebSocket di pojok kanan header
function WsBadge({ status }) {
    const config = {
        connecting: { color: "bg-yellow-100 text-yellow-700", label: "Menghubungkan..." },
        connected:  { color: "bg-green-100 text-green-700",   label: "🟢 Live" },
        error:      { color: "bg-gray-100 text-gray-500",     label: "Polling" },
    };
    const { color, label } = config[status] ?? config.connecting;

    return (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${color}`}>
            {label}
        </span>
    );
}