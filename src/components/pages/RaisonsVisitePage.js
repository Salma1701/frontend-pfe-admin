import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { toast } from "react-toastify";

const RaisonsVisitePage = () => {
  const [raisons, setRaisons] = useState([]);
  const [newRaison, setNewRaison] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedValue, setEditedValue] = useState("");

  const token = localStorage.getItem("token");

  const fetchRaisons = async () => {
    try {
      const res = await axios.get("http://localhost:4000/raisons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRaisons(res.data);
    } catch (err) {
      toast.error("Erreur lors du chargement des raisons");
    }
  };

  useEffect(() => {
    fetchRaisons();
  }, []);

  const addRaison = async () => {
    if (!newRaison.trim()) return;
    try {
      await axios.post(
        "http://localhost:4000/raisons",
        { nom: newRaison },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Raison ajoutée !");
      setNewRaison("");
      fetchRaisons();
    } catch (err) {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const updateRaison = async (id) => {
    try {
      await axios.patch(
        `http://localhost:4000/raisons/${id}`,
        { nom: editedValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Raison modifiée !");
      setEditingId(null);
      fetchRaisons();
    } catch (err) {
      toast.error("Erreur lors de la modification");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.put(
        `http://localhost:4000/raisons/${id}/status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRaisons();
    } catch (err) {
      toast.error("Erreur lors du changement de statut");
    }
  };

  return (
    <div className="p-6 text-gray-800 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">⚙️ Gestion des Raisons de Visite</h2>

      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Nouvelle raison"
          value={newRaison}
          onChange={(e) => setNewRaison(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
        <button
          onClick={addRaison}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ajouter
        </button>
      </div>

      <div className="bg-white rounded-lg shadow divide-y">
        {raisons.map((raison) => (
          <div
            key={raison.id}
            className="p-4 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div className="flex-1 flex items-center gap-2">
              {editingId === raison.id ? (
                <>
                  <input
                    className="border p-1 rounded w-full"
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        updateRaison(raison.id);
                      }
                    }}
                  />
                  <button
                    onClick={() => updateRaison(raison.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                  >
                    Annuler
                  </button>
                </>
              ) : (
                <span>{raison.nom}</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setEditingId(raison.id);
                  setEditedValue(raison.nom);
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => toggleStatus(raison.id)}
                className={raison.isActive ? "text-green-500" : "text-gray-400"}
              >
                {raison.isActive ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RaisonsVisitePage;
