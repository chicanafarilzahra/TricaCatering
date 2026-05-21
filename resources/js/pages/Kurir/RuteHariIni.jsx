// resources/js/pages/Kurir/RuteHariIni.jsx

import React, { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";

import L from "leaflet";
import axios from "axios";

import KurirLayout from "../../layouts/KurirLayout";

import "leaflet/dist/leaflet.css";

// FIX MARKER
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function RuteHariIni({
    onLogout,
}) {
    const [locations, setLocations] =
        useState([]);

    useEffect(() => {
        axios
            .get("/api/kurir/rute")
            .then((res) =>
                setLocations(res.data)
            )
            .catch((err) =>
                console.error(err)
            );
    }, []);

    return (
        <KurirLayout
            title="Rute Hari Ini"
            onLogout={onLogout}
        >
            {/* HEADER */}
            <div
                style={{
                    marginBottom: "28px",
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        fontSize: "30px",
                        fontWeight: "700",
                        color: "#ffffff",
                    }}
                >
                    Rute Hari Ini
                </h1>

                <p
                    style={{
                        marginTop: "10px",
                        color: "#94a3b8",
                        fontSize: "15px",
                    }}
                >
                    Pantau lokasi
                    pengiriman kurir hari
                    ini
                </p>
            </div>

            {/* EMPTY */}
            {locations.length === 0 ? (
                <div
                    style={{
                        background:
                            "#132544",
                        padding: "30px",
                        borderRadius:
                            "18px",
                        color: "#cbd5e1",
                        boxShadow:
                            "0 10px 25px rgba(0,0,0,0.25)",
                        border:
                            "1px solid rgba(255,255,255,0.05)",
                    }}
                >
                    Belum ada rute
                    pengiriman hari ini.
                </div>
            ) : (
                <div
                    style={{
                        width: "100%",
                        height: "600px",
                        borderRadius:
                            "20px",
                        overflow: "hidden",
                        boxShadow:
                            "0 10px 30px rgba(0,0,0,0.3)",
                        border:
                            "1px solid rgba(255,255,255,0.05)",
                    }}
                >
                    <MapContainer
                        center={[
                            locations[0]
                                .lat,
                            locations[0]
                                .lng,
                        ]}
                        zoom={13}
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenStreetMap"
                        />

                        {locations.map(
                            (loc) => (
                                <Marker
                                    key={
                                        loc.order_id
                                    }
                                    position={[
                                        loc.lat,
                                        loc.lng,
                                    ]}
                                >
                                    <Popup>
                                        <div
                                            style={{
                                                minWidth:
                                                    "180px",
                                            }}
                                        >
                                            <h3
                                                style={{
                                                    margin:
                                                        "0 0 8px 0",
                                                    color:
                                                        "#17306a",
                                                }}
                                            >
                                                Tujuan
                                            </h3>

                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize:
                                                        "14px",
                                                }}
                                            >
                                                {
                                                    loc.address
                                                }
                                            </p>
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        )}
                    </MapContainer>
                </div>
            )}
        </KurirLayout>
    );
}