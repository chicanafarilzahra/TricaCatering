import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import NavbarKlien from "../../components/NavbarKlien";


// ════════════════════════════════════════════════════════════
// FIX ICON LEAFLET
// ════════════════════════════════════════════════════════════
const defaultIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const kurirIcon = L.divIcon({
    html: `<div style="
        background:#2563eb;width:18px;height:18px;
        border-radius:50%;border:3px solid white;
        box-shadow:0 2px 8px rgba(37,99,235,0.5)">
    </div>`,
    className: "",
    iconAnchor: [9, 9],
});

const dapurIcon = L.divIcon({
    html: `<div style="
        background:#1E3A8A;width:18px;height:18px;
        border-radius:50%;border:3px solid white;
        box-shadow:0 2px 8px rgba(30,58,138,0.5)">
    </div>`,
    className: "",
    iconAnchor: [9, 9],
});

const klienIcon = L.divIcon({
    html: `<div style="
        background:#93C5FD;width:18px;height:18px;
        border-radius:50%;border:3px solid white;
        box-shadow:0 2px 8px rgba(147,197,253,0.6)">
    </div>`,
    className: "",
    iconAnchor: [9, 9],
});

// ════════════════════════════════════════════════════════════
// SETUP LARAVEL ECHO + REVERB (singleton)
// ════════════════════════════════════════════════════════════
window.Pusher = Pusher;

