import React, { useEffect, useState } from "react";
import axios from "axios";

const ReclamationsPage = () => {
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchReclamations = async () => {
    try {
      const res = await axios.get("http://localhost:4000/reclamations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReclamations(res.data);
    } catch (err) {
      console.error("Erreur récupération réclamations", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:3000/reclamations/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchReclamations(); // rafraîchir
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    }
  };

  useEffect(() => {
    fetchReclamations();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Réclamations reçues</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="space-y-4">
          {reclamations.map((rec) => (
            <div
              key={rec.id}
              className="border p-4 rounded-md bg-white shadow-sm"
            >
              <h3 className="text-lg font-semibold">{rec.sujet}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {rec.description}
              </p>
              <p className="text-sm text-gray-500">
                Client : <strong>{rec.client.nom}</strong> – Par :{" "}
                <strong>{rec.user.nom}</strong>
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    rec.status === "ouverte"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {rec.status}
                </span>
                {rec.status === "ouverte" && (
                  <button
                    className="ml-auto px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => updateStatus(rec.id, "traitée")}
                  >
                    Marquer comme traitée
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReclamationsPage;
