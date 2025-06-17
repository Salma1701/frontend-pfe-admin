import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    } catch {
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
    } catch {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const updateRaison = async (id) => {
    try {
      await axios.put(
        `http://localhost:4000/raisons/${id}`,
        { nom: editedValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Raison modifiée !");
      setEditingId(null);
      fetchRaisons();
    } catch {
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
    } catch {
      toast.error("Erreur lors du changement de statut");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <ToastContainer />
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6">

        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6">
          ⚙️ Gestion des Raisons de Visite
        </h2>

        {/* ➕ Ajout de raison */}
        <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Nouvelle raison"
            value={newRaison}
            onChange={(e) => setNewRaison(e.target.value)}
            className="flex-1 border px-4 py-2 rounded shadow-sm w-full"
          />
          <button
            onClick={addRaison}
            className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700"
          >
            Ajouter
          </button>
        </div>

        {/* 📋 Liste des raisons */}
        <div className="bg-white rounded-lg shadow divide-y">
          {raisons.map((raison) => (
            <div
              key={raison.id}
              className="p-4 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <div className="flex-1 flex items-center gap-3">
                {editingId === raison.id ? (
                  <>
                    <input
                      className="border px-2 py-1 rounded w-full"
                      value={editedValue}
                      onChange={(e) => setEditedValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") updateRaison(raison.id);
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
                  <span className="font-medium text-gray-700">{raison.nom}</span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setEditingId(raison.id);
                    setEditedValue(raison.nom);
                  }}
                  className="text-indigo-600 hover:text-indigo-800"
                  title="Modifier"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => toggleStatus(raison.id)}
                  className={raison.isActive ? "text-green-500" : "text-gray-400"}
                  title="Activer/Désactiver"
                >
                  {raison.isActive ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RaisonsVisitePage;
