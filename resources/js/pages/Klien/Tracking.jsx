import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25,41],
    iconAnchor: [12,41],
});

export default function Tracking({ orderId }) {
    const [order, setOrder] = useState(null);

    useEffect(() => {
        axios.get(`/api/klien/orders/${orderId}`, { withCredentials: true })
            .then(res => setOrder(res.data))
            .catch(err => console.error(err));
    }, [orderId]);

    if (!order) return <div>Loading...</div>;

    return (
        <div className="flex">
            <Sidebar role="klien" />
            <div className="flex-1">
                <Navbar role="klien" />
                <div className="p-4">
                    <h1>Tracking Pesanan</h1>
                    <MapContainer center={[order.lat, order.lng]} zoom={13} style={{height:"500px", width:"100%"}}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenStreetMap"
                        />
                        <Marker position={[order.lat, order.lng]} icon={markerIcon}>
                            <Popup>{order.order.delivery_address}</Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}