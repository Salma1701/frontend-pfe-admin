import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import '../pages/Styles/cluster.css'; // ✅ Correct

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapCommercials = () => {
  const [commerciaux, setCommerciaux] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:4000/users?role=commercial", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Ne garder que ceux avec des coordonnées valides
        const withCoords = res.data.filter(c => c.latitude && c.longitude);
        setCommerciaux(withCoords);
      } catch (err) {
        console.error("Erreur chargement commerciaux:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-[80vh] w-full rounded-xl shadow-lg overflow-hidden">
      <MapContainer center={[36.8, 10.2]} zoom={6} style={{ height: "500px", borderRadius: "15px" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <MarkerClusterGroup>
          {commerciaux.map((c) => (
            <Marker key={c.id} position={[c.latitude, c.longitude]}>
              <Popup>
                <strong>{c.nom} {c.prenom}</strong><br />
                {c.email}<br />
                Tél: {c.tel}
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default MapCommercials;
