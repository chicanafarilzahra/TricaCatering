// resources/js/pages/Kurir/RuteHariIni.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMapMarkedAlt, FaTruck, FaCheckCircle, FaClock } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import SidebarKurir from "../../components/SidebarKurir";
import NavbarKurir from "../../components/NavbarKurir";

// FIX ICON LEAFLET
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function RuteHariIni({ onLogout }) {
  const [locations, setLocations] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    axios
      .get("/api/kurir/rute")
      .then((res) => setLocations(res.data))
      .catch((err) => console.error(err));
  }, []);

  const totalRute = locations.length;
  const selesai = locations.filter((l) => l.status === "delivered").length;
  const perjalanan = locations.filter((l) => l.status === "on_delivery").length;

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", overflow: "hidden", background: "#071028" }}>
      {/* SIDEBAR */}
      <div style={{ width: "260px", height: "100%", flexShrink: 0 }}>
        <SidebarKurir onLogout={onLogout} />
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", background: "#071028" }}>
        {/* NAVBAR */}
        <div style={{ width: "100%", height: "78px", flexShrink: 0 }}>
          <NavbarKurir title="Rute Hari Ini" />
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "24px", background: "#071028", color: "#ffffff" }}>
          {/* HEADER */}
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ margin: 0, fontSize: "34px", fontWeight: "800", color: "#ffffff" }}>Rute Hari Ini</h2>
            <p style={{ marginTop: "8px", color: "#94a3b8", fontSize: "15px" }}>
              Pantau lokasi dan rute pengiriman kurir hari ini secara realtime.
            </p>
          </div>

          {/* STAT CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: "16px", marginBottom: "24px" }}>
            <StatCard title="Total Rute" value={totalRute} icon={<FaMapMarkedAlt />} />
            <StatCard title="Dalam Perjalanan" value={perjalanan} icon={<FaTruck />} />
            <StatCard title="Selesai" value={selesai} icon={<FaCheckCircle />} />
            <StatCard title="Kurir Aktif" value={locations.length} icon={<FaClock />} />
          </div>

        {/* MAP */}
            <div style={{ background: "#182338", borderRadius: "18px", padding: "20px", boxShadow: "0 8px 25px rgba(0,0,0,0.25)", overflow: "hidden" }}>
            <h3 style={{ marginTop: 0, marginBottom: "18px", fontSize: "22px", fontWeight: "700", color: "#ffffff" }}>Maps Rute Pengiriman</h3>

            <div style={{ width: "100%", height: "350px", borderRadius: "16px", overflow: "hidden" }}>
                <MapContainer
                center={locations.length > 0 ? [locations[0].lat, locations[0].lng] : [-6.200000, 106.816666]} // default Jakarta
                zoom={locations.length > 0 ? 13 : 12}
                style={{ width: "100%", height: "100%" }}
                >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                {locations.length > 0 && locations.map((loc) => (
                    <Marker key={loc.order_id} position={[loc.lat, loc.lng]}>
                    <Popup>
                        <div style={{ minWidth: "180px" }}>
                        <h3 style={{ margin: "0 0 8px 0", color: "#17306a" }}>Tujuan</h3>
                        <p style={{ margin: 0, fontSize: "14px" }}>{loc.address}</p>
                        </div>
                    </Popup>
                    </Marker>
                ))}
                </MapContainer>
            </div>
            </div>
          </div>
        </div>
      </div>
  );
}

/* STAT CARD COMPONENT */
const StatCard = ({ title, value, icon }) => (
  <div style={{ background: "#182338", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
    <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(59,130,246,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", fontSize: "20px" }}>
      {icon}
    </div>
    <div style={{ fontSize: "14px", color: "#94a3b8" }}>{title}</div>
    <div style={{ fontSize: "30px", fontWeight: "800", color: "#ffffff" }}>{value}</div>
  </div>
);