let echoInstance = null;
function getEcho() {
    if (echoInstance) return echoInstance;

    echoInstance = new Echo({
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

    return echoInstance;
}

// ════════════════════════════════════════════════════════════
// STYLE TOKENS — selaras dengan PesananSaya.jsx
// ════════════════════════════════════════════════════════════
const COLOR = {
    bgPage:     "#0B1220",
    bgCard:     "#111827",
    bgCardSoft: "rgba(255,255,255,0.03)",
    border:     "rgba(255,255,255,0.08)",
    borderSoft: "rgba(255,255,255,0.06)",
    text:       "#E5E7EB",
    textDim:    "#9CA3AF",
    textFaint:  "#6B7280",
    blue:       "#3B82F6",
    purple:     "#8B5CF6",
    green:      "#22C55E",
    orange:     "#F59E0B",
    red:        "#EF4444",
    line:       "rgba(255,255,255,0.10)",
};

const MILESTONES = [
    { key: "confirmed",  label: "Disetujui",  icon: "check", barColor: "#3B82F6", glow: "rgba(59,130,246,0.25)"  },
    { key: "preparing",  label: "Diproses",   icon: "chef",  barColor: "#8B5CF6", glow: "rgba(139,92,246,0.25)"  },
    { key: "dispatched", label: "Dikirim",    icon: "box",   barColor: "#F59E0B", glow: "rgba(245,158,11,0.25)" },
    { key: "delivered",  label: "Selesai",    icon: "flag",  barColor: "#22C55E", glow: "rgba(34,197,94,0.25)"  },
];

const STEP_DEFS = [
    { key: "confirmed",   title: "Pesanan Disetujui", desc: "Owner telah menyetujui pesanan.",  icon: "check", color: "#3B82F6" },
    { key: "preparing",   title: "Diproses di Dapur",  desc: "Sedang disiapkan.",                  icon: "chef",  color: "#8B5CF6" },
    { key: "dispatched",  title: "Pesanan Dikirim",    desc: "Kurir berangkat dari dapur.",         icon: "box",   color: "#F59E0B" },
    { key: "on_delivery", title: "Dalam Perjalanan",   desc: "Kurir sedang menuju lokasi Anda.",    icon: "bike",  color: "#F59E0B" },
    { key: "delivered",   title: "Pesanan Selesai",    desc: "Pesanan telah diterima.",              icon: "flag",  color: "#22C55E" },
];

const STATUS_ORDER = ["pending", "confirmed", "preparing", "dispatched", "on_delivery", "delivered"];
const ACTIVE_STATUSES = ["pending", "confirmed", "preparing", "dispatched", "on_delivery"];
const MAP_STATUSES = ["dispatched", "on_delivery"];

function statusIndex(status) {
    const idx = STATUS_ORDER.indexOf(status);
    return idx === -1 ? 0 : idx;
}

// ════════════════════════════════════════════════════════════
// ICON SET
// ════════════════════════════════════════════════════════════
function Icon({ name, size = 18 }) {
    const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none" };
    switch (name) {
        case "check":
            return <svg {...common}><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
        case "chef":
            return (
                <svg {...common}>
                    <path d="M6 13c0-3 1.5-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <rect x="6" y="13" width="12" height="3.2" rx="1" fill="currentColor" />
                    <rect x="9" y="17" width="6" height="3" rx="0.6" fill="currentColor" />
                </svg>
            );
        case "box":
            return (
                <svg {...common}>
                    <path d="M3 8l9-4 9 4-9 4-9-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M3 8v8l9 4 9-4V8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M12 12v8" stroke="currentColor" strokeWidth="2" />
                </svg>
            );
        case "bike":
            return (
                <svg {...common}>
                    <circle cx="6" cy="17" r="3" stroke="currentColor" strokeWidth="2" />
                    <circle cx="18" cy="17" r="3" stroke="currentColor" strokeWidth="2" />
                    <path d="M6 17l4-7h4l3 7M10 10l3-4h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case "flag":
            return (
                <svg {...common}>
                    <path d="M6 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M6 4h11l-2.5 3.5L17 11H6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
            );
            case "calendar":
    return (
        <svg {...common}>
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M3 9h18" stroke="currentColor" strokeWidth="2" />
            <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
case "clock":
    return (
        <svg {...common}>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
case "pin":
    return (
        <svg {...common}>
            <path d="M12 21s7-7.2 7-12a7 7 0 10-14 0c0 4.8 7 12 7 12z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="12" cy="9" r="2.4" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
case "cancel":
    return (
        <svg {...common}>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
        default:
            return null;
    }
}

// ════════════════════════════════════════════════════════════
// HERO
// ════════════════════════════════════════════════════════════
function Hero({ orders, selectedId, onSelect }) {
    return (
        <div style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.07), rgba(139,92,246,0.07))",
            border: `1px solid ${COLOR.borderSoft}`,
            borderRadius: 24,
            padding: "32px 32px",
            marginBottom: 28,
        }}>
            <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "6px 14px", borderRadius: 999,
                background: "rgba(59,130,246,0.12)",
                border: "1px solid rgba(59,130,246,0.3)",
                marginBottom: 18,
            }}>
                <span style={{
                    width: 6, height: 6, borderRadius: "50%", background: COLOR.blue,
                    animation: "trkPulse 1.6s ease-in-out infinite",
                }} />
                <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.08em", color: "#93C5FD" }}>
                    LIVE TRACKING
                </span>
            </div>

            <div style={{
                display: "flex", flexWrap: "wrap", justifyContent: "space-between",
                alignItems: "flex-end", gap: 20,
            }}>
                <div>
                    <h1 style={{
                        margin: 0, fontSize: 36, fontWeight: 800, color: "#fff",
                        lineHeight: 1.15,
                    }}>
                        Lacak{" "}
                        <span style={{
                            background: "linear-gradient(90deg, #60A5FA, #A78BFA)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                        }}>
                            Pesanan Anda
                        </span>
                    </h1>
                    <p style={{ margin: "10px 0 0", fontSize: 14.5, color: COLOR.textDim, maxWidth: 480 }}>
                        Pantau perjalanan pesanan Anda dari dapur hingga sampai di depan pintu, secara real-time.
                    </p>
                </div>

                {orders.length > 1 && (
                    <div style={{ minWidth: 220 }}>
                        <p style={{
                            margin: "0 0 8px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                            color: COLOR.textFaint, textTransform: "uppercase",
                        }}>
                            Pesanan Aktif
                        </p>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {orders.map((o) => {
                                const active = o.id === selectedId;
                                return (
                                    <button
                                        key={o.id}
                                        onClick={() => onSelect(o.id)}
                                        style={{
                                            padding: "8px 14px",
                                            borderRadius: 10,
                                            border: active ? `1px solid ${COLOR.blue}` : `1px solid ${COLOR.border}`,
                                            background: active ? "rgba(59,130,246,0.18)" : "rgba(255,255,255,0.04)",
                                            color: active ? "#93C5FD" : COLOR.textDim,
                                            fontSize: 13,
                                            fontWeight: 700,
                                            cursor: "pointer",
                                        }}
                                    >
                                        #{o.id}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ════════════════════════════════════════════════════════════
// MILESTONE CARD
// ════════════════════════════════════════════════════════════
function MilestoneCard({ milestone, state }) {
    const isDone   = state === "done";
    const isActive = state === "active";

    return (
        <div style={{
            position: "relative",
            background: isActive ? `linear-gradient(160deg, ${milestone.glow}, transparent)` : COLOR.bgCard,
            border: `1px solid ${isActive ? milestone.barColor + "55" : COLOR.border}`,
            borderRadius: 18,
            padding: "20px 20px 18px",
            overflow: "hidden",
            transition: "all 0.3s ease",
        }}>
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 3,
                background: isDone || isActive ? milestone.barColor : "rgba(255,255,255,0.08)",
                transition: "background 0.3s ease",
            }} />

            <div style={{
                width: 42, height: 42, borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 14,
                background: isDone || isActive ? milestone.barColor + "22" : "rgba(255,255,255,0.04)",
                color: isDone || isActive ? milestone.barColor : COLOR.textFaint,
                position: "relative",
            }}>
                {isActive && (
                    <span style={{
                        position: "absolute", inset: -3, borderRadius: 14,
                        border: `2px solid ${milestone.barColor}`,
                        opacity: 0.5,
                        animation: "trkRing 1.5s ease-out infinite",
                    }} />
                )}
                <Icon name={isDone ? "check" : milestone.icon} size={20} />
            </div>

            <p style={{
                margin: 0, fontSize: 15, fontWeight: 700,
                color: isDone || isActive ? COLOR.text : COLOR.textFaint,
            }}>
                {milestone.label}
            </p>
            <p style={{
                margin: "4px 0 0", fontSize: 12,
                color: isActive ? milestone.barColor : isDone ? COLOR.green : COLOR.textFaint,
                fontWeight: isActive ? 700 : 500,
            }}>
                {isDone ? "Selesai" : isActive ? "Sedang berjalan…" : "Menunggu"}
            </p>
        </div>
    );
}

// ════════════════════════════════════════════════════════════
// TIMELINE STEP
// ════════════════════════════════════════════════════════════
function TimelineStep({ step, state, isLast }) {
    const circleStyle = {
        width: 36, height: 36, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, position: "relative", zIndex: 1,
        transition: "all 0.3s ease",
        ...(state === "done" && {
            background: `${step.color}22`, border: `2px solid ${step.color}`, color: step.color,
        }),
        ...(state === "active" && {
            background: step.color, border: `2px solid ${step.color}`, color: "#fff",
            boxShadow: `0 0 0 6px ${step.color}33`,
        }),
        ...(state === "upcoming" && {
            background: "rgba(255,255,255,0.04)", border: `2px solid ${COLOR.line}`, color: COLOR.textFaint,
        }),
    };

    return (
        <div style={{ display: "flex", gap: 14, position: "relative" }}>
            {!isLast && (
                <div style={{
                    position: "absolute", left: 17, top: 36, width: 2,
                    height: "calc(100% - 8px)",
                    background: state === "done" ? step.color : COLOR.line,
                    opacity: state === "done" ? 0.5 : 1,
                    transition: "background 0.3s ease",
                }} />
            )}

            <div style={circleStyle}>
                {state === "active" ? (
                    <span style={{
                        width: 8, height: 8, borderRadius: "50%", background: "#fff",
                        animation: "trkPulseDot 1.4s ease-in-out infinite",
                    }} />
                ) : (
                    <Icon name={state === "done" ? "check" : step.icon} />
                )}
            </div>

            <div style={{ paddingBottom: 24, minWidth: 0 }}>
                <p style={{
                    margin: 0, fontSize: 14.5, fontWeight: 700,
                    color: state === "upcoming" ? COLOR.textFaint : COLOR.text,
                }}>{step.title}</p>
                <p style={{
                    margin: "3px 0 0", fontSize: 12.5,
                    color: state === "upcoming" ? "rgba(107,114,128,0.6)" : COLOR.textDim,
                }}>{step.desc}</p>
            </div>
        </div>
    );
}

// ════════════════════════════════════════════════════════════
// MENU PREVIEW
// ════════════════════════════════════════════════════════════
function MenuPreview({ order }) {
    const menu = order.menu;
    if (!menu) {
        return <p style={{ fontSize: 13, color: COLOR.textFaint, margin: "10px 0 0" }}>Tidak ada detail menu.</p>;
    }

    const imgSrc = menu.image
        ? (String(menu.image).startsWith("http") ? menu.image : `/storage/${menu.image}`)
        : null;

    return (
        <div style={{ display: "flex", gap: 12, padding: "10px 0" }}>
            <div style={{
                width: 56, height: 56, borderRadius: 12, flexShrink: 0, overflow: "hidden",
                background: "rgba(255,255,255,0.04)", border: `1px solid ${COLOR.borderSoft}`,
            }}>
                {imgSrc ? (
                    <img
                        src={imgSrc}
                        alt={menu.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🍽️</div>
                )}
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{
                    margin: 0, fontSize: 14, fontWeight: 700, color: COLOR.text,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{menu.name}</p>
                {order.quantity != null && (
                    <p style={{ margin: "3px 0 0", fontSize: 12.5, color: COLOR.textDim }}>
                        {order.quantity} porsi
                        {order.type === "harian" && order.duration ? ` × ${order.duration} hari` : ""}
                    </p>
                )}
            </div>
        </div>
    );
}

// ════════════════════════════════════════════════════════════
// FORMAT TANGGAL — terima string ISO ('2026-07-01T00:00:00.000000Z'
// dari cast 'date' Laravel) ATAU string sederhana 'YYYY-MM-DD'.
// ════════════════════════════════════════════════════════════
function formatTanggal(tanggal) {
    if (!tanggal) return "—";
    try {
        const d = new Date(tanggal);
        if (isNaN(d.getTime())) return "—";
        return d.toLocaleDateString("id-ID", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
        });
    } catch {
        return "—";
    }
}

// ════════════════════════════════════════════════════════════
// FORMAT JAM — robust terhadap beberapa kemungkinan bentuk:
// "14:30:00" (kolom TIME mysql), "14:30" (HH:mm dari validasi
// date_format:H:i), atau bahkan ikut terbungkus tanggal penuh
// "2026-01-01T14:30:00.000000Z" kalau suatu saat backend
// menyimpannya sebagai datetime/cast.
// ════════════════════════════════════════════════════════════
function formatJam(jam) {
    if (jam === null || jam === undefined || jam === "") return "—";

    const str = String(jam).trim();

    // Kasus "14:30:00" atau "14:30" -> ambil HH:MM langsung
    const simpleMatch = str.match(/^(\d{1,2}):(\d{2})/);
    if (simpleMatch) {
        const hh = simpleMatch[1].padStart(2, "0");
        const mm = simpleMatch[2];
        return `${hh}:${mm}`;
    }

    // Kasus terbungkus format ISO datetime -> parse sebagai Date
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    }

    return "—";
}

function InfoRow({ label, value, icon }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
            <div style={{
                width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                background: "rgba(255,255,255,0.05)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: COLOR.textDim, fontSize: 14,
            }}>
                {icon}
            </div>
            <div>
                <p style={{ margin: 0, fontSize: 11.5, color: COLOR.textFaint }}>{label}</p>
                <p style={{ margin: "1px 0 0", fontSize: 13.5, fontWeight: 600, color: COLOR.text }}>{value}</p>
            </div>
        </div>
    );
}

// ════════════════════════════════════════════════════════════
// AUTO FITBOUNDS — marker kurir + klien selalu terlihat
// ════════════════════════════════════════════════════════════
function MapBoundsAdjuster({ kurirPos, klienPos }) {
    const map     = useMap();
    const isFirst = useRef(true);

    useEffect(() => {
        if (!kurirPos || !klienPos) return;
        const bounds = L.latLngBounds([kurirPos, klienPos]);

        if (isFirst.current) {
            map.fitBounds(bounds, { padding: [50, 50] });
            isFirst.current = false;
        } else {
            map.flyToBounds(bounds, { padding: [50, 50], duration: 0.8, easeLinearity: 0.5 });
        }
    }, [map, kurirPos?.[0], kurirPos?.[1], klienPos?.[0], klienPos?.[1]]);

    return null;
}

// ════════════════════════════════════════════════════════════
// PETA TRACKING — dirender hanya saat status dispatched/on_delivery
// ════════════════════════════════════════════════════════════
function TrackingMap({ order, kurirPos }) {
    const klienPos = order.lat && order.lng ? [order.lat, order.lng] : null;
    const dapurPos = order.lat_dapur && order.lng_dapur ? [order.lat_dapur, order.lng_dapur] : null;

    const [routePath, setRoutePath] = useState(null);

    useEffect(() => {
        if (!dapurPos || !klienPos) {
            setRoutePath(null);
            return;
        }
        let cancelled = false;

        (async () => {
            try {
                const url = `https://router.project-osrm.org/route/v1/driving/${dapurPos[1]},${dapurPos[0]};${klienPos[1]},${klienPos[0]}?overview=full&geometries=geojson`;
                const res = await fetch(url);
                const data = await res.json();
                const coords = data?.routes?.[0]?.geometry?.coordinates;
                if (!cancelled && Array.isArray(coords) && coords.length > 0) {
                    setRoutePath(coords.map(([lng, lat]) => [lat, lng]));
                } else if (!cancelled) {
                    setRoutePath(null);
                }
            } catch {
                if (!cancelled) setRoutePath(null);
            }
        })();

        return () => { cancelled = true; };
    }, [dapurPos?.[0], dapurPos?.[1], klienPos?.[0], klienPos?.[1]]);

    return (
        <div style={{
            height: 260, borderRadius: 16, overflow: "hidden",
            border: `1px solid ${COLOR.border}`, marginBottom: 16,
        }}>
            <MapContainer
                center={klienPos ?? dapurPos ?? [-7.457, 112.691]}
                zoom={14}
                style={{ width: "100%", height: "100%" }}
                zoomControl={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {dapurPos && klienPos && (
                    routePath ? (
                        <Polyline
                            positions={routePath}
                            pathOptions={{ color: "#3B82F6", weight: 4, opacity: 0.85, lineCap: "round" }}
                        />
                    ) : (
                        <Polyline
                            positions={[dapurPos, klienPos]}
                            pathOptions={{ color: "#3B82F6", weight: 3, opacity: 0.4, dashArray: "6 8" }}
                        />
                    )
                )}

                {klienPos && (
                    <Marker position={klienPos} icon={klienIcon}>
                        <Popup>📍 Lokasi Anda<br /><span style={{ fontSize: 12 }}>{order.address}</span></Popup>
                    </Marker>
                )}

                {dapurPos && (
                    <Marker position={dapurPos} icon={dapurIcon}>
                        <Popup>🍽️ Dapur Catering</Popup>
                    </Marker>
                )}

                {kurirPos && (
                    <Marker position={kurirPos} icon={kurirIcon}>
                        <Popup>🛵 {order.courier?.name ?? "Kurir"}</Popup>
                    </Marker>
                )}

                {kurirPos && klienPos && (
                    <MapBoundsAdjuster kurirPos={kurirPos} klienPos={klienPos} />
                )}
            </MapContainer>
        </div>
    );
}

// ════════════════════════════════════════════════════════════
// KARTU UTAMA TRACKING UNTUK SATU ORDER
// ════════════════════════════════════════════════════════════
function TrackingDetail({ order, onStatusChange }) {
    const [kurirPos, setKurirPos] = useState(
        order.last_kurir_lat && order.last_kurir_lng
            ? [order.last_kurir_lat, order.last_kurir_lng]
            : null
    );

    useEffect(() => {
        if (!order?.id) return;

        const echo = getEcho();
        const channel = echo.private(`orders.${order.id}`);

        const applyStatus = (status) => onStatusChange(order.id, status);

        channel.listen(".order.confirmed",   () => applyStatus("confirmed"));
        channel.listen(".order.preparing",   () => applyStatus("preparing"));
        channel.listen(".order.dispatched",  () => applyStatus("dispatched"));
        channel.listen(".order.on_delivery", () => applyStatus("on_delivery"));
        channel.listen(".order.delivered",   () => applyStatus("delivered"));
        channel.listen(".order.cancelled",   () => applyStatus("cancelled"));
        channel.listen(".order.status.updated", (e) => {
            if (e?.status) applyStatus(e.status);
        });

        // Update posisi kurir secara realtime selama pengiriman
        channel.listen(".kurir.location.updated", (e) => {
            if (e?.latitude && e?.longitude) setKurirPos([e.latitude, e.longitude]);
        });

        return () => {
            channel.stopListening(".order.confirmed");
            channel.stopListening(".order.preparing");
            channel.stopListening(".order.dispatched");
            channel.stopListening(".order.on_delivery");
            channel.stopListening(".order.delivered");
            channel.stopListening(".order.cancelled");
            channel.stopListening(".order.status.updated");
            channel.stopListening(".kurir.location.updated");
            echo.leave(`orders.${order.id}`);
        };
    }, [order?.id]);

    const currentIdx = statusIndex(order.status);
    const isCancelled = order.status === "cancelled";
    const showMap = MAP_STATUSES.includes(order.status);

    // Tanggal kirim: pilih field sesuai tipe order, TAPI fallback ke
    // field lain kalau yang utama kosong/null -- supaya data lama atau
    // tipe yang tidak konsisten tetap menampilkan sesuatu.
    const tanggalKirim =
        (order.type === "harian"
            ? (order.tanggal ?? order.tanggal_kirim ?? order.start_date ?? order.tanggal_mulai)
            : (order.event_date ?? order.tanggal_kirim ?? order.tanggal)
        ) ??
        order.tanggal ??
        order.tanggal_kirim ??
        order.event_date ??
        order.start_date ??
        order.tanggal_mulai ??
        null;

    const jamKirim =
        order.jam ??
        order.jam_kirim ??
        order.waktu_kirim ??
        order.jam_pengiriman ??
        order.delivery_time ??
        null;

    return (
        <div style={{ animation: "trkFadeIn 0.25s ease" }}>

            {/* ── 4 Milestone cards ── */}
            {!isCancelled && (
                <div className="trk-milestone-grid" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 16,
                    marginBottom: 24,
                }}>
                    {MILESTONES.map((m) => {
                        const mIdx = statusIndex(m.key);
                        let state = "upcoming";
                        if (mIdx < currentIdx) state = "done";
                        else if (mIdx === currentIdx || (m.key === "dispatched" && order.status === "on_delivery")) state = "active";
                        if (m.key === "delivered" && order.status === "delivered") state = "done";
                        return <MilestoneCard key={m.key} milestone={m} state={state} />;
                    })}
                </div>
            )}

            <div className="trk-detail-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)", gap: 20 }}>

                {/* ── Card kiri: peta (jika relevan) + timeline detail ── */}
                <div style={{
                    background: COLOR.bgCard, border: `1px solid ${COLOR.border}`,
                    borderRadius: 20, padding: 24,
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                        <div>
                            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: COLOR.blue }}>
                                ORDER #{order.id}
                            </p>
                            <h3 style={{ margin: "4px 0 0", fontSize: 17, fontWeight: 700, color: COLOR.text }}>
                                Status Pengiriman
                            </h3>
                        </div>
                        {order.courier?.name && (
                            <div style={{ textAlign: "right" }}>
                                <p style={{ margin: 0, fontSize: 11, color: COLOR.textFaint }}>Kurir</p>
                                <p style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 600, color: COLOR.text }}>
                                    {order.courier.name}
                                </p>
                            </div>
                        )}
                    </div>

                    {!isCancelled && showMap && (
                        <TrackingMap order={order} kurirPos={kurirPos} />
                    )}

                    {isCancelled ? (
                        <div style={{ textAlign: "center", padding: "30px 8px" }}>
                            <div style={{
                                width: 64, height: 64, borderRadius: "50%", margin: "0 auto 14px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: "rgba(239,68,68,0.12)", color: COLOR.red,
                            }}>
                                <Icon name="cancel" size={30} />
                            </div>
                            <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: COLOR.red }}>Pesanan Dibatalkan</p>
                            <p style={{ margin: "6px 0 0", fontSize: 13, color: COLOR.textDim }}>Hubungi kami jika ada pertanyaan.</p>
                        </div>
                    ) : (
                        STEP_DEFS.map((step, i) => {
                            const stepIdx = statusIndex(step.key);
                            let state = "upcoming";
                            if (stepIdx < currentIdx) state = "done";
                            else if (stepIdx === currentIdx) state = "active";
                            return <TimelineStep key={step.key} step={step} state={state} isLast={i === STEP_DEFS.length - 1} />;
                        })
                    )}
                </div>

                {/* ── Card kanan: menu + info kirim ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                    <div style={{
                        background: COLOR.bgCard, border: `1px solid ${COLOR.border}`,
                        borderRadius: 20, padding: 22,
                    }}>
                        <p style={{
                            margin: "0 0 4px", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                            color: COLOR.textFaint, textTransform: "uppercase",
                        }}>
                            Menu Dipesan
                        </p>
                        <MenuPreview order={order} />
                    </div>

                    <div style={{
                        background: "linear-gradient(160deg, rgba(59,130,246,0.08), rgba(139,92,246,0.05))",
                        border: "1px solid rgba(59,130,246,0.18)",
                        borderRadius: 20, padding: "10px 22px 4px",
                    }}>
                        <InfoRow icon={<Icon name="calendar" size={16} />} label="Tanggal Kirim" value={formatTanggal(tanggalKirim)} />
                        <InfoRow icon={<Icon name="clock" size={16} />} label="Jam Kirim" value={formatJam(jamKirim)} />
                        {order.address && <InfoRow icon={<Icon name="pin" size={16} />} label="Alamat" value={order.address} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ════════════════════════════════════════════════════════════
// SKELETON LOADING
// ════════════════════════════════════════════════════════════
function LoadingState() {
    return (
        <div>
            <div className="trk-milestone-grid" style={{
                display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
                gap: 16, marginBottom: 24,
            }}>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{
                        height: 116, borderRadius: 18,
                        background: COLOR.bgCard, border: `1px solid ${COLOR.border}`,
                    }} />
                ))}
            </div>
            <div style={{
                background: COLOR.bgCard, border: `1px solid ${COLOR.border}`,
                borderRadius: 20, padding: 24,
            }}>
                {[1, 2, 3].map((i) => (
                    <div key={i} style={{ display: "flex", gap: 14, marginBottom: 18 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.06)", flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ height: 14, width: "50%", borderRadius: 4, background: "rgba(255,255,255,0.06)", marginBottom: 6 }} />
                            <div style={{ height: 11, width: "70%", borderRadius: 4, background: "rgba(255,255,255,0.04)" }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ════════════════════════════════════════════════════════════
// KOMPONEN UTAMA — HALAMAN TRACKING
// Route: /klien/lacak-pengiriman  (opsional query ?order=ID)
// ════════════════════════════════════════════════════════════
export default function Tracking() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [orders, setOrders]       = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);
    const [selectedId, setSelected] = useState(null);

    const preselectId = searchParams.get("order");

    useEffect(() => {
        let cancelled = false;

        const loadOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await axios.get("/klien/orders");
                const all = Array.isArray(data.data) ? data.data : data.data?.data ?? [];
                const active = all.filter((o) => ACTIVE_STATUSES.includes(o.status) && o.status !== "pending");

                if (!cancelled) {
                    setOrders(active);
                    const fromQuery = preselectId
                        ? active.find((o) => String(o.id) === String(preselectId))
                        : null;
                    setSelected(fromQuery?.id ?? active[0]?.id ?? null);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.response?.status === 401 || err.response?.status === 403
                            ? "Anda tidak memiliki akses ke halaman ini."
                            : "Gagal memuat data pesanan. Coba refresh halaman."
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadOrders();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleStatusChange = (orderId, newStatus) => {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    };

    const selectedOrder = useMemo(
        () => orders.find((o) => o.id === selectedId) ?? null,
        [orders, selectedId]
    );

    return (
        <div style={{ minHeight: "100vh", background: COLOR.bgPage, fontFamily: "Arial, sans-serif" }}>
            <style>{`
                html, body, #root {
                    margin: 0;
                    padding: 0;
                    background: ${COLOR.bgPage};
                    min-height: 100%;
                }
                * { box-sizing: border-box; }
                @keyframes trkPulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50%      { transform: scale(1.4); opacity: 0.5; }
                }
                @keyframes trkPulseDot {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50%      { transform: scale(1.3); opacity: 0.6; }
                }
                @keyframes trkRing {
                    0%   { transform: scale(1);   opacity: 0.6; }
                    100% { transform: scale(1.35); opacity: 0; }
                }
                @keyframes trkFadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @media (max-width: 860px) {
                    .trk-detail-grid { grid-template-columns: minmax(0, 1fr) !important; }
                }
                @media (max-width: 640px) {
                    .trk-milestone-grid { grid-template-columns: repeat(2, 1fr) !important; }
                }
                .leaflet-container { background: #1f2937 !important; }
            `}</style>

            <NavbarKlien />

            <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 24px 60px" }}>

                <Hero orders={orders} selectedId={selectedId} onSelect={setSelected} />

                {loading && <LoadingState />}

                {error && !loading && (
                    <div style={{
                        background: COLOR.bgCard, border: `1px solid ${COLOR.border}`,
                        borderRadius: 20, padding: "36px 20px", textAlign: "center",
                    }}>
                        <p style={{ fontSize: 38, margin: "0 0 10px" }}>⚠️</p>
                        <p style={{ margin: 0, fontSize: 14, color: COLOR.textDim }}>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                marginTop: 16, padding: "9px 18px", borderRadius: 10,
                                border: `1px solid ${COLOR.border}`, background: "rgba(255,255,255,0.04)",
                                color: COLOR.text, fontSize: 13, fontWeight: 600, cursor: "pointer",
                            }}
                        >
                            Refresh halaman
                        </button>
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div style={{
                        background: COLOR.bgCard, border: `1px solid ${COLOR.border}`,
                        borderRadius: 20, padding: "50px 20px", textAlign: "center",
                    }}>
                        <p style={{ fontSize: 44, margin: "0 0 12px" }}>📭</p>
                        <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: COLOR.text }}>
                            Tidak ada pesanan aktif
                        </p>
                        <p style={{ margin: "8px 0 0", fontSize: 13.5, color: COLOR.textDim }}>
                            Pesanan yang sedang berjalan akan otomatis muncul di sini.
                        </p>
                        <button
                            onClick={() => navigate("/klien/pesanan")}
                            style={{
                                marginTop: 18, padding: "10px 20px", borderRadius: 10,
                                border: "1px solid rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.1)",
                                color: COLOR.blue, fontSize: 13.5, fontWeight: 700, cursor: "pointer",
                            }}
                        >
                            Lihat Pesanan Saya
                        </button>
                    </div>
                )}

                {!loading && !error && selectedOrder && (
                    <TrackingDetail order={selectedOrder} onStatusChange={handleStatusChange} />
                )}
            </div>
        </div>
    );
}