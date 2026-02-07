"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

type Props = {
  latLng: { lat: number; lng: number } | null;
  setLatLng: (value: { lat: number; lng: number }) => void;
  setAddress: (value: string) => void;
};

export default function CheckoutMap({ latLng, setLatLng, setAddress }: Props) {
  const LocationMarker = () => {
    useMapEvents({
      click: async (e) => {
        setLatLng(e.latlng);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json&accept-language=uz`
          );
          const data = await res.json();
          setAddress(data.display_name || "Unknown Address");
        } catch {
          setAddress("Unknown Address");
        }
      },
    });

    return latLng ? <Marker position={latLng} /> : null;
  };

  return (
    <MapContainer
      center={[41.30557, 69.23136]}
      zoom={15}
      className="h-64 w-full rounded-2xl"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  );
}
