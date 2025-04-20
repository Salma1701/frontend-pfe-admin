import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminVisitePage = () => {
  const [visites, setVisites] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchVisites = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/visites/all", {

        headers: { Authorization: `Bearer ${token}` },
      });
      setVisites(res.data);
    };
    fetchVisites();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📋 Toutes les Visites</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des visites */}
        <div className="col-span-1 bg-white shadow-lg rounded-lg overflow-y-auto h-[80vh] border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 p-4 border-b border-gray-200">Liste des visites</h3>
          <div className="divide-y divide-gray-100">
            {visites.map((v) => (
              <div
                key={v.id}
                onClick={() => setSelected(v)}
                className="p-4 hover:bg-blue-50 cursor-pointer transition"
              >
               <p><strong>Client :</strong> {v.client?.nom ?? "Nom inconnu"} {v.client?.prenom ?? ""}</p>
               <p><strong>Commercial :</strong> {v.commercial?.nom ?? 'N/A'}</p>
<p><strong>Raison :</strong> {v.raison?.nom ?? 'Non précisée'}</p>
<p><strong>Date :</strong> {v.date ? new Date(v.date).toLocaleString() : 'Date inconnue'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Détails de la visite */}
        <div className="col-span-2 bg-white shadow-xl rounded-lg p-6 border border-gray-200">
          {selected ? (
            <>
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">📝 Détail de la Visite</h3>
              <div className="space-y-4 text-gray-700">
                <p><span className="font-semibold">Client :</span> {selected.client.nom}</p>
                <p><span className="font-semibold">Commercial :</span> {selected.commercial.nom}</p>
                <p><span className="font-semibold">Date :</span> {new Date(selected.date).toLocaleString()}</p>
                <p><span className="font-semibold">Raison :</span> {selected.raison.nom}</p>
              </div>
            </>
          ) : (
            <div className="text-gray-400 text-lg text-center pt-20">
              👉 Sélectionnez une visite à gauche pour voir les détails.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVisitePage;
