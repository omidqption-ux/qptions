"use client";

import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

function fixLeafletIcons() {
    const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
    const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
    const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";
    // @ts-expect-error internal override
    delete (L.Icon.Default.prototype)._getIconUrl;
    L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });
}

export default function MapLeafletClient() {
    useEffect(() => { fixLeafletIcons(); }, []);
    const center = [42.6977, 23.3219];

    return (
        <MapContainer center={center} zoom={12} style={{ height: 340, width: 340 }} scrollWheelZoom>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={center}>
                <Popup>Our office</Popup>
            </Marker>
        </MapContainer>
    );
}
