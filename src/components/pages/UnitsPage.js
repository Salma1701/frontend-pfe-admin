import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBalanceScale, FaPlus } from "react-icons/fa";

const UnitsPage = () => {
  const [units, setUnits] = useState([]);
  const [newUnit, setNewUnit] = useState("");

  const token = localStorage.getItem("token");

  const fetchUnits = async () => {
    try {
      const res = await axios.get("http://localhost:4000/unite", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnits(res.data);
    } catch (err) {
      console.error("Erreur chargement unités :", err);
    }
  };

  const addUnit = async () => {
    if (!newUnit.trim()) return;
    try {
      await axios.post(
        "http://localhost:4000/unite",
        { nom: newUnit },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewUnit("");
      fetchUnits();
    } catch (err) {
      console.error("Erreur ajout unité :", err);
    }
  };

  const toggleUnitStatus = async (id, currentStatus) => {
    try {
      await axios.put(
        `http://localhost:4000/unite/${id}/status`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUnits();
    } catch (err) {
      console.error("Erreur modification statut :", err);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 flex items-center gap-3">
          <FaBalanceScale className="text-indigo-500" /> Gestion des Unités
        </h2>

        {/* Formulaire d'ajout */}
        <div className="bg-white shadow-xl rounded-xl p-6 mb-8 flex items-center gap-4">
          <input
            type="text"
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value)}
            placeholder="Entrez une unité (ex: kg, litre...)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            onClick={addUnit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-md transition-transform hover:scale-105"
          >
            <FaPlus /> Ajouter
          </button>
        </div>

        {/* Liste des unités */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-indigo-50 text-indigo-800 text-left">
              <tr>
                <th className="px-6 py-3 font-semibold">Nom</th>
                <th className="px-6 py-3 text-center font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit, idx) => (
                <tr key={unit.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4 font-medium capitalize">{unit.nom}</td>
                  <td className="px-6 py-4 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={unit.isActive}
                        onChange={() => toggleUnitStatus(unit.id, unit.isActive)}
                      />
                      <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300 relative">
                        <div className="absolute left-[2px] top-[2px] bg-white w-7 h-7 rounded-full transition-all duration-300 peer-checked:translate-x-full flex items-center justify-center text-xs shadow">
                          {unit.isActive ? "✅" : "❌"}
                        </div>
                      </div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UnitsPage;
