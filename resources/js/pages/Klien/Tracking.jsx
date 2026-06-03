// resources/js/pages/Klien/Tracking.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarKlien from "../../components/NavbarKlien";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { FaCheck, FaTruck, FaHome } from "react-icons/fa";

/* ---------- FIX LEAFLET MARKER ---------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ---------- ICON KURIR ---------- */
const courierIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

/* ---------- CENTER MAP HOOK ---------- */
function CenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, map.getZoom());
  }, [coords, map]);
  return null;
}

/* ---------- ROUTING HOOK ---------- */
function Routing({ start, end, map }) {
  useEffect(() => {
    if (!map || !start || !end) return;

    const control = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      lineOptions: { styles: [{ color: "#3b82f6", weight: 6 }] }, // biru
      createMarker: () => null, // tidak buat marker tambahan
      addWaypoints: false,
      routeWhileDragging: false,
      show: false,
    }).addTo(map);

    return () => map.removeControl(control);
  }, [map, start, end]);

  return null;
}

export default function Tracking({ orderId }) {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapInstance, setMapInstance] = useState(null);

  /* ---------- FETCH DATA REAL ---------- */
  const loadTracking = async () => {
    try {
      const res = await axios.get(`/api/klien/lacak/${orderId}`);
      setTracking(res.data);
    } catch (err) {
      console.error(err);
      setTracking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTracking();
    const interval = setInterval(loadTracking, 10000); // refresh 10 detik
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#071028" }}>
        <NavbarKlien title="Tracking Pengiriman" />
        <div style={{ padding: "24px", color: "#fff" }}>Memuat tracking...</div>
      </div>
    );
  }

  if (!tracking) {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#071028" }}>
        <NavbarKlien title="Tracking Pengiriman" />
        <div style={{ padding: "24px", color: "#94a3b8" }}>Tidak ada pengiriman aktif.</div>
      </div>
    );
  }

  const route = [
    [tracking.catering.lat, tracking.catering.lng],
    [tracking.client.lat, tracking.client.lng],
  ];

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#071028", display: "flex", flexDirection: "column" }}>
      <NavbarKlien title="Tracking Pengiriman" />

      <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
        <h1 style={{ color: "#fff", fontSize: "36px", fontWeight: "800", marginBottom: "8px" }}>Tracking Pengiriman</h1>
        <p style={{ color: "#94a3b8", marginBottom: "24px" }}>Pantau posisi kurir secara realtime</p>

        <div style={{ background: "#182338", borderRadius: "28px", padding: "28px", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h2 style={{ color: "#fff", marginBottom: "12px" }}>{tracking.menu}</h2>
          <div style={{ color: "#94a3b8" }}>Kurir : {tracking.courier_name}</div>
        </div>

        <div style={{ background: "#182338", borderRadius: "28px", padding: "28px", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <TimelineItem active blue icon={<FaCheck />} title="Makanan siap dari dapur" subtitle="Pesanan selesai diproses" />
          <TimelineItem active icon={<FaTruck />} title={`Dalam perjalanan — ${tracking.distance_left} km lagi`} subtitle={`Estimasi tiba ${tracking.estimated_time} • Biaya kurir Rp ${tracking.courier_fee.toLocaleString("id-ID")}`} />
          <TimelineItem active={tracking.status === "selesai"} icon={<FaHome />} title="Tiba di lokasi Anda" subtitle={tracking.status === "selesai" ? "Pesanan telah diterima" : "Menunggu..."} />
        </div>

        {/* MAP */}
        <div style={{ background: "#182338", borderRadius: "28px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
          <MapContainer
            center={[tracking.courier.lat, tracking.courier.lng]}
            zoom={15}
            style={{ height: "550px", width: "100%" }}
            whenCreated={setMapInstance}
          >
            <CenterMap coords={[tracking.courier.lat, tracking.courier.lng]} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker position={[tracking.catering.lat, tracking.catering.lng]}>
              <Popup>Catering (Titik Awal)</Popup>
            </Marker>

            <Marker position={[tracking.courier.lat, tracking.courier.lng]} icon={courierIcon}>
              <Popup>Kurir: {tracking.courier_name}</Popup>
            </Marker>

            <Marker position={[tracking.client.lat, tracking.client.lng]}>
              <Popup>Lokasi Klien</Popup>
            </Marker>

            {mapInstance && (
              <Routing
                map={mapInstance}
                start={[tracking.courier.lat, tracking.courier.lng]}
                end={[tracking.client.lat, tracking.client.lng]}
              />
            )}
          </MapContainer>
        </div>
      </div>

      <style>{`* { margin:0; padding:0; box-sizing:border-box; } .hide-scrollbar::-webkit-scrollbar { display:none; }`}</style>
    </div>
  );
}

function TimelineItem({ icon, title, subtitle, active, blue }) {
  return (
    <div style={{ display: "flex", gap: "18px", marginBottom: "28px" }}>
      <div style={{ width: "52px", height: "52px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", background: blue ? "#3b82f6" : active ? "#8b5e34" : "transparent", border: active && !blue ? "none" : !blue ? "3px solid #d6c0a6" : "none", color: blue ? "#fff" : active ? "#fff" : "#c9975b" }}>
        {icon}
      </div>
      <div>
        <div style={{ color: "#fff", fontSize: "20px", fontWeight: "700" }}>{title}</div>
        <div style={{ color: "#c9975b", marginTop: "5px" }}>{subtitle}</div>
      </div>
    </div>
  );
